import { defineStore } from "pinia";
import {ProductDoc } from "../types/product";
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
            // Assigning our products to be the initial products list.
            console.log("Inside init method")
            // get reference to our collection and get it and see if size > 1, meaning the collection already exists.
            const rootCollection = collection(db, '/products');
            const docs = await getDocs(rootCollection);
            if (docs.size == 0){
                console.log("the collecion is empty");
                // if the collection is empty we need to populate it with the data from initProducts and store it in firebase.
                this.products = initProducts;
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
                        console.log('finished')
                    })
                });
            } else {
                // if the collection is not empty then we load it from firestore
                console.log("the collection is not empty");
                // we need to convert each item from firebase object to the correct object type our Array expects.
                docs.forEach((docSnap: QueryDocumentSnapshot) => {
                    const productAsProductDocObject = docSnap.data() as ProductDoc;
                    // now we have correct object type, lets add it to our array.
                    this.products.push(productAsProductDocObject);
                })
            }
            console.log('Root Collection is:', rootCollection); 
            this.products = initProducts;
            console.log("End init method")

        },

        // string because this is the category we're filtering based off of.
        filterByCategory(category: string) {
            // we have to call this.init() first because if we skipped that step and only filtered then when we use this function to filter
            // electronics and then filter clothing items immediately after, there would be no clothing items because we've
            // already filtered for the electronics items first.
            this.init();
            this.products = this.products.filter((product) => filterForCategory(product, category));

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
