// run with command line argument of the image result to be tweeted e.g.
// > node tweet_imageof.js "yourcriteria"

console.log('initialising bot');
const numOfPhotos = 20;

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);
var imagecriteria = process.argv.slice(2);
// USE THIS! 
var tweetbody = "#1 image result for query '" + imagecriteria + "'";
var imgResults;


var fs = require('fs'),
    request = require('request');

var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: true,
    },
});




async function getResults(){
    return await google.scrape(imagecriteria[0], numOfPhotos);
}

//waits for results before downloading
(async function(){
    console.log('waiting for results');
    imgResults = await getResults();
    useResults();
})();

//scans results for 
function useResults(){
    var pngfound = false;
    var searchcount = 0;
    var currentUrl;
    while(!pngfound && searchcount < numOfPhotos){
        currentUrl = imgResults[searchcount].url;
        if(currentUrl.includes('.jpg')){
            pngfound = true;
        }else{
            searchcount++;
            console.log("invalid - ", currentUrl);
        }
    }

    if(pngfound){
        download(currentUrl, 'result.jpg', function(){
            console.log('VALID! - ', currentUrl);
            console.log('saved to result.jpg');
        });
    }else{
        throw new Error('ERROR: cannot find suitable image from first ' + numOfPhotos + ' results');
    }
}


//download image functions --------
var download = function(url, filename, callback){
  request.head(url, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
//-----------------------------------


