<script setup>
import { ref, computed, onMounted } from 'vue';
import columns from './columns';
import axios from 'axios';
import dummypatients from '../data/PatientData.js';
import { Button } from '@/components/ui/button';
import { useRouter } from 'vue-router';
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);

const router = useRouter();

const genderFilter = ref('');
const ageFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const patients = ref([]);

async function fetchData() {
  try {
    const response = await axios.get(`${API_BASE_URL}/patient/getall`);
    console.log('Data fetched:', response.data)
    patients.value = response.data.length ? response.data : dummyPatients;
  } catch (error) {
    console.error('Error fetching data:', error);
    patients.value = dummyPatients;
  }
}

onMounted(() => {
  fetchData();
});

const filteredData = computed(() => {
  let data = Array.isArray(patients.value) ? patients.value : [];
  // let data = patients;
  if (genderFilter.value) {
    data = data.filter(patient => patient.gender === genderFilter.value);
  }
  if (ageFilter.value) {
    data = data.filter(patient => patient.age == ageFilter.value);
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

const toDetailPage = (id) => {
  router.push(`/patient/${id}`);
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label>Filter by Gender:</label>
      <select v-model="genderFilter" @change="applyFilters">
        <option value="">All</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <!-- <label>Filter by Gender:</label>
      <Select v-model="genderFilter" @value-change="applyFilters">
        <SelectTrigger  class="w-[280px]">
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Gender</SelectLabel>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select> -->

      <!-- <div class="w-[280px]"> -->
        <label>Filter by Age:</label>
        <input type="number" v-model="ageFilter" @input="applyFilters" placeholder="Enter age" />
        <!-- <NumberField id="age" v-model="ageFilter" :min="0" @input="applyFilters">
          <Label for="age">Age</Label>
          <NumberFieldContent class="w-280">
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div> -->
    </div>

    <div class="rounded-md border">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.accessor">
              {{ column.Header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td v-for="column in columns" :key="column.accessor">
              <span v-if="column.accessor === 'name'">
                <!-- <button @click="toDetailPage(row._id)"> -->
                  <p
                    as="a"
                    class="hover:underline cursor-pointer"
                    @click="toDetailPage(row._id)"
                  >{{ row[column.accessor] }}</p>
                <!-- </button> -->
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
