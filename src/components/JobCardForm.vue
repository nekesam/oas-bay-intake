<script setup>
import { computed, ref } from 'vue'
import {
  LABOUR_CHARGE,
  WHEEL_ALIGNMENT_CHARGE,
  WHEEL_BALANCING_CHARGE,
  vehicleClasses
} from '../data/workshop'

const props = defineProps({
  job: Object,
  services: Array,
  technicians: Array,
  bays: Array,
  runningTotal: Number
})

const emit = defineEmits(['submit-job'])

const touched = ref({
  plate: false,
  ownerName: false,
  ownerContact: false,
  engineOilPrice: false,
  brakeFluidPrice: false,
  oilFilterPrice: false
})

const isPlateValid = computed(() => /^[A-Z]{3}\s\d{3}[A-Z]$/.test(props.job.plate))
const isOwnerNameValid = computed(() => /^[A-Za-z\s]{2,}$/.test(props.job.ownerName.trim()))
const isOwnerContactValid = computed(() => /^\d{10}$/.test(props.job.ownerContact))

const isEngineOilPriceValid = computed(() => {
  const value = Number(props.job.engineOilPrice)
  return value >= 79000 && value <= 200000
})
const isBrakeFluidPriceValid = computed(() => {
  const value = Number(props.job.brakeFluidPrice)
  return value >= 13000 && value <= 20000
})
const isOilFilterPriceValid = computed(() => {
  const value = Number(props.job.oilFilterPrice)
  return value >= 15000 && value <= 20000
})

const isWheelAlignmentSelected = computed(() => props.job.services.includes('Wheel Alignment'))
const isWheelBalancingSelected = computed(() => props.job.services.includes('Wheel Balancing'))

const isFormValid = computed(() =>
  isPlateValid.value &&
  isOwnerNameValid.value &&
  isOwnerContactValid.value &&
  isEngineOilPriceValid.value &&
  isBrakeFluidPriceValid.value &&
  isOilFilterPriceValid.value &&
  Boolean(props.job.vehicleClass) &&
  props.job.services.length > 0 &&
  props.job.technicians.length > 0 &&
  Boolean(props.job.bayId)
)

const errorCount = computed(() => {
  const checks = [
    isPlateValid.value,
    isOwnerNameValid.value,
    isOwnerContactValid.value,
    isEngineOilPriceValid.value,
    isBrakeFluidPriceValid.value,
    isOilFilterPriceValid.value,
    Boolean(props.job.vehicleClass),
    props.job.services.length > 0,
    props.job.technicians.length > 0,
    Boolean(props.job.bayId)
  ]
  return checks.filter((valid) => !valid).length
})

function setTouched(field) {
  touched.value[field] = true
}

function normalisePlate() {
  props.job.plate = props.job.plate.toUpperCase()
}

function submitJob() {
  if (!isFormValid.value) {
    return
  }
  emit('submit-job')
}
</script>

<template>
  <form class="job-card-form" @submit.prevent="submitJob">
    <h2>Job Card Form</h2>

    <div class="field">
      <label for="plate">Plate Number</label>
      <input
        id="plate"
        type="text"
        v-model="job.plate"
        placeholder="UBK 123A"
        @blur="setTouched('plate')"
        @input="normalisePlate"
      />
      <p v-if="touched.plate && !isPlateValid" class="error">
        Format: 3 letters, space, 3 digits, 1 letter (example UBK 123A)
      </p>
    </div>

    <div class="field">
      <label for="ownerName">Owner Name</label>
      <input
        id="ownerName"
        type="text"
        v-model="job.ownerName"
        placeholder="Mukasa James"
        @blur="setTouched('ownerName')"
      />
      <p v-if="touched.ownerName && !isOwnerNameValid" class="error">
        Owner name must be letters and spaces only, at least 2 characters
      </p>
    </div>

    <div class="field">
      <label for="ownerContact">Owner Contact</label>
      <input
        id="ownerContact"
        type="text"
        v-model="job.ownerContact"
        placeholder="0772123456"
        @blur="setTouched('ownerContact')"
      />
      <p v-if="touched.ownerContact && !isOwnerContactValid" class="error">
        Contact must be exactly 10 digits
      </p>
    </div>

    <div class="field">
      <label for="engineOilPrice">Engine Oil Price</label>
      <input
        id="engineOilPrice"
        type="number"
        v-model.number="job.engineOilPrice"
        placeholder="79000 to 200000"
        @blur="setTouched('engineOilPrice')"
      />
      <p v-if="touched.engineOilPrice && !isEngineOilPriceValid" class="error">
        Engine oil price must be between 79,000 and 200,000
      </p>
    </div>

    <div class="field">
      <label for="brakeFluidPrice">Brake Fluid Price</label>
      <input
        id="brakeFluidPrice"
        type="number"
        v-model.number="job.brakeFluidPrice"
        placeholder="13000 to 20000"
        @blur="setTouched('brakeFluidPrice')"
      />
      <p v-if="touched.brakeFluidPrice && !isBrakeFluidPriceValid" class="error">
        Brake fluid price must be between 13,000 and 20,000
      </p>
    </div>

    <div class="field">
      <label for="oilFilterPrice">Oil Filter Price</label>
      <input
        id="oilFilterPrice"
        type="number"
        v-model.number="job.oilFilterPrice"
        placeholder="15000 to 20000"
        @blur="setTouched('oilFilterPrice')"
      />
      <p v-if="touched.oilFilterPrice && !isOilFilterPriceValid" class="error">
        Oil filter price must be between 15,000 and 20,000
      </p>
    </div>

    <div class="field">
      <label for="vehicleClass">Vehicle Class</label>
      <select id="vehicleClass" v-model="job.vehicleClass">
        <option value="" disabled>Select class</option>
        <option v-for="option in vehicleClasses" :key="option" :value="option">
          {{ option }}
        </option>
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

    <div class="field" v-if="isWheelAlignmentSelected">
      <label for="wheelAlignmentCharge">Wheel Alignment Charge</label>
      <input
        id="wheelAlignmentCharge"
        type="text"
        :value="WHEEL_ALIGNMENT_CHARGE.toLocaleString()"
        readonly
      />
    </div>

    <div class="field" v-if="isWheelBalancingSelected">
      <label for="wheelBalancingCharge">Wheel Balancing Charge</label>
      <input
        id="wheelBalancingCharge"
        type="text"
        :value="WHEEL_BALANCING_CHARGE.toLocaleString()"
        readonly
      />
    </div>

    <div class="field">
      <label>Technicians</label>
      <div v-for="technician in technicians" :key="technician" class="checkbox-row">
        <label>
          <input type="checkbox" :value="technician" v-model="job.technicians" />
          {{ technician }}
        </label>
      </div>
    </div>

    <div class="field">
      <label for="bay">Assign Bay (Free only)</label>
      <select id="bay" v-model="job.bayId">
        <option value="" disabled>Select free bay</option>
        <option v-for="bay in bays" :key="bay.id" :value="bay.id">
          {{ bay.id }}
        </option>
      </select>
    </div>

    <div class="field">
      <label for="labour">Labour Charge</label>
      <input id="labour" type="text" :value="LABOUR_CHARGE.toLocaleString()" readonly />
    </div>

    <p class="running-total">Running Total: UGX {{ runningTotal.toLocaleString() }}</p>
    <p class="error-count">{{ errorCount }} errors remaining</p>

    <button type="submit" :disabled="!isFormValid">Save Job Card</button>
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
input[type='number'],
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
}

input[readonly] {
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

.error-count {
  color: #c0392b;
  font-weight: 600;
}

button {
  background: #2f2544;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 14px;
  cursor: pointer;
}

button:hover {
  background: #201631;
}

button:disabled {
  background: #998fb0;
  cursor: not-allowed;
}
</style>
