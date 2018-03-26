const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const allLinks = require('./76-100.json');

function urlData(link, numberOfSubpages){
    this.url = link;
    this.numberOfSubpages = numberOfSubpages;
}

var urlApi = "http://www.wykop.pl";

function titleOfArticles(urlApi){
        rp({url: urlApi, json: true}).then(function(obj){
            var $ = cheerio.load(obj);
            var headers = $("li.link.iC > div.article.clearfix.preview.dC > div.lcontrast.m-reset-margin > h2 > a");
            for( let i = 0; i < headers.length; i++ ){
                fs.readFile('./allLinks.json', function (err, data){
                    console.log(allLinks);
                    var urlArticle = headers[i].attribs.href;
                    var urlDatax = new urlData(urlArticle, "0");
                    allLinks.push(urlDatax);
                })
            }
            return saveToJsonExternalFile(allLinks);
        });
}


function saveToJsonExternalFile(obj) {
    fs.writeFile("./76-100.json", JSON.stringify(obj, null, 4), (err)=>{
        if(err){
            console.error(err);
            return;
        }
        console.log("file has beed created")
    })
}

function getAllArticlesURL(){
    for(let i = 76; i <= 100; i++){
        var url = urlApi + '/strona/' + i;
        console.log(url);
        titleOfArticles(url);
    }
}

getAllArticlesURL();