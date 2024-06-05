

export function is_leap_year(year) {
    if (year % 4 === 0) {
        if (year % 100 === 0) {
            if (year % 400 === 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}

export function get_days_in_month(month, year) {
    if (month === 1 && is_leap_year(year)) {
        return 29
    } else {
        return days_in_month[month]
    }
}