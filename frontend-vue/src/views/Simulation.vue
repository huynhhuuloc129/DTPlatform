<template>
  <div id="layout">
    <MapSimulate></MapSimulate>

  </div>
</template>
<script setup lang="ts">
//@ts-ignore
import MapSimulate from '../components/MapSimulate.vue';
import checkLogin from '@/utilites/utilities';
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';

const router = useRouter()

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
