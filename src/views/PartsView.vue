<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePartsStore } from '../stores/parts'
import { LOW_STOCK_THRESHOLD } from '../data/workshop'

const partsStore = usePartsStore()
const { parts, loading, error } = storeToRefs(partsStore)

onMounted(() => {
  if (partsStore.parts.length === 0) {
    partsStore.fetchParts()
  }
})
</script>

<template>
  <section>
    <h1>Parts Inventory</h1>

    <div v-if="loading" class="spinner" aria-label="Loading parts"></div>

    <p v-else-if="error" class="error">
      {{ error }}
      <button type="button" @click="partsStore.fetchParts()">Retry</button>
    </p>

    <table v-else>
      <thead>
        <tr>
          <th>Part</th>
          <th>Unit Price</th>
          <th>Qty In Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="part in parts"
          :key="part.id"
          :class="{ low: part.qtyInStock <= LOW_STOCK_THRESHOLD }"
        >
          <td>{{ part.name }}</td>
          <td>UGX {{ part.unitPrice.toLocaleString() }}</td>
          <td>{{ part.qtyInStock }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
h1 {
  margin-bottom: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

th,
td {
  border: 1px solid #dfdbe6;
  padding: 10px;
  text-align: left;
}

th {
  background: #ece7f5;
}

tr.low td {
  background: #fff4e0;
}

.error {
  color: #c0392b;
  font-weight: 500;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #d6d2dd;
  border-top-color: #2f2544;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
