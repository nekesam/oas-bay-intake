<script setup>
import { computed } from 'vue'

const props = defineProps({
  job: Object,
  labour: Number,
  servicesTotal: Number,
  partsTotal: Number,
  total: Number
})

const servicesDisplay = computed(() =>
  props.job.services.length ? props.job.services.join(', ') : 'None selected'
)

const partsDisplay = computed(() => {
  if (!props.job.parts.length) return 'None selected'

  const counts = {}
  props.job.parts.forEach((part) => {
    counts[part.name] = (counts[part.name] || 0) + 1
  })

  return Object.entries(counts)
    .map(([name, qty]) => `${name} (${qty})`)
    .join(', ')
})
</script>

<template>
  <div class="confirmation-card">
    <h2>Job Card Summary</h2>

    <div class="row">
      <span>Plate:</span>
      <span>{{ job.plate || '—' }}</span>
    </div>
    <div class="row">
      <span>Owner:</span>
      <span>{{ job.owner || '—' }}</span>
    </div>
    <div class="row">
      <span>Class:</span>
      <span>{{ job.vehicleClass || '—' }}</span>
    </div>
    <div class="row">
      <span>Services:</span>
      <span>{{ servicesDisplay }}</span>
    </div>
    <div class="row">
      <span>Parts:</span>
      <span>{{ partsDisplay }}</span>
    </div>

    <hr />

    <div class="row">
      <span>Labour:</span>
      <span>{{ labour.toLocaleString() }}</span>
    </div>
    <div class="row">
      <span>Services:</span>
      <span>{{ servicesTotal.toLocaleString() }}</span>
    </div>
    <div class="row">
      <span>Parts:</span>
      <span>{{ partsTotal.toLocaleString() }}</span>
    </div>

    <hr />

    <div class="row total">
      <span>TOTAL:</span>
      <span>{{ total.toLocaleString() }} UGX</span>
    </div>
  </div>
</template>

<style scoped>
.confirmation-card {
  border: 1px solid #08060d;
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
  background: #08060d;
  color: #fff;
  font-family: ui-monospace, Consolas, monospace;
}

.confirmation-card h2 {
  margin-top: 0;
  font-size: 16px;
  font-family: system-ui, sans-serif;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 3px 0;
}

hr {
  border: none;
  border-top: 1px solid #444;
  margin: 8px 0;
}

.total {
  font-weight: 700;
  font-size: 17px;
  color: #c084fc;
}
</style>
