<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card :class="{ 'on-hover': isHovering }" :elevation="isHovering ? 16 : 1" style="cursor: pointer;"
            v-bind="props" class="pa-5" height="600">

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

            <!-- delete button -->
            <v-card-actions class="justify-end pt-5">
                <v-btn color="red" @click="deleteProduct()">
                    <v-icon class="mr-2">mdi-delete</v-icon>
                    Delete
                </v-btn>
              <v-btn class="mx-5" @click="modifyProductDialog = true" >
                <v-icon>mdi-plus</v-icon>
                Modify
              </v-btn>
            </v-card-actions>

        </v-card>
    </v-hover>

  <!--Start of additions for dialog used to modify products-->
      <v-dialog v-model="modifyProductDialog" max-width="600">
        <v-card>
          <v-card-title>Add New Product</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                label="Product Name"
                v-model="modifiedProduct.name"
                required
                disabled
              ></v-text-field>
              <v-text-field
                label="Image URL"
                v-model="modifiedProduct.imgURL"
                required
              ></v-text-field>
              <v-text-field
                label="Description"
                v-model="modifiedProduct.description"
                required
              ></v-text-field>
              <v-text-field
                label="Category"
                v-model="modifiedProduct.category"
                required
              ></v-text-field>
              <v-slider
                v-model="modifiedProduct.rating"
                label="Rating"
                min="1"
                max="5"
                step="1"
                thumb-label="always"
              ></v-slider>
              <v-text-field
                label="Price"
                v-model="modifiedProduct.price"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                label="Stock"
                v-model="modifiedProduct.stock"
                type="number"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text="Close" @click="modifyProductDialog = false">Close</v-btn>
            <v-btn color="primary" text="Add" @click="modifyProduct()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--End of additions for dialog used to modify products-->
</template>

<script lang="ts" setup>
import { useProductStore } from "../stores/ProductStore.ts";
import {ref} from "vue";
import { Product } from '../types/product';
const product = defineProps<Product>();
// Assigning product store to our variable 
const productStore = useProductStore();


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
  QuerySnapshot,
  updateDoc
} from "firebase/firestore";

function deleteProduct() {


  const confirmation = window.confirm(
    `Are you sure you want to delete the product: ${product.name}?`
  );
  if (!confirmation) {
    console.log("Deletion canceled by the user.");
    return;
  }
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
  const indexItemAppears = productStore.products.findIndex( (prod) => {
    return product.name == prod.data.name});
  console.log(productStore.products, 'index for product', indexItemAppears);
//   we want to remove the element from our array, so we will splice it.
    productStore.products.splice(indexItemAppears, 1);

}
//code for modify
const modifyProductDialog = ref(false);
const modifiedProduct = ref({
  name: product.name,
  imgURL: product.image,
  description: product.description,
  category: product.category,
  rating: product.rating,
  price: product.price,
  stock: product.stock,
});

function modifyProduct(){
    const confirmation = window.confirm(
    `Are you sure you want to Modify the product: ${product.name}?`
  );
  if (!confirmation) {
    console.log("Deletion canceled by the user.");
    return;
  }
  const productName = modifiedProduct.value.name;
  console.log(productName);
  const myCol: CollectionReference = collection(db, "products");
  const qr = query(myCol, where("name", "==", productName));
  getDocs(qr).then((qs: QuerySnapshot) => {
    qs.forEach(async (qd: QueryDocumentSnapshot) => {
      const myDoc = doc(db, "products", qd.id);
      await updateDoc(myDoc, {
        name: modifiedProduct.value.name,
        description: modifiedProduct.value.description,
        price: modifiedProduct.value.price,
        rating: modifiedProduct.value.rating,
        stock: modifiedProduct.value.stock,
        image: modifiedProduct.value.imgURL,
        category: modifiedProduct.value.category,
      });
    })
  });
  modifyProductDialog.value = false;
}
</script>
