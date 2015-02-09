describe('Tweet Handling', function () {
	var searchTerm = 'comprised of'
	it('should block tweets without "comprised of"', function () {
		var tweet = 'The whole is comprised entirely of the parts';
		var result = (tweet.toLowerCase().indexOf(searchTerm) > -1)
		expect(result).toBe(false);
	});

	it('should accept tweets with "comprised of"', function () {		
		var tweet = 'The whole is comprised of the parts';		
		var result = (tweet.toLowerCase().indexOf(searchTerm) > -1)
		expect(result).toBe(true);
	});
});