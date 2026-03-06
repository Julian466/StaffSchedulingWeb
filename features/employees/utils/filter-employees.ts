import {Employee} from "@/src/entities/models";

export function filterEmployees(employees: Employee[], searchTerm: string) {
    if (!searchTerm) return employees;

    const lowerSearch = searchTerm.toLowerCase();
    return employees.filter((employee) => {
        const fullName = `${employee.firstname} ${employee.name}`.toLowerCase();
        return fullName.includes(lowerSearch) ||
            employee.firstname.toLowerCase().includes(lowerSearch) ||
            employee.name.toLowerCase().includes(lowerSearch) ||
            employee.type.toLowerCase().includes(lowerSearch) ||
            employee.key.toString().includes(lowerSearch);
    });
}