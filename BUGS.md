# OAS Bay Debugging Journal

Three bugs encountered while extending the intake app into the full records system.

Screenshots referenced below are stored in `.github/`. Each entry also quotes the exact console or terminal text.

---

## Bug 1: Store used before Pinia was installed

### What broke
The app showed a blank page immediately after adding the first store. Every route rendered nothing and the console threw on load.

Screenshot: `.github/bug1-getactivepinia.png`

```
Uncaught Error: [🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
    at useStore (pinia.js)
    at useUserStore (user.js:5)
    at src/router/index.js
```

### Where in my code
`src/router/index.js`. The guard file imported the store and called `useUserStore()` at module top level:

```js
import { useUserStore } from '../stores/user'
const userStore = useUserStore()

router.beforeEach((to) => {
  const allowed = to.meta.roles
  if (allowed && !allowed.includes(userStore.role)) return '/bays'
})
```

`src/router/index.js` is imported by `src/main.js` while evaluating the import graph, which runs before `createApp(App).use(createPinia())`.

### What I tried first
I moved `import router from './router'` above `import App from './App.vue'` in `src/main.js`, thinking it was an import ordering problem. It made no difference, because the store call still ran at import time, before any `app.use`.

### The actual fix
Call the store inside the guard callback instead of at module scope:

```js
router.beforeEach((to) => {
  const userStore = useUserStore()
  const allowed = to.meta.roles
  if (allowed && !allowed.includes(userStore.role)) {
    return '/bays'
  }
})
```

The guard runs during navigation, which happens after `main.js` has called `app.use(createPinia())`, so an active Pinia exists.

### What I learned
A `useStore()` call must run after `app.use(createPinia())`. Inside components and route guards that is automatic. At module top level it is not, so keep store calls inside functions.

---

## Bug 2: Parts table stayed empty after a successful fetch

### What broke
The loading spinner appeared and then disappeared, the network tab showed the parts data returning, but the inventory table rendered zero rows. No error in the console.

Screenshot: `.github/bug2-empty-parts-table.png`

```
(no console error)
GET mock getParts resolved with 4 items
partsStore.parts.length === 4 in Vue devtools
rendered rows: 0
```

### Where in my code
`src/views/PartsView.vue`. The store was destructured directly:

```js
const { parts, loading, error } = usePartsStore()

onMounted(() => partsStore.fetchParts())
```

`parts` was captured as a plain array snapshot at setup time. When `fetchParts` later replaced `this.parts`, the template kept pointing at the old empty array.

### What I tried first
I added `.value` in the template and script (`parts.value`) assuming it was a ref unwrapping issue. That threw `parts.value is undefined` because the destructured value was a plain array, not a ref.

### The actual fix
Use `storeToRefs` for state and getters, and keep the store instance for actions:

```js
import { storeToRefs } from 'pinia'

const partsStore = usePartsStore()
const { parts, loading, error } = storeToRefs(partsStore)

onMounted(() => {
  if (partsStore.parts.length === 0) {
    partsStore.fetchParts()
  }
})
```

`storeToRefs` returns reactive refs bound to the store, so replacing `this.parts` updates the view.

### What I learned
Destructuring a Pinia store breaks reactivity for state and getters. Wrap them in `storeToRefs`, and call actions on the store object directly.

---

## Bug 3: v-else on a v-for element broke the parts list

### What broke
After adding loading and error branches to the parts catalogue, the dev server showed a
compile error overlay and the page would not render.

Screenshot: `.github/bug3-velse-vfor-compile-error.png`

```
[plugin:vite:vue] v-else/v-else-if has no adjacent v-if or v-else-if.
/src/views/IntakeView.vue
  <PartCard v-for="part in parts" v-else :key="part.id" ... />
```

### Where in my code
`src/views/IntakeView.vue`, parts catalogue block. The first version put `v-for` and
`v-else` on the same `PartCard`:

```html
<div v-if="loading" class="spinner"></div>
<p v-else-if="partsError" class="notice error">{{ partsError }}</p>
<PartCard
  v-for="part in parts"
  v-else
  :key="part.id"
  ...
/>
```

Vue processes `v-for` before `v-if` on the same node, so the `v-else` had no `v-if` to pair
with.

### What I tried first
I reordered the attributes to put `v-else` before `v-for`. The compiler gave the same error,
because the priority is fixed regardless of attribute order.

### The actual fix
Wrap the list in a `<template>` that carries the `v-else`:

```html
<template v-else>
  <PartCard v-for="part in parts" :key="part.id" ... />
</template>
```

The `template` element holds the conditional, and `v-for` runs on the child.

### What I learned
Do not put `v-if` family directives and `v-for` on the same element. Move the condition to a
wrapper `template`.
