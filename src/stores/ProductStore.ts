import { defineStore } from "pinia";
import {ProductDoc , Product} from "../types/product";
import { initProducts } from "../data-init";
import { db } from '../firebase';
import { collection, doc, getDocs, QueryDocumentSnapshot, setDoc} from "firebase/firestore";

// function to be used by the filter function for filtering by category.
function filterForCategory(item: ProductDoc, category: string) {
    return item.data.category == category;
}

// function to be used by the filter function for filtering by rating.
function filterForRating(item: ProductDoc, minimumRating: number) {
    return item.data.rating > minimumRating;
}

export const useProductStore = defineStore("ProductStore", {
    // Setting up state for the variable we're using
    state: () => {
        const prods: ProductDoc[] = []
        return {products: prods};
    },

    // Setting up our actions.
    actions: {
        async init() {
            // get the products from firestore
            console.log("Inside init method")
            const querySnapshot = await getDocs(collection(db, "products"));
            if (querySnapshot.size > 0){
                querySnapshot.forEach((doc) => {
                    const docAsProdDoc: ProductDoc = { id: doc.id, data: doc.data() as ProductDoc["data"] };
                    // if this item isn't in the array already, then add it, else do nothing since it's already in our array.
                    console.log("docAsProdDocs:", docAsProdDoc)
                    const isValAlreadyInProdsArray = ((this.products.some( (product) => { console.log("product id:", product.id, "doc id", docAsProdDoc.id, "comparison:", product.id === docAsProdDoc.id); return product.id === docAsProdDoc.id;})))
                    console.log("is val already in products array:", isValAlreadyInProdsArray);
                    if (!isValAlreadyInProdsArray){    
                        this.products.push(docAsProdDoc);
                    }
                });
            }
            // sets products to init products if theres nothing in products after loading from firebase, and stores the items in firebase.
            if (querySnapshot.size == 0) {
                console.log("didn't find products in firebase")
                this.products = initProducts;
                // if the product array was empty then there's nothing in firebase, so we need to update it.
                this.products.forEach((product) => {
                    // created the document with the product ID as the primary key.
                    const docRef = doc(db, "products", product.id);
                    setDoc(docRef, product.data).then(() => {
                        console.log('product added was:', product)
                    })
                    .catch((err: any) => {
                        console.log('Rejected adding item:', product, 'due to error:', err);
                    })
                    .finally(() => {
                        console.log('finished uploading to firebase')
                    })
                });
            }
            console.log("init finished, Product array is:", this.products);
        },

        // string because this is the category we're filtering based off of.
        filterByCategory(category: string) {
            // we have to call this.init() first because if we skipped that step and only filtered then when we use this function to filter
            // electronics and then filter clothing items immediately after, there would be no clothing items because we've
            // already filtered for the electronics items first.
            this.init().then(() => {
                this.products = this.products.filter((product) => filterForCategory(product, category))
                });

        },

        // filter products with ratings above minRating value.
        filterByRating(minRating: number) {
            // we have to call this.init() first because if we skipped that step and only filtered then when we use this function to filter
            // electronics and then filter best seller immediately items immediately after, there would be  items from the original list missing because we've
            // already filtered for ONLY the electronic items first.
            this.init();
            this.products = this.products.filter( (product) => filterForRating(product, minRating));

        }
    }
  // your answer
});