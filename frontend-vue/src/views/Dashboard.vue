<template>
  <div id="layout">
    <Map></Map>

  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
//@ts-ignore
import Map from '../components/Map.vue';
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import checkLogin from '@/utilites/utilities';
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';

const router = useRouter()

// const currentUser = ref()

// const isLogin = ref(false)
// try {
//     currentUser.value = await checkLogin();
//     if (currentUser.value !== null && currentUser.value['id'] !== null) {
//         isLogin.value = true;
//     }
// } catch (err) {
//     console.log(err)
// }
onMounted(() => {
  if (!checkLogin()) router.push({ name: 'login' })
})
</script>

<style>
#layout {
  flex: 1;
  display: flex;
  position: relative;
}
</style>
