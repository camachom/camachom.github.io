---
title: "System design: rate limiter"
date: 2026-01-12
---

Like a lot of system design exercises, most engineers don’t actually build rate limiters at work. Most companies rely on off-the-shelf solutions from products they’re already using—Cloudflare, NGINX, etc. Still, rate limiting is a foundational concept for web developers and a classic system design problem.

The [ByteByteGo write-up](https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter) is helpful, but I don't retain much by just reading. Instead, after getting comfortable with the high-level ideas, I used Claude to build a toy rate limiter.

It was surprisingly satisfying to run `curl` locally and watch the headers change as requests were consumed:

```sh
me@MacBookPro ~> curl -i localhost:3000/ping
...
x-ratelimit-limit: 10
x-ratelimit-remaining: 9
x-ratelimit-reset: 1768250604
...

{"message":"pong","timestamp":"2026-01-12T20:43:18Z"}⏎
me@MacBookPro ~> curl -i localhost:3000/ping
...
x-ratelimit-limit: 10
x-ratelimit-remaining: 8
x-ratelimit-reset: 1768250610
...

{"message":"pong","timestamp":"2026-01-12T20:43:20Z"}⏎
```

And finally:

```sh
me@MacBookPro ~> curl -i localhost:3000/ping
...
x-ratelimit-limit: 10
x-ratelimit-remaining: 0
x-ratelimit-reset: 1768250721
retry-after: 55
...

{"error":"Rate limit exceeded"}⏎
```

I implemented the rate limiter as a Rails middleware using an in-memory [token bucket](https://en.wikipedia.org/wiki/Token_bucket). At its core, it’s just a hash with some bookkeeping:

```ruby
module RateLimiter
  module Stores
    class Memory < Base
      def initialize
        @data = {}
        @mutex = Mutex.new
      end

      def get(key)
        @mutex.synchronize do
          entry = @data[key]
          return nil unless entry

          if entry[:expires_at] && Time.now > entry[:expires_at]
            @data.delete(key)
            return nil
          end

          entry[:value]
        end
      end
    ...
```

The mutex caught me off guard. Multithreading is easy to overlook in an exercise like this.

```sh
me@MacBookPro ~/R/rate-limiter-tester> rails server -p 3000
=> Booting Puma
=> Rails 8.1.1 application starting in development
=> Run `bin/rails server --help` for more startup options
Puma starting in single mode...
* Puma version: 7.1.0 ("Neon Witch")
* Ruby version: ruby 4.0.0 (2025-12-25 revision 553f1675f3) +PRISM [arm64-darwin25]
*  Min threads: 3
*  Max threads: 3
*  Environment: development
*          PID: 60042
* Listening on http://127.0.0.1:3000
* Listening on http://[::1]:3000
Use Ctrl-C to stop
```

Even in development, Puma is running multiple threads. Without a `Mutex`, it’s easy to introduce subtle race conditions and inconsistent token counts under load.

None of this is groundbreaking. You *can* absorb it by carefully reading an article. But implementing a toy version forces the details to click. When it’s reasonable, I try to build small, working versions of the systems I’m learning—it’s consistently the fastest way I’ve found to make the details stick.

