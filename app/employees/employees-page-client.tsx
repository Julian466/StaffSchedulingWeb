import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {EmployeeList} from '@/features/employees/components/employee-list';
import {Employee} from '@/src/entities/models/employee.model';

interface EmployeesPageClientProps {
    employees: Employee[];
}

export function EmployeesPageClient({employees}: EmployeesPageClientProps) {
    return (
        <div className="py-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Mitarbeiter-Datenbank</CardTitle>
                            <CardDescription>
                                Verwalte alle Mitarbeiter an einem Ort
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <EmployeeList
                        employees={employees}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
