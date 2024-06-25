<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DataTTVTable from '@/components/DataTTVTable.vue';
import { Button } from '@/components/ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);

const route = useRoute();
const router = useRouter();
const patient = ref(null);

// const patientid = ref('');
const type = ref('');
const value = ref('');
const systolic = ref('');
const diastolic = ref('');
const detectionSite = ref('');

async function fetchData() {
  try {
    const paramID = route.params.id;
    console.log('paramID:', paramID);
    const response = await axios.get(`${API_BASE_URL}/patient/${paramID}`);
    patient.value = response.data.patient;
    // patientid = response.data.patient._id;
    console.log('Data fetched:', response.data)
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

onMounted(() => {
  fetchData();
});

const backToPatients = () => {
  router.push('/patients');
}

async function saveTTVRecord() {
  try {
    const paramID = route.params.id;
    const ttvRecord = {
      patient: paramID,
      type: type.value,
      value: type.value === 'Blood Pressure' ? {
        systolic: parseInt(systolic.value),
        diastolic: parseInt(diastolic.value) 
      } : parseInt(value.value) ,
      detectionSite: type.value === 'Pulse' ? detectionSite.value : null,
    };
    const response = await axios.post(`${API_BASE_URL}/ttv/new`, ttvRecord);
    console.log('Response:', response.data);
    type.value = '';
    value.value = '';
    systolic.value = '';
    diastolic.value = '';
    detectionSite.value = '';
    location.reload();
  } catch (error) {
    console.error('Error saving TTV record:', error);
  }
}

async function deletePatient() {
  const paramID = route.params.id;
  try {
    const response = await axios.delete(`${API_BASE_URL}/patient/delete/${paramID}`);
    console.log('Response:', response);
    backToPatients();
  } catch (error) {
    console.error('Error:', error);
  }
}
</script>


<template>
  <div id="app">
    <div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div class="flex items-center justify-between space-y-2">
        <div>
          <Button @click='backToPatients()' class="hover:bg-blue-700 text-white font-bold py-6 px-4 rounded">
            Back to Patients
          </Button>
          <p class="text-muted-foreground py-5">
            This is the detail page for a single patient.
            Here you can view all the details of a patient including their ttv's record.
          </p>
          <h2 class="text-2xl font-bold tracking-tight">
            {{ patient ? patient.name : 'Patient' }}
          </h2>
          <p>
            Age     : {{ patient ? patient.age : 'N/A' }} <br>
            Gender  : {{ patient ? patient.gender : 'N/A' }} <br>
            Contact : {{ patient ? patient.contact : 'N/A' }} <br>
            Address : {{ patient ? patient.address : 'N/A' }} <br>
          </p>
        </div>
      </div>
      <div class="flex items-right justify-between space-y-2">
        <Dialog>
          <DialogTrigger 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add TTV Record
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add ttv record</DialogTitle>
              <DialogDescription>
                <label for="type">Type:</label>
                <select id="type" v-model="type" class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="Body Temperature">Body Temperature</option>
                  <option value="Respiration Rate">Respiration Rate</option>
                  <option value="Blood Pressure">Blood Pressure</option>
                  <option value="Pulse">Pulse</option>
                </select>

                <div v-if="type !== 'Blood Pressure'">
                  <label for="value">Value:</label>
                  <Input id="value" type="text" v-model="value" />
                </div>

                <div v-if="type === 'Blood Pressure'">
                  <label for="systolic">Systolic:</label>
                  <Input id="systolic" type="text" v-model="systolic" />
                  <label for="diastolic">Diastolic:</label>
                  <Input id="diastolic" type="text" v-model="diastolic" />
                </div>

                <div v-if="type === 'Pulse'">
                  <label for="detectionSite">Detection Site:</label>
                  <select id="detectionSite" v-model="detectionSite" class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="Arteri radialis">Arteri radialis</option>
                    <option value="Arteri brakialis">Arteri brakialis</option>
                    <option value="Arteri karotis">Arteri karotis</option>
                    <option value="Arteri poplitea">Arteri poplitea</option>
                    <option value="Arteri dorsalis pedis">Arteri dorsalis pedis</option>
                  </select>
                </div>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                @click="saveTTVRecord"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <DataTTVTable />
      <!-- <div class="fixed bottom-4 right-4">
        <Button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete Patient
        </Button>
      </div> -->

      <div class="fixed bottom-4 right-4">
        <AlertDialog>
          <AlertDialogTrigger
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >Delete Patient</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this patient and remove all their data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                @click="deletePatient"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </div>
</template>