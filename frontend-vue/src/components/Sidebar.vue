<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <nav id="sidebar" class="bg-light border-end">
      <!-- Sidebar Header -->
      <div class="p-3 border-bottom">
        <div class="d-flex align-items-center justify-content-between">
          <button class="btn btn-link p-0">
            <i class="fas fa-arrow-left"></i>
          </button>
          <button class="btn btn-link p-0">
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>

      <!-- Sidebar Content -->
      <div class="p-3">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center mb-3">
            <button class="btn btn-outline-secondary me-1">
                <div style="font-size: small;">Tốt nhất</div>
              </button>
            <button class="btn btn-outline-secondary me-2">
              <i class="fa-solid fa-car"></i>
            </button>
            <button class="btn btn-outline-secondary me-2">
              <i class="fas fa-bus"></i>
            </button>
            <button class="btn btn-outline-secondary me-2">
              <i class="fas fa-train"></i>
            </button>
            <button class="btn btn-outline-secondary me-2">
              <i class="fas fa-walking"></i>
            </button>
            <button class="btn btn-outline-secondary">
              <i class="fas fa-bicycle"></i>
            </button>
          </div>
        </div>
        <form @submit.prevent="getDirections">
          <div class="mb-3">
            <input type="text" class="form-control" v-model="startLocation"
              placeholder="Đại học Cần Thơ, Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ, Việt Nam">
          </div>
          <div class="mb-3">
            <input type="text" class="form-control" v-model="endLocation" placeholder="Thành phố Hồ Chí Minh, Việt Nam">
          </div>
        </form>
        <hr>

        <!-- <hr> -->
        <!-- <div class="mb-3">
          <h6>Rời khỏi bây giờ</h6>
          <button class="btn btn-link p-0">Tùy chọn</button>
        </div> -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <strong>qua CT01</strong>
            <p class="mb-0">2 giờ 48 p</p>
          </div>
          <div>
            <span class="badge bg-warning text-dark">Tuyến này có thu phí</span>
          </div>
        </div>
        <div class="mb-2">
          <strong>Phuong Trang</strong>
          <p class="mb-0">3 giờ 58 p</p>
        </div>
        <div class="mb-2">
          <strong>Phuong Trang</strong>
          <p class="mb-0">3 giờ 52 p</p>
        </div>
        <hr>
        <div>
          <!-- <button class="btn btn-link">Khám phá Thành phố Hồ Chí Minh</button> -->
          <div class="profile">
            <div class="h6">
              <span class="h6">Độ dài: </span>
              <span>150km</span>
            </div>
            <div class="h6">
              <span class="h6">Lượng khí thải: </span>
              <span>1000 PPM</span>
            </div>
            <div class="h6">
              <span class="h6">Thời gian: </span>
              <span>20 phút</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const startLocation = ref('')
const endLocation = ref('')

function getDirections() {
  console.log('Getting directions from', startLocation.value, 'to', endLocation.value);
}

</script>

<style>
#sidebar {
  width: 350px;
  height: 100vh;
}

#content {
  width: 100%;
}
</style>
