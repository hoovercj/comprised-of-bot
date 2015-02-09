# 'Comprised Of' Bot

A simple twitter bot that monitors the twitter streaming API for users tweeting the phrase 'comprised of'. It then replies with a helpful suggestion to used 'composed of' instead and links to the great essay on the topic by profilic Wikipedia Editor GiraffeData.

You can read the essay [here](http://en.wikipedia.org/wiki/User:Giraffedata/comprised_of) as well as a [great profile](https://medium.com/backchannel/meet-the-ultimate-wikignome-10508842caad) written about him and posted on Medium.

The bot is written in node.js with a redis brain makes sure that users aren't 'educated' twice by receiving more than one reply from the account. The project is hosted on heroku and was built entirely in the Cloud9 IDE.

http://twitter.com/ComposedOf

     ,-----.,--.                  ,--. ,---.   ,--.,------.  ,------.
    '  .--./|  | ,---. ,--.,--. ,-|  || o   \  |  ||  .-.  \ |  .---'
    |  |    |  || .-. ||  ||  |' .-. |`..'  |  |  ||  |  \  :|  `--, 
    '  '--'\|  |' '-' ''  ''  '\ `-' | .'  /   |  ||  '--'  /|  `---.
     `-----'`--' `---'  `----'  `---'  `--'    `--'`-------' `------'
    ----------------------------------------------------------------- 

## Uploading Media
I used the [Twit](https://github.com/ttezel/twit) module for accessing the streaming API, but used these [two](https://gist.github.com/travischoma/9279105) [gists](https://gist.github.com/adaline/7363853) to post my tweets as the Twit doesn't support uploading media.

## Replying to a tweet
To reply to a tweet you need to add the `tweet.id_str` to the update request, NOT `tweet.id`. More details [here](https://dev.twitter.com/overview/api/twitter-ids-json-and-snowflake).

## Running on Heroku
Normally heroku node projects use a `Procfile` that defines a `web` process to run. `web` processes are a special type in heroku and on free tiers that only run a single 1X Dyno, these processes sleep after a short period of inactivity and take a while to start back up again. They are intended for running a web server using something like express.

For the twitter bot, we don't need to accept any incoming web requests. Instead we want a background worker request. Create a `Procfile` as shown below with the command you would use to start the application assigned to the name `worker` or anything you want(`web` is the only special keyword), deploy the app, and then go to your apps dashboard in heroku. You'll see an entry for `worker` under Dynos. Click edit and change the quantity of 1X Dynos to 1 and save. Now every time you deploy to heroku, a process will spin up and execute your `worker` task, letting your bot run infinitely.

## Environment Variables
The file `sample.env` contains a list of environment variables used by the project. To utilize these locally, create a file called `.env` in the root of your directory and run your scripts using [foreman](https://www.npmjs.com/package/foreman). To run the `worker` defined in the `Procfile`, simply execute `$ nf worker`. To add the variables to heroku, use the heroku dashboard or the command `$ heroku config:set VARIABLE_NAME=VALUE VARIABLE_NAME2=VALUE`. Find more information about using foreman, environment variables, and even multiple configurations, [here](https://devcenter.heroku.com/articles/config-vars).

### sample.env:

```
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=
TWITTER_DEBUG_USER=
REDISCLOUD_URL=
LOCAL=true
```

The twitter keys can be obtained from the [twitter developer page](http://apps.twitter.com). 
The script will only 'educate' a particular user once. The `TWITTER_DEBUG_USER` variable allows a particular username to be whitelisted and replied to repeatedly for debugging.

Setting `LOCAL=true` signifies that you are running the script completely locally and using a local instance of redis. In this case it will skip the authorization step. Setting it to false or leaving it blank will attempt to connect to the url supplied to the heroku config:REDISCLOUD_URL (set automatically on heroku by the redisCloud add-on)

Conversely, if you want to run the script locally but connect to the redisCloud instance, copy the `REDISCLOUD_URL` value from heroku to your `.env` file. 
