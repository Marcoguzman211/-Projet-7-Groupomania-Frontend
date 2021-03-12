import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Profil from '../views/Profil.vue';
import OnePublication from '../views/OnePublication.vue';

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/user/profil',
        name: 'Profil',
        component: Profil
    },
    {
        path: '/publication/:id',
        name: 'OnePublication',
        component: OnePublication
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router