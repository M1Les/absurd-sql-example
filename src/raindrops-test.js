let db2 = undefined;
let drops = [];

const bridgeRCs ='[{}]';

async function PrepareRainDrops(count) {
  console.log("prepared rain drops", count);
  for (var i = 1; i <= count; ++i) {
    drops.push({
      id: i,
      position: Math.random(),
      someData: {
        someText: "some value",
        someNumber: Math.random().toFixed(5)
      }
    });
  }
}

async function CreateTable(name) {
  if (!db2) {
    console.log("CreateTable: DB not created");
    return;
  }
  
  return new Promise(function(resolve, reject) {
    let sql_statement = 'CREATE TABLE IF NOT EXISTS ' + name + ' (id unique, position REAL, data TEXT); CREATE INDEX IF NOT EXISTS tposition ON RAINDROPS(position);';
      try {
        db2.exec(sql_statement);
      } catch (e) {
        reject();
      }
      console.log("Executing: ", sql_statement);
      db2.exec(sql_statement);
      resolve();
  });
}

// async function CreateTable(name) {
//   if (!db2) {
//     console.log("CreateTable: DB not created");
//     return;
//   }
  
//   return new Promise(function(resolve, reject) {
//     let sql_statement = 'CREATE TABLE IF NOT EXISTS ' + name + ' (id unique, position REAL)';
//       try {
//         db2.exec(sql_statement);
//       } catch (e) {
//         reject();
//       }
//       console.log("Executing: ", sql_statement);
//       db2.exec(sql_statement);
//       resolve();
//   });
// }

async function BulkStore() {
 console.log("Bulk Storing 10000 drops into db");
 await CreateTable("RAINDROPS");

 let bulk_store_end;
 let bulk_store_start = performance.now();

 return new Promise(function(resolve, reject) {
  try {
const parsedRCs = JSON.parse(bridgeRCs);

    db2.exec('BEGIN TRANSACTION');
    let stmt = db2.prepare('INSERT OR REPLACE INTO RAINDROPS (id, position, data) VALUES (?, ?, ?)');    
    for (var i = 0; i < drops.length; ++i) {
      stmt.run([drops[i].id, drops[i].position, parsedRCs[i % parsedRCs.length].data]);
    }
    stmt.free();
    db2.exec('COMMIT');

    bulk_store_end = performance.now();
    console.log("Finished inserting drops: " + drops.length + " took: " +  (bulk_store_end - bulk_store_start) + " ms");
    resolve();
  } catch (error) {
    reject(error);
  }
  
 });
}

// async function BulkStore() {
//   console.log("Bulk Storing 10000 drops into db");
//   await CreateTable("RAINDROPS");
 
//   let bulk_store_end;
//   let bulk_store_start = performance.now();
 
//   return new Promise(function(resolve, reject) {
//    try {
 
//      // const values = drops.map( drop => [drop.id, drop.position]);
//      // const placeholders = values.map(() => "(?, ?)").join(",");
//      // let sql = 'INSERT OR REPLACE INTO RAINDROPS (id, position) VALUES ' + placeholders;
//      // db2.run(sql, values);
 
//      db2.exec('BEGIN TRANSACTION');
//      let stmt = db2.prepare('INSERT OR REPLACE INTO RAINDROPS (id, position) VALUES (?, ?)');    
//      for (var i = 0; i < drops.length; ++i) {
//        stmt.run([drops[i].id, drops[i].position]);
//      }
//      stmt.free();
//      db2.exec('COMMIT');
 
//      bulk_store_end = performance.now();
//      console.log("Finished inserting drops: " + drops.length + " took: " +  (bulk_store_end - bulk_store_start) + " ms");
//      resolve();
//    } catch (error) {
//      reject(error);
//    }
   
//   });
//  }

async function smallQuery() {
  let small_query_end;
  let small_query_begin = performance.now();
  return new Promise(function(resolve, rej) {

    let stmt = db2.prepare('SELECT * FROM RAINDROPS WHERE position > 0.50 AND position <= 0.51 LIMIT 1');
    let  count = 0;
    const val1 = stmt.get();
    while (stmt.step()) {
      // const val = stmt.get();
      // const parsedData = JSON.parse(val[2]);
      // count += val[0];
      count++;
    }

    stmt.free();

    small_query_end = performance.now();
    console.log("Small query test done: " + count + " record found. Took " + (small_query_end - small_query_begin) + " ms");
    resolve();
  });
}

async function largeQuery() {
  let large_query_begin = performance.now();
  let large_query_end;

  return new Promise(function(resolve, rej) {

    let stmt = db2.prepare('SELECT * FROM RAINDROPS WHERE position > 0.3 AND position <= 0.7 LIMIT 1  ');
    let  count = 0;
    while (stmt.step()) {
      // const val = stmt.get();
      // count += val[0];
      count++;
    }
    stmt.free();

    large_query_end = performance.now();
    console.log("Large query test done: " + count + " record found. Took " + (large_query_end - large_query_begin) + " ms");
    resolve();
  });
}

async function allQuery() {
  let all_query_begin = performance.now();
  let all_query_end;

  return new Promise(function(resolve, rej) {

    let stmt = db2.prepare('SELECT * FROM RAINDROPS');
    let  count = 0;
    while (stmt.step()) {
      // const val = stmt.get();
      // count += val[0];
      count++;
    }
    stmt.free();

    all_query_end = performance.now();
    console.log("All query test done: " + count + " record found. Took " + (all_query_end - all_query_begin) + " ms");
    resolve();
  });
}

// async function DeleteDropsIndividually() {
//   let bulk_delete_end;
//   let bulk_delete_start = performance.now();
//   return new Promise(function(resolve, reject) {
//     db2.transaction((tx) => {
//       let deleted = 0;
//       for (var i = 1; i <= drops.length; ++i) {
//         let sql_statement = 'DELETE FROM RAINDROPS WHERE id=' + i;
//         tx.executeSql(sql_statement, [], (tx, results) => {
//           ++deleted;
//           if (deleted == drops.length) {
//             bulk_delete_end = performance.now();
//             console.log("Finished deleting drops: " + drops.length + " took: " +  (bulk_delete_end - bulk_delete_start) + " ms");
//             resolve();
//           }
//         });
//       }
//    });
  
//    });

   
// }

async function DeleteDrops() {
  let bulk_delete_end;
  let bulk_delete_start = performance.now();


  

  return new Promise(function(resolve, reject) {

    db2.exec('BEGIN TRANSACTION');

    try {
      let sql_statement = 'DELETE FROM RAINDROPS WHERE id >= 1';

      let stmt = db2.prepare(sql_statement);

      stmt.step();
      stmt.free();
    }
    catch(err) {
      reject(err);
    }

    db2.exec('COMMIT');

    bulk_delete_end = performance.now();
    console.log("Finished deleting drops: " + drops.length + " took: " +  (bulk_delete_end - bulk_delete_start) + " ms");
    resolve();
  });
}


function DropTable() {
  console.log("Dropping Rain Drops");

  db2.exec('DROP TABLE RAINDROPS');
}

 export async function RunTest(db, count) {
    db2 = db;

  await new Promise(resolve => setTimeout(resolve, 100)); // Leave some breath to GC.

   PrepareRainDrops(count);

   await BulkStore();
   
   //await new Promise(resolve => setTimeout(resolve, 1000));
   await smallQuery();
   
   await largeQuery();

   await smallQuery();

   await allQuery();
   
   // DropTable();
   await DeleteDrops();
 }
