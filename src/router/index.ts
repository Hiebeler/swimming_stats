import DashboardView from '@/views/DashboardView.vue'
import SwimView from '@/views/SwimView.vue'
import UploadView from '@/views/UploadView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/upload',
      name: "upload",
      component: UploadView
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/swims/:id',
      name: 'swim-detail',
      component: SwimView
    }
  ],
})

export default router
