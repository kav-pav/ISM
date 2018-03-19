var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');

function urlData(link, numberOfSubpages){
    this.url = link;
    this.numberOfSubpages = numberOfSubpages;
}

var dataLinks = [];

var pageToVisit = "http://www.wykop.pl";
console.log("Visiting page" + pageToVisit);
request(pageToVisit, function(error, response, body){
    if(error){
        console.log("Something goes wrong" + error);
    }
    console.log("Status code: " + response.statusCode);
    if(response.statusCode === 200){
        var $ = cheerio.load(body);
        $("li.link.iC > div.article.clearfix.preview.dC > div.lcontrast.m-reset-margin > h2 > a").each(function(index){
            var obj = $(this).attr(href);
            console.log(index);
            var href = JSON.stringify(obj);
            href = href.substring(9);
            href = href.substring(0, href.indexOf('"'));
            var urlDatax = new urlData(href, 0);
            dataLinks.push(urlDatax);
        });
        console.log(JSON.stringify(dataLinks));
        console.log(links);
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
                    // console.log(text);
                    var url = response.request.uri.href;
                    // console.log(url);
                    var lastLinkFromSubpages = $$('div.wblock.rbl-block.pager > p > a').eq(-2).attr('href');
                    // console.log(lastLinkFromSubpages);
                    if(lastLinkFromSubpages == undefined){
                        console.log('malo komentarzy');
                        console.log(url);
                    }
                    else{
                        var lastLinkFromSubpages = JSON.stringify(lastLinkFromSubpages);
                        console.log(lastLinkFromSubpages);
                        var numberOfSubpages = lastLinkFromSubpages.slice(-3);
                        var numberOfSubpages = numberOfSubpages.substring(0,1);
                        console.log(numberOfSubpages);
                    }

                    // if($$('div.wblock.rbl-block.pager > p > a').length > 0){
                    //     var linksSubPages= [];
                    //     var numberOfSubpages = $$('div.wblock.rbl-block.pager > p > a').length - 1;
                    //     $$('div.wblock.rbl-block.pager > p > a').each(function(index){
                    //         // console.log($$(this));
                    //         var subPages = $$(this).attr('href');
                    //         // console.log(index);
                    //         var hrefSubPages = JSON.stringify(subPages);
                    //         hrefSubPages = hrefSubPages.substring(9);
                    //         hrefSubPages = hrefSubPages.substring(0, hrefSubPages.indexOf('"'));
                    //         linksSubPages.push(hrefSubPages);
                    //     })
                    //     linksSubPages.shift();
                    //     linksSubPages.pop();
                    //     // console.log(linksSubPages);
                    // }
                }
            })
        }
    }
});


