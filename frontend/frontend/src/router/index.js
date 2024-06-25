import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import DetailPatient from "@/views/DetailPatient.vue";
import PatientList from "@/views/PatientList.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/patient/:id',
    name: 'DetailPatient',
    component: DetailPatient
  },
  {
    path: '/patients',
    name: 'PatientList',
    component: PatientList
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
