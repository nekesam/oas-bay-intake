<script setup>
import { partsCatalogue } from '../data/workshopStore'
</script>

<template>
  <section>
    <h1>Parts Inventory</h1>

    <table>
      <thead>
        <tr>
          <th>Part</th>
          <th>Unit Price</th>
          <th>Qty In Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="part in partsCatalogue" :key="part.name">
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
</style>
