import initSqlJs from '@m1les/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
import {RunTest} from './raindrops-test';

async function init() {
  let SQL = await initSqlJs({ locateFile: file => file });
  let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');

  let db = new SQL.Database('/sql/db.sqlite', { filename: true });
  db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);
  return db;
}

async function runQueries() {
  let db = await init();

  RunTest(db, 10000);


  // try {
  //   db.exec('CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT)');
  // } catch (e) {}

  // try {
  //   db.exec("CREATE TABLE t (body TEXT,id TEXT GENERATED ALWAYS AS (json_extract(body, '$.id')) VIRTUAL NOT NULL); CREATE INDEX tid ON t(id);");
  // } catch (e) {}

  // db.exec('BEGIN TRANSACTION');
  // let stmt = db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)');
  // let stmt2 = db.prepare('INSERT OR REPLACE INTO t (body) VALUES (?)');
  // for (let i = 0; i < 500000; i++) {
  //   stmt.run([i, ((Math.random() * 100) | 0).toString()]);
  //   stmt2.run([`{ "id": "${((Math.random() * 100) | 0).toString()}" }`]);
  //   if (i % 100000 === 0) {
  //     console.log(`Inserting entries; iteration ${i} of 500000`);
  //   }
  // }
  // for (let i = 0; i < 500000; i++) {
  //   if (i % 100000 === 0) {
  //     console.log(`Random processing code #-1; iteration ${i} of 500000`);
  //   }
  // }
  // stmt.free();
  // stmt2.free();
  // for (let i = 0; i < 500000; i++) {
  //   if (i % 100000 === 0) {
  //     console.log(`Random processing code #0; iteration ${i} of 500000`);
  //   }
  // }
  // db.exec('COMMIT');

  // for (let i = 0; i < 500000; i++) {
  //   if (i % 100000 === 0) {
  //     console.log(`Random processing code #1; iteration ${i} of 500000`);
  //   }
  // }

  // stmt = db.prepare(`SELECT SUM(value) FROM kv`);
  // stmt2 = db.prepare(`SELECT SUM(id) FROM t`);

  // for (let i = 0; i < 500000; i++) {
  //   if (i % 100000 === 0) {
  //     console.log(`Random processing code #2; iteration ${i} of 500000`);
  //   }
  // }
  // stmt.step();
  // stmt2.step();

  // for (let i = 0; i < 500000; i++) {
  //   if (i % 100000 === 0) {
  //     console.log(`Random processing code #3; iteration ${i} of 500000`);
  //   }
  // }
  // console.log('Result:', stmt.getAsObject());
  // console.log('Result2:', stmt2.getAsObject());
  // stmt.free();
  // stmt2.free();
}

runQueries();
