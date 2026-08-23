import { reactive } from 'vue'

export const LABOUR_CHARGE = 20000

export const services = [
  { name: 'Oil Change', price: 0 },
  { name: 'General Inspection', price: 0 },
  { name: 'Wheel Alignment', price: 30000 },
  { name: 'Wheel Balancing', price: 20000 }
]

export const technicians = ['Aisha', 'Kato', 'Martha', 'Okello']

export const bays = reactive([
  { id: 'BAY-1', status: 'Free', currentPlate: '' },
  { id: 'BAY-2', status: 'Occupied', currentPlate: 'UAW 887J' },
  { id: 'BAY-3', status: 'Free', currentPlate: '' },
  { id: 'BAY-4', status: 'Occupied', currentPlate: 'UBM 040P' }
])

export const partsCatalogue = reactive([
  { name: 'Engine Oil (20W-50)', unitPrice: 120000, qtyInStock: 10 },
  { name: 'Oil Filter', unitPrice: 18000, qtyInStock: 8 },
  { name: 'Brake Fluid', unitPrice: 15000, qtyInStock: 5 },
  { name: 'Brake Pads (Front)', unitPrice: 45000, qtyInStock: 4 }
])

export const jobs = reactive([])

export function createEmptyJob() {
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
