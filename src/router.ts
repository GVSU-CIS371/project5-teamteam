import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "./components/Home.vue";
import Clothing from "./components/Clothing.vue";
import Electronics from "./components/Electronics.vue";
import Groceries from "./components/Groceries.vue";
import BestSeller from "./components/BestSeller.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    props: true,
    component: HomeView,
  },
  {
    path: '/clothing',
    name: 'Clothing',
    props: true,
    component: Clothing
  },
  {
    path: '/electronics',
    name: 'Electronics',
    props: true,
    component: Electronics
  },
  {
    path: '/groceries',
    name: 'Groceries',
    props: true,
    component: Groceries
  },
  {
    path: '/bestseller',
    name: 'Best Seller',
    props: true,
    component: BestSeller
  }
  // you need to add more routes here
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
