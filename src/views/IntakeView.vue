<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import JobCardForm from '../components/JobCardForm.vue'
import PartCard from '../components/PartCard.vue'
import ConfirmationCard from '../components/ConfirmationCard.vue'
import { usePartsStore } from '../stores/parts'
import { useJobStore } from '../stores/jobs'
import { LABOUR_CHARGE, services, technicians } from '../data/workshop'

const router = useRouter()
const partsStore = usePartsStore()
const jobStore = useJobStore()

const { parts, loading, error: partsError } = storeToRefs(partsStore)
const { freeBays, saving, error: saveError } = storeToRefs(jobStore)

function createEmptyJob() {
  return {
    plate: '',
    ownerName: '',
    ownerContact: '',
    engineOilPrice: '',
    brakeFluidPrice: '',
    oilFilterPrice: '',
    vehicleClass: '',
    services: [],
    technicians: [],
    bayId: '',
    parts: []
  }
}

const job = reactive(createEmptyJob())

const servicesTotal = computed(() =>
  job.services.reduce((sum, name) => {
    const service = services.find((item) => item.name === name)
    return sum + (service ? service.price : 0)
  }, 0)
)

const partsTotal = computed(() =>
  job.parts.reduce((sum, part) => sum + part.unitPrice, 0)
)

const runningTotal = computed(() => LABOUR_CHARGE + servicesTotal.value + partsTotal.value)

function issuePart(part) {
  if (part.qtyInStock <= 0) {
    return
  }
  partsStore.issuePart(part.id)
  job.parts.push({ id: part.id, name: part.name, unitPrice: part.unitPrice })
}

async function saveJob() {
  const payload = {
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

  const saved = await jobStore.openJob(payload)
  if (!saved) {
    return
  }

  Object.assign(job, createEmptyJob())
  router.push(`/job/${saved.plate}`)
}

onMounted(() => {
  if (partsStore.parts.length === 0) {
    partsStore.fetchParts()
  }
})
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

    <p v-if="saving" class="notice">Saving job card...</p>
    <p v-if="saveError" class="notice error">{{ saveError }}</p>

    <section class="parts-catalogue">
      <h2>Parts Catalogue</h2>

      <div v-if="loading" class="spinner" aria-label="Loading parts"></div>
      <p v-else-if="partsError" class="notice error">
        {{ partsError }}
        <button type="button" @click="partsStore.fetchParts()">Retry</button>
      </p>
      <template v-else>
        <PartCard
          v-for="part in parts"
          :key="part.id"
          :id="part.id"
          :name="part.name"
          :unit-price="part.unitPrice"
          :qty-in-stock="part.qtyInStock"
          @issue="issuePart(part)"
        />
      </template>
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

.notice {
  margin: 12px 0;
  font-weight: 500;
}

.notice.error {
  color: #c0392b;
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
