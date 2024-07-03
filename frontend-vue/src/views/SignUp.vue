<template>
    <div>
        <section id="section" class="vh-100 vw-100 gradient-custom">
            <div class="container py-5 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div class="card" style="border-radius: 1rem; color: #23a5ae;">
                            <div class="card-body p-5 text-center">

                                <div class="mt-md-4 pb-5">

                                    <h2 class="fw-bold mb-2 text-uppercase">Signup now</h2>
                                    <p class="mb-5">Please enter your username and password to create an
                                        account!</p>
                                    <form @submit="onRegister">

                                        <input v-model="inputFormRegister.username" type="text" id="typeEmailX"
                                            class="form-control form-control-lg input-login" placeholder="Username"
                                            required />

                                        <input v-model="inputFormRegister.password" type="password" id="typePasswordX"
                                            class="form-control form-control-lg input-login" placeholder="Password"
                                            required />

                                        <input v-model="inputFormRegister.repeatPassword" type="password"
                                            class="form-control form-control-lg input-login"
                                            placeholder="Repeat password" required />

                                        <button class="btn btn-outline-info btn-lg px-5 input-login"
                                            type="submit">Signup</button>

                                    </form>

                                </div>

                                <div>
                                    <p class="mb-0">Already have an account? <a href="http://localhost:5173"
                                          style="color: #23a5ae;"  class="fw-bold">Login</a>
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
import { useRouter } from 'vue-router'
import authServices from '@/services/auth.services';
import checkLogin from "@/utilites/utilities";

const router = useRouter()

const inputFormRegister = ref({
    username: '',
    password: '',
    repeatPassword: ''
})

var onRegister = async (e: any) => {
    e.preventDefault();
    try {
        if (inputFormRegister.value.password != inputFormRegister.value.repeatPassword) {
            Swal.fire({
                title: 'Error!',
                text: 'Password and repeat password not match.',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        } else {
            await authServices.register({
                'username': inputFormRegister.value.username,
                'password': inputFormRegister.value.password
            });
            Swal.fire({
                title: 'Success!',
                text: 'Register success.',
                icon: 'success',
                confirmButtonText: 'OK'
            })
            router.push({ name: "login" })
        }
    } catch (err: any) {
        Swal.fire({
            title: 'Error!',
            text: 'Username already exist.',
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

<style>
.input-login::placeholder{
    color: #23a5ae;

}
.input-login {
    margin-top: 20px;
}
#section{
    background-image: url('@/assets/banner.jpeg');
    background-size: 100vw 100vh;
}
.input-login {
    margin-top: 20px;
}
</style>
