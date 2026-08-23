<template>
  <header class="top-nav">
    <h1>OAS Bay Intake</h1>
    <nav>
      <RouterLink to="/intake">Intake</RouterLink>
      <RouterLink to="/bays">Bays</RouterLink>
      <RouterLink to="/parts">Parts</RouterLink>
      <RouterLink to="/reports">Reports</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.top-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

nav a {
  text-decoration: none;
  color: #2f2544;
  border: 1px solid #cfc6df;
  border-radius: 6px;
  padding: 6px 10px;
  background: #fff;
}

nav a.router-link-active {
  background: #2f2544;
  color: #fff;
  border-color: #2f2544;
}
</style>
