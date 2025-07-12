/**
 * @fileoverview Router configuration for the ACME Learning Center application
 * Defines all routes and navigation behavior for the application
 */

import {createRouter, createWebHistory} from "vue-router";
import {authenticationGuard} from "@/domains/iam/services/authentication.guard.js";


/**
 * @description Lazy-loaded component imports for route configuration
 * Using dynamic imports to enable code splitting and improve initial load performance
 */

const HomeComponent = () => import('@/public/pages/home.component.vue');
const AboutComponent = () => import('@/public/pages/about.component.vue');
const PageNotFoundComponent = () => import('@/public/pages/page-not-found.component.vue');

const RecommendationManagement = () => import('@/domains/recommendations/pages/recommendation-management.component.vue');
const MealPlanDetail = () => import('@/domains/meal_plans/pages/meal-plan-detail.component.vue');

const RecipeListComponent = ()=> import("@/domains/recipes/pages/recipe-list.component.vue");
const RecipeDetailComponent = ()=> import("@/domains/recipes/components/recipe-detail.component.vue");
const RecipeEditorComponent = ()=> import("@/domains/recipes/pages/recipe-editor.component.vue");
const ProfileManagementComponent = () => import("@/domains/profiles/pages/profile-management.component.vue");

const SignInComponent = () => import('../domains/iam/pages/sign-in.component.vue');
const SignUpComponent = () => import('../domains/iam/pages/sign-up.component.vue');


/**
 * @type {import('vue-router').RouteRecordRaw[]}
 * @description Application route definitions.
 * Each route object contains:
 * - path: URL path for the route
 * - name: Unique identifier for the route
 * - component: Vue component to render
 * - meta: Additional metadata including page title
 */
const routes = [
    {   path: '/home',                  name: 'home',      component: HomeComponent,                            meta: {title: 'Home'}},
    {   path: '/about',                 name: 'about',      component: AboutComponent,                          meta: {title: 'About us'}},
    {   path: '/recommendations',       name: 'recommendations', component: RecommendationManagement,           meta: {title: 'Recommendations'}},
    {
        path: '/meal_plans/1',
        name: 'meal_plan-detail',
        component: MealPlanDetail,
        props: true,
        meta: { title: 'Meal Plan Detail' }
    },
    {
        path: '/recipes',
        name: 'recipe-list',
        component: RecipeListComponent,
        meta: {title: 'Recipe List'}
    },
    {
        path: '/recipes/new', // Route for creating a new recipe
        name: 'recipe-creator',
        component: RecipeEditorComponent,
        meta: {title: 'Create Your Recipe'}
    },
    {
        path: '/recipes/:id', // Route for displaying a recipe detail
        name: 'recipe-detail',
        component: RecipeDetailComponent, // Or a page component that loads the detail component
        props: route => ({ recipeId: route.params.id }),// Pass route params as props (useful for detail page to get ID)
        meta: {title: 'Recipe Detail'}
    },
    {
        path: '/recipes/:id/edit', // Route for editing an existing recipe
        name: 'recipe-editor',
        component: RecipeEditorComponent,
        props: route => ({ recipeId: route.params.id }),
        meta: {title: 'Edit A Recipe'}
    },
    {   path: '/profile',
        name: 'profile',
        component : ProfileManagementComponent,
        meta: {title: 'Profile'}
    },
    {   path: '/sign-in',           name: 'sign-in',    component: SignInComponent,   meta: {title: 'Sign In'}},
    {   path: '/sign-up',           name: 'sign-up',    component: SignUpComponent,   meta: {title: 'Sign Up'}},
    {   path: '/',                  name: 'default',    redirect: {name: 'home'}},
    {   path: '/:pathMatch(.*)*',   name: 'not-found',  component: PageNotFoundComponent,       meta: {title: 'Page not found'}}
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
 * @description Global navigation guard that runs before each route change
 * Handles:
 * - Navigation logging
 * - Dynamic page title updates based on route metadata
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route
 * @param {import('vue-router').RouteLocationNormalized} from - Current route
 * @param {import('vue-router').NavigationGuardNext} next - Function to resolve the navigation
 */

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    // Set the page title
    let baseTitle = 'Alimentate+';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    authenticationGuard(to, from, next);
});

export default router;