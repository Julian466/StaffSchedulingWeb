import {WishesAndBlockedEmployee} from "@/types/wishes-and-blocked";

export function getDaysByWeekday(year?: number, month?: number): number[][] {
    const today = new Date();
    const y = typeof year === 'number' ? year : today.getFullYear();
    const m = typeof month === 'number' ? month : today.getMonth() + 1; // 1-12

    if (m < 1 || m > 12) throw new RangeError('month must be between 1 and 12');

    // Anzahl Tage im Monat (wenn month 1-12 ist, liefert new Date(y, m, 0) den letzten Tag des Monats)
    const daysInMonth = new Date(y, m, 0).getDate();

    // Ergebnis: 0 = Montag, 1 = Dienstag, ..., 6 = Sonntag
    const result: number[][] = Array.from({ length: 7 }, () => []);

    for (let d = 1; d <= daysInMonth; d++) {
        const jsWeekday = new Date(y, m - 1, d).getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
        const index = (jsWeekday + 6) % 7; // mappt 1->0 (Montag) ... 0->6 (Sonntag)
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
export function generateMonthlyDataFromWeeklyData(weeklyEmployee: WishesAndBlockedEmployee, year?: number, month?: number): Omit<WishesAndBlockedEmployee, 'key'> {
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

    // wish_days und blocked_days
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

    // wish_shifts und blocked_shifts
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

    return monthlyEmployee;
}
