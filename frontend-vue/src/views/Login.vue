<template>
    <div>
        <section id="section" class="vh-100 vw-100">
            <div class="container py-5 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div class="card " style="border-radius: 1rem; ">
                            <div class="card-body p-5 text-center">

                                <div class=" mt-md-4 pb-5">

                                    <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                                    <p class="mb-5" style="">Please enter your username and password!</p>
                                    <form @submit="onLogin">

                                        <input v-model="inputFormLogin.username" type="text" id="typeEmailX"
                                            class="form-control form-control-lg input-login" placeholder="Username"
                                            required />

                                        <input v-model="inputFormLogin.password" type="password" id="typePasswordX"
                                            class="form-control form-control-lg input-login" placeholder="Password"
                                            required />

                                        <button type="submit"
                                            class="btn btn-outline-dark btn-lg px-5 input-login">Login</button>
                                    </form>

                                </div>

                                <div>
                                    <p class="mb-0">Don't have an account? <a @click="router.push({ name: 'signup' })" href="#"
                                            class="fw-bold">Sign Up</a>
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';
import { useRouter } from 'vue-router'
import { useCookies } from "vue3-cookies";
import authServices from '@/services/auth.services';
import checkLogin from "@/utilites/utilities";

const router = useRouter()
const cookies = useCookies();
const tokenBearer = cookies.cookies.get('Token')

const inputFormLogin = ref({
    username: '',
    password: ''
})

const currentToken = ref({
    token: '',
    refresh_token: '',
})


var onLogin = async (e: any) => {
    e.preventDefault();
    try {
        const salt = bcrypt.genSaltSync(10)
        currentToken.value = await authServices.login({
            'username': inputFormLogin.value.username,
            'password': bcrypt.hashSync(inputFormLogin.value.password, salt)
        });
        cookies.cookies.set("Token", currentToken.value.token);
        Swal.fire({
            title: 'Success!',
            text: 'Login success.',
            icon: 'success',
            confirmButtonText: 'OK'
        })
        router.push({ name: "home" })
    } catch (err: any) {
        Swal.fire({
            title: 'Error!',
            text: 'Wrong username or password.',
            icon: 'error',
            confirmButtonText: 'OK'
        })
        console.log(err)
    }
}

onMounted(() => {
    if (checkLogin()) router.push({ name: 'home' })
})

</script>

<style scoped>
.input-login {
    margin-top: 20px;
}
#section{
    background-image: url('@/assets/banner1.jpg');
    background-size: 100vw 100vh;
}
@media only screen and (max-width: 500px) {
    h2{
        font-size: 10%;
    }
}
</style>
