<template>
  <div class="d-flex flex-column w-100">
    <Header></Header>
    <div class="container">
      <form @submit="onUploadinFile" style="margin-top: 50px;">
        <div class="form-group">
          <label for="input-file" class="label fw-bold">Upload new data:</label>
          <input @change="changeFile($event)" id="input-file" type="file" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top: 20px; padding: 10px;">Upload file</button>
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
import Swal
 from 'sweetalert2';
import adminService from '@/services/admin.service';
const cookies = useCookies();
const router = useRouter()
const tableData = ref([])
const token = cookies.cookies.get('Token');
const filecsv = ref()


function changeFile(event: any){
    filecsv.value = event.target.files[0]
}

var onUploadinFile= async (e: any) =>{
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

onMounted(async () => {
  if (!checkLogin()) router.push({ name: 'login' })
    try {

      const dataResponse = await axios.get(`http://localhost:2000/csv/data`, {
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
</style>