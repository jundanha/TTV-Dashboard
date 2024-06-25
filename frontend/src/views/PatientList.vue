<script setup>
import DataTable from '../components/DataTable.vue';
</script>

<template>
  <div id="app">
    <div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div class="flex items-center justify-between space-y-2">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">
            Patients
          </h2>
          <p class="text-muted-foreground">
            Here&apos;s a list of all patients in the system. <br>
            Click on a patient to view more details.
          </p>
        </div>
      </div>
      <DataTable />
    </div>
  </div>
</template>
