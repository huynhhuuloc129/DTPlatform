<template>
    <header id="headerBar" class="p-3 bg-dark text-white w-100">
    <div class="">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="http://localhost:5173/dashboard" class="nav-link px-2 text-white">Home</a></li>

        </ul>

        <div class="text-end">
          <button @click="signOut()" type="button" class="btn btn-light">Log out</button>
        </div>
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
@media only screen and (max-width: 992px) {
    /* #headerBar{
        margin: 130px 10px 0 0;
    } */
}
</style>

