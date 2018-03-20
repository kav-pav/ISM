var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var completeRequests = 0;

function urlData(link, numberOfSubpages){
    this.url = link;
    this.numberOfSubpages = numberOfSubpages;
}

function getMyResourceData(current){
    request(current, function(error, response, body){
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
                completeRequests++;
            }
            else{
                var lastLinkFromSubpages = JSON.stringify(lastLinkFromSubpages);
                console.log(lastLinkFromSubpages);
                var numberOfSubpages = lastLinkFromSubpages.slice(-5);
                numberOfSubpages = numberOfSubpages.substring(numberOfSubpages.indexOf("/")+1);
                numberOfSubpages = numberOfSubpages.substring(-1,numberOfSubpages.indexOf('"')-1);
                console.log(numberOfSubpages);
                dataLinks[completeRequests].numberOfSubpages = numberOfSubpages;
                console.log(dataLinks[completeRequests]);
                completeRequests++;
            }
        }
    })

}
var dataLinks = [];

var pageToVisit = "http://www.wykop.pl";
console.log("Visiting page " + pageToVisit);
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
        for(var i = 0; i < dataLinks.length-1; i++){         
            var current = dataLinks[i].url;

            getMyResourceData(current);
            console.log(completeRequests);
        }
    }
});

console.log(dataLinks);


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