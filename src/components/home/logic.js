import * as mypouch from '../../pouch.js';

const electron = window.require('electron'); // Workaround for importing electron
const fs = electron.remote.require('fs'); // Load the File System to execute our common tasks (CRUD)
const ipcRenderer  = electron.ipcRenderer; // inter-process messages to the main process => use dialog in renderer process
const remote = electron.remote; // Load remote compnent that contains the dialog dependency
const dialog = remote.dialog; // Load the dialogs component of the OS

var md = require('markdown-it')({
    html: true,
    typographer: true,
}).use(require('markdown-it-katex'));

export function get(setname, actualize) {
    //getfile
    dialog.showOpenDialog((fileNames) => {
        if(fileNames === undefined){
            console.log("No file selected");
            return;
        }
        readfile(fileNames[0], setname, actualize);
    });
    //choose header seperation level
}

function readfile(filepath, setname, actualize) {
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        parseMD(data, setname, actualize);
    });
}

function parseMD(data, setname, actualize) {
    //to HTML
    var parsed = md.render(data);

    //split
    var div = document.createElement("div"), nodes;
    div.innerHTML = parsed;
    nodes = [].slice.call(div.children); // slice in array of all childnodes(childNodes)
    console.log(nodes);

    //cards format: {"f" : "frontside1", "b" : "<b>backside1</b>"}
    var set = {
      title: setname,
      cards: []
    };
    var active = false;
    var length = nodes.length;
    nodes.forEach(function (node, index) {
        if (active) {
            if (/^h[1-3]$/i.test(node.nodeName)) { //regex expression matching
                active = false;
            }
            else {
                set.cards[set.cards.length-1].b += node.outerHTML;
            }
        }
        if (/^h3$/i.test(node.nodeName)) {
            active = true;
            set.cards.push({"f" : node.innerHTML, "b" : ""});
        }
    });

    console.log(set);
    //add set to database
    mypouch.addset(set).then( result => {
        actualize();
    }).catch(function (err) {
        console.log(err);
    });
};
