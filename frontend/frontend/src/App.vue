<script setup lang="js">
import { Button } from '@/components/ui/button';

import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <!-- <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/patients">List of All Patients</RouterLink>
      <RouterLink to="/patient/:id">Patient</RouterLink>
    </nav> -->
    <RouterView />
  </div>
</template>
