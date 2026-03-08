import {WishesAndBlockedEmployee} from "@/src/entities/models/wishes-and-blocked.model";

export function getDaysByWeekday(year?: number, month?: number): number[][] {
    const today = new Date();
    const y = typeof year === 'number' ? year : today.getFullYear();
    const m = typeof month === 'number' ? month : today.getMonth() + 1; // 1-12

    if (m < 1 || m > 12) throw new RangeError('month must be between 1 and 12');

    // new Date(y, m, 0) returns the last day of the requested month when month is in the 1-12 range.
    const daysInMonth = new Date(y, m, 0).getDate();

    // Result: 0 = Monday, 1 = Tuesday, ..., 6 = Sunday.
    const result: number[][] = Array.from({length: 7}, () => []);

    for (let d = 1; d <= daysInMonth; d++) {
        const jsWeekday = new Date(y, m - 1, d).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const index = (jsWeekday + 6) % 7; // maps 1->0 (Monday) ... 0->6 (Sunday)
        result[index].push(d);
    }

    return result;
}

/**
 * Generates monthly wishes and blocked data from weekly data.
 * Therefore, the weekdays in the weekly data are expanded to actual days in the month.
 * @param weeklyEmployee
 * @param year
 * @param month
 */
export function generateMonthlyDataFromWeeklyData(weeklyEmployee: WishesAndBlockedEmployee, year?: number, month?: number): WishesAndBlockedEmployee {
    const daysByWeekday = getDaysByWeekday(year, month);
    const monthlyEmployee: WishesAndBlockedEmployee = {
        key: weeklyEmployee.key,
        firstname: weeklyEmployee.firstname,
        name: weeklyEmployee.name,
        wish_days: [],
        wish_shifts: [],
        blocked_days: [],
        blocked_shifts: []
    };

    // Expand wished and blocked weekdays into concrete calendar days.
    weeklyEmployee.wish_days.forEach(weekday => {
        if (weekday >= 1 && weekday <= 7) {
            monthlyEmployee.wish_days.push(...daysByWeekday[weekday - 1]);
        }
    });
    weeklyEmployee.blocked_days.forEach(weekday => {
        if (weekday >= 1 && weekday <= 7) {
            monthlyEmployee.blocked_days.push(...daysByWeekday[weekday - 1]);
        }
    });

    // Expand wished and blocked shifts into concrete day-shift pairs.
    weeklyEmployee.wish_shifts.forEach(([weekday, shift]) => {
        if (weekday >= 1 && weekday <= 7) {
            daysByWeekday[weekday - 1].forEach(day => {
                monthlyEmployee.wish_shifts.push([day, shift]);
            });
        }
    });
    weeklyEmployee.blocked_shifts.forEach(([weekday, shift]) => {
        if (weekday >= 1 && weekday <= 7) {
            daysByWeekday[weekday - 1].forEach(day => {
                monthlyEmployee.blocked_shifts.push([day, shift]);
            });
        }
    });

    // Ensure canonical ordering: by day asc, then by shift (F, S, N)
    const SHIFT_ORDER = ['F', 'S', 'N'];
    const shiftPriority = (s: string) => {
        const idx = SHIFT_ORDER.indexOf(s);
        return idx === -1 ? 999 : idx;
    };

    monthlyEmployee.wish_shifts.sort((a, b) => a[0] - b[0] || shiftPriority(a[1]) - shiftPriority(b[1]));
    monthlyEmployee.blocked_shifts.sort((a, b) => a[0] - b[0] || shiftPriority(a[1]) - shiftPriority(b[1]));

    // dedupe (same day + same shift)
    const dedupe = (arr: [number, string][]) => arr.filter((v, i, a) => i === 0 || !(v[0] === a[i - 1][0] && v[1] === a[i - 1][1]));
    monthlyEmployee.wish_shifts = dedupe(monthlyEmployee.wish_shifts);
    monthlyEmployee.blocked_shifts = dedupe(monthlyEmployee.blocked_shifts);

    return monthlyEmployee;
}
