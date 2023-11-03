<script lang="ts" setup>

useHead({
    script:[
        {src:'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'}
    ]
})

/*
  參考網站
  Apple ID (使用者): https://appleid.apple.com/
  Apple Developer (開發者): https://developer.apple.com/account
  Apple登入文檔: https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple
  
  登入開發者 > Certificates, IDs & Profiles > Identifiers > 先建立一個App IDs > Select a type 選 App > 填寫 Description (ex. test) > 填寫 Bundle ID (選擇Explicit) (ex. tw.xxx.app.test (explicit)) > Capabilities 底下的 Sign In with Apple 打勾 > 點進Configure > Sign In with Apple: App ID Configuration 要勾 Enable as a primary App ID。

  建立一個Services IDs > 填寫 Description (ex. login-test) > 填寫 Identifier (ex. com.test.abcd.web) > 建完後點進剛建好的Services IDs > 底下的Sign In with Apple打勾 > 點進Configure > 填寫 Domains and Subdomains (ex. 1111-2222-33-44-55.ngrok-free.app) > 填寫 Return URLs (ex. https://1111-2222-33-44-55.ngrok-free.app/apple) > 設定完後 continue > save

  備註:

  (1)串接Apple的網站網址一定要是https 並且不能是localhost 所以開發時要用ngrok來啟動
  (2)使用ngrok時 要把nuxt.config.ts devServer的https關掉
*/

interface IAppleSignIn {
    authorization: {
        code: string,
        id_toekn: string,
        state: string,
    },
    user?: {
        name: {
            firstName: string,
            lastName: string,
        },
        email: string
    }
}

const runtimeConfig = useRuntimeConfig()
const isLoggedIn = ref(false)
const message = ref('請登入Apple')


const init = ()=>{
    window.AppleID.auth.init({
        clientId: runtimeConfig.public.appleClientId, // Services IDs 的 Identifier
        redirectURI: '', // Services IDs 的 Return URLs
        state: 'state',
        scope: 'name email',
        usePopup: true, // true 會跳出一個彈跳框來進行登入授權；false 會到另一個登入頁面
    })

}
const login = async ()=>{
    await init()

    try{
        // Apple只有在第一次授權登入時會取回user資訊 (name email) 之後的授權登入都不會取回user
        // 但是在取回的id_token裡可以解析出email
        const data: IAppleSignIn = await window.AppleID.auth.signIn()
        console.log('data', data);

        message.value = data.user ? `歡迎回來,${data.user.name.lastName} ${data.user.name.firstName}` : '歡迎回來'
        isLoggedIn.value = true
    } catch(err){console.log(err);
    }
    
}
const logOut = async ()=>{
    message.value = '請登入Apple'
    isLoggedIn.value = false
}

</script>
<template>
    <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }">
        <h1>Apple OAuth2.0</h1>
        <h2>{{ message }}</h2>
        <div v-if="!isLoggedIn" :style="{ marginBottom: '20px' }">
            <button @click="login">Apple登入</button>
        </div>
        <div v-if="isLoggedIn" :style="{ marginBottom: '20px' }">
            <button @click="logOut">Apple登出</button>
        </div>
    </div>
</template>

<style scoped></style>
