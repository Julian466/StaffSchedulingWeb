'use client';

import { Employee } from '@/types/employee';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Badge} from "@/components/ui/badge";

interface EmployeeListProps {
  employees: Employee[];
}

export function EmployeeList({ 
  employees
}: EmployeeListProps) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Keine Mitarbeiter vorhanden. 
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Vorname</TableHead>
            <TableHead>Nachname</TableHead>
            <TableHead>Beruf</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.key}>
              <TableCell><Badge>{employee.key}</Badge></TableCell>
              <TableCell className="font-medium">
                {employee.firstname}
              </TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
