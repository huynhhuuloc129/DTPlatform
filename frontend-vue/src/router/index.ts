import { createRouter, createWebHistory } from 'vue-router'
import Login from './../views/Login.vue'
// @ts-ignore
import Dashboard from './../views/Dashboard.vue'
// @ts-ignore
import SignUp from './../views/SignUp.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
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