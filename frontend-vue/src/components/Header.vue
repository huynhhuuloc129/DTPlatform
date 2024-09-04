<template>
    <header id="headerBar" class="p-3 text-white w-100" style="background-color: black;">
    <div >
      <div id="barContent" class="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-start ">

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 w-25">
          <li><a href="http://localhost:5173/home" class="item-header px-2 text-white inter-bold">Home</a></li>
        </ul>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 w-25">
          <li><a @click="router.push({name: 'map navigate'})" href="#" class="item-header px-2 text-white inter-bold">Hiện trạng</a></li>
        </ul>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 w-25">
          <li><a @click="router.push({name: 'simulate'})" href="#" class="item-header px-2 text-white inter-bold">Mô phỏng</a></li>
        </ul>

        <span class="text-end">
          <button @click="signOut()" type="button" class="btn btn-light">Log out</button>
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
    #barContent{
      display: flex;
    }
}
.inter-normal {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}
.inter-bold {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}
.item-header{
  text-decoration: none;
}
.item-header:hover{
  text-decoration: underline;
}
</style>

