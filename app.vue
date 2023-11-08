<script lang="ts" setup>

</script>
<template>
  <div :style="{display:'flex',justifyContent:'center'}">
    <nuxt-link to="/" :style="{ color:'blue',textDecoration: 'none' }">
      <h2>Google</h2>
    </nuxt-link>
    <nuxt-link to="/line" :style="{color:'blue',textDecoration:'none',marginLeft:'20px'}">
      <h2>Line</h2>
    </nuxt-link>
    <nuxt-link to="/facebook" :style="{color:'blue',textDecoration:'none',marginLeft:'20px'}">
      <h2>Facebook</h2>
    </nuxt-link>
    <nuxt-link to="/apple" :style="{color:'blue',textDecoration:'none',marginLeft:'20px'}">
      <h2>Apple</h2>
    </nuxt-link>
  </div>
  <NuxtPage />
</template>

<style scoped>

</style>
