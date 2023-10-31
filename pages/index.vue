<script lang="ts" setup>
import { GoogleSignInButton, type CredentialResponse, } from "vue3-google-signin";
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

// google預設按鈕 ----------------------------------------------------------------
// handle success event
const handleLoginSuccess = (response: CredentialResponse) => {
    const { credential } = response;
    console.log("Access Token", credential);
    console.log("response", response);
};

// handle an error event
const handleLoginError = () => {
    console.error("Login failed");
};

// 自訂按鈕 useTokenClient ----------------------------------------------------------------
const handleOnSuccessToken = (response: AuthCodeFlowSuccessResponse) => {
    console.log("Access Token: ", response.access_token);
    console.log("response", response);
};

const handleOnErrorToken = (errorResponse: AuthCodeFlowErrorResponse) => {
    console.log("Error: ", errorResponse);
};

const { isReady: isReadyToken, login: loginToken } = useTokenClient({
    onSuccess: handleOnSuccessToken,
    onError: handleOnErrorToken,
    // other options
});

// 自訂按鈕 useCodeClient ----------------------------------------------------------------
const handleOnSuccessCode = (response: ImplicitFlowSuccessResponse) => {
    // send code to a backend server to verify it.
    console.log("Code: ", response.code);
    console.log("response: ", response);

    // use axios or something to reach backend server
    // const result = await fetch("https://YOUR_BACKEND/code/verify", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     code: response.code,
    //   }),
    // });
};

const handleOnErrorCode = (errorResponse: ImplicitFlowErrorResponse) => {
    console.log("Error: ", errorResponse);
};

const { isReady: isReadyCode, login: loginCode } = useCodeClient({
    onSuccess: handleOnSuccessCode,
    onError: handleOnErrorCode,
    // other options
});



</script>
<template>
    <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }">
        <h1>Google OAuth2.0</h1>
        <div :style="{ marginBottom: '20px' }">
            <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError">
            </GoogleSignInButton>
        </div>
        <div :style="{ marginBottom: '20px' }">
            <button :disabled="!isReadyToken" @click="loginToken">Login with Google useTokenClient</button>
        </div>
        <div :style="{ marginBottom: '20px' }">
            <button :disabled="!isReadyCode" @click="loginCode">Login with Google useCodeClient</button>
        </div>
    </div>
</template>

<style scoped></style>
