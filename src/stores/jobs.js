import { defineStore } from 'pinia'
import { createJob } from '../api/mock'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function isToday(job) {
  return typeof job.createdAt === 'string' && job.createdAt.slice(0, 10) === todayKey()
}

export const useJobStore = defineStore('jobs', {
  state: () => ({
    jobs: [],
    bays: [
      { id: 'BAY-1', status: 'Free', currentPlate: '' },
      { id: 'BAY-2', status: 'Occupied', currentPlate: 'UAW 887J' },
      { id: 'BAY-3', status: 'Free', currentPlate: '' },
      { id: 'BAY-4', status: 'Occupied', currentPlate: 'UBM 040P' }
    ],
    saving: false,
    error: ''
  }),
  getters: {
    freeBays: (state) => state.bays.filter((bay) => bay.status === 'Free'),
    activeJobs: (state) => state.jobs.filter((job) => job.status === 'Open'),
    revenueToday: (state) =>
      state.jobs.filter(isToday).reduce((sum, job) => sum + job.total, 0),
    totalRevenue: (state) => state.jobs.reduce((sum, job) => sum + job.total, 0),
    labourCollected: (state) => state.jobs.reduce((sum, job) => sum + job.labour, 0),
    carsServicedToday: (state) => state.jobs.filter(isToday).length,
    findByPlate: (state) => (plate) => state.jobs.find((job) => job.plate === plate)
  },
  actions: {
    async openJob(job) {
      this.saving = true
      this.error = ''
      try {
        const saved = await createJob({ ...job, status: 'Open' })
        this.jobs.push(saved)
        const bay = this.bays.find((item) => item.id === saved.bayId)
        if (bay) {
          bay.status = 'Occupied'
          bay.currentPlate = saved.plate
        }
        return saved
      } catch (error) {
        this.error = error.message
        return null
      } finally {
        this.saving = false
      }
    },
    closeJob(plate) {
      const job = this.jobs.find((item) => item.plate === plate)
      if (!job) {
        return
      }
      job.status = 'Closed'
      const bay = this.bays.find((item) => item.id === job.bayId)
      if (bay) {
        bay.status = 'Free'
        bay.currentPlate = ''
      }
    }
  }
})
