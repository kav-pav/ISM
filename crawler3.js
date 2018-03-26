const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const urls = require('./76-100.json');

function urlData(link, numberOfSubpages){
    this.url = link;
    this.numberOfSubpages = numberOfSubpages;
}
let urlApi = 'http://www.wykop.pl';


function titleOfArticles(urlApi){
    let dataLinks = [];
        rp({url: urlApi, json: true}).then(function(obj){
            var $ = cheerio.load(obj);
            var headers = $("li.link.iC > div.article.clearfix.preview.dC > div.lcontrast.m-reset-margin > h2 > a");
            for( let i = 0; i < headers.length; i++ ){
                var urlArticle = headers[i].attribs.href;
                var urlDatax = new urlData(urlArticle, "0");
                dataLinks.push(urlDatax);
            }
        return saveToJsonExternalFile(dataLinks);
        });
}

function numberOfSubpages(url, array){
    rp({url: url, json: true}).then(function(obj){
        var $ = cheerio.load(obj);
        var url = $("meta[property='og:url']").attr("content");
        var numberOfSubpages = $('div.wblock.rbl-block.pager > p > a').eq(-2).attr("href");
        if(numberOfSubpages !== undefined){
            numberOfSubpages = numberOfSubpages.slice(-5);
            numberOfSubpages = numberOfSubpages.substring(numberOfSubpages.indexOf("/")+1);
            numberOfSubpages = numberOfSubpages.slice(0,-1);
            var urlDatax = new urlData(url, numberOfSubpages);
            array.push(urlDatax);
        }
        else{
            var urlDatax = new urlData(url, 0);
            array.push(urlDatax);
        }
        return saveToJsonExternalFile(array);

    })
}

function allNumbersOfSubpages(){
    var dataLinks = [];
    for( let i = 0; i <= urls.length - 1; i ++ ){
        console.log(numberOfSubpages(urls[i].url, dataLinks));
        urls[i].numberOfSubpages = numberOfSubpages(urls[i].url, dataLinks);
    }
    return saveToJsonExternalFile(urls);
}

// function removeDuplicates(myArr, prop) {
//     return myArr.filter((obj, pos, arr) => {
//         return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
//     });
// }



function saveToJsonExternalFile(obj) {
    fs.writeFile("./76-100.json", JSON.stringify(obj, null, 4), (err)=>{
        if(err){
            console.error(err);
            return;
        }
        console.log("file has beed created")
    })
}


titleOfArticles(urlApi);
allNumbersOfSubpages();

