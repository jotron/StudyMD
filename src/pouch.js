import PouchDB from 'pouchdb';
var db = new PouchDB('./pouch');

export function addset(text) {
  var set = {
    title: text
  };
  db.post(set, function callback(err, result) {
    if (!err) {
      console.log('Successfully posted a set!');
    }
  });
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
    return r
}

export function deleteButtonPressed(set) {
    console.log(set);
    db.remove(set.doc).then( result => {
      console.log(result);
    }).catch(function (err) {
      console.log(err);
    });
}
