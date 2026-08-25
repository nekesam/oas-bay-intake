<script setup>
import { storeToRefs } from 'pinia'
import { useJobStore } from '../stores/jobs'

const jobStore = useJobStore()
const { bays } = storeToRefs(jobStore)
</script>

<template>
  <section>
    <h1>Bay Status</h1>

    <div class="bay-list">
      <article
        v-for="bay in bays"
        :key="bay.id"
        class="bay-card"
        :class="bay.status.toLowerCase()"
      >
        <h2>{{ bay.id }}</h2>
        <p>Status: {{ bay.status }}</p>
        <p v-if="bay.currentPlate">Current Plate: {{ bay.currentPlate }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin-bottom: 16px;
}

.bay-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
}

.bay-card {
  border: 1px solid #d6d2dd;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}

.bay-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.bay-card p {
  margin: 4px 0;
}

.free {
  border-color: #3a9152;
}

.occupied {
  border-color: #b84747;
}
</style>
