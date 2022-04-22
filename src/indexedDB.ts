
// module IDB_SEIs {


//     function replacer(key: string, value: object) {
//         if (typeof value === "function") {
//             return value.toString();
//         }
//         return value;
//     }

//     let getOrCreateDB = () => {

//         return new Promise<IDBDatabase>((resolve, reject) => {
//             let openDBRequest = indexedDB.open("dados", 1);
//             let i = 0;
//             openDBRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
//                 let _db: IDBDatabase = (<any>event.target).result;
//                 let store = _db.createObjectStore("store", { keyPath: "item" });
//                 console.log(i++)
//                 store.transaction.addEventListener("complete", (event) => {
//                     console.log("complete")
//                     resolve(_db);

//                 })
//             }

//             openDBRequest.onsuccess = (event) => {
//                 let _db: IDBDatabase = (<any>event.target).result;
//                 resolve(_db);
//             }
//         })
//     }

//     export let addItem = async (appCfg: AppCfg | Partial<AppCfg>) => {
//         let db = await getOrCreateDB();
//         let transaction = db.transaction(['store'], "readwrite");
//         transaction.oncomplete = function (event) {
//         };
//         transaction.onerror = function (event) {
//             console.log('Erro: ' + (<any>event.target).error);
//         };
//         let store = transaction.objectStore('store');
//         for (let key in appCfg) {
//             let valor = JSON.stringify(appCfg[key], replacer, '');
//             let request = store.put({ item: key, valor: valor });
//             request.onerror = function (event) {
//                 console.log(event);
//             }
//             request.onsuccess = function (event) {
//             }
//         }
//     }

//     export let updateItem = async (key: string, value: string) => {
//         let db = await getOrCreateDB();
//         let transaction = db.transaction(['store'], "readwrite");
//         transaction.oncomplete = function (event) {
//         };

//         transaction.onerror = function (event) {
//             console.log('Erro: ' + (<any>event.target).error);
//         };

//         let store = transaction.objectStore('store');
//         let requestItem = store.get(key);
//         requestItem.onerror = function (event) {
//             console.log('Erro: ' + (<any>event.target).error);
//         };
//         requestItem.onsuccess = function (event: any) {
//             let dbItem: DBItem = event.target.result;
//             dbItem.item = key;
//             dbItem.valor = value;
//             let requestUpdate = store.put(dbItem);

//             requestUpdate.onerror = function (event) {
//                 console.log('Erro: ' + (<any>event.target).error);
//             };

//             requestUpdate.onsuccess = function (event) {
//             };
//         };
//     }


//     export let deleteItem = async (appCfg: AppCfg | Partial<AppCfg>) => {
//         for (let key in appCfg) {
//             let db = await getOrCreateDB();
//             let transaction = db.transaction(['store'], "readwrite");
//             transaction.oncomplete = function (event) {
//             };
//             transaction.onerror = function (event) {
//                 console.log('Erro: ' + (<any>event.target).error);
//             };
//             let store = transaction.objectStore('store');
//             let request = store.delete(key);
//             request.onerror = function (event) {
//                 console.log('Erro: ' + (<any>event.target).error);
//             }
//             request.onsuccess = function (event) {
//             }
//         }
//     }

//     export let getItem = (key: string) => {
//         return new Promise<DBItem>(async (resolve, reject) => {
//             let db = await getOrCreateDB();
//             let transaction = db.transaction(['store'], "readonly");
//             let store = transaction.objectStore('store');
//             let requestItem = store.get(key);
//             requestItem.onsuccess = function (event) {
//                 resolve((<any>event).target.result);
//             }

//         })

//     }
// }