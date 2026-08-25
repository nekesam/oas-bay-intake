import { defineStore } from 'pinia'
import { getParts } from '../api/mock'
import { LOW_STOCK_THRESHOLD } from '../data/workshop'

export const usePartsStore = defineStore('parts', {
  state: () => ({
    parts: [],
    loading: false,
    error: ''
  }),
  getters: {
    lowStockParts: (state) =>
      state.parts.filter((part) => part.qtyInStock <= LOW_STOCK_THRESHOLD),
    outOfStockParts: (state) => state.parts.filter((part) => part.qtyInStock === 0)
  },
  actions: {
    async fetchParts() {
      this.loading = true
      this.error = ''
      try {
        this.parts = await getParts()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    issuePart(id) {
      const part = this.parts.find((item) => item.id === id)
      if (part && part.qtyInStock > 0) {
        part.qtyInStock -= 1
      }
    }
  }
})
