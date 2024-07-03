<template>
    <header id="headerBar" class="p-3 text-white w-100" style="background-color: #23a5ae;">
    <div >
      <div id="barContent" class="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-start">

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 w-25">
          <li><a href="http://localhost:5173/home" class="nav-link px-2 text-white">Home</a></li>
        </ul>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 w-25">
          <li><a @click="router.push({name: 'admin'})" href="#" class="nav-link px-2 text-white">Admin</a></li>
        </ul>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 w-25">
          <li><a @click="router.push({name: 'admincsv'})" href="#" class="nav-link px-2 text-white">CSV</a></li>
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
@media only screen and (max-width: 992px) {
    #barContent{
      display: flex;
    }
}
</style>

