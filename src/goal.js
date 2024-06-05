import { query } from "./data.js"


export const Goal = {
    add_goal: async function(title, date) {
        await query(
            `insert into goal(
                title, 
                is_complete, 
                date, 
                created_on
            ) 
            values (
                ?,
                0,
                ?,
                date('now')
            )`,
            title, 
            date.toISOString().substring(0, 10)
        )
    },

    delete_goal: async function(goal_id) {
        await query(`
            delete from goal
            where goal_id=?
        `, goal_id)
    },

    get_goals_for_day: async function(date) {
        let rows = await query(
            `select * from goal where date=?;`,
            date.toISOString().substring(0, 10)
        )
        return rows;
    },

    mark_completion: async function(goal_id, is_complete) {
        let value = (is_complete) ? 1 : 0;
        await query(
            `update goal
            set completion=?
            where goal_id=?`,
            value,
            is_complete
        )
    }
}