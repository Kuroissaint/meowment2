import { createRouter, createWebHistory } from 'vue-router';

// Impor komponen halaman (pages)
import SearchPage from '../views/SearchPage.vue';
import HomePage from '../views/HomePage.vue';
import MySearchPage from '../views/MySearchPage.vue';
import FormSearchPage from '../views/FormSearch.vue';

import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';

import AdoptPage from '../views/AdoptPage.vue';
import AdoptDetail from '../views/AdoptDetail.vue';
import AjukanAdopsi from '../views/AjukanAdopsi.vue';
import AjukanKucing from '../views/AjukanKucing.vue';

import RescuePage from '../views/RescuePage.vue';
import FormLaporanRescue from '../views/FormLaporanRescue.vue';

import DonatePage from '../views/Donate.vue'; 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage,
  },
  {
    path: '/mysearch',
    name: 'MySearch',
    component: MySearchPage,
  },
  {
    path: '/report',
    name: 'Report',
    component: FormSearchPage,
  },
  {
    path: '/rescue',
    name: 'Rescue',
    component: RescuePage,  
  },
  {
    path: '/formlaporanrescue',
    name: 'FormLaporanRescue',
    component: FormLaporanRescue,
  },
  {
    path: '/adopt',
    name: 'Adopt',
    component: AdoptPage,

  },
  {
    path: '/adoptdetail',
    name: 'AdoptDetail',
    component: AdoptDetail,

  },
  {
    path: '/ajukanadopsi',
    name: 'AjukanAdopsi',
    component: AjukanAdopsi,
  },
  {
    path: '/ajukankucing',
    name: 'AjukanKucing',
    component: AjukanKucing,
  },
  {
    path: '/donate',
    name: 'Donate',
    component: DonatePage,
  },
  {
    path: '/donate/bank-transfer',
    name: 'BankTransferCheckout',
    component: () => import('../views/BankTransferCheckout.vue'),
    },
    {
    path: '/payment/confirmation',
    name: 'PaymentConfirmation', 
    component: () => import('../views/PaymentConfirmation.vue'),
    },
    {
    path: '/donate/qris',
    name: 'QrisCheckout',
    component: () => import('../views/QrisCheckout.vue'),
    }
];

const router = createRouter({
  history: createWebHistory(), 
  routes,
});

export default router;