---
title: "From Github Pages To EC2"
date: 2023-09-02
tags: ["programming"]
series: "Coming back online"
summary: "Visiting my blog now makes me a lot happier even though I'm rendering the exact same thing."
---

I underestimated how much Github Pages does for you.

For the migration, I had to get a lot more comfortable with security groups, ACLs, Docker debugging, nginx directives and asking strangers online for help. The [Remark42](https://remark42.com) (comment engine I added) maintainer was so helpful I become a project sponsor for the first time.

The end result is a much more brittle infrastructure with gaping security holes (please don't hack my humble, free-tier instance) and no elasticity. I did my best to follow best practices, but I'm not a devops engineer, so there's plenty to learn. It was a complicated task that consumed a good portion of my free time for the last two week. For most people who simply want to post content on a blog, this is an irrational decision.

It was well worth the time. Visiting my blog now makes me a lot happier even though I'm rendering the exact same thing. I feel a lot more comfortable looking at a `nginx.conf` file or reading the DNS records for a domain. I discovered new concepts to investigate like [ephemeral ports](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html#nacl-ephemeral-ports).

I had my dosage of networking for the time being. Think I'm going to look into something different next week.
