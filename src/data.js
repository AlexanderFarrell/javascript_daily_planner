const sqlite3 = require('sqlite3')
const fs = require('fs')

const filename_db = './goals.sqlite'
let db = null;

export function setup_database(seed_func) {
    return new Promise((res, rej) => {
        fs.access(filename_db, (err, data) => {
            db = new sqlite3.Database(filename_db);
            if (err) {
                seed_func()
                    .then(res)
                    .catch(rej)
            } else {
                res()
            }
        })
    })
}

export function query(sql, ...args) {
    return new Promise((resolve, reject) => {
        let func = (err, data) => {
            if (err) {
                console.error(err)
                reject(err);
            } else {
                resolve(data);
            }
        }
        db.all(sql, args, func)
        // if (args.length > 0) {
        //     let stmt = db.prepare(sql)
        //     stmt.run(args, func)
        //     // db.all(sql, [args], func);
        // } else {
        //     db.all(sql, func)
        // }
    })
}