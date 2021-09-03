// run with command line argument of the tweet to be sent e.g.
// > node send_text_tweet.js "THIS IS THE BODY OF THE TWEET"

console.log('intiialising bot');

var Twit = require('twit');
var config = require('./config');
var tweettext = process.argv.slice(2);

var T = new Twit(config);
var tweet = {
  status: tweettext
}

T.post('statuses/update', tweet , function(err, data, response) {
  console.log(data)
})