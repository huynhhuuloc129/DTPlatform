<template>
    <div>
    <section class="vh-100 vw-100 gradient-custom">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div class="card bg-dark text-white" style="border-radius: 1rem;">
                <div class="card-body p-5 text-center">

                    <div class="mb-md-5 mt-md-4 pb-5">

                    <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                    <p class="text-white-50 mb-5">Please enter your username and password!</p>
                    <form @submit="onLogin">

                        <input v-model="inputFormLogin.username" type="text" id="typeEmailX" class="form-control form-control-lg input-login" placeholder="Username" required/>
                        
                        <input v-model="inputFormLogin.password" type="password" id="typePasswordX" class="form-control form-control-lg input-login" placeholder="Password" required/>
                        
                        <button type="submit" class="btn btn-outline-light btn-lg px-5 input-login">Login</button>
                    </form>

                    </div>

                    <div>
                    <p class="mb-0">Don't have an account? <a href="http://localhost:5173/signup" class="text-white-50 fw-bold">Sign Up</a>
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
import { ref } from 'vue';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';
import {useRouter } from 'vue-router'
import { useCookies } from "vue3-cookies";
import authServices from '@/services/auth.services';

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
        router.push({name: "dashboard"})
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

</script>

<style>
.gradient-custom {
/* fallback for old browsers */
background: #6a11cb;

/* Chrome 10-25, Safari 5.1-6 */
background: -webkit-linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1));

/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))
}
.input-login{
    margin-top: 20px;
}
</style>
