<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card :class="{ 'on-hover': isHovering }" :elevation="isHovering ? 16 : 1" style="cursor: pointer;"
            v-bind="props" class="pa-5" height="525">

            <v-card-title><b>{{ product.name }}</b></v-card-title>
            <v-card-text class="pa-3 pl-7">
                <v-row>
                    <v-rating v-model="product.rating" color="amber" readonly size="20" class="pr-8"></v-rating>
                    <v-icon color="green" icon="mdi-currency-usd" class="pt-1"></v-icon>
                    <div class="pt-1 pr-8">{{ product.price }}</div>
                    <v-icon color="blue" icon="mdi-pound" class="pt-1 pr-1"></v-icon>
                    <div class="pt-1">{{ product.stock }}</div>
                </v-row>
            </v-card-text>
            <v-img :src="product.image" alt="image of the item being displayed" height="228px" class="mt-10"></v-img>
            <v-card-text class="px-12 pt-10">{{ product.description }}</v-card-text>
            <v-btn class="mx-5" @click="deleteProduct()" >
              <v-icon>mdi-plus</v-icon>
              Add Product
            </v-btn>

        </v-card>
    </v-hover>
</template>

<script lang="ts" setup>

import { Product } from '../types/product';
const product = defineProps<Product>();
import {db} from "../firebase.ts";
import {
  deleteDoc,
  doc,
  collection,
  CollectionReference,
  QueryDocumentSnapshot,
  query,
  where,
  getDocs,
  QuerySnapshot
} from "firebase/firestore";

function deleteProduct() {
  const productName = product.name;
  console.log(productName);
  const myCol: CollectionReference = collection(db, "products");
  const qr = query(myCol, where("name", "==", productName));
  getDocs(qr).then((qs: QuerySnapshot) => {
    qs.forEach(async (qd: QueryDocumentSnapshot) => {
      const myDoc = doc(db, "products", qd.id);
      await (deleteDoc(myDoc));
    })
  });
  location.reload();
}
</script>
