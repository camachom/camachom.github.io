---
title: "How much faster is an Alias A record vs a CNAME record on AWS Route 53?"
pubDate: "2026-03-03"
description: "Empirical DNS resolution times for track.vs.computer: CNAME beat Alias in my test. Why the theoretical 1-lookup advantage didn't show up."
tags:
  - DNS
  - AWS
---

I wrote a [serverless tracking pixel](/blog/tracking-pixel/) and wanted to host that project under a custom subdomain: `track.vs.computer`. So I went into Route 53 and noticed I was using a CNAME to map `track.vs.computer` to the CloudFront distribution.

AWS has "Alias A" records that behave like A records but can point to internal AWS services like CloudFront. Turns out it works either way:

```
track.vs.computer → A (Alias) → CloudFront
track.vs.computer → CNAME → CloudFront
```

However, there's a big difference in how each of these records end up getting resolved:

![DNS resolution comparison: Alias A Record vs CNAME](/dns-resolution.png)

Notice there are more steps in the CNAME path. That's because a CNAME maps a domain to another domain but a DNS resolution needs to conclude with an IP address. So a second hop is required to map the resolved domain to an IP. 

I ran tests by querying Google DNS (8.8.8.8) with `dig`:

```bash
# CNAME
echo "=== CNAME (test-cname.vs.computer) ===" && for i in $(seq 1 10); do sleep 1; dig test-cname.vs.computer A +noall +stats 2>&1 | grep "Query time"; done

# A alias
echo "=== A ALIAS (test-alias.vs.computer) ===" && for i in $(seq 1 10); do sleep 1; dig test-alias.vs.computer A +noall +stats 2>&1 | grep "Query time"; done
```

Results:

```bash
            n=50    avg     min    max    stddev
  CNAME     50      17.9ms  12ms   24ms   2.9
  A ALIAS   50      22.4ms  11ms   52ms   8.9
```

The CNAME was slightly faster on average and much more consistent. The A alias had higher variance with occasional spikes up to 52ms.

So much for "alias is faster because one lookup"—in my test the CNAME won, probably because 8.8.8.8 caches the target and Route 53's alias resolution adds its own variable latency. I'm sticking with Alias anyway: zone apex, no per-query charge, instant IP updates when CloudFront changes, and the gap was small.

