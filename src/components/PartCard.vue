<script setup>
const props = defineProps({
  id: String,
  name: String,
  unitPrice: Number,
  qtyInStock: Number
})

const emit = defineEmits(['issue'])

function issuePart() {
  emit('issue', props.id)
}
</script>

<template>
  <div class="part-card">
    <div class="part-info">
      <h3>{{ name }}</h3>
      <p>UGX {{ unitPrice.toLocaleString() }}</p>
      <p class="stock">In stock: {{ qtyInStock }}</p>
    </div>

    <button v-if="qtyInStock > 0" @click="issuePart">Issue to Job</button>
    <span v-else class="out-of-stock">Out of Stock</span>
  </div>
</template>

<style scoped>
.part-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e5e4e7;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 10px;
  background: #fff;
}

.part-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.part-info p {
  margin: 0;
  font-size: 14px;
  color: #6b6375;
}

.stock {
  font-weight: 500;
}

button {
  background: #aa3bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
}

button:hover {
  background: #9526e8;
}

.out-of-stock {
  color: #c0392b;
  font-weight: 500;
}
</style>
