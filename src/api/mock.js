const NETWORK_DELAY = 700

const PARTS_SEED = [
  { id: 'P-ENGINE-OIL', name: 'Engine Oil (20W-50)', unitPrice: 120000, qtyInStock: 10 },
  { id: 'P-OIL-FILTER', name: 'Oil Filter', unitPrice: 18000, qtyInStock: 8 },
  { id: 'P-BRAKE-FLUID', name: 'Brake Fluid', unitPrice: 15000, qtyInStock: 5 },
  { id: 'P-BRAKE-PADS', name: 'Brake Pads (Front)', unitPrice: 45000, qtyInStock: 4 }
]

function shouldFail() {
  try {
    return localStorage.getItem('oasApiFail') === '1'
  } catch (error) {
    return false
  }
}

export function getParts() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new Error('Network error while loading parts'))
        return
      }
      resolve(PARTS_SEED.map((part) => ({ ...part })))
    }, NETWORK_DELAY)
  })
}

export function createJob(job) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new Error('Network error while saving job card'))
        return
      }
      resolve({
        ...job,
        id: `JOB-${Date.now()}`,
        createdAt: new Date().toISOString()
      })
    }, NETWORK_DELAY)
  })
}
