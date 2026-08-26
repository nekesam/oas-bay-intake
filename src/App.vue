<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore, ROLES } from './stores/user'
import RestockBanner from './components/RestockBanner.vue'

const router = useRouter()
const userStore = useUserStore()
const { role } = storeToRefs(userStore)

const links = [
  { to: '/intake', label: 'Intake', roles: ['manager', 'technician'] },
  { to: '/bays', label: 'Bays', roles: ['manager', 'technician'] },
  { to: '/parts', label: 'Parts', roles: ['manager'] },
  { to: '/reports', label: 'Reports', roles: ['manager'] }
]

const visibleLinks = computed(() =>
  links.filter((link) => link.roles.includes(role.value))
)

function changeRole(event) {
  userStore.setRole(event.target.value)
}

watch(role, () => {
  const allowed = router.currentRoute.value.meta.roles
  if (allowed && !allowed.includes(role.value)) {
    router.push('/bays')
  }
})
</script>

<template>
  <header class="top-nav">
    <h1>OAS Bay</h1>
    <nav>
      <RouterLink v-for="link in visibleLinks" :key="link.to" :to="link.to">
        {{ link.label }}
      </RouterLink>
    </nav>
    <label class="role-switch">
      <span>Role</span>
      <select :value="role" @change="changeRole">
        <option v-for="option in ROLES" :key="option" :value="option">{{ option }}</option>
      </select>
    </label>
  </header>

  <RestockBanner />

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.top-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

nav a {
  text-decoration: none;
  color: #2f2544;
  border: 1px solid #cfc6df;
  border-radius: 6px;
  padding: 6px 10px;
  background: #fff;
}

nav a.router-link-active {
  background: #2f2544;
  color: #fff;
  border-color: #2f2544;
}

.role-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.role-switch select {
  padding: 6px 8px;
  border: 1px solid #cfc6df;
  border-radius: 6px;
}
</style>
