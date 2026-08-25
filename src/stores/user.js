import { defineStore } from 'pinia'

export const ROLES = ['manager', 'technician']

export const useUserStore = defineStore('user', {
  state: () => ({
    role: 'technician'
  }),
  getters: {
    isManager: (state) => state.role === 'manager',
    canAccess: (state) => (roles) =>
      !Array.isArray(roles) || roles.length === 0 || roles.includes(state.role)
  },
  actions: {
    setRole(role) {
      if (ROLES.includes(role)) {
        this.role = role
      }
    }
  }
})
