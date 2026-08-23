import { createRouter, createWebHistory } from 'vue-router'
import IntakeView from '../views/IntakeView.vue'
import BaysView from '../views/BaysView.vue'
import PartsView from '../views/PartsView.vue'
import ReportsView from '../views/ReportsView.vue'
import JobDetailsView from '../views/JobDetailsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/intake' },
    { path: '/intake', component: IntakeView },
    { path: '/bays', component: BaysView },
    { path: '/parts', component: PartsView },
    { path: '/reports', component: ReportsView },
    { path: '/job/:plate', component: JobDetailsView },
    { path: '/:pathMatch(.*)*', component: NotFoundView }
  ]
})

export default router
