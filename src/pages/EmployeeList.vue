<template>
    <div class="container">
        <div class="employee-list d-flex flex-column">
            <h2>Employee List</h2>
            <div class="input-group mb-3">
                <label for="occupation-filter" class="input-group-text">Occupation: </label>
                <select id="occupation-filter" class="form-select" v-model="selectedOccupation">
                    <option value="">All</option>
                    <option v-for="occupation in uniqueOccupations" :value="occupation">{{ occupation }}</option>
                </select>
            </div>
            <template v-if="filteredEmployees && filteredEmployees.length">
                <ul class="list-group bg-light text-dark">
                    <li :class="{ 'list-group-item': true, 'list-group-item-action': true, 'list-group-item-primary': !employee.isValid(), 'list-group-item-warning': !employee.isValid() }"
                        v-for="employee in filteredEmployees" :key="employee.Id">
                        <a href="#" @click="onEmployeeSelected(employee)">
                            {{ employee.LastName }}, {{ employee.FirstName }}
                            ({{ employee.Occupation.length > 0
                                ? employee.Occupation
                                : 'unassigned'
                            }})
                        </a>
                    </li>
                </ul>
            </template>
            <template v-else-if="loading">
                <div class="rounded bg-light text-dark">
                    <p class="p-3">Loading employees...</p>
                </div>
            </template>
            <template v-else-if="error">
                <div class="rounded bg-light text-dark">
                    <p class="p-3">Error fetching employee list</p>
                </div>
            </template>
            <template v-else-if="employees && employees.length === 0">
                <div class="rounded bg-light text-dark">
                    <p class="p-3">No employees found</p>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss">
.employee-list {
    max-height: 100vh
}

.list-group {
    max-height: 100vh;
    overflow: scroll;
}
</style>

<script lang="ts">
import { ref } from 'vue';
import router from '@/router';
import { encodeId, fetchEmployees } from '@/services/EmployeeService';
import { Employee } from '@/objects/Employee';

export default {
    data() {
        return {
            employees: ref<Employee[] | null>(null),
            loading: ref<boolean>(false),
            error: ref<string | null>(null),
            selectedOccupation: '',
        };
    },
    computed: {
        /**
         * Computes a list of unique occupations from the employees data.
         * @returns An array of unique occupation strings, sorted alphabetically.
         */
        uniqueOccupations(): string[] {
            if (!this.employees) {
                return [];
            }
            return [...new Set(this.employees.map(employee => employee.Occupation))]
                .filter((occupation) => occupation.length > 0)
                .sort((a, b) => {
                    return a.localeCompare(b);
                })
        },
        /**
         * Filters the employees data based on the selected occupation.
         * If no occupation is selected, returns all employees.
         * @returns An array of Employee objects, or null if no employees data is available.
         */
        filteredEmployees(): Employee[] | null {
            if (!this.employees) {
                return null;
            }
            if (!this.selectedOccupation) {
                return this.employees;
            }
            return this.employees.filter(employee => employee.Occupation === this.selectedOccupation);
        }
    },
    mounted() {
        this.loading = true;
        fetchEmployees()
            .then((data) => {
                this.employees = data;
                this.employees.sort((a, b) => {
                    return a.LastName.localeCompare(b.LastName);
                });
            })
            .catch((err) => {
                this.error = err;
            })
            .finally(() => {
                this.loading = false;
            });
    },
    methods: {
        /**
         * Navigates to the EmployeeDetails page when an employee is selected.
         * @param employee The selected Employee object.
         */
        onEmployeeSelected: (employee: Employee) => {
            const id = encodeId(employee.Id);
            router.push({ name: 'EmployeeDetails', params: { id: id } });
        }
    },
};
</script>
