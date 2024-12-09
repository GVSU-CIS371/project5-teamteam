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
type productWithID = Product & {
    id: string
}

const product = defineProps<productWithID>();

// Assigning product store to our variable 
const productStore = useProductStore();
console.log('this items id:', product.id, 'this items name:', product.name);


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
console.log(product.name);
  console.log('Products array before deletion:', productStore.products);

  const confirmation = window.confirm(
    `Are you sure you want to delete the product: ${product.name}?`
  );
  if (!confirmation) {
    console.log("Deletion canceled by the user.");
    return;
  }
  const productName = product.name;

//   have to update the delete funciton to delete the document that matches the doc id that we have.
  const docToDelete = doc(db, `products/${product.id}`);
  deleteDoc(docToDelete).then(() => {
    // if item was successfully deleted then we remove it from our array we're referencing.
    const indexItemAppears = productStore.products.findIndex( (prod) => {
    return product.id == prod.id});
  console.log(productStore.products, 'index for product', indexItemAppears);
//   we want to remove the element from our array, so we will splice it.
    productStore.products.splice(indexItemAppears, 1);
    console.log('Products array after deletion:', productStore.products);
  })
  .catch((err: any) => {
    console.log('Failed to delete item with id:', product.id, 'Error:', err);
  })
}

//code for modify
const modifyProductDialog = ref(false);
const modifiedProduct = ref({
  name: product.name,
  oldName: product.name,
  imgURL: product.image,
  description: product.description,
  category: product.category,
  rating: product.rating,
  price: product.price,
  stock: product.stock,
  id: product.id
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
  console.log('modifed product new name:', productName);
  const myCol: CollectionReference = collection(db, "products");
  const qr = query(myCol, where("name", "==", modifiedProduct.value.oldName));
  let itemId = product.id;
  modifyProductDialog.value = false;
  const docRefToBeUpdated = doc(db, `products/${itemId}`);
  updateDoc(docRefToBeUpdated, {
        name: productName,
        description: modifiedProduct.value.description,
        price: parseInt(modifiedProduct.value.price, 10),
        rating: parseInt(modifiedProduct.value.rating, 10),
        stock: parseInt(modifiedProduct.value.stock, 10),
        image: modifiedProduct.value.imgURL,
        category: modifiedProduct.value.category,
      }).then(() => {
    //   we want the UI to update when we modify an item. Let's get the index of the array we need to modify the UI for. 
    const indexItemAppears = productStore.products.findIndex( (prod) => {
    return modifiedProduct.value.id == prod.id});
    // we can use splice to replace this element with itself but with the modified data version. 
    productStore.products.splice(indexItemAppears, 1, {id: itemId, data: {
        name: productName,
        description: modifiedProduct.value.description,
        price: parseInt(modifiedProduct.value.price, 10),
        rating: parseInt(modifiedProduct.value.rating, 10),
        stock: parseInt(modifiedProduct.value.stock, 10),
        image: modifiedProduct.value.imgURL,
        category: modifiedProduct.value.category,
      }})
      console.log('modifed product at end of funciton name:', productName);

      })

}
    
</script>
