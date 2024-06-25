<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const patient = ref(null);
const ttvs = ref([]);

async function fetchData() {
  try {
    const paramID = route.params.id;
    console.log('paramID:', paramID);
    const response = await axios.get(`http://localhost:3000/patient/${paramID}`);
    patient.value = response.data.patient;
    ttvs.value = response.data.ttvs;
    console.log('Data fetched:', response.data)
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

onMounted(() => {
  fetchData();
});

</script>


<template>
  <div id="app">
    <div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div class="flex items-center justify-between space-y-2">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">
            {{ patient ? patient.name : 'Patient' }}
          </h2>
          <p class="text-muted-foreground">
            This is the detail page for a single patient. <br>
            Here you can view all the details of a patient including their ttv's record.
          </p>
        </div>
      </div>
      <DataTable />
    </div>
  </div>
</template>