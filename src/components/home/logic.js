import * as mypouch from '../../pouch.js';
const electron = window.require('electron'); // Workaround for importing electron
const fs = electron.remote.require('fs'); // Load the File System to execute our common tasks (CRUD)
const ipcRenderer  = electron.ipcRenderer; // inter-process messages to the main process => use dialog in renderer process
const remote = electron.remote; // Load remote compnent that contains the dialog dependency
const remote_dialog = remote.dialog; // Load the dialogs component of the OS

let setpath;

var md = require('markdown-it')({
    html: true,
    typographer: true,
}).use(require('markdown-it-katex'));

/*Function to actualize document*/
export function refresh(doc_id, actualize) {
    mypouch.getset(doc_id).then( doc => {
        console.log(doc);
        fs.readFile(doc.setpath, 'utf-8', (err, new_data) => {
            if(err){
                alert("An error ocurred reading the file :" + err.message);
                return;
            }
            var new_cards = parseMD(new_data, doc.setlevel);
            doc.cards = new_cards;
            mypouch.updateset(doc).then( result => {
                actualize();
            }).catch(function (err) {
                console.log(err);
            });
        });
    }).catch(function(err) {
        console.log(err);
    });
    return;
}

/* Function to create new document*/
export function get() {
    //getfile
    return remote_dialog.showOpenDialog({ filters: [
        { name: 'markdown', extensions: ['md', 'txt'] }
    ]});
}
export function make_new(filepath, setname, headerlevel, actualize) {
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        // create
        var new_doc = {
          title: setname,
          setpath: filepath,
          setlevel: headerlevel,
          cards: parseMD(data, headerlevel)
        };
        mypouch.addset(new_doc).then( result => {
            actualize();
        }).catch(function (err) {
            console.log(err);
        });
    });
}

/* Function to do all the work*/
function parseMD(data, headerlevel) {
    //to HTML
    var parsed = md.render(data);

    //split
    var div = document.createElement("div"), nodes;
    div.innerHTML = parsed;
    nodes = [].slice.call(div.children); // slice in array of all childnodes(childNodes)
    //console.log(nodes);

    //cards format: {"f" : "frontside1", "b" : "<b>backside1</b>"}
    var cards = [];

    var active = false;
    var length = nodes.length;
    var regex1 = new RegExp('^h[1-' + headerlevel.toString() + ']$', 'i'),
        regex2 = new RegExp('^h' + headerlevel.toString() + '$', 'i');
    nodes.forEach(function (node, index) {
        if (active) {
            if (regex1.test(node.nodeName)) { //regex expression matching
                active = false;
            }
            else {
                cards[cards.length-1].b += node.outerHTML;
            }
        }
        if (regex2.test(node.nodeName)) {
            active = true;
            cards.push({"f" : node.innerHTML, "b" : ""});
        }
    });

    console.log(cards);
    //add set to database
    if (cards.length === 0) {
        console.log("no cards");
        return;
    }
    return cards;
};
