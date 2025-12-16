import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';

const FILE_PATH = path.join(process.cwd(), 'cases', '1', 'global_wishes_and_blocked.json');

async function readFile(): Promise<{ employees: WishesAndBlockedEmployee[] }> {
    const raw = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(raw);
}

async function writeFile(data: { employees: WishesAndBlockedEmployee[] }) {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
    try {
        const data = await readFile();
        return NextResponse.json(data.employees);
    } catch (err) {
        return new NextResponse('Konnte Datei nicht lesen', { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = await readFile();
        const employees = data.employees || [];
        const maxKey = employees.reduce((m, e) => Math.max(m, e.key ?? 0), 0);
        const newEmployee: WishesAndBlockedEmployee = { key: maxKey + 1, ...body };
        employees.push(newEmployee);
        await writeFile({ employees });
        return NextResponse.json(newEmployee);
    } catch (err) {
        return new NextResponse('Fehler beim Erstellen', { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, data: payload } = await req.json();
        const file = await readFile();
        const employees = file.employees || [];
        const idx = employees.findIndex((e) => e.key === id);
        if (idx === -1) return new NextResponse('Nicht gefunden', { status: 404 });
        employees[idx] = { ...employees[idx], ...payload, key: id };
        await writeFile({ employees });
        return NextResponse.json(employees[idx]);
    } catch (err) {
        return new NextResponse('Fehler beim Aktualisieren', { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        const file = await readFile();
        const employees = file.employees || [];
        const filtered = employees.filter((e) => e.key !== id);
        await writeFile({ employees: filtered });
        return NextResponse.json({ success: true });
    } catch (err) {
        return new NextResponse('Fehler beim Löschen', { status: 500 });
    }
}