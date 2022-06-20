const dbName = 'RMSDB';
const storeName = 'environment';
const version = 1;

// 打开数据库
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, version);
    request.onsuccess = function(event) {
      const db = event.target.result; // 数据库对象
      resolve(db);
    };

    request.onerror = function(event) {
      reject(event);
    };

    request.onupgradeneeded = function(event) {
      console.log('[RMS]: IndexedDB upgraded');
      const db = event.target.result; // 数据库对象
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' }); // 创建表
      }
    };
  });
}

// 添加数据
export function insertDB(db, data) {
  return new Promise((resolve, reject) => {
    let request = db
      .transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .add(data);

    request.onsuccess = function(event) {
      resolve(event);
    };

    request.onerror = function(event) {
      reject(event);
    };
  });
}

// 根据id获取数据
export function selectDB(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName]); // 事务
    const objectStore = transaction.objectStore(storeName); // 仓库对象
    const request = objectStore.get(id);

    request.onsuccess = function() {
      resolve(request.result);
    };

    request.onerror = function(event) {
      reject(event);
    };
  });
}

// 获取表所有数据
export function selectAllDB(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName]); // 事务
    const objectStore = transaction.objectStore(storeName); // 仓库对象
    const request = objectStore.getAll(); // 获取所有数据

    request.onsuccess = function(event) {
      resolve(request.result);
    };

    request.onerror = function(event) {
      reject(event);
    };
  });
}

// 根据id修改数
export function updateDB(db, data) {
  return new Promise((resolve, reject) => {
    let request = db
      .transaction([storeName], 'readwrite') // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data);

    request.onsuccess = function(event) {
      resolve(event);
    };

    request.onerror = function() {
      reject();
    };
  });
}

// 根据id删除数据
export function deleteDB(db, id) {
  return new Promise((resolve, reject) => {
    let request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id);

    request.onsuccess = function(event) {
      resolve(event);
    };

    request.onerror = function(event) {
      reject(event);
    };
  });
}

// 关闭数据库
export function closeDB(db) {
  db.close();
}
