<script setup lang="ts">
import { onMounted } from 'vue';
import axios from 'axios'
import queryString from 'query-string';

/*
  https://developers.line.biz/zh-hant/
  到LINE Developers Console 看自己的channel 把id和secret填到下面

  Callback URL在自己channel的LINE Login裡做設定，登入後會帶著query到Callback URL的頁面
*/
const runtimeConfig = useRuntimeConfig()

// 登入
const LineAuth = () => {
    let URL = 'https://access.line.me/oauth2/v2.1/authorize?';
    URL += 'response_type=code';
    URL += `&client_id=${runtimeConfig.public.lineChannelId}`;
    URL += `&redirect_uri=${runtimeConfig.public.lineCallbackUrl}`;
    URL += '&state=abcde';
    URL += '&scope=openid%20profile';
    window.location.href = URL;
}

// 登入後會重新導回頁面 並且query會帶state和code
onMounted(() => {
    checkLineLoginCallBack()
})

// 取得token和個人資訊
const checkLineLoginCallBack = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('urlParams', urlParams);
    // 沒有執行line登入就return不調用 (看query是否有state和code 有才繼續)
    if (!urlParams.has('state') && !urlParams.has('code')) return
    const state = urlParams.get('state');
    const code = urlParams.get('code');
    // state不是abcde就return
    if (state !== 'abcde') return

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
        const accessToken = result1.data.access_token;
        const idToken = result1.data.id_token;
        console.log(result1);

        // 取回個人資訊
        const getProfileApiUrl = 'https://api.line.me/v2/profile';
        const result2 = await axios({
            method: 'GET',
            url: getProfileApiUrl,
            responseType: 'json', // responseType 也可以寫在 header 裡面
            headers: {
                Authorization: `Bearer ${accessToken}`, // Bearer 跟 token 中間有一個空格
            },
        })
        console.log(result2);

        //  驗證token
        const getVerifyApiUrl = 'https://api.line.me/oauth2/v2.1/verify';
        const getVerifyBody = {
            client_id: runtimeConfig.public.lineChannelId,
            id_token: idToken,
        };
        const result3 = await axios.post(getVerifyApiUrl, getVerifyBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        console.log(result3);
    } catch (err) {
        console.log(err);
    }
}
</script>

<template>
    <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }">
        <h1>Line OAuth2.0</h1>
        <div :style="{ marginBottom: '20px' }">
            <button class="border" @click="LineAuth">Line Login</button>
        </div>
    </div>
</template>

<style scoped>
</style>
