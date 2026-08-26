import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import IntakeView from '../views/IntakeView.vue'
import BaysView from '../views/BaysView.vue'
import PartsView from '../views/PartsView.vue'
import ReportsView from '../views/ReportsView.vue'
import JobDetailsView from '../views/JobDetailsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const BOTH_ROLES = ['manager', 'technician']

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/intake' },
    { path: '/intake', component: IntakeView, meta: { roles: BOTH_ROLES } },
    { path: '/bays', component: BaysView, meta: { roles: BOTH_ROLES } },
    { path: '/parts', component: PartsView, meta: { roles: ['manager'] } },
    { path: '/reports', component: ReportsView, meta: { roles: ['manager'] } },
    { path: '/job/:plate', component: JobDetailsView, meta: { roles: BOTH_ROLES } },
    { path: '/:pathMatch(.*)*', component: NotFoundView }
  ]
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const allowed = to.meta.roles
  if (allowed && !allowed.includes(userStore.role)) {
    return '/bays'
  }
})

export default router
