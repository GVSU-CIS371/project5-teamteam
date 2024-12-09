<template>
    <v-app>
      <v-app-bar class="bg-blue-darken-4">
        <v-toolbar-title>My Online Store</v-toolbar-title>
        <v-btn class="mx-5" v-for="link in links" :key="link.text" :to="link.to">
          <v-icon>{{ link.icon }}</v-icon>
          {{ link.text }}
        </v-btn>

      <!--button added for dialog-->
        <v-btn class="mx-5" @click="addProductDialog = true" >
          <v-icon>mdi-plus</v-icon>
          Add Product
        </v-btn>
      <!--button added for dialog-->

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

      <!--Start of additions for dialog used to add products-->
      <v-dialog v-model="addProductDialog" max-width="600">
        <v-card>
          <v-card-title>Add New Product</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                label="Product Name"
                v-model="newProduct.name"
                required
              ></v-text-field>
              <v-text-field
                label="Image URL"
                v-model="newProduct.imgURL"
                required
              ></v-text-field>
              <v-text-field
                label="Description"
                v-model="newProduct.description"
                required
              ></v-text-field>
              <v-text-field
                label="Category"
                v-model="newProduct.category"
                required
              ></v-text-field>
              <v-slider
                v-model="newProduct.rating"
                label="Rating"
                min="1"
                max="5"
                step="1"
                thumb-label="always"
              ></v-slider>
              <v-text-field
                label="Price"
                v-model="newProduct.price"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                label="Stock"
                v-model="newProduct.stock"
                type="number"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text="Close" @click="addProductDialog = false">Close</v-btn>
            <v-btn color="primary" text="Add" @click="saveProduct">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--End of additions for dialog used to add products-->

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
    { text: "Home", to: "/all", icon: "mdi-home" },
    { text: "Electronics", to: "/electronics", icon: "mdi-laptop" },
    { text: "Clothing", to: "/clothing", icon: "mdi-tshirt-crew" },
    { text: "Groceries", to: "/groceries", icon: "mdi-cart" },
    { text: "Best Seller", to: "/bestseller", icon: "mdi-cash-register" },
  ]);

// start of additions for add dialog feature
  import {db, collection, addDoc} from "./firebase";
import { getDocs } from "firebase/firestore";
  const addProductDialog = ref(false);
  const newProduct = ref({
    name: "",
    imgURL: "",
    description: "",
    category: "",
    rating: 3,
    price: 0,
    stock: 0,
  });

  // if we need to have only number ids as strings for later, can use this function potentially.
async function newDocIDGenerator(){
    const allDocs = await getDocs(collection(db, "products"));
    const allNumsUsed: number[] = []
    allDocs.forEach( (doc) => {
        allNumsUsed.push(parseInt(doc.id, 10));
    })
    let i = 0
    while (!allNumsUsed.some((num) =>{
        num == i
    })) {
        i++
    }
}

const saveProduct = async () => {
  if (newProduct.value.name && newProduct.value.description && newProduct.value.price > 0) {
    try {
    //   const newDocID = await newDocIDGenerator();
    //   console.log("new doc id number value:", newDocID);
      const docRef = await addDoc(collection(db, "products"), {
        name: newProduct.value.name,
        description: newProduct.value.description,
        image: newProduct.value.imgURL,
        price: parseInt(newProduct.value.price, 10),
        rating: parseInt(newProduct.value.rating, 10),
        stock: parseInt(newProduct.value.stock, 10),
        category: newProduct.value.category,
      });

      productStore.products.push({
        id: docRef.id,
        data: {
          name: newProduct.value.name,
          description: newProduct.value.description,
          image: newProduct.value.imgURL,
          price: parseInt(newProduct.value.price, 10),
          rating: parseInt(newProduct.value.rating, 10),
          stock: parseInt(newProduct.value.stock, 10),
          category: newProduct.value.category,
        },
      });

      addProductDialog.value = false;
      newProduct.value = { name: "", description: "", rating: 3, price: 0, imgURL: "", stock: 0, category: "" };
    } catch (e) {
      console.error("Error adding product: ", e);
    }
  } else {
    console.log("info missing");
  }
};
// end of additions for add dialog feature
  </script>
