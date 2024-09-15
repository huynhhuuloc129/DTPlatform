<template>
  <header id="headerBar" class="p-3 text-white w-100" style="background-color: white;">
    <div>
      <div id="barContent" class="d-flex flex-wrap align-items-center justify-content-between">

        <ul class="nav justify-content-center mb-md-0 ">
          <li><a href="https://dtplatform.netlify.app/home" class="item-header px-2 text-dark inter-bold"><img
                width="100" src="@/assets/logo.png" alt=""></a></li>
        </ul>

        <ul class="nav justify-content-center mb-md-0 ">
          <li><a href="https://dtplatform.netlify.app/home" class="item-header px-2 text-dark inter-bold">Home</a></li>
        </ul>

        <ul class="nav justify-content-center mb-md-0 ">
          <li><a @click="router.push({ name: 'map navigate' })" href="#"
              class="item-header px-2 text-dark inter-bold">Hiện trạng</a></li>
        </ul>

        <ul class="nav justify-content-center mb-md-0 ">
          <li><a @click="router.push({ name: 'simulate' })" href="#" class="item-header px-2 text-dark inter-bold">Mô
              phỏng</a></li>
        </ul>

        <span class="text-end">
          <button @click="signOut()" type="button" class="btn btn-dark">Log out</button>
        </span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useCookies } from "vue3-cookies";

const route = useRoute();
const router = useRouter()
const cookies = useCookies();


function signOut() {
  const path = route.path
  cookies.cookies.set("Token", '');

  router.push({ name: "login" })
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
@media only screen and (max-width: 992px) {
  #barContent {
    display: flex;
  }
}

.inter-normal {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}

a:hover {
  background-color: transparent;
}

.inter-bold {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}

.item-header {
  text-decoration: none;
}

.item-header:hover {
  text-decoration: underline;
}
</style>
