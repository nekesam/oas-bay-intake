# OAS Bay Debugging Journal

Three bugs hit while extending the intake app into the full records system. Screenshots are
in `.github/`.

---

## Bug 1: Pinia store used before Pinia was installed on the app

### What broke
After moving the role check into the router, every route rendered a blank page. Nothing in
the app mounted.

Screenshot: `.github/bug1-getactivepinia.png`

```
Uncaught Error: [🍍]: "getActivePinia()" was called but there was no active Pinia.
Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
    at index.js:10:19
```

### Where in my code
`src/router/index.js`. I called the store at module top level:

```js
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

router.beforeEach((to) => {
  const allowed = to.meta.roles
  if (allowed && !allowed.includes(userStore.role)) return '/bays'
})
```

`src/main.js` imports `./router` while evaluating the module graph, which runs before
`createApp(App).use(createPinia())`. So `useUserStore()` ran with no active Pinia.

### What I tried first
I moved `app.use(createPinia())` above `app.use(router)` in `src/main.js`. It made no
difference, because the store call still ran at import time, before any `app.use`.

### The actual fix
Call the store inside the guard, not at module scope:

```js
router.beforeEach((to) => {
  const userStore = useUserStore()
  const allowed = to.meta.roles
  if (allowed && !allowed.includes(userStore.role)) {
    return '/bays'
  }
})
```

The guard runs during navigation, after `main.js` has called `app.use(createPinia())`.

### What I learned
A `useStore()` call must run after `app.use(createPinia())`. Inside components and guards
that is automatic; at module top level it is not, so keep store calls inside functions.

---

## Bug 2: Stale import after splitting the data module

### What broke
The whole app went blank after I renamed `src/data/workshopStore.js` to
`src/data/workshop.js` and moved the parts list into `usePartsStore`.

Screenshot: `.github/bug2-missing-export.png`

```
Uncaught SyntaxError: The requested module '/src/data/workshop.js'
does not provide an export named 'partsCatalogue' (at PartsView.vue:5:31)
```

### Where in my code
`src/views/PartsView.vue` still had:

```js
import { LOW_STOCK_THRESHOLD, partsCatalogue } from '../data/workshop'
```

`partsCatalogue` no longer exists as an export; the parts data now lives in the store.
Because `src/router/index.js` imports every view eagerly, one broken view import blanks the
entire app, not just `/parts`.

### What I tried first
I added a `partsCatalogue` export back to `workshop.js`. The page loaded, but the inventory
table showed a fixed copy of the data that never changed when stock was issued.

### The actual fix
Read the store instead of the old module:

```js
import { storeToRefs } from 'pinia'
import { usePartsStore } from '../stores/parts'

const partsStore = usePartsStore()
const { parts } = storeToRefs(partsStore)
```

Now the page and the rest of the app share one source of truth.

### What I learned
When state moves into a store, every consumer has to move with it. Re-exporting the old name
only hides the split and creates a second, stale copy.

---

## Bug 3: Parts table empty after a successful fetch

### What broke
On `/parts` the loading spinner cleared and the table rendered its header row with no data
rows. The mock returned four parts and there was no console error.

Screenshot: `.github/bug3-storerefs-empty.png`

```
(no console error)
mock getParts resolved with 4 items
partsStore.parts.length === 4
rendered rows: 0
```

### Where in my code
`src/views/PartsView.vue:7`:

```js
const { parts, loading, error } = partsStore
```

`parts` was captured as the initial empty array at setup time. When `fetchParts` later
replaced `this.parts`, the template kept pointing at the old array.

### What I tried first
I added `.value` everywhere (`parts.value`), assuming it was a ref that needed unwrapping.
That threw `parts.value is undefined`, because the destructured value was a plain array.

### The actual fix
```js
import { storeToRefs } from 'pinia'

const partsStore = usePartsStore()
const { parts, loading, error } = storeToRefs(partsStore)
```

`storeToRefs` returns refs bound to the store, so replacing `this.parts` updates the view.
Actions are still called on `partsStore` directly.

### What I learned
Do not destructure a Pinia store for state or getters. Use `storeToRefs` for those and keep
the store object for actions.
