/**
 * @fileoverview Router configuration for the Nutrition Recommendation System
 * Defines all routes and navigation behavior for the application
 */

import {createRouter, createWebHistory} from "vue-router";

/**
 * @description Lazy-loaded component imports for route configuration
 * Using dynamic imports to enable code splitting and improve initial load performance
 */
const RecommendationManagementComponent = () => import('../recommendation/pages/recommendation-management.component.vue');

/**
 * @type {import('vue-router').RouteRecordRaw[]}
 * @description Application route definitions for recommendations
 */
const routes = [
    {
        path: '/recommendations',
        name: 'recommendations',
        component: RecommendationManagementComponent,
        meta: {title: 'Nutrition Recommendations'}
    },
    {
        path: '/',
        name: 'default',
        redirect: {name: 'recommendations'}
    },
]

/**
 * @type {import('vue-router').Router}
 * @description Vue Router instance configured with HTML5 history mode
 */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

/**
 * @description Global navigation guard for recommendation routes
 */
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name || 'none'} to ${to.name}`);
    document.title = `Nutrition System | ${to.meta['title']}`;
    next();
});

export default router;