<template>
    <div class="container">
        <div class="employee-details">
            <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E&#34;);"
                aria-label="breadcrumb">
                <ol class="breadcrumb rounded bg-light text-dark p-3">
                    <li class="breadcrumb-item"><a href="#" @click="onClickHome">Employees</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Employee Details</li>
                </ol>
            </nav>
            <template v-if="employee">
                <div class="list-group bg-light text-dark">
                    <div class="list-group-item">
                        <h3 class="m-0">
                            {{ employee.LastName }}, {{ employee.FirstName }}
                        </h3>
                    </div>
                    <EmployeeDetailsListItem :name="'Gender'" :required="true" :value="employee.Gender" />
                    <EmployeeDetailsListItem :name="'Occupation'" :required="true" :value="employee.Occupation" />
                    <EmployeeDetailsListItem :name="'Date of Birth'" :required="true" :validator="isDateInPast"
                        :value="employee.DateOfBirth" />
                    <EmployeeDetailsListItem :name="'Employment Date'" :required="true" :validator="isDateValid"
                        :value="employee.EmploymentDate" :editable="true" :type="'DATE'"
                        :minimum-value="employee.DateOfBirth" :maximum-value="employee.TerminationDate"
                        @onEditValue="onChangeEmploymentDate" />
                    <EmployeeDetailsListItem :name="'Termination Date'" :required="false" :validator="isDateValid"
                        :value="employee.TerminationDate" :editable="true" :type="'DATE'"
                        :minimum-value="employee.EmploymentDate" @onEditValue="onChangeTerminationDate" />
                    <div v-if="message" class="p-3">
                        <div :class="{ 'alert': true, 'alert-info': true, 'm-0': true, 'alert-primary': employmentStatus === EmploymentStatus.ToBeEmployed, 'alert-success': employmentStatus === EmploymentStatus.Employed, 'alert-warning': employmentStatus === null || employmentStatus === EmploymentStatus.ToBeTerminated, 'alert-danger': employmentStatus === EmploymentStatus.Terminated }"
                            class="alert alert-info m-0">
                            {{ message }}
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="loading">
                <div class="rounded bg-light text-dark">
                    <p class="p-3">Loading employee...</p>
                </div>
            </template>
            <template v-else-if="error">
                <div class="rounded bg-light text-dark">
                    <p class="p-3">Error fetching employee</p>
                </div>
            </template>
            <template v-else>
                <div class="rounded bg-light text-dark">
                    <p class="p-3">No employee found</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import router from '@/router';
import EmployeeDetailsListItem from '@/components/EmployeeDetailsListItem.vue';
import { decodeId, fetchEmployee } from '@/services/EmployeeService';
import { Employee } from '@/objects/Employee';
import { EmploymentStatus } from '@/enums/EmploymentStatus';

export default {
    components: {
        EmployeeDetailsListItem,
    },
    data() {
        return {
            employee: ref<Employee | null>(null),
            loading: ref<boolean>(false),
            error: ref<string | null>(null),
            message: '',
            employmentStatus: ref<EmploymentStatus | null>(null),
            EmploymentStatus: EmploymentStatus,
        }
    },
    mounted() {
        const route = router.currentRoute.value;
        const employeeId = route.params.id as string;
        const id = decodeId(employeeId);
        this.loading = true;
        fetchEmployee(id)
            .then((data) => {
                this.employee = data;
                this.rewriteMessage();
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
         * Validates a date string.
         * @param date The date string to validate.
         * @returns True if the date is valid, false otherwise.
         */
        isDateValid(date): boolean {
            try {
                if (!date && date.length === 0) {
                    return true;
                }
                const d = new Date(date);
                return !!d.getDate();
            }
            catch (e) {
                return false;
            }
        },
        /**
         * Checks if a date is in the past.
         * @param date The date string to check.
         * @returns True if the date is in the past, false otherwise.
         */
        isDateInPast(date): boolean {
            if (this.isDateValid(date)) {
                return new Date(date) < new Date();
            }
            return false;
        },
        /**
         * Checks if a date is in the future.
         * @param date The date string to check.
         * @returns True if the date is in the future, false otherwise.
         */
        isDateInFuture(date): boolean {
            if (this.isDateValid(date)) {
                return new Date(date) > new Date();
            }
            return false;
        },
        /**
         * Navigates to the EmployeeList page.
         */
        onClickHome() {
            this.$router.push({ name: 'EmployeeList' });
        },
        /**
         * Updates the employment status message based on the employment and termination dates.
         */
        rewriteMessage() {
            this.message = '';
            if (this.employee.EmploymentDate) {
                if (this.isDateInPast(this.employee.EmploymentDate)) {
                    this.message = 'Employed';
                    this.employmentStatus = EmploymentStatus.Employed;
                } else {
                    this.message = 'Employed Soon';
                    this.employmentStatus = EmploymentStatus.ToBeEmployed;
                }
            }
            if (this.employee.TerminationDate) {
                if (this.isDateInPast(this.employee.TerminationDate)) {
                    this.message = 'Terminated';
                    this.employmentStatus = EmploymentStatus.Terminated;
                } else {
                    this.message = 'To Be Terminated';
                    this.employmentStatus = EmploymentStatus.ToBeTerminated;
                }
            }
        },
        /**
         * Updates the employment date for the employee.
         * @param value The new employment date value.
         */
        onChangeEmploymentDate(value) {
            if (value < this.employee?.DateOfBirth) {
                this.message = 'Employment date cannot be before date of birth';
                this.employmentStatus = null;
                return;
            }
            if (this.employee?.TerminationDate && value > this.employee?.TerminationDate) {
                this.message = 'Employment date cannot be after termination date';
                this.employmentStatus = null;
                return;
            }
            this.employee.EmploymentDate = value;
            this.rewriteMessage();
        },
        /**
         * Updates the termination date for the employee.
         * @param value The new termination date value.
         */
        onChangeTerminationDate(value) {
            if (value < this.employee?.DateOfBirth) {
                this.message = 'Termination date cannot be before date of birth';
                this.employmentStatus = null;
                return;
            }
            if (value < this.employee?.EmploymentDate) {
                this.message = 'Employment date cannot be after termination date';
                this.employmentStatus = null;
                return;
            }
            this.employee.TerminationDate = value;
            this.rewriteMessage();
        },
    },
};
</script>