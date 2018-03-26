const filterJSON = require('./76-100.json');
const fs = require('fs');


function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
function saveToJSON(obj){
    fs.writeFile("./filtered.json", JSON.stringify(obj, null, 4), (err)=>{
        if(err){
            console.error(err);
            return;
        }
        console.log("file has beed created")
    })
}

var array = removeDuplicates(filterJSON, "url");
saveToJSON(array);