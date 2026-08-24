# OAS Bay Theory Answers

## Question 1

### a) Why the template does not update in the broken counter
Files used: [src/views/IntakeView.vue](src/views/IntakeView.vue), [src/components/JobCardForm.vue](src/components/JobCardForm.vue)

Relevant variables and APIs from my project: job, touched, isFormValid, runningTotal, ref, reactive, computed

In Vue, plain variables are not reactive. In the broken example, count is just a normal let value, so Vue does not track changes. In my project, values update only because they are reactive, for example job is created with reactive in [src/views/IntakeView.vue](src/views/IntakeView.vue), and touched is created with ref in [src/components/JobCardForm.vue](src/components/JobCardForm.vue).

### b) Correct rewrite using Vue 3 Composition API
Files used: [src/components/JobCardForm.vue](src/components/JobCardForm.vue)

Relevant APIs from my project: ref

~~~vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">Clicked {{ count }} times</button>
</template>
~~~

This matches how I already use ref for touched state in my form component.

### c) Difference between ref and reactive with OAS Bay examples
Files used: [src/components/JobCardForm.vue](src/components/JobCardForm.vue), [src/views/IntakeView.vue](src/views/IntakeView.vue), [src/data/workshopStore.js](src/data/workshopStore.js)

Relevant variables: touched, job, bays, partsCatalogue, jobs

ref is better for a single value or one grouped object where I assign through .value. In my code, touched is a ref object in [src/components/JobCardForm.vue](src/components/JobCardForm.vue).

reactive is better for object or array state I mutate directly. In my code, job is reactive in [src/views/IntakeView.vue](src/views/IntakeView.vue), and bays, partsCatalogue, jobs are reactive arrays in [src/data/workshopStore.js](src/data/workshopStore.js).

## Question 2

### a) Props flow from App to PartCard with emit back up
Files used: [src/App.vue](src/App.vue), [src/views/IntakeView.vue](src/views/IntakeView.vue), [src/components/PartCard.vue](src/components/PartCard.vue), [src/data/workshopStore.js](src/data/workshopStore.js)

Relevant variables and functions: partsCatalogue, issuePart, defineProps, defineEmits, issue

~~~mermaid
flowchart TD
  A[App.vue RouterView] --> B[IntakeView.vue]
  D[workshopStore partsCatalogue] --> B
  B -- name, unitPrice, qtyInStock props --> C[PartCard.vue]
  C -- emit issue --> B
  B -- issuePart part --> D
  D -- qtyInStock updates reactively --> C
~~~

This is exactly how my current parts issuing works.

### b) Diagram of Pinia-style flow instead
Files used: [src/main.js](src/main.js), [src/views/IntakeView.vue](src/views/IntakeView.vue)

Relevant evidence from my code: project currently has no Pinia registration and no stores folder

~~~mermaid
flowchart TD
  S[Pinia store usePartsStore] --> B[IntakeView.vue]
  S --> C[PartCard.vue]
  C -- call store action issuePart id --> S
  S -- state updates --> B
  S -- state updates --> C
~~~

My current code does not implement this yet. Right now I use shared reactive state in [src/data/workshopStore.js](src/data/workshopStore.js), not Pinia.

### c) When props are still useful even if Pinia exists
Files used: [src/views/IntakeView.vue](src/views/IntakeView.vue), [src/components/PartCard.vue](src/components/PartCard.vue), [src/components/ConfirmationCard.vue](src/components/ConfirmationCard.vue)

Relevant props from my code: name, unitPrice, qtyInStock, job, labour, servicesTotal, partsTotal, total

Even with Pinia, I would still use props for local parent-child data contracts. My own example is PartCard, where IntakeView passes name, unitPrice, qtyInStock to one card instance. Another example is ConfirmationCard where IntakeView passes totals and current job summary. These are clear UI inputs from the immediate parent.

## Question 3

### a) Computed property for engine oil validation
Files used: [src/components/JobCardForm.vue](src/components/JobCardForm.vue)

Relevant variable names: job.engineOilPrice, isEngineOilPriceValid

~~~js
const isEngineOilPriceValid = computed(() => {
  const value = Number(props.job.engineOilPrice)
  return value >= 79000 && value <= 200000
})
~~~

This is already implemented in my form.

### b) Where it is used and how submission is prevented
Files used: [src/components/JobCardForm.vue](src/components/JobCardForm.vue)

Relevant computed and functions: isEngineOilPriceValid, isFormValid, submitJob

isEngineOilPriceValid is included inside isFormValid. The submit button is disabled with :disabled bound to the inverse of isFormValid. Also submitJob returns early if isFormValid is false, so the emit does not run.

### c) Should backend also validate
Files used: [src/components/JobCardForm.vue](src/components/JobCardForm.vue), [src/views/IntakeView.vue](src/views/IntakeView.vue)

Relevant functions: submitJob, saveJob

Yes. Frontend validation improves user experience, but it is not a security boundary. A user can still bypass browser checks and send bad data directly. So backend should enforce the same range rule before accepting a saved job.

## Question 4

### a) RouterLink v-if by role vs beforeEach guard
Files used: [src/App.vue](src/App.vue), [src/router/index.js](src/router/index.js)

Relevant route and UI pieces: RouterLink navigation, router routes

A RouterLink hidden with v-if is mainly UX. It just removes the visible link.

A beforeEach guard is route protection. It runs during navigation and can block or redirect.

In my current code, nav links are always shown in [src/App.vue](src/App.vue), and there is no beforeEach guard in [src/router/index.js](src/router/index.js).

### b) beforeEach guard to block Technician from /parts and /reports
Files used: [src/router/index.js](src/router/index.js)

Relevant routes in my project: /parts, /reports, /bays

My current project does not have role state yet, so this is the simplest guard shape I would add in router using localStorage role:

~~~js
router.beforeEach((to) => {
  const role = localStorage.getItem('role') || 'technician'
  const blockedForTechnician = ['/parts', '/reports']

  if (role === 'technician' && blockedForTechnician.includes(to.path)) {
    return '/bays'
  }
})
~~~

### c) Why hidden nav link alone is not enough
Files used: [src/App.vue](src/App.vue), [src/router/index.js](src/router/index.js)

Relevant behavior: direct URL navigation to routes in router table

If a student hides only the link, a technician can still type /reports in the address bar or paste it directly. Since my current router has no guard, that route still resolves.

## Question 5

### a) What onMounted does and why top-level fetch is different
Files used: [src/main.js](src/main.js), [src/views/PartsView.vue](src/views/PartsView.vue)

Relevant evidence from my project: current code has no onMounted and no fetch yet

onMounted runs after the component is mounted into the DOM. It is a good place for data fetching that drives rendered UI.

A top-level fetch inside script setup can still run, but it does not mean DOM is already mounted when the request starts. So if logic depends on mounted UI state, onMounted is the safer lifecycle hook.

### b) What happens with const data = fetch('/api/parts') without await
Files used: [src/views/PartsView.vue](src/views/PartsView.vue)

Relevant evidence from my project: no async fetch currently in this file

data holds a Promise, not the final JSON payload. fetch is asynchronous, so without await or then, you only get the pending Promise object.

### c) Loading, success, error request states and how handled in OAS Bay
Files used: [src/views/PartsView.vue](src/views/PartsView.vue), [src/data/workshopStore.js](src/data/workshopStore.js)

Relevant variables: partsCatalogue

In my current code, parts view is in success-style display only because it reads partsCatalogue directly and renders the table. I have not yet implemented explicit loading and error states for network requests.

If I extend my current parts view, I would add:
- loading: show spinner while request is in progress
- success: render table from parts data
- error: show message instead of crashing the page

Right now, only the success-style render exists in [src/views/PartsView.vue](src/views/PartsView.vue).
