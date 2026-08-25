<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useJobStore } from '../stores/jobs'

const route = useRoute()
const jobStore = useJobStore()

const plate = computed(() => String(route.params.plate || '').toUpperCase())
const job = computed(() => jobStore.findByPlate(plate.value))
</script>

<template>
  <section>
    <h1>Job Details</h1>

    <p v-if="!job">No job found for plate: {{ plate }}</p>

    <div v-else class="job-card">
      <p><strong>Plate:</strong> {{ job.plate }}</p>
      <p><strong>Owner:</strong> {{ job.ownerName }}</p>
      <p><strong>Contact:</strong> {{ job.ownerContact }}</p>
      <p><strong>Vehicle Class:</strong> {{ job.vehicleClass }}</p>
      <p><strong>Technicians:</strong> {{ job.technicians.join(', ') }}</p>
      <p><strong>Bay:</strong> {{ job.bayId }}</p>
      <p><strong>Services:</strong> {{ job.services.join(', ') }}</p>
      <p><strong>Status:</strong> {{ job.status }}</p>
      <p><strong>Labour:</strong> UGX {{ job.labour.toLocaleString() }}</p>
      <p><strong>Services Total:</strong> UGX {{ job.servicesTotal.toLocaleString() }}</p>
      <p><strong>Parts Total:</strong> UGX {{ job.partsTotal.toLocaleString() }}</p>
      <p><strong>Total:</strong> UGX {{ job.total.toLocaleString() }}</p>
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin-bottom: 16px;
}

.job-card {
  border: 1px solid #d6d2dd;
  border-radius: 8px;
  padding: 14px;
  background: #fff;
}

p {
  margin: 8px 0;
}
</style>
