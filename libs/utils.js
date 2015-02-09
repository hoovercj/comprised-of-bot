// Needed Variables
var maxUrlLength = 23;
var defaultMaxLength = 140;
var photoCharCount = 23;
var maxTweetLength = defaultMaxLength - 23;

// Takes in parameters and builds an appropriate reply
// with an acceptable length
exports.buildReplyText = function (username, baseText, shortText, url, hasImg) {
    var screenName = '@' + username;

    var untrimmedTweetLength = exports.getTweetLength(username, baseText, url, hasImg);
    if (untrimmedTweetLength <= defaultMaxLength) {
        return screenName + baseText + url;
    }

    var mediumTweetLength = exports.getTweetLength(username, shortText, url, hasImg);
    if (mediumTweetLength <= defaultMaxLength) {
        return screenName + shortText + url;
    }

    var shortTweetLength = exports.getTweetLength(username, url, hasImg);
    if (shortTweetLength <= defaultMaxLength) {
        return screenName + url;
    }

    return url;
}

exports.getTweetLength = function (username, text, url, hasImg) {
    var val = username.length + 
           (url ? Math.min(maxUrlLength, url.length) : 0) +
           (hasImg ? photoCharCount : 0) +
           text.length;
    return val;
}

// Takes a tweet and a search term and checks that the
// tweet contains the search term
exports.checkTweetForTerm = function (tweet, searchTerm) {
    if (tweet.retweeted_status || tweet.entities.urls.length > 0) {
        console.log('DONT TWEET: Received retweeted tweet or tweet with a URL');
        return false;
    } else if (tweet.text.toLowerCase().indexOf(searchTerm) == -1) {
        console.log('DONT TWEET: Tweet does NOT contain phrase ' + searchTerm);
        return false;
    }
    return true;
}