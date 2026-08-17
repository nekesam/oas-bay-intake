<script setup>
import { reactive, computed, onMounted } from 'vue'
import JobCardForm from './components/JobCardForm.vue'
import PartCard from './components/PartCard.vue'
import ConfirmationCard from './components/ConfirmationCard.vue'

const LABOUR_CHARGE = 20000

// Services offered. Only Wheel Alignment and Wheel Balancing have a fixed charge.
const services = [
  { name: 'Oil Change', price: 0 },
  { name: 'Wheel Alignment', price: 30000 },
  { name: 'Wheel Balancing', price: 20000 }
]

// Parts catalogue starts empty; onMounted below simulates fetching it.
const partsCatalogue = reactive([])

// The job card being filled in by the technician.
const job = reactive({
  plate: '',
  owner: '',
  vehicleClass: '',
  services: [],
  parts: []
})

const servicesTotal = computed(() =>
  job.services.reduce((sum, name) => {
    const service = services.find((s) => s.name === name)
    return sum + (service ? service.price : 0)
  }, 0)
)

const partsTotal = computed(() => job.parts.reduce((sum, part) => sum + part.unitPrice, 0))

const runningTotal = computed(() => LABOUR_CHARGE + servicesTotal.value + partsTotal.value)

function issuePart(part) {
  if (part.qtyInStock > 0) {
    part.qtyInStock--
    job.parts.push({ name: part.name, unitPrice: part.unitPrice })
  }
}

onMounted(() => {
  console.log('OAS Bay Intake loaded')

  // Simulates fetching the parts catalogue from a server.
  partsCatalogue.push(
    { name: 'Engine Oil (20W-50)', unitPrice: 120000, qtyInStock: 10 },
    { name: 'Oil Filter', unitPrice: 18000, qtyInStock: 8 },
    { name: 'Brake Fluid', unitPrice: 15000, qtyInStock: 5 },
    { name: 'Brake Pads (Front)', unitPrice: 45000, qtyInStock: 4 }
  )
})
</script>

<template>
  <h1>OAS Bay Job Card Intake</h1>

  <JobCardForm :job="job" :services="services" :running-total="runningTotal" />

  <section class="parts-catalogue">
    <h2>Parts Catalogue</h2>
    <PartCard
      v-for="part in partsCatalogue"
      :key="part.name"
      :name="part.name"
      :unit-price="part.unitPrice"
      :qty-in-stock="part.qtyInStock"
      @issue="issuePart(part)"
    />
  </section>

  <ConfirmationCard
    :job="job"
    :labour="LABOUR_CHARGE"
    :services-total="servicesTotal"
    :parts-total="partsTotal"
    :total="runningTotal"
  />
</template>

<style scoped>
h1 {
  font-size: 26px;
  margin-bottom: 20px;
}

.parts-catalogue {
  margin: 24px 0;
}

.parts-catalogue h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
