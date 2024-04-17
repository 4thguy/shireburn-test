import { createRouter, createWebHistory } from 'vue-router';
import EmployeeList from '@/pages/EmployeeList.vue';
import EmployeeDetails from '@/pages/EmployeeDetails.vue';

const routes = [
    {
        path: '/',
        name: 'EmployeeList',
        component: EmployeeList,
    },
    {
        path: '/employee/:id',
        name: 'EmployeeDetails',
        component: EmployeeDetails,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
