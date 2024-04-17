import { Config } from "@/config";
import { Employee } from "@/objects/Employee";

/**
 * Fetches all employees from the configured endpoint.
 * @returns A promise that resolves with an array of Employee objects on success,
 *          or rejects with an error message on failure.
 */
export function fetchEmployees(): Promise<Employee[]> {
    const errorMessage = 'An error occurred while fetching employee data';
    const noDataMessage = 'No employees found';

    return new Promise((resolve, reject) => {
        fetch(Config.employeesEndpoint)
            .then((response) => {
                if (!response.ok) {
                    reject(errorMessage);
                }
                return response.json();
            })
            .then((data) => {
                if (data?.record?.Employees) {
                    const employees = data.record.Employees.map((e) => new Employee(e))
                    resolve(employees);
                } else {
                    reject(noDataMessage);
                }
            })
            .catch((error) => {
                reject(errorMessage);
            });
    });
}

/**
 * Fetches a specific employee by ID from the configured endpoint.
 * @param id The ID of the employee to fetch.
 * @returns A promise that resolves with the Employee object on success,
 *          or rejects with an error message on failure.
 */
export function fetchEmployee(id: string): Promise<Employee> {
    const errorMessage = 'An error occurred while fetching employee data';
    const noDataMessage = 'Employee not found';

    return new Promise((resolve, reject) => {
        fetchEmployees()
            .then((employees: Employee[]) => {
                const employee = employees.find((e) => e.Id === id);
                if (employee) {
                    resolve(employee);
                } else {
                    reject(noDataMessage);
                }
            })
            .catch((error) => {
                reject(errorMessage);
            });
    });
}

/**
 * Encodes an employee ID to a base64 string.
 * @param id The ID to encode.
 * @returns The encoded ID.
 */
export function encodeId(id: string): string {
    return btoa(id);
}

/**
 * Decodes an employee ID from a base64 string.
 * @param encodedId The encoded ID to decode.
 * @returns The decoded ID.
 */
export function decodeId(encodedId: string): string {
    return atob(encodedId);
}
