<script setup>
import { computed } from 'vue'
import { usePartsStore } from '../stores/parts'

const partsStore = usePartsStore()

const show = computed(() => partsStore.outOfStockParts.length > 0)

const message = computed(() => {
  const names = partsStore.outOfStockParts.map((part) => part.name).join(', ')
  return `Restock needed: ${names}`
})
</script>

<template>
  <p v-show="show" class="restock-banner">{{ message }}</p>
</template>

<style scoped>
.restock-banner {
  margin: 0 0 16px;
  padding: 10px 14px;
  border: 1px solid #b84747;
  border-radius: 6px;
  background: #fbe6e6;
  color: #7a1f1f;
  font-weight: 600;
}
</style>
