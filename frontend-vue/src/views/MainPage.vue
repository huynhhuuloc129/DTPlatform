<template>
    <div class="d-flex flex-column w-100">
        <Header></Header>
        <div id="banner">
            <img src="@/assets/banner.jpeg" width="100%" alt="">
        </div>

        <h5 class="mleft mb-3 mt-2">Xin chào, admin!</h5>
        <div>
            <div class="container1" style="border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
                <div class="row">
                    <div class="col">
                        <a @click="router.push({ name: 'dashboard' })" href="#">
                            <button class="btn btn-light w-100 text-start">
                                <h5>
                                    <i class="fa-solid fa-location-dot" style="color: orange;"></i>
                                    <span class="fw-bold" style="color: black;">
                                        Bạn muốn đi đến đâu?
                                    </span>
                                </h5>
                            </button>
                        </a>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <a @click="router.push({ name: 'dashboard' })" href="#">
                            <button class="btn btn-outline-light d-flex justify-content-start align-items-center w-100"
                                style="color: black;">

                                <div class="text-start">
                                    <i class="fa-solid fa-house"></i>
                                </div>
                                <div class="d-flex button-responsive justify-content-start align-items-start flex-column"
                                    style="">
                                    <div>Nhà</div>
                                    <div class="text-secondary">Lý Tự Trọng</div>
                                </div>
                            </button>
                        </a>
                    </div>
                    <div class="col">
                        <a @click="router.push({ name: 'dashboard' })" href="#">
                            <button class="btn btn-outline-light d-flex justify-content-start align-items-center w-100"
                                style="color: black;">

                                <i class="fa-regular fa-building"></i>
                                <div class="d-flex button-responsive justify-content-start align-items-start flex-column"
                                    style="">
                                    <div>Công ty</div>
                                    <div class="text-secondary">Lý Tự Trọng</div>
                                </div>
                            </button>
                        </a>
                    </div>
                    <div class="col">
                        <a @click="router.push({ name: 'dashboard' })" href="#">
                            <button class="btn btn-outline-light d-flex justify-content-start align-items-center w-100"
                                style="color: black;">

                                <i class="fa-solid fa-house-user"></i>
                                <div class="d-flex button-responsive justify-content-start align-items-start flex-column"
                                    style="">
                                    <div>Nhà</div>
                                    <div class="text-secondary">Lý Tự Trọng</div>
                                </div>
                            </button>
                        </a>
                    </div>
                    <div class="col responsive">
                        <a @click="router.push({ name: 'dashboard' })" href="#">
                            <button class="btn btn-outline-light d-flex justify-content-start align-items-center w-100"
                                style="color: black;">

                                <i class="fa-solid fa-house-user"></i>
                                <div class="d-flex button-responsive justify-content-start align-items-start flex-column"
                                    style="">
                                    <div>Khu vui chơi</div>
                                    <div class="text-secondary">Lý Tự Trọng</div>
                                </div>
                            </button>
                        </a>
                    </div>
                    <div class="col responsive">
                        <a @click="router.push({ name: 'dashboard' })" href="#">
                            <button class="btn btn-outline-light d-flex justify-content-start align-items-center w-100"
                                style="color: black;">

                                <i class="fa-solid fa-house-user"></i>
                                <div class="d-flex button-responsive justify-content-start align-items-start flex-column"
                                    style="">
                                    <div>Công viên</div>
                                    <div class="text-secondary">Lý Tự Trọng</div>
                                </div>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
            <div class="mt-3 mb-3 d-flex justify-content-around mleft mright">
                <div class="w-100 text-center">
                    <button class="btn btn-light w-100"><i class="fa-solid fa-car"></i></button>
                    <h6>Ô tô</h6>
                </div>

                <div class="w-100 text-center">
                    <button class="btn btn-light w-100 "><i class="fa-solid fa-motorcycle"></i></button>
                    <h6>Xe máy</h6>
                </div>

                <div class="w-100 text-center">
                    <button class="btn btn-light w-100 "><i class="fa-solid fa-bicycle"></i></button>
                    <h6>Giao hàng</h6>
                </div>

                <div class="w-100 text-center">
                    <button class="btn btn-light w-100 "><i class="fa-solid fa-car-side"></i></button>
                    <h6>Thuê xe</h6>
                </div>
            </div>

            <img src="@/assets/banner3.png" width="94%" class="mleft" style="border-radius: 20px;" alt="">
            
            <div class="mleft mt-3">
                <h5>Thanh toán tiện lợi - Ưu đãi hấp dẫn</h5>
            </div>
        </div>

        <Footer></Footer>

    </div>
</template>

<script setup lang="ts">
import Header from './../components/Header.vue'
import Footer from './../components/Footer.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style>
.mleft {
    margin-left: 50px;
}
.mright {
    margin-right: 50px;
}
a {
    color: black;
    text-decoration: none;
}

.button-responsive {
    margin-left: 20px;
}

.container1 {
    margin: 0 50px 0 50px;
}

.col {
    padding: 0 12px;
}

@media (width <=1000px) {
    .responsive {
        display: none;
    }

    .button-responsive {
        margin-left: 5px;
    }
}

@media (width <=677px) {
    .container1 {
        margin: 0 10px 0 10px;
    }

    .mleft {
        margin-left: 10px;
    }
    .mright {
        margin-right: 10px;
    }
    .button-responsive {
        margin-left: 5px;
    }
}
</style>