<script lang="ts" setup>
import axios from 'axios'
import { GoogleSignInButton, type CredentialResponse, decodeCredential  } from "vue3-google-signin";
import { useTokenClient, type AuthCodeFlowSuccessResponse, type AuthCodeFlowErrorResponse, } from "vue3-google-signin";
import { useCodeClient, type ImplicitFlowSuccessResponse, type ImplicitFlowErrorResponse, } from "vue3-google-signin";

/*
套件
nuxt-vue3-google-signin
*/

/*
  Google Cloud https://cloud.google.com/?hl=zh-tw 從裡面創建OAuth相關的東西
  前往控制台 > API和服務 > 憑證 > 如果已經有OAuth2.0 用戶端ID憑證 就直接用 沒有就建立憑證 
  > 用戶端編號寫到env裡 並在nuxt.config.ts引用

  在憑證裡的"已授權的重新導向 URI" 和 "已授權的 JavaScript 來源" 寫上啟動的網址
*/

const isLogined = ref(false)
const message = ref('請登入Google')

// google預設按鈕 ----------------------------------------------------------------
// handle success event
// const handleLoginSuccess = (response: CredentialResponse) => {
//     const { credential } = response;
//     console.log("Access Token", credential);
//     console.log("response", response);

//     if(credential){
//         const decodedCredential = decodeCredential(credential);
//         console.log("User:", decodedCredential);
//     }
// };

// // handle an error event
// const handleLoginError = () => {
//     console.error("Login failed");
// };

const accessToken = ref('')
// 自訂按鈕 useTokenClient ----------------------------------------------------------------
const handleOnSuccessToken = async(response: AuthCodeFlowSuccessResponse) => {
    console.log("Access Token: ", response.access_token);
    console.log("response", response);
    accessToken.value = response.access_token

    getProfile()
};

// 取得個人資訊
const getProfile = async ()=>{
     try {
        const getData = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken.value}`)
        console.log('getData', getData.data)
        message.value = `歡迎回來,${getData.data.name}`

        isLogined.value = true

    } catch (err) {
        console.log(err);
    }
}

const handleOnErrorToken = (errorResponse: AuthCodeFlowErrorResponse) => {
    console.log("Error: ", errorResponse);
};

const { isReady: isReadyToken, login: loginToken } = useTokenClient({
    onSuccess: handleOnSuccessToken,
    onError: handleOnErrorToken,
    // other options
});

// 自訂按鈕 useCodeClient ----------------------------------------------------------------
// const handleOnSuccessCode = (response: ImplicitFlowSuccessResponse) => {
//     // send code to a backend server to verify it.
//     console.log("Code: ", response.code);
//     console.log("response: ", response);

//     // use axios or something to reach backend server
//     // const result = await fetch("https://YOUR_BACKEND/code/verify", {
//     //   method: "POST",
//     //   body: JSON.stringify({
//     //     code: response.code,
//     //   }),
//     // });
//     // console.log('result', result);
    
// };

// const handleOnErrorCode = (errorResponse: ImplicitFlowErrorResponse) => {
//     console.log("Error: ", errorResponse);
// };

// const { isReady: isReadyCode, login: loginCode } = useCodeClient({
//     onSuccess: handleOnSuccessCode,
//     onError: handleOnErrorCode,
//     // other options
// });

// 登出
const googleLogout = async () => {
    try{
        await axios.post(` https://oauth2.googleapis.com/revoke?token=${accessToken.value}`)
        message.value = '請登入Google'

        isLogined.value = false
    } catch(err){
        console.log(err);
    }
};


</script>
<template>
    <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }">
        <h1>Google OAuth2.0</h1>
        <h2>{{ message }}</h2>
        <!-- <div :style="{ marginBottom: '20px' }">
            <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError">
            </GoogleSignInButton>
        </div> -->
        <div v-if="!isLogined" :style="{ marginBottom: '20px' }">
            <button :disabled="!isReadyToken" @click="loginToken">Google登入 (useTokenClient)</button>
        </div>
        <!-- <div :style="{ marginBottom: '20px' }">
            <button :disabled="!isReadyCode" @click="loginCode">Login with Google useCodeClient</button>
        </div> -->
        <div v-if="isLogined" :style="{ marginBottom: '20px' }">
            <button @click="googleLogout">登出</button>
        </div>
    </div>
</template>

<style scoped></style>
