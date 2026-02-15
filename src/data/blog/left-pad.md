---
title: "'npm left-pad' Incident"
pubDate: "2026-02-06"
description: "Reproducing the famous npm left-pad incident that broke the internet."
tags:
  - JavaScript
  - npm
series:
  - Retro Bugs
---

I'm going to reproduce the famous `npm left-pad` incident. I love it when bugs have [wikipedia](https://en.wikipedia.org/wiki/Npm_left-pad_incident) pages. TLDR: a maintainer removed a library called `left-pad` from NPM breaking any project attempting to install it.

Why did this create chaos?

Popular projects like `React` and `Babel` didn't explicitly import `left-pad` but pulled it indirectly through their dependency trees. Here is a visual of my project's dependency tree:

```
me@MacBookPro ~/R/l/app> npm ls -a
app@1.0.0 /Users/me/Repos/leftpad-repro/app
└─┬ mid-lib@1.0.0
  └── tiny-pad@1.0.0
```

`mid-lib` is acting like `React` or `Babel` and `tiny-pad` is acting like `left-pad`. Instead of using `npm` as a registry, I created a directory called `packages`. For each package, I ran `npm pack` to create a tarball simulating a published package. All that `mid-lib` does is call `tiny-pad`:

```js
// packages/mid-lib/index.js
const pad = require("tiny-pad");

module.exports = function formatId(n) {
  return pad(n, 5, "0");
};

// packages/mid-lib/package.json
{
    "name": "mid-lib",
    "version": "1.0.0",
    "main": "index.js",
    "dependencies": {
      // the file I got after running `npm pack`
      "tiny-pad": "file:../tiny-pad/tiny-pad-1.0.0.tgz"
    }
}
```

Similarly, here is `tiny-pad`:

```js
module.exports = function tinyPad(str, len, ch = " ") {
    str = String(str);
    if (str.length >= len) return str;
    return ch.repeat(len - str.length) + str;
  };
```

As is, the project runs as expected:

```sh
me@MacBookPro ~/R/l/app (main)> npm install
added 2 packages, and audited 3 packages in 472ms
found 0 vulnerabilities
me@MacBookPro ~/R/l/app (main)> node index.js
00007
```

But what happens if I remove `tiny-pad-1.0.0.tgz` and run `npm install` at the top level?

```sh
me@MacBookPro ~/R/l/app (main)> rm ../packages/tiny-pad/tiny-pad-1.0.0.tgz
me@MacBookPro ~/R/l/app (main)> npm install

up to date, audited 3 packages in 496ms

found 0 vulnerabilities
me@MacBookPro ~/R/l/app (main)> node index.js
00007
```

Absolutely nothing! I admit: that was a trick question. `package.json` hasn't changed, so it aligns with `package-lock.json` and `/node_modules` so `npm` does nothing. To trigger the error, we need a fresh install:

```bash
me@MacBookPro ~/R/l/app (main)> rm -rf node_modules package-lock.json
me@MacBookPro ~/R/l/app (main)> npm install
npm warn tarball tarball data for tiny-pad@file:../tiny-pad/tiny-pad-1.0.0.tgz (null) seems to be corrupted. Trying again.
npm warn tarball tarball data for tiny-pad@file:../tiny-pad/tiny-pad-1.0.0.tgz (null) seems to be corrupted. Trying again.
npm warn tarball tarball data for tiny-pad@file:../tiny-pad/tiny-pad-1.0.0.tgz (null) seems to be corrupted. Trying again.
npm warn tarball tarball data for tiny-pad@file:../tiny-pad/tiny-pad-1.0.0.tgz (null) seems to be corrupted. Trying again.
npm error code ENOENT
npm error syscall open
npm error path /Users/me/Repos/leftpad-repro/app/node_modules/tiny-pad/tiny-pad-1.0.0.tgz
npm error errno -2
npm error enoent ENOENT: no such file or directory, open '/Users/me/Repos/leftpad-repro/app/node_modules/tiny-pad/tiny-pad-1.0.0.tgz'
npm error enoent This is related to npm not being able to find a file.
npm error enoent
npm error A complete log of this run can be found in: /Users/me/.npm/_logs/2026-02-08T22_54_18_238Z-debug-0.log
```

This is exactly what happened with the `left-pad` incident. `mid-lib` hasn't changed but a fresh install will try to pull a non-existent `tiny-pad`.

npm has made changes so that the rug can't be pulled, but it's still a great lesson. I learned a bunch reproducing this retro bug.
