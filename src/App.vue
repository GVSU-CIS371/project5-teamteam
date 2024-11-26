<template>
    <v-app>
      <v-app-bar class="bg-blue-darken-4">
        <v-toolbar-title>My Online Store</v-toolbar-title>
        <v-btn class="mx-5" v-for="link in links" :key="link.text" :to="link.to">
          <v-icon>{{ link.icon }}</v-icon>
          {{ link.text }}
        </v-btn>
      </v-app-bar>
      <v-main class="bg-blue-lighten-5">
        <router-view v-slot="{ Component }">
          <transition name="shrink-explode">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-main>
  
      <v-footer color="primary" app>
        © 2023 My Online Store. All rights reserved.
      </v-footer>
    </v-app>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
  // Importing product Pinia store we created. 
  import { useProductStore } from "./stores/ProductStore";
  // Assigning product store to our variable 
  const productStore = useProductStore();
  // Calling the function to populating the store with items.
  productStore.init()
  // has to be reference so vuetify will work properly.
  const links = ref([
    { text: "Home", to: "/", icon: "mdi-home" },
    { text: "Electronics", to: "/electronics", icon: "mdi-laptop" },
    { text: "Clothing", to: "/clothing", icon: "mdi-tshirt-crew" },
    { text: "Groceries", to: "/groceries", icon: "mdi-cart" },
    { text: "Best Seller", to: "/bestseller", icon: "mdi-cash-register" },
  ]);
  </script>
  