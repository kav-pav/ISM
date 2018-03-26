const uniqueHash = require("unique-hash").default;
const rp = require('request-promise');
const cheerio = require('cheerio');
const links = require('./Links/1-25-filtered.json');
const fs = require('fs');


function urlData(id, iid, duration_start, duration_end, title, author, content, url){
    this.lname = 'Wykop';
    this.id = id;
    this.iid = iid;
    this.duration_start = duration_start;
    this.duration_end = duration_end;
    this.title = title;
    this.author = author;
    this.content = content;
    this.url = url;
}
function createCommentsURL(url, url_hash){
    var finalURL = url.substring(0,33);
    finalURL = finalURL+ '/#comment-' + url_hash;
    return finalURL;
}

function createID(url,url_hash){
    var finalURL = url.substring(0,33);
    finalURL = finalURL+ '/#comment-' + url_hash;
    finalURL = uniqueHash(finalURL);
    return finalURL;
}
function commentFromArticles(urlApi, index){
    rp({url: urlApi, json: true}).then(function(obj){
        var urls_hash = [];
        var data_time_created = [];
        var array_urls = [];
        var array_id = [];
        var comments = [];
        var authors = [];
        var externalJSON = [];
        var $ = cheerio.load(obj);
        var title = $('h2').text()
        title = title.replace(/(\r\n\t|\n|\r\t)/gm,"");
        title = title.replace('\t',' ');
        title = title.trim();
        var text = $('div.text > p').map(function(){
            someText = $(this).text().replace(/(\r\n\t|\n|\r\t)/gm,"");
            someText = someText.replace('\t',' ');
            someText = someText.trim();
            return someText;
        });
        text.toArray(comments);
        var author = $('div.author.ellipsis > a.showProfileSummary > b').each(function(index){
            authors[index] = $(this).text();
        });
        var url = $('li > div.wblock.lcontrast.dC').each(function(index){
            urls_hash[index] = $(this).attr('data-id');
        })
        var dataTime = $('div.author.ellipsis > a > small > time').each(function(index){
            data_time_created[index] = $(this).attr('datetime');
            
        });

        for(let i = 0; i < text.length; i++){
            array_urls[i] = createCommentsURL(urlApi, urls_hash[i]);
            array_id[i]= createID(urlApi,urls_hash[i]);
            var idd = array_id[i] + '-1';
            urlDatax = new urlData(array_id[i],idd, data_time_created[i], data_time_created[i], title, authors[i], text[i], array_urls[i]);
            externalJSON.push(urlDatax);
        }
        console.log(externalJSON);
        saveToJsonExternalFile(externalJSON, index, title);
        // for( let i = 0; i < headers.length; i++ ){
        //     fs.readFile('./allLinks.json', function (err, data){
        //         console.log(allLinks);
        //         var urlArticle = headers[i].attribs.href;
        //         var urlDatax = new urlData(urlArticle, "0");
        //         allLinks.push(urlDatax);
        //     })
        //     fs.close();
        // }
        // return saveToJsonExternalFile(allLinks);
    });
}

function loopComments(links){
    

    for( let j=0; j < links.length-1; j++){
        for( let k=1; k <= links[j].numberOfSubpages; k++){
            var url = links[j].url + 'strona/' + k;
            console.log(url);
            commentFromArticles(url, k);
        }
    }
}


function saveToJsonExternalFile(obj, k, title) {
    fs.writeFile("./Comments/" +title +"-page-"+k+".json", JSON.stringify(obj, null, 4), (err)=>{
        if(err){
            console.error(err);
            return;
        }
        console.log("file has beed created")
    })
}

loopComments(links);