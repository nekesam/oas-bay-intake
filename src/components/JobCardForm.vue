<script setup>
import { computed } from 'vue'

const props = defineProps({
  job: Object,
  services: Array,
  runningTotal: Number
})

const LABOUR_CHARGE = 20000

// Plate format: 3 letters, a space, 3 digits, 1 letter. e.g. UBK 123A
const isPlateValid = computed(() => /^[A-Za-z]{3} \d{3}[A-Za-z]$/.test(props.job.plate))

// Owner name: alphabets only, at least 2 characters.
const isOwnerValid = computed(() => /^[A-Za-z\s]{2,}$/.test(props.job.owner))
</script>

<template>
  <form class="job-card-form" @submit.prevent>
    <h2>Job Card Form</h2>

    <div class="field">
      <label for="plate">Plate Number</label>
      <input id="plate" type="text" v-model="job.plate" placeholder="UBK 123A" />
      <p v-if="job.plate && !isPlateValid" class="error">
        Format: 3 letters, space, 3 digits, 1 letter (e.g. UBK 123A)
      </p>
    </div>

    <div class="field">
      <label for="owner">Owner Name</label>
      <input id="owner" type="text" v-model="job.owner" placeholder="Mukasa James" />
      <p v-if="job.owner && !isOwnerValid" class="error">
        Owner name must be alphabets only, at least 2 characters
      </p>
    </div>

    <div class="field">
      <label for="vehicleClass">Vehicle Class</label>
      <select id="vehicleClass" v-model="job.vehicleClass">
        <option value="" disabled>Select class</option>
        <option value="Heavy">Heavy</option>
        <option value="Small">Small</option>
        <option value="Commercial">Commercial</option>
      </select>
    </div>

    <div class="field">
      <label>Services</label>
      <div v-for="service in services" :key="service.name" class="checkbox-row">
        <label>
          <input type="checkbox" :value="service.name" v-model="job.services" />
          {{ service.name }}
          <span v-if="service.price > 0">(UGX {{ service.price.toLocaleString() }})</span>
        </label>
      </div>
    </div>

    <div class="field">
      <label for="labour">Labour Charge</label>
      <input id="labour" type="text" :value="LABOUR_CHARGE.toLocaleString()" disabled />
    </div>

    <p class="running-total">Running Total: UGX {{ runningTotal.toLocaleString() }}</p>
  </form>
</template>

<style scoped>
.job-card-form {
  border: 1px solid #e5e4e7;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}

.job-card-form h2 {
  margin-top: 0;
  font-size: 18px;
}

.field {
  margin-bottom: 14px;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
}

input[type='text'],
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
}

input[disabled] {
  background: #f4f3ec;
  color: #6b6375;
}

.checkbox-row label {
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 6px;
}

.error {
  color: #c0392b;
  font-size: 13px;
  margin: 4px 0 0;
}

.running-total {
  font-size: 18px;
  font-weight: 600;
  margin-top: 16px;
}
</style>
