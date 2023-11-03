// https://nuxt.com/docs/api/configuration/nuxt-con
export default defineNuxtConfig({
  ssr: false,
  /*
  把啟動改為https

  下載Chocolatey https://chocolatey.org/install#individual > 找到 Now run the following command: 複製底下的code > 用系統管理身分開啟Powershell > 貼上code > 安裝好後用系統管理身分開啟cmd > 輸入 choco install mkcert > 輸入 mkcert -install > 輸入 mkcert localhost > 得到localhost.pem、localhost-key.pem兩個檔案 > 放到專案裡 > 底下devServer設定
  */
  devServer: {
    https: {
     key: 'localhost-key.pem',
     cert: 'localhost.pem'
    }
  },
  devtools: { enabled: false },
  modules: ['nuxt-vue3-google-signin'],
  googleSignIn: {
    clientId: process.env.NUXT_ENV_GOOGLE_CLIENT_ID,
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: '',
    // Keys within public, will be also exposed to the client-side
    public: {
      lineChannelId: process.env.NUXT_ENV_LINE_CHANNEL_ID,
      lineCallbackUrl: process.env.NUXT_ENV_LINE_CALLBACK_URL,
      lineChannelSecret: process.env.NUXT_ENV_LINE_CHANNEL_SECRET,
      facebookAppId: process.env.NUXT_ENV_FACEBOOK_APP_ID,
      facebookApiVersion: process.env.NUXT_ENV_FACEBOOK_API_VERSION,
      appleClientId: process.env.NUXT_ENV_APPLE_CLIENT_ID,
      appleRedirectUri: process.env.NUXT_ENV_APPLE_REDIRECT_URI,
    }
  }
})
