<script setup lang="ts">
import axios from 'axios'

// 先到nuxt.config做設定 (https)

/*
參考網站
https://developers.facebook.com/docs/facebook-login/web
到Facebook 開發人員帳號 > 有應用程式就直接用 沒有就建立 > 應用程式編號填到下面的appId

version也會更新 要去確認

https://developers.facebook.com/docs/facebook-login/web/js-example
https://penueling.com/%E7%B7%9A%E4%B8%8A%E5%AD%B8%E7%BF%92/vue3-%E4%BD%BF%E7%94%A8-facebook-login-api/
https://tools.wingzero.tw/article/sn/126
*/

const runtimeConfig = useRuntimeConfig()

// 類型
declare global {
    interface Window {
        fbAsyncInit: () => void;
        FB: any;
    }
}

const isLoggedIn = ref(false)
const message = ref('請登入FB')

const init = ()=>{
    // 初始化
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: runtimeConfig.public.facebookAppId,
            cookie: true,  // enable cookies to allow the server to access 
            // the session
            xfbml: true,  // parse social plugins on this page
            // 進到自己的應用程式 > App settings > Advanced > Upgrade API version可以看到目前的版本
            version: runtimeConfig.public.facebookApiVersion // Specify the Graph API version to use
        });

        // 確認狀態 改變isLoggedIn和message
        checkLoginState()
    };

    let js, fjs = document.getElementsByTagName('script')[0];
    if (document.getElementById('facebook-jssdk')) { return; }
    js = document.createElement('script'); js.id = 'facebook-jssdk';
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    // js.src = `https://connect.facebook.net/en_US/sdk.js#version=&appId=&xfbml=true&cookie=true`;
    if (fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
    }
}
init()

// const userID = ref('')
// const accessToken = ref('')

// 登入
const login = async () => {
    window.FB.login(function (response: any) {
        console.log('response', response);
        // {
        //   "authResponse": {
        //     "accessToken":"",
        //     "userID": "",
        //     "expiresIn": 0,
        //     "signedRequest": "",
        //     "graphDomain": "facebook",
        //     "data_access_expiration_time": 0
        //   },
        //   "status": "connected"
        // }

        // 登入成功
        if (response.authResponse) {
            //這邊可以做登入成功後要做的事 例如:將使用者登入狀態存到 session 去
            console.log('登入成功');

            // userID.value = response.authResponse.userID
            // accessToken.value = response.authResponse.accessToken

            // 確認狀態 改變isLoggedIn和message
            checkLoginState()
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { scope: 'public_profile email user_birthday' });
}

// 獲取個人資料
const getProfile = async () => {
    window.FB.api(`/${runtimeConfig.public.facebookApiVersion}/me?fields=id,email,name,picture,birthday`, function (response: any) {
        message.value = `歡迎回來,${response.name}`
        console.log('response', response);
        /*
        1.目前無法取回email
        2.目前取來的picture url會404

        https://stackoverflow.com/questions/77397073/facebook-ios-sdk-image-url-of-public-profile-have-status-404
        https://stackoverflow.com/questions/77372593/facebook-graph-api-explorer-not-showing-profile-picture-but-returns-the-url
        https://developers.facebook.com/community/threads/292690177015780/
        https://developers.facebook.com/community/threads/228962369861977/
        */
    });

    // 這個和上面的/me功能相同
    // const getData = await axios.get(`https://graph.facebook.com/${runtimeConfig.public.facebookApiVersion}/${userID.value}?fields=id,name,email,picture,birthday&access_token=${accessToken.value}`)
    // console.log('getData', getData.data)


    // const pic = await axios.get(`https://graph.facebook.com/${userID.value}/picture?type=large`)
    // console.log('pic', pic)

}

// 登出
const logout = () => {
    window.FB.logout(function () {
        // 確認狀態 改變isLoggedIn和message
        checkLoginState()
    });
}

// 確認狀態 改變isLoggedIn和message
function checkLoginState() {
    window.FB.getLoginStatus(function (response: any) {
        console.log('response', response);
        // {
        //   "authResponse": {
        //     "accessToken":"",
        //     "userID": "",
        //     "expiresIn": 0,
        //     "signedRequest": "",
        //     "graphDomain": "facebook",
        //     "data_access_expiration_time": 0
        //   },
        //   "status": "connected"
        // }

        // 已登入
        if (response.status === 'connected') {
            isLoggedIn.value = true

            // 個人資料
            getProfile()
        }
        // 未登入
        if (response.status !== 'connected') {
            isLoggedIn.value = false
            message.value = '請登入FB'
        }
    });
}

</script>

<template>
    <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }">
        <h1>Facebook OAuth2.0</h1>
        <h2>{{ message }}</h2>
         <div v-if="!isLoggedIn" :style="{marginBottom:'20px'}">
            <button @click="login">
                FB登入
            </button>
        </div>
        <div v-if="isLoggedIn" :style="{marginBottom:'20px'}">
            <button @click="logout">
                FB登出
            </button>
        </div>
        <div>
            <button @click="checkLoginState" class="border">
                獲取登入狀態
            </button>
        </div>
    </div>
   
</template>

<style scoped>

</style>
