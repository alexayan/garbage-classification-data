/* eslint-disable no-console */
const SQL = require('sql-template-strings');
const sqlite = require('sqlite');
const path = require('path');

const databasePath = path.resolve(__dirname, '../database/garbage.sqlite');

async function main() {
  const db = await sqlite.open(databasePath);

  await db.all(
    SQL`SELECT
          category,
          count(*)
        FROM
          Garbage
        GROUP BY
          category;`,
  ).then((res) => {
    console.log(res);
  }, (e) => {
    console.log(e.message);
  });
}

main();
