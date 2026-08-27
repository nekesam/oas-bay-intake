# OAS Bay Records Management System

### Name: Martha Nekesa

Vue 3 records management app for Oyera Auto Service Bay Ltd. Built on the Week 1 job card
intake page and extended for the final assessment with routing, Pinia state, a mock API,
role based access, and a manager dashboard.

Stack: Vue 3 (`<script setup>`), Vue Router 4, Pinia 4, Vite.

## How to run

```
npm install
npm run dev
```

Open http://localhost:5173

Build:

```
npm run build
npm run preview
```

## Features

- Routing: `/intake`, `/bays`, `/parts`, `/reports`, `/job/:plate`, and a catch all 404 route.
- Navigation bar with active link highlighting, links filtered by role.
- Job card intake form with `v-model` binding, service and technician pickers, free bay
  selection, read only labour and service charges, and a live running total.
- Validation: plate regex, owner name, 10 digit contact, and price range checks for engine
  oil, brake fluid, and oil filter. Errors show after a field is touched. Submit is disabled
  until the form is valid and an error count is shown.
- Parts catalogue with `PartCard`, issue to job with stock decrement, and a `v-show` restock
  banner when a part reaches zero.
- Pinia stores: `usePartsStore`, `useJobStore`, `useUserStore` with actions and getters.
- Mock API (`src/api/mock.js`): `getParts` and `createJob` with network delay, loading
  spinner, and an error state with retry.
- Role based access: `beforeEach` guard, role switcher, nav links hidden per role.
- Manager dashboard at `/reports`: Total Revenue, Labour Collected, Cars Serviced Today,
  Low Stock Items, all from Pinia getters.

## Roles

Switch role with the dropdown in the top right.

- Technician: sees Intake and Bays. Blocked from `/parts` and `/reports` by the router
  guard, redirected to `/bays`.
- Manager: sees Intake, Bays, Parts, and Reports.

Screenshots:

- `.github/role-technician.png`
- `.github/role-manager.png`
- `.github/oas_bay_intake.jpeg`

## Documents

- `THEORY.md`: answers to the five theory questions.
- `BUGS.md`: debugging journal.
- `mydocs.md` (in the assessment folder): full end to end documentation.

## Testing the API error state

Set `localStorage.setItem('oasApiFail', '1')` in the browser console and reload to see the
loading spinner followed by the error message and retry button. Remove the key to restore
normal responses.
