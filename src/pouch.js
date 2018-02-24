import PouchDB from 'pouchdb';
var db = new PouchDB('./pouch');

export async function addset(set) {
    return await db.post(set);
}
export async function updateset(doc) {
    return await db.put(doc);
}

export async function showsets() {
    try {
        var r = await db.allDocs({
            include_docs: true,
            descending: true
        });
    } catch (err){
        console.log(err);
    }
    var rr = r.rows.map(function(row){
        return {
            title: row.doc.title,
            id: row.id
        };
    });
    return rr
}

export async function deleteid(id) {
  return await db.get(id).then(function(doc) {
      return db.remove(doc);
  });
}

export async function getset(id) {
    return db.get(id);
}
