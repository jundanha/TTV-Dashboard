<script setup>
import DataTable from '../components/DataTable.vue';
import { Button } from '@/components/ui/button';
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
import { ref } from 'vue';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);

const name = ref('');
const age = ref('');
const gender = ref('');
const contact = ref('');
const address = ref('');

async function savePatient() {
  console.log('Saving patient:', name.value, age.value, gender.value, contact.value, address.value);
  try {
    const response = await axios.post(`${API_BASE_URL}/patient/new`, {
      name: name.value,
      age: age.value,
      gender: gender.value,
      contact: contact.value,
      address: address.value,
    });
    console.log('Response:', response.data);
    name.value = '';
    age.value = '';
    gender.value = '';
    contact.value = '';
    address.value = '';
    location.reload();
  } catch (error) {
    console.error('Error saving patient:', error);
  }
}
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
            Click on a patient's name to view more details.
          </p>
        </div>
      </div>
       <div class="flex items-right justify-between space-y-2">
        <Dialog>
          <DialogTrigger 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add new patient
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new patient</DialogTitle>
              <DialogDescription>
                <label for="name">Name:</label>
                <Input id="name" type="text" v-model="name" />
                <label for="age">Age:</label>
                <Input id="age" type="number" v-model="age" />
                <label for="gender">Gender:</label>
                <select id="gender" v-model="gender" class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <!-- <Input id="gender" type="text" v-model="gender" /> -->
                <label for="contact">Contact:</label>
                <Input id="contact" type="text" v-model="contact"/>
                <label for="address">Address:</label>
                <Input id="address" type="text" v-model="address" />
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                @click="savePatient"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>  
      <DataTable />
    </div>
  </div>
</template>
