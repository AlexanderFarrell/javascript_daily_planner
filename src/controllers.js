import { Goal } from "./goal.js";
import { get_days_in_month, is_leap_year} from "./helper.js";

window.$ = window.jQuery = require('jquery')


export async function render_day(date=new Date()) {
    $('#heading').html(date.toDateString());

    render_add_goal_bar(date)

    let goals = await Goal.get_goals_for_day(date);
    goals.forEach(goal => {
        $('#content').append(render_goal(goal, date))
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

function render_add_goal_bar(date) {
    $('#content').html(`
    <div id="add_container">
        <input type="text" id="add_goal" placeholder="Add Goal">
        <button id="add">
            <img src="./icon/add.svg">
        </button>
        <button id="edit">
            <img src="./icon/edit.svg">
        </button>
    </div>
    `)

    $('#edit').on('click', function(){
        let buttons = document.querySelectorAll('.delete');
        buttons.forEach((button) => {
            if (button.style.display === 'none') {
                button.style.display = "block"
            } else {
                button.style.display = 'none'
            }
        })
    })

    let add_goal_function = function() {
        let value = document.getElementById('add_goal').value;
        if (value.length > 0) {
            Goal.add_goal(value.trim(), date)
        }
        render_day(date)
    }

    $('#add').on('click', add_goal_function)
    $('#add_goal')
        .on('keydown', function () {
            if (e.key === 'Enter') {
                add_goal_function()
            }
        })
        .focus()
}

function render_goal(goal, date) {
    let element = $('<div class="goal"></div>')
    element.html(`<div>${goal.title}</div>`)

    let checkbox = $(`<input type="checkbox">`)
    if (goal.is_complete === 1) {
        checkbox.attr('checked', true)
    }
    checkbox.on('click', () => {
        Goal.mark_completion(goal.goal_id, checkbox.is(':checked'))
    })
    element.append(checkbox)

    let deleteButton = $(`
        <button class="delete">
            <img src="./icon/delete.svg">
        </button>`)
        .hide()
        .on('click', async function () {
            await Goal.delete_goal(goal.goal_id)
            render_day(date)
        })
    element.append(deleteButton)
    return element;
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
    let month_name = month_names[month];

    $('#heading').html(`${month_name} ${year}`);

    let container = $('#content')
    container.html('')

    let monthView = $('<div class="month"></div>')
    container.append(monthView)

    let days = get_days_in_month(month, year)

    // Find out what day of the week is the first of the month
    let day_of_week = new Date(year, month, 1).getDay();
    for (let i = 0; i < day_of_week; i++) {
        let element = $('<div>&nbsp;</div>')
        monthView.append(element)
    }

    // Display all of the days
    for (let i = 1; i <= days; i++) {
        let day_button = $(`<button>${i}</button>`)
        day_button.on('click', function() {
            render_day(new Date(year, month, i))
        })
        monthView.append(day_button)
    }

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
}