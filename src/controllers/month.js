import { Goal } from "../goal.js";

window.$ = window.jQuery = require('jquery')


export async function render_day(date=new Date()) {

    let heading = document.getElementById('heading')

    heading.innerHTML = date.toDateString();

    let container = document.getElementById('content')
    container.innerHTML = `
    <div id="add_container">
        <input type="text" id="add_goal" placeholder="Add Goal">
        <button id="add">
            <img src="./icon/add.svg">
        </button>
        <button id="edit">
            <img src="./icon/edit.svg">
        </button>
    </div>
    `

    document.getElementById('edit').onclick = function () {
        let buttons = document.querySelectorAll('.delete');
        buttons.forEach((button) => {
            if (button.style.display === 'none') {
                button.style.display = "block"
            } else {
                button.style.display = 'none'
            }
        })
    }

    let add_goal_function = function() {
        let value = document.getElementById('add_goal').value;
        if (value.length > 0) {
            Goal.add_goal(value.trim(), date)
        }
        render_day(date)
    }

    document.getElementById('add').onclick = add_goal_function
    document.getElementById('add_goal').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            add_goal_function()
        }
    })
    document.getElementById('add_goal').focus()

    let goals = await Goal.get_goals_for_day(date);
    goals.forEach(goal => {
        let element = document.createElement("div")
        element.classList.add('goal')
        element.innerHTML = `
        <div>${goal.title}</div>
        `
        let checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        if (goal.is_complete === 1) {
            checkbox.checked = true
        }
        element.appendChild(checkbox)

        let deleteButton = document.createElement('button')
        deleteButton.classList.add('delete')
        deleteButton.style.display = 'none'
        deleteButton.innerHTML = `
        <img src="./icon/delete.svg">
        `
        deleteButton.onclick = function () {
            Goal.delete_goal(goal.goal_id)
            render_day(date)
        }
        element.appendChild(deleteButton)

        container.appendChild(element)
    })

    document.getElementById('month').onclick = function() {
        console.log("hello")
        render_month(date.getMonth(), date.getFullYear())
    }

    document.getElementById('previous').onclick = function() {
        let yesterday = new Date(date);
        yesterday.setDate(date.getDate() - 1);
        render_day(yesterday)
    }
    document.getElementById('forward').onclick = function() {
        let tomorrow = new Date(date);
        tomorrow.setDate(date.getDate() + 1);
        render_day(tomorrow)
    }


}

const month_names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]
let days_in_month = [
    31, // January
    28, // February
    31, // March
    30, // April
    31, // May
    30, // June
    31, // July
    31, // August
    30, // September
    31, // October
    30, // November
    31  // December
]

export function render_month(month, year) {
    let heading = document.getElementById('heading')
    let month_name = month_names[month];
    heading.innerHTML = `${month_name} ${year}`;

    document.getElementById('month').onclick = function() {
        let today = new Date();
        render_month(today.getMonth(), today.getFullYear());
    }

    document.getElementById('previous').onclick = function() {
        let lastMonth = month-1;
        let y = year;
        if (lastMonth < 0) {
            lastMonth += 12;
            y--;
        }
        render_month(lastMonth, y);
    }
    document.getElementById('forward').onclick = function() {
        let nextMonth = month+1;
        let y = year;
        if (nextMonth > 11) {
            nextMonth -= 12;
            y++;
        }
        render_month(nextMonth, y);
    }

    let container = document.getElementById('content')
    container.innerHTML = ""
    let monthView = document.createElement('div')
    monthView.classList.add('month')
    container.appendChild(monthView)
    let days = get_days_in_month(month, year)
    // Find out what day of the week is the first of the month
    let day_of_week = new Date(year, month, 1).getDay();
    for (let i = 0; i < day_of_week; i++) {
        monthView.innerHTML += "<div>&nbsp;</div>"
    }
    for (let i = 1; i <= days; i++) {
        let day_button = document.createElement('button')
        day_button.innerHTML = i;
        day_button.onclick = function() {
            render_day(new Date(year, month, i))
        }
        monthView.appendChild(day_button)
    }
}

function is_leap_year(year) {
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

function get_days_in_month(month, year) {
    if (month === 1 && is_leap_year(year)) {
        return 29
    } else {
        return days_in_month[month]
    }
}