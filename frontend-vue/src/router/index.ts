import { createRouter, createWebHistory } from 'vue-router'
import Login from './../views/Login.vue'
import Dashboard from './../views/Dashboard.vue'
import SignUp from './../views/SignUp.vue'
import Admin from './../views/Admin.vue'
import AdminCSV from './../views/AdminCSV.vue'
// @ts-ignore
import MainPage from './../views/MainPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/map',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/home',
      name: 'home',
      component: MainPage
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/admincsv',
      name: 'admincsv',
      component: AdminCSV
    },
    // {
    //   path: '/upload-post',
    //   name: 'upload post',
    //   component: () => import('../views/UploadPost.vue')
    // },
    // {
    //   path: '/admin',
    //   name: 'admin',
    //   component: () => import('../views/AdminPage.vue')
    // },
    // {
    //   path: '/tag/:id',
    //   name: 'tag',
    //   component: () => import('../views/ListPostTags.vue')
    // }
    // ,
    // {
    //   path: '/search/:content',
    //   name: 'search',
    //   component: () => import('../views/SearchPost.vue')
    // }
  ]
})

export default router