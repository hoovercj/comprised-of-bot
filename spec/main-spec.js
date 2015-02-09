var utils = require('../utils.js');

describe('Tweet Handling', function () {
	var searchTerm = 'comprised of'
	it('should block tweets without "comprised of"', function () {
		var tweet = { text: 'This tweet is comprised entirely of fail', retweeted_status: false, entities: { urls: [] } }; 
		var result = utils.checkTweetForTerm(tweet, searchTerm);
		expect(result).toBe(false);
	});

	it('should accept tweets with "comprised of"', function () {		
		var tweet = { text: 'This tweet is comprised of pass', retweeted_status: false, entities: { urls: [] } }; 
		var result = utils.checkTweetForTerm(tweet, searchTerm);
		expect(result).toBe(true);
	});

	// TODO: Add tests for the length of the the returned status
});