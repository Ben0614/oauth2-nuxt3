<script setup lang="ts">
import { onMounted } from 'vue';
import axios from 'axios'
import queryString from 'query-string';

/*
  https://developers.line.biz/zh-hant/
  到LINE Developers Console 看自己的channel 把id和secret填到下面

  Callback URL在自己channel的LINE Login裡做設定，登入後會帶著query到Callback URL的頁面
  如果回傳的用戶資料需要email，要先到自己的channel > Basic settings > 底下有一個OpenID Connect 要點Apply申請
*/
const runtimeConfig = useRuntimeConfig()

const isLoggedIn = ref(false)
const message = ref('請登入Line')

// 登入
const lineLogin = () => {
    let URL = 'https://access.line.me/oauth2/v2.1/authorize?';
    URL += 'response_type=code';
    URL += `&client_id=${runtimeConfig.public.lineChannelId}`;
    URL += `&redirect_uri=${runtimeConfig.public.lineCallbackUrl}`;
    URL += '&state=abcde';
    URL += '&scope=profile%20openid'; // 如果需要email 就寫&scope=profile%20openid%20email
    window.location.href = URL;
}

// 登入後會重新導回頁面 並且query會帶state和code
onMounted(() => {
    checkLineLoginCallBack()
})

// 檢查登入的回調函式
const checkLineLoginCallBack = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('urlParams', urlParams);
    // 沒有執行line登入就return不調用 (看query是否有state和code 有才繼續)
    if (!urlParams.has('state') && !urlParams.has('code')) return
    const state = urlParams.get('state');
    const code = urlParams.get('code') ?? '';
    // state不是abcde就return
    if (state !== 'abcde') return

    // 取得token
    getToken(code)
}

const accessToken = ref('')
const idToken = ref('')
// 取得token
const getToken = async (code:string) => {
    const getTokenUrl = 'https://api.line.me/oauth2/v2.1/token';
    const getTokenBody = queryString.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: runtimeConfig.public.lineCallbackUrl,
        client_id: runtimeConfig.public.lineChannelId,
        client_secret: runtimeConfig.public.lineChannelSecret,
    });

    try {
        // 取回token
        const result1 = await axios.post(getTokenUrl, getTokenBody)
        accessToken.value = result1.data.access_token;
        idToken.value = result1.data.id_token;
        console.log('result1', result1.data);

        // 驗證token
        useVerify()

    } catch (err) {
        console.log(err);
    }
}

// 驗證token
const useVerify = async () => {
    try{
        //  驗證token
        const getVerifyApiUrl = 'https://api.line.me/oauth2/v2.1/verify';
        const getVerifyBody = {
            client_id: runtimeConfig.public.lineChannelId,
            id_token: idToken.value,
        };
        const result2 = await axios.post(getVerifyApiUrl, getVerifyBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken.value}`
            }
        })
        console.log('result2', result2.data);

        // 取得個人資訊
        getProfile()
    } catch(err) {
        console.log(err);
    }
}

// 取得個人資訊
const getProfile = async () => {
    try {
        // 取回個人資訊
        const getProfileApiUrl = 'https://api.line.me/v2/profile';
        const result3 = await axios({
            method: 'GET',
            url: getProfileApiUrl,
            responseType: 'json', // responseType 也可以寫在 header 裡面
            headers: {
                Authorization: `Bearer ${accessToken.value}`, // Bearer 跟 token 中間有一個空格
            },
        })
        console.log('result3', result3.data);
        message.value = `歡迎回來,${result3.data.displayName}`

        isLoggedIn.value = true
    } catch (err) {
        console.log(err);
    }
}

// 登出
const lineLogOut = async () => {
    try {
        const revokeApiUrl = 'https://api.line.me/oauth2/v2.1/revoke';
         const revokeBody = queryString.stringify({
            client_id: runtimeConfig.public.lineChannelId,
            client_secret: runtimeConfig.public.lineChannelSecret,
            access_token: accessToken.value
        });
        await axios.post(revokeApiUrl, revokeBody)
        message.value = '請登入Line'
        isLoggedIn.value = false
    } catch (err) {
        console.log(err);
    }
}
</script>

<template>
    <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }">
        <h1>Line OAuth2.0</h1>
        <h2>{{ message }}</h2>
        <div v-if="!isLoggedIn" :style="{ marginBottom: '20px' }">
            <button class="border" @click="lineLogin">Line登入</button>
        </div>
        <div v-if="isLoggedIn" :style="{ marginBottom: '20px' }">
            <button class="border" @click="lineLogOut">Line登出</button>
        </div>
    </div>
</template>

<style scoped>
</style>
