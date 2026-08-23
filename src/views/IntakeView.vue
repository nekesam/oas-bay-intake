<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import JobCardForm from '../components/JobCardForm.vue'
import PartCard from '../components/PartCard.vue'
import ConfirmationCard from '../components/ConfirmationCard.vue'
import {
  LABOUR_CHARGE,
  services,
  technicians,
  bays,
  partsCatalogue,
  jobs,
  createEmptyJob
} from '../data/workshopStore'

const router = useRouter()
const job = reactive(createEmptyJob())

const freeBays = computed(() => bays.filter((bay) => bay.status === 'Free'))

const servicesTotal = computed(() =>
  job.services.reduce((sum, name) => {
    const service = services.find((item) => item.name === name)
    return sum + (service ? service.price : 0)
  }, 0)
)

const partsTotal = computed(() => job.parts.reduce((sum, part) => sum + part.unitPrice, 0))

const runningTotal = computed(() => LABOUR_CHARGE + servicesTotal.value + partsTotal.value)

function issuePart(part) {
  if (part.qtyInStock > 0) {
    part.qtyInStock -= 1
    job.parts.push({ name: part.name, unitPrice: part.unitPrice })
  }
}

function saveJob() {
  const savedJob = {
    plate: job.plate.trim().toUpperCase(),
    ownerName: job.ownerName.trim(),
    ownerContact: job.ownerContact.trim(),
    engineOilPrice: Number(job.engineOilPrice),
    brakeFluidPrice: Number(job.brakeFluidPrice),
    oilFilterPrice: Number(job.oilFilterPrice),
    vehicleClass: job.vehicleClass,
    services: [...job.services],
    technicians: [...job.technicians],
    bayId: job.bayId,
    parts: [...job.parts],
    labour: LABOUR_CHARGE,
    servicesTotal: servicesTotal.value,
    partsTotal: partsTotal.value,
    total: runningTotal.value
  }

  jobs.push(savedJob)

  const selectedBay = bays.find((bay) => bay.id === savedJob.bayId)
  if (selectedBay) {
    selectedBay.status = 'Occupied'
    selectedBay.currentPlate = savedJob.plate
  }

  Object.assign(job, createEmptyJob())

  router.push(`/job/${savedJob.plate}`)
}
</script>

<template>
  <section>
    <h1>OAS Bay Job Card Intake</h1>

    <JobCardForm
      :job="job"
      :services="services"
      :technicians="technicians"
      :bays="freeBays"
      :running-total="runningTotal"
      @submit-job="saveJob"
    />

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
  </section>
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
