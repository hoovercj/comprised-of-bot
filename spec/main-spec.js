var utils = require('../libs/utils.js');

var username = 'test';
var usernameLength = username.length + 1; // length=5
var longText = ' "Comprised of" is poor grammar. Consider using "composed of" instead - ';
var longTextLength = longText.length; // length=72
var shortText = ' "Comprised of" is poor grammar - ';
var shortTextLength = shortText.length; // length=34
var shortUrl = 'http://localhost';
var shortUrlLength = shortUrl.length; // length=16
var longUrl = 'http://en.wikipedia.org/wiki/User:Giraffedata/comprised_of';
var longUrlLength = longUrl.length; // length= 58
var maxUrlLength = 23 // length=23 -- Max URL Length
var hasImg = true;
var hasImgLength = 23; // Photo Length
var noImg = false;
var noImgLength = 0;
var emptyString = '';


describe('checkTweetForTerm', function () {
	var searchTerm = 'comprised of'
	it('should return false for tweets that are retweets, true otherwise', function () {
		var tweet = { text: 'This tweet is testing retweets with comprised of', retweeted_status: false, entities: { urls: [] } }; 
		
		var result = utils.checkTweetForTerm(tweet, searchTerm);
		expect(result).toBe(true);
		
		tweet.retweeted_status = true;		
		result = utils.checkTweetForTerm(tweet, searchTerm);
		expect(result).toBe(false);
	});

	it('should return false for tweets with links, true otherwise', function () {		
		var tweet = { text: 'This tweet is testing links with comprised of', retweeted_status: false, entities: { urls: ['http://localhost'] } }; 
		
		var result = utils.checkTweetForTerm(tweet, searchTerm);
		expect(result).toBe(false);
		
		tweet.entities.urls = [];
		result = utils.checkTweetForTerm(tweet, searchTerm);
		expect(result).toBe(true);
	});

	it('should return false for tweets without "comprised of", true otherwise', function () {
		var tweet = { text: 'This tweet is comprised of success', retweeted_status: false, entities: { urls: [] } }; 
		
		var result = utils.checkTweetForTerm(tweet, searchTerm);
		expect(result).toBe(true);

		tweet.text = 'This tweet doesnt have the search term and should fail';
		var result = utils.checkTweetForTerm(tweet, searchTerm);
		expect(result).toBe(false);

		tweet.text = 'The parts comprise the whole of failure';
		var result = utils.checkTweetForTerm(tweet, searchTerm);
		expect(result).toBe(false);
	});
});

describe('getTweetLength', function () {
	it('should count long urls at 23 characters', function () {
		var result = utils.getTweetLength(emptyString, emptyString, longUrl, noImg);
		expect(result).toBe(maxUrlLength);
	});

	it('should count short urls as their actual length', function () {
		var result = utils.getTweetLength(emptyString, emptyString, shortUrl, noImg);
		expect(result).toBe(shortUrlLength);
	});

	it('should count imgs as 23', function () {
		var result = utils.getTweetLength(emptyString, emptyString, emptyString, hasImg);
		expect(result).toBe(hasImgLength);
	});

	it('should count short urls as their value', function () {
		var result = utils.getTweetLength(emptyString, emptyString, emptyString, noImg);
		expect(result).toBe(noImgLength);
	});

	it('should create this tweet to be less than 140', function() {
		var averageTweetLength = (usernameLength * 2) + longTextLength + maxUrlLength + hasImgLength;
		expect(averageTweetLength).toBeLessThan(140);		
	});
});

describe('buildReplyText', function () {
	it('should return short tweets as the combination of their parts', function () {
		var result = utils.buildReplyText(username, longText, shortText, longUrl, hasImg);
		expect(result).toBe('@' + username + longText + longUrl);
		// 72 + 5 + 23 + 23
	});

	it('should return long tweets as the sum of their shortened parts', function () {
		var result = utils.buildReplyText(username, longText + shortText, shortText, longUrl, hasImg);
		expect(result).toBe('@' + username + shortText + longUrl);
	});	
});