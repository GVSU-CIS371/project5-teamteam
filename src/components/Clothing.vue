<template>
    <!-- your answer -->
    <!-- v-for loop to display a card for each item in the store  -->
    <v-row class="max-width-row ma-1">
        <!-- have to use the reference so vuetify will work properly -->
        <v-col lg="3" md="4" sm="5" v-for="item in prodsArray" :key="item.id">
            <!-- pass store item props that are needed -->
            <StoreItem :name="item.data.name" :description="item.data.description" :price="item.data.price"
                :rating="item.data.rating" :stock="item.data.stock" :image="item.data.image"
                :category="item.data.category" :id="item.id" />
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useProductStore } from '../stores/ProductStore';
// import the store item cards.
import StoreItem from "./StoreItem.vue";
// initialize our store
const productStore = useProductStore();
// filter so we only get the clothing items.
productStore.filterByCategory("Clothing");
// get a reference to this data so that our loop can function properly.
const prodsArray = ref(productStore.products);

</script>
