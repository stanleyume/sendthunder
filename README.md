## Send Thunder

Anymously send thunder to anyone via Twitter.

### What?
Just for laughs, it lets you send different flavors of thunder to anyone, anonymously. After submiting the form on [the website](http://sendthunder.herokuapp.com), a tweet is posted via [@sendthunder](https://teitter.com/sendthunder), mentioning the recipient and telling them what you have sent them.

Unfortunately for them, "Back to sender" doesn't work.

### Why?
Why not?

### How?
Even though I have access to the Twitter API, I thought it was too risky.

The tweets are posted automatically by an applet on [IFTTT](https://ifttt.com). Unfortunately, they have a limit of 100 tweets per day for Twitter applets.

More than 100 requests came in very quickly in the morning of the first day, so I had to limit things to 7 requests per hour as you'll find in *server/index.js*

### Status?
Twitter doesn't like unsolicited mentions via automated sources (someone gracefully pointed me to the TOS), and after a while, they start to filter your tweets from the timelines of others, or even worse, suspend your account (the inevitable demise).
