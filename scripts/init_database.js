/* eslint-disable no-console */
const SQL = require('sql-template-strings');
const sqlite = require('sqlite');
const path = require('path');

const databasePath = path.resolve(__dirname, '../database/garbage.sqlite');

async function main() {
  const db = await sqlite.open(databasePath);

  await db.all(
    SQL`CREATE TABLE Garbage (
          name TEXT PRIMARY KEY,
          categroy NUMBER,
          create_at TEXT,
          update_at TEXT
        );`,
  ).then(() => {
    console.log('create table Garbage success');
  }, (e) => {
    console.log(e.message);
  });
}

main();
