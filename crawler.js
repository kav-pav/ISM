var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');


var pageToVisit = "http://www.wykop.pl";
console.log("Visiting page" + pageToVisit);
request(pageToVisit, function(error, response, body){
    if(error){
        console.log("Something goes wrong" + error);
    }
    console.log("Status code: " + response.statusCode);
    if(response.statusCode === 200){
        var $ = cheerio.load(body);
        var links = [];
        $("li.link.iC > div.article.clearfix.preview.dC > div.lcontrast.m-reset-margin > h2 > a").each(function(index){
            var obj = $(this).attr(href);
            var href = JSON.stringify(obj);
            href = href.substring(9);
            href = href.substring(0, href.indexOf('"'));
            links.push(href);  
        });
        for(var i = 0; i < links.length-1; i++){
            request(links[i], function(error, response, body){
                if(error){
                    console.log('Something goes wrong' + error);
                }
                console.log("Status code: " + response.statusCode);
                console.log("----------------------------------")
                if(response.statusCode === 200){
                    var $$ = cheerio.load(body);
                    var text = $$('div.text > p').text();
                    console.log(text);
                }
            })
        }
    }
});


