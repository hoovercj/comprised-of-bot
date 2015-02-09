var utils = require('libs/utils.js'); // Local Import
var redis = require('redis');
var url = require('url');
var Twit = require('twit');
var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

var twitter_update_with_media = require('twitter_update_with_media');
var tuwm = new twitter_update_with_media({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_SECRET
});

// DB Variables
var redisURL = url.parse(process.env.REDISCLOUD_URL || 'redis://127.0.0.1:6379');
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
if (!process.env.LOCAL == true) {
    client.auth(redisURL.auth.split(":")[1]);
}
var repliedToKey = 'repliedTo';

// Twitter Variables
var replyBaseText = ' "Comprised of" is poor grammar. Consider using "composed of" instead - ';
var replyBaseTextShort = ' "Comprised of" is poor grammar - ';
var replyUrl = 'http://en.wikipedia.org/wiki/User:Giraffedata/comprised_of';
var replyImg = 'http://www.giraffedays.com/wp-content/uploads/2011/03/Grammar-Police.jpg';

var searchTerm = 'comprised of';

function replyTo(username, tweetId) {
    var statusText = utils.buildReplyText(username, replyBaseText, replyBaseTextShort, replyUrl, true);
    tuwm.postReply(statusText, replyImg, tweetId, function(err, response) {
        console.log('called post');
        if (err) {
            console.log(err);
        }
        console.log('Replied to: ' + username);
    });
}

function processTweet(tweet) {
    // Don't tweet at the same person twice
    console.log('Processing Tweet: ' + tweet.id_str + ', ' + tweet.text);
    client.sadd(repliedToKey, tweet.user.id_str, function(err, reply) {
        if (err) {
            console.log(err);
        } else if (reply == 1 || tweet.user.screen_name == process.env.TWITTER_DEBUG_USER) {
            replyTo(tweet.user.screen_name, tweet.id_str);
        } else {
            console.log('DONT TWEET: ' + tweet.user.screen_name + ' has already been educated')
        }
    });
}

//  filter the twitter public stream by the phrase 'comprised of'.
var stream = T.stream('statuses/filter', { track: searchTerm });

// Exclude tweets that are retweets or contain links.
// Why links? Because posts with links are much more likely
// to be linking to articles about this topic, or quoting
// the topic. This reduces the chance of tweeting at people
// that are already aware of the topic.
stream.on('tweet', function (tweet) {
    if (utils.checkTweetForTerm(tweet, searchTerm)) {
        processTweet(tweet);
    }
});

stream.on('limit', function (limitMessage) {
    console.log(limitMessage);
});

stream.on('disconnect', function (disconnectMessage) {
    console.log(disconnectMessage);
});

stream.on('reconnect', function (request, response, connectInterval) {
    console.log('Reconnecting in ' + connectInterval + 'ms...');
})

stream.on('error', function(error) {
    console.log(error);
});