---
title: "Building a Tracking Pixel"
pubDate: "2026-02-06"
description: "Implementing a tracking pixel from scratch using AWS API Gateway, Lambda, Firehose, and S3."
draft: true
tags:
  - AWS
  - Software Engineering
---

Ar my previous job, we would rank users every year and send them a badge they could show off on their website. Similar to how restaurants falunt Yelp stickets. Teh badge included a tracking pixel.

Tracking pixels have a simple job: make a request unload and return a one by one transparent gift. They're interesting because they have to support a large load and Any mistake can affect Thousands of not millions of rows.

I decided to implement a basic tracking pixel because I had experience adding features to the system, but I had never set it up from scratch. I took a simplified approach because It's meant to be educational and not production ready but it's based on the architecture We used a BuildZoom:

Production Architecture:
API Gateway → Kinesis Data Streams → Lambda -> Snowflake

Reproduction architecture
API Gateway → Lambda → Firehose -> S3

## ingest
You don't want to overwhelm your app server with analytics calls. At the end of the day, analytics our secondary to use our interactions. Instead of using rails, all request would go into an API gateway, integrated with an AWS Lander. This is an easy task if you're already using AWS.

The first deviation in architecture happens at the lamb level. My project is not expecting a lot of traffic. At most there will be deployed in this blog or get simulated data for test testing. Add in kinesis felt like over engineering. 

However, it's worth noting that it was a great set up. You could control ingest throguh `BatchSize` and `MaximumBatchingWindowInSeconds`. That translates to send me events every x minutes or y numbner of events. Whichever comes first. It was incredibly reliable as well. The set-and-forget forget kind of system.

Instead, I used firehouse. It acts as a buffer so I'm not making a ton of request to S3. You'll notice that Firehose goes in front of the lambda and Kinesis is behind. That's because fire hose does nothing to control the number of land invocations--it's just reducing the amount of calls to s3.

One critical aspect is defining how this data will be stored in the S3. The idea is that it should be easy to query the Athena or ingest it into some other system. Here is what I landed on:

s3://tracking-pixel-events-9162/events/year=2026/month=02/day=10/hour=21/tracking-pixel-events-1-2026-02-10-21-21-44-c41135c9-daee-4bda-a974-08f9bec315a9.gz

That's great, but how do you demo it? 

I have Claude to find for this idea.



