
import { render_month, render_day } from "./controllers.js";
import { query, setup_database } from "./data.js";

async function init() {
    await setup_database(seed_database)

    render_day();

    document.getElementById('day').addEventListener('click', function() {
        render_day();
    })
}

async function seed_database() {
    await query(`
    create table goal(
        goal_id integer primary key autoincrement,
        title text not null,
        is_complete int not null,
        date text not null,
        created_on text not null
    );
    `)
}

init()