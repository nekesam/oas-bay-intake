# OAS Bay Debugging Journal

Three bugs hit while extending the intake app into the full records system. Screenshots are
in `.github/`.

---

## Bug 1: Pinia import fails to resolve

### What broke
Right after adding the first store, `npm run build` and the dev server both failed to start.
The app would not compile at all.

Screenshot: `.github/bug1-pinia-unresolved.png`

```
error during build:
Build failed with 1 error:

Error: [vite]: Rolldown failed to resolve import "pinia" from "src/main.js".
This is most likely unintended because it can break your application at runtime.
```

### Where in my code
`src/main.js:2` had `import { createPinia } from 'pinia'` and `src/stores/user.js:1` had
`import { defineStore } from 'pinia'`, but `pinia` was never added to `package.json`.

### What I tried first
I changed the import to `import { createPinia } from 'vue'`, assuming Pinia shipped with
Vue 3. That produced a new error, `"createPinia" is not exported by "vue"`.

### The actual fix
```
npm install pinia
```
Pinia is a separate package. Once installed, `package.json` lists it under `dependencies`
and the import resolves.

### What I learned
A new import only works if its package is installed. Add the dependency before writing the
import, and check `package.json`.

---

## Bug 2: Stale import after splitting the data module

### What broke
`npm run build` failed after I renamed `src/data/workshopStore.js` to `src/data/workshop.js`
and moved the parts list into `usePartsStore`.

Screenshot: `.github/bug2-missing-export.png`

```
[MISSING_EXPORT] "partsCatalogue" is not exported by "src/data/workshop.js".
    ╭─[ src/views/PartsView.vue:17:31 ]
    │
 17 │ import { LOW_STOCK_THRESHOLD, partsCatalogue } from '../data/workshop'
    │                               ───────┬──────
    │                                      ╰──────── Missing export
```

### Where in my code
`src/views/PartsView.vue` still imported `partsCatalogue` from `../data/workshop`, but that
export no longer existed after the parts data moved into the store.

### What I tried first
I added a `partsCatalogue` export back to `workshop.js`. The build passed, but the inventory
page then showed a fixed copy of the data that never changed when stock was issued.

### The actual fix
Read the store instead of the old module:
```js
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
On `/parts` the loading spinner cleared and the table rendered its headers with no rows. The
network request returned four parts and there was no console error.

Screenshot: `.github/bug3-storerefs-empty.png`

```
(no console error)
mock getParts resolved with 4 items
partsStore.parts.length === 4
rendered rows: 0
```

### Where in my code
`src/views/PartsView.vue:8`:
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
