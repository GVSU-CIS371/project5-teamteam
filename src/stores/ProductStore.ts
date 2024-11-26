import { defineStore } from "pinia";
import {ProductDoc } from "../types/product";
import { initProducts } from "../data-init";

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
        init() {
            // Assigning our products to be the initial products list.
            this.products = initProducts;
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
