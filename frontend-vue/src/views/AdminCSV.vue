<template>
  <div class="d-flex flex-column w-100">
    <Header></Header>
    <div id="contentBetween">
      <div style=" display: flex;  justify-content: center;">
        <div id="card-user" class="card" style="border-radius: 0 0 15px 15px;  margin-top: 30px;">
          <div class="card-body">
            <h5>Thông tin tất cả người dùng</h5>
            <ul class="list-group">
              <li v-for="user in users" class="list-group-item  align-items-center"
                style="display: flex; justify-content: space-between;">
                <div style="display: flex;">
                  <div>
                    <div> Id: <span>{{ user._id }}</span> </div>

                    <div> Tài khoản: <span>{{ user.username }}</span>
                    </div>
                    <div> Vai trò:

                      <span v-if="user.username == 'admin'">Admin</span>
                      <span v-else>Thành viên</span>

                    </div>
                  </div>

                </div>

              </li>
            </ul>
          </div>
        </div>
      </div>

      <form @submit="onUploadinFile" style="margin-top: 50px;">
        <div class="form-group">
          <label for="input-file" class="label fw-bold">Upload new data:</label>
          <input @change="changeFile($event)" id="input-file" type="file" class="form-control">
        </div>
        <button type="submit" class="btn btn-dark" style="margin-top: 20px; padding: 10px;">Upload file</button>
      </form>

      <h2 class="mt-5">Uploaded Data</h2>
      <table class="table  table-bordered" v-if="tableData.length > 0">
        <thead>
          <tr>
            <th v-for="(value, key) in tableData[0]" :key="key">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index">
            <td v-for="(value, key) in row" :key="key">{{ value }}</td>
          </tr>
        </tbody>
      </table>
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
import Footer from './../components/Footer.vue'
import axios from 'axios';
import { useCookies } from "vue3-cookies";
import Swal from 'sweetalert2';
import adminService from '@/services/admin.service';
import userServices from '@/services/user.services';

const cookies = useCookies();
const router = useRouter()
const tableData = ref([])
const token = cookies.cookies.get('Token');
const filecsv = ref()


function changeFile(event: any) {
  filecsv.value = event.target.files[0]
}

var onUploadinFile = async (e: any) => {
  e.preventDefault();
  try {
    await adminService.upload(filecsv.value, token)
    Swal.fire({
      title: "Success!",
      text: "Upload new data success!",
      icon: "success",
      confirmButtonText: "OK",
    });
    window.location.reload();
  } catch (err: any) {
    Swal.fire({
      title: "Error!",
      text: err,
      icon: "error",
      confirmButtonText: "OK",
    });
    console.log(err);
  }
};
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

  try {

    const dataResponse = await axios.get(`https://dtplatform.onrender.com/csv/data`, {
      headers: {
        'token': token
      }
    });
    tableData.value = dataResponse.data;
  } catch (error) {
    console.error('Error uploading or fetching data:', error);
  }
})

</script>

<style>
#contentBetween {
  margin: 0 50px 0 50px;
}

@media only screen and (max-width: 770px) {

  h2,
  label {
    font-size: 175%;
  }

  #contentBetween {
    margin: 0 10px 0 10px;
    font-size: 50%;
  }
}
</style>