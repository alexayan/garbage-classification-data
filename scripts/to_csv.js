/* eslint-disable no-console */
const SQL = require('sql-template-strings');
const sqlite = require('sqlite');
const path = require('path');
const fs = require('fs-extra');

const databasePath = path.resolve(__dirname, '../database/garbage.sqlite');
const csvFilePath = path.resolve(__dirname, '../garbage.csv');

async function main() {
  const db = await sqlite.open(databasePath);

  await db
    .all(
      SQL`SELECT
          *
        FROM
          Garbage`,
    )
    .then(
      (res) => {
        let content = '';
        res.forEach((garbage) => {
          content += `${garbage.name},${garbage.categroy}\n`;
        });
        return fs.writeFile(csvFilePath, content);
      },
      (e) => {
        console.log(e.message);
      },
    );
}

main();
