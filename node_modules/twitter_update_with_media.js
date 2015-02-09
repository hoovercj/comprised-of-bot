// adapted from https://gist.github.com/adaline/7363853 which read the image from a file
// modified to support posting to twitter update_with_media - with image from s3 rather than a
// local file.
 
(function() {
  var fs, path, request, twitter_update_with_media;
 
  fs = require('fs');
 
  path = require('path');
 
  request = require('request');
 
 
  twitter_update_with_media = (function() {
    function twitter_update_with_media(auth_settings) {
      this.auth_settings = auth_settings;
      this.api_url = 'https://api.twitter.com/1.1/statuses/update_with_media.json';
    }
 
    twitter_update_with_media.prototype.post = function(status, imageUrl, callback) {
      var form, r;
      r = request.post(this.api_url, {
        oauth: this.auth_settings
      }, callback);
      form = r.form();
      form.append('status', status);
      return form.append('media[]', request(imageUrl));
    };
    
    twitter_update_with_media.prototype.postReply = function(status, imageUrl, tweetId, callback) {
      var form, r;
      r = request.post(this.api_url, {
        oauth: this.auth_settings
      }, callback);
      form = r.form();
      form.append('status', status);
      if (tweetId) {
        form.append('in_reply_to_status_id', tweetId);
      }
      return form.append('media[]', request(imageUrl));
    }
    return twitter_update_with_media;
 
  })();
 
  module.exports = twitter_update_with_media;
 
}).call(this);