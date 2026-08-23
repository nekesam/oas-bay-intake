<script setup>
import { RouterLink } from 'vue-router'
import { jobs } from '../data/workshopStore'
</script>

<template>
  <section>
    <h1>Reports</h1>

    <p v-if="jobs.length === 0">No jobs submitted yet.</p>

    <table v-else>
      <thead>
        <tr>
          <th>Plate</th>
          <th>Owner</th>
          <th>Bay</th>
          <th>Total</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in jobs" :key="item.plate + item.ownerContact">
          <td>{{ item.plate }}</td>
          <td>{{ item.ownerName }}</td>
          <td>{{ item.bayId }}</td>
          <td>UGX {{ item.total.toLocaleString() }}</td>
          <td>
            <RouterLink :to="`/job/${item.plate}`">View</RouterLink>
          </td>
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
