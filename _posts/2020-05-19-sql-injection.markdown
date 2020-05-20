---
layout: post
title: "SQL Injection in Node/Mongo"
date: 2020-05-19 19:27:56 -0700
categories: jekyll update
---

I’ve been exploring the basics of authentication as a side project. As soon as I had a working prototype, my first thought was ‘How can I exploit this?’. I’m far from a security expert so I surely made some mistakes. The best place to start is with one of the most simple attacks: [SQL Injection](https://en.wikipedia.org/wiki/SQL_injection). I found one practical example using Node/Mongo in this [article](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).

It's a bit dated, but the idea is to pass JSON instead of a string in the payload for the username property.

```javascript
{
    "username": {"$gt": ""},
    "password": "not important"
}
```

You can make the key a Mongo operator like `$gt`. `$gt` or `Greater than` will compare `""` (empty string) with usernames in your database lexicographically. This will likely evaluate to true on its first comparison and return an arbitrary user.

```javascript
app.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // user could be anyone!
  } catch (error) {
    // handle error
  }
});
```

One of the solutions that come out of the conversation around that article points to a [package](https://github.com/vkarpov15/mongo-sanitize#readme) that recursively looks for keys in the input that start with `$` and deletes them. No more sneaky Mongo operators. However, validation seems like a simpler solution to me.

Here is an example using the Joi library to restrict the type of `username` to `string`:

```javascript
const authSchema = Joi.object({
  username: Joi.string().min(3).alphanum().max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const { error, value } = authSchema.validate(req.body);
```

Submitting JSON as the value for `username` will now yield this validation error:

```javascript
"ValidationError: "username" must be a string"
```

This is an obvious and well known attack with a simple solution. My challenge is to now create a [CodeQL](https://securitylab.github.com/tools/codeql) query that can automatically detect these vulnerabilities.
