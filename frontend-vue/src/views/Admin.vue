<template>
    <div class="d-flex flex-column w-100">
        <Header></Header>
        <div id="contentBetween" style=" min-height: 67vh">
            <div style=" display: flex;  justify-content: center;">
                <div id="card-user" class="card" style="border-radius: 0 0 15px 15px;  margin-top: 30px;">
                    <div class="card-body">
                        <h5>Thông tin tất cả người dùng</h5>
                        <ul class="list-group" >
                            <li v-for="user in users" class="list-group-item  align-items-center" style="display: flex; justify-content: space-between;">
                                <div style="display: flex;">
                                    <div>
                                        <div> Id: <span>{{ user._id }}</span> </div>

                                        <div> Tài khoản: <span>{{ user.username }}</span>
                                        </div>
                                        <div> Vai trò:

                                            <span v-if="user.username =='admin'">Admin</span>
                                            <span v-else>Thành viên</span>

                                        </div>
                                    </div>

                                </div>
                                <button class="btn btn-light">
                                    <font-awesome-icon icon="trash" style="cursor: pointer"  />
                                </button>
                            </li>
                        </ul>
                        <!-- <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#registerModal"
                            style="width: 100%;">+</button> -->


                        <!-- <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel"
                            aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog-centered modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="loginTitle">Thêm người dùng</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="registerForm">

                                            <div class="form-floating">
                                                <input type="text" class="form-control" 
                                                    id="registerInputUsername"  placeholder=""
                                                    required>
                                                <label for="registerInputUsername">Tài khoản</label>
                                            </div>

                                            <div class="form-floating">
                                                <input type="email" class="form-control" id="registerInputEmail1" 
                                                    aria-describedby="emailHelp" placeholder="" required>
                                                <label for="registerInputEmail1">Địa chỉ email</label>
                                            </div>

                                            <div class="form-floating">
                                                <input type="password" class="form-control"
                                                    id="registerInputPassword"  placeholder=""
                                                    required>
                                                <label for="registerInputPassword">Mật khẩu</label>
                                            </div>

                                            <div class="form-floating form-element">
                                                <select class="form-select form-select-sm" id="floatingSelect"
                                                    aria-label=".form-select-sm role" 
                                                    required>
                                                    <option value="male">Nam</option>
                                                    <option value="female">Nữ</option>
                                                </select>
                                                <label for="floatingSelect">Giới tính</label>
                                            </div>

                                            <div class="form-floating">
                                                <select class="form-select form-select-sm"  id="floatingSelectRole"
                                                    aria-label=".form-select-sm role" required>
                                                    <option value="lessor">Chủ trọ</option>
                                                    <option value="tenant">Người thuê trọ</option>
                                                </select>
                                                <label for="floatingSelectRole">Chọn vai trò</label>

                                            </div>
                                            <div
                                                style="display:flex; align-items:center; justify-content: center; padding: 10px 0 0 0;">
                                                <button type="button" id="registerButton" class="btn btn-danger registerForm-button"> Thêm người dùng </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div> -->


                    </div>
                    </div>
                </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import checkLogin from '@/utilites/utilities'; ``
import { useRouter } from 'vue-router'
// @ts-ignore
import Header from './../components/Header.vue'
// @ts-ignore
import Footer from './../components/Footer.vue'
import userServices from '@/services/user.services';
import { useCookies } from "vue3-cookies";

const router = useRouter()
const cookies = useCookies();
const token = cookies.cookies.get('Token');

const users = ref([
{
    _id: "",
    username: "",
    password: "",
    __v: 0
}])
onMounted(async () => {
    if (!checkLogin()) router.push({ name: 'login' })
    let resp = await userServices.getUsers(token)
    users.value = resp.users
})
</script>

<style>
#card-user{
    width: 75%;
}
@media only screen and (max-width: 500px) {
    #card-user{
        font-size: 200%;
        width: 100%;
    }
}
</style>