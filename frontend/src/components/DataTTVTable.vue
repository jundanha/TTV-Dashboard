<script setup>
import { ref, computed, onMounted } from 'vue';
import ttvcolumns from './ttvcolumns';
import axios from 'axios';
// import dummyTTVData from '../data/ttvData.js';
import { Button } from '@/components/ui/button';
import { useRoute } from 'vue-router';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);

const route = useRoute();

const typeFilter = ref('');
const siteFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const ttvs = ref([]);

async function fetchData() {
  try {
    const paramID = route.params.id;
    console.log('paramID:', paramID);
    const response = await axios.get(`${API_BASE_URL}/patient/${paramID}`);
    console.log('Response:', response.data.ttvs);
    // ttvs.value = response.data.ttvs.length ? response.data.ttvs : dummyTTVData;
    ttvs.value = response.data.ttvs.length ? response.data.ttvs : [];
    console.log('ttvs:', ttvs.value);
  } catch (error) {
    console.error('Error fetching data:', error);
    // ttvs.value = dummyTTVData;
    ttvs.value = [];
  }
}

onMounted(() => {
  fetchData();
});

const filteredData = computed(() => {
  let data = Array.isArray(ttvs.value) ? ttvs.value : [];
  if (typeFilter.value) {
    data = data.filter(ttv => ttv.type === typeFilter.value);
  }
  if (siteFilter.value) {
    data = data.filter(ttv => ttv.detectionSite === siteFilter.value);
  }
  return data;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

function applyFilters() {
  currentPage.value = 1;
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

async function deleteTTVRecord(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/ttv/delete/${id}`);
    console.log("Response: ", response);
    location.reload();
  } catch (error) {
    console.error("error: ", error);
  }
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label>Filter by Type:</label>
      <select v-model="typeFilter" @change="applyFilters">
        <option value="">All</option>
        <option value="Blood Pressure">Blood Pressure</option>
        <option value="Pulse">Pulse</option>
        <option value="Body Temperature">Body Temperature</option>
        <option value="Respiration Rate">Respiration Rate</option>
      </select>
      
    </div>

    <div class="rounded-md border">
      <table>
        <thead>
          <tr>
            <th v-for="column in ttvcolumns" :key="column.accessor">
              {{ column.Header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id"> 
            <td v-for="column in ttvcolumns" :key="column.accessor">
              <span v-if="column.accessor === 'value'" >
                <span v-if="row.unit === 'mmHg'">
                  {{ row[column.accessor].systolic }}/{{ row[column.accessor].diastolic }} {{ row.unit }}
                </span>
                <span v-else>
                  {{ row[column.accessor] }} {{ row.unit }}
                </span>
              </span>
              <span v-else-if ="column.accessor === 'timestamp'">
                {{ new Date(row[column.accessor]).toLocaleString() }}
              </span>
              <span v-else-if ="column.accessor === '_id'">
                <div class="flex justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger
                      class="m-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >Delete</AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this ttv record of the patient.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          @click="deleteTTVRecord(row[column.accessor])"
                          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </span>
              <span v-else>
                {{ column.Cell ? column.Cell({ value: row[column.accessor] }) : row[column.accessor] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <Button @click="previousPage" :disabled="currentPage === 1">Previous</Button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <Button @click="nextPage" :disabled="currentPage === totalPages">Next</Button>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border: 1px solid #ccc;
}

th {
  background-color: #f4f4f4;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
