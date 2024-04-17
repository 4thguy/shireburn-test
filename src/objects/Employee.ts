/**
 * Represents an employee.
 */
export class Employee {
    /** The ID of the employee. */
    public Id: string;

    /** The first name of the employee. */
    public FirstName: string;

    /** The last name of the employee. */
    public LastName: string;

    /** The gender of the employee. */
    public Gender: string;

    /** The occupation of the employee. */
    public Occupation: string;

    /** The date of birth of the employee. */
    public DateOfBirth: string;

    /** The employment date of the employee. */
    public EmploymentDate: string;

    /** The termination date of the employee. */
    public TerminationDate: string;

    /**
     * Creates a new Employee object.
     * @param data The data to initialize the Employee object with.
     */
    constructor(data: any) {
        Object.assign(this, data);
    }

    /**
     * Checks if the employee is valid.
     * An employee is considered valid if they have a first name, last name, and occupation.
     * @returns True if the employee is valid, false otherwise.
     */
    public isValid(): boolean {
        return this.FirstName && this.LastName && this.Occupation;
    }
}