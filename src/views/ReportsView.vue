<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePartsStore } from '../stores/parts'
import { useJobStore } from '../stores/jobs'

const jobStore = useJobStore()
const partsStore = usePartsStore()

const cards = computed(() => [
  { label: 'Total Revenue', value: `UGX ${jobStore.totalRevenue.toLocaleString()}` },
  { label: 'Labour Collected', value: `UGX ${jobStore.labourCollected.toLocaleString()}` },
  { label: 'Cars Serviced Today', value: jobStore.carsServicedToday },
  { label: 'Low Stock Items', value: partsStore.lowStockParts.length }
])
</script>

<template>
  <section>
    <h1>Manager Dashboard</h1>

    <div class="cards">
      <article v-for="card in cards" :key="card.label" class="card">
        <p class="card-label">{{ card.label }}</p>
        <p class="card-value">{{ card.value }}</p>
      </article>
    </div>

    <h2>Job Cards</h2>
    <p v-if="jobStore.jobs.length === 0">No jobs submitted yet.</p>

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
        <tr v-for="job in jobStore.jobs" :key="job.id">
          <td>{{ job.plate }}</td>
          <td>{{ job.ownerName }}</td>
          <td>{{ job.bayId }}</td>
          <td>UGX {{ job.total.toLocaleString() }}</td>
          <td>
            <RouterLink :to="`/job/${job.plate}`">View</RouterLink>
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

h2 {
  font-size: 18px;
  margin: 24px 0 12px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.card {
  border: 1px solid #d6d2dd;
  border-radius: 8px;
  padding: 14px;
  background: #fff;
}

.card-label {
  margin: 0 0 6px;
  font-size: 13px;
  color: #6b6375;
}

.card-value {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
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
