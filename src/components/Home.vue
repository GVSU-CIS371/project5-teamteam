<template>
    <!-- v-for loop to display a card for each item in the store  -->
    <v-row class="max-width-row ma-1">
        <!-- have to use the reference so vuetify will work properly -->
        <v-col lg="3" md="4" sm="5" v-for="item in prodsArray" :key="item.id">
            <!-- pass store item props that are needed -->
            <StoreItem :name="item.data.name" :description="item.data.description" :price="item.data.price"
                :rating="item.data.rating" :stock="item.data.stock" :image="item.data.image"
                :category="item.data.category" />
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import StoreItem from "./StoreItem.vue";
import { ref } from "vue";
// Importing product Pinia store we created. 
import { useProductStore } from "../stores/ProductStore";
// Assigning product store to our variable 
const productStore = useProductStore();
// 
// has to be reference so vuetify will work properly.
const prodsArray = ref(productStore.products);
console.log('products loaded are:', productStore.products);
</script>
