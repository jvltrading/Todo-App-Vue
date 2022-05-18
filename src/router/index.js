import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/AboutPage.vue')
    },
    {
        path: '/archive',
        name: 'Archive',
        component: () => import('../views/Archive.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;