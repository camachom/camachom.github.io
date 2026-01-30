---
title: "Retro Bug"
date: 2026-01-30
---

While working on a toy web crawler, I ran into an issue that circulated the web in the early 2010s: should URLs end with a trailing `/`?

There's a vintage (15 year old) [StackOverflow](https://stackoverflow.com/questions/5948659/when-should-i-use-a-trailing-slash-in-my-url?utm_source=chatgpt.com) thread that discusses the topic. Mainly that depending on the choice, relative paths point to different places:

```
child relative to /base/ is /base/child.
child relative to /base is (perhaps surprisingly) /child.
```

Most web servers (Apache, Nginx) follow the convention that a trailing `/` means "look for index.html in this directory". If the path is a directory and there's no trailing slash, you normally get a 301 redirect:

```sh
me@MacBookPro ~/R/camachom.github.io (master)> curl -I -L https://me.vs.computer/posts/rate-limiter-system-design
HTTP/2 301
date: Fri, 30 Jan 2026 20:32:49 GMT
server: AmazonS3
location: /posts/rate-limiter-system-design/
x-cache: Miss from cloudfront
...

HTTP/2 200
content-type: text/html
content-length: 11134
date: Fri, 30 Jan 2026 20:32:50 GMT
cache-control: public, max-age=0, s-maxage=31536000
server: AmazonS3
....
```

I did a little reading on the [Apache docs](https://httpd.apache.org/docs/current/mod/mod_dir.html) about how this works and ran into a security advisory:

```
Security Warning

Turning off the trailing slash redirect may result in an information disclosure.
Consider a situation where mod_autoindex is active (Options +Indexes) and
DirectoryIndex is set to a valid resource (say, index.html) and there's no other
special handler defined for that URL. In this case a request with a trailing
slash would show the index.html file. But a request without trailing slash would
list the directory contents.
```

This inspired me to reproduce this "retro" bug. The idea is to accidentally expose the content of a directory by omitting the trailing slash in the URL. I call it retro because this is most likely to happen when publishing a static site like a blog or a landing page. With options like GitHub Pages and AWS Amplify, I doubt people are manually starting EC2 instances and installing Apache. But I did it for the plot. Yes, I stood up an EC2 just for this.

So [here's](https://github.com/camachom/infra/blob/main/projects/redirect-security-toy/user-data.sh#L6) how I shot myself in the foot:

```sh
cat <<EOF >/etc/httpd/conf.d/demo.conf
<Directory "/var/www/html">
    Options Indexes
    AllowOverride None
    Require all granted
    DirectoryIndex index.html
    DirectorySlash Off
</Directory>
EOF
```

I turned off `DirectorySlash`. `http://54.183.206.165/demo/` works as expected:

![index.html](/files/demo.png)

And this is what you get without the slash (`http://54.183.206.165/demo):

![directory listing](/files/secret.png)

Secret exposed. There's something fun and silly about purposefully reproducing a bug that probably hasn't happened in decades. Feels like a claim to fame tbh. I'll take it. 