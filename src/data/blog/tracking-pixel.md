---
title: "Building a Tracking Pixel"
pubDate: "2026-02-21"
description: "Implementing a tracking pixel from scratch using AWS API Gateway, Lambda, Kinesis, and S3."
draft: false
tags:
  - AWS
  - Software Engineering
---

Tracking pixels have a simple job: return a 1x1 transparent gif. But they have to support a large load and any mistake can affect thousands if not millions of rows.

At my previous job, we would rank users every year and send them a badge they could show off on their website — similar to how restaurants flaunt Yelp stickers. The badge included a tracking pixel.

I built a serverless implementation inspired by that system deployed on AWS via Terraform to us-west-1 (I know, I know, but I used to live in California). Here's the [demo](https://64caxv0uii.execute-api.us-west-1.amazonaws.com) and the [github repo](https://github.com/camachom/infra/tree/main/projects/tracking-pixel).

![Tracking pixel architecture diagram](/tracking-pixel-arch.svg)

## API Gateway
You don't want to overwhelm your app server with analytics calls. At the end of the day, analytics are secondary to user interactions. All requests go to an API Gateway, integrated with an AWS Lambda. This is an easy task if you're already using AWS. You should add throttling (API Gateway supports rate and burst limits out of the box) to make sure it's not abused.

## Ingest
Why have a lambda here in the first place and not integrate the API Gateway with Kinesis directly? It's a place to format the data and enrich the event before it hits the stream. All mine does is parse the User-Agent, write the record to Kinesis and return the pixel. Keep this lambda lightweight since it's not benefiting from Kinesis.

## Data Stream
This is the critical piece of infra that's enabling a high throughput suitable for analytics calls. Kinesis logs all the events from ingest and retains them for 24h (configurable). The idea is that ingest and consuming are now decoupled. It also allows retries if the consumer lambda fails.

The consumer Lambda doesn't poll Kinesis itself — an [event source mapping](https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html) handles that. You configure `BatchSize` and `MaximumBatchingWindowInSeconds` to control how often the consumer is invoked. Mine is set to `batch=100` and `window=5s`, meaning: invoke the consumer every 5 seconds or when 100 records accumulate, whichever comes first.

## Consumer
This lambda is responsible for persisting data. It does two things in parallel:
1. Batches records to S3. This is the persistence layer of this project. Records are partitioned by time so they can be queried with Athena:

    `s3://tracking-pixel-events/events/year=2026/month=02/day=10/hour=21/{timestamp}.json.gz`

2. Update DynamoDB. This was Claude's idea tbh. I wanted a good way to demo this project that even non-technical users could appreciate. It suggested a DynamoDB table to populate a dashboard. The table stores recent events and a couple of counters, all with a TTL of 7 days — it's not meant for long term storage, just enough to power a live view.

The consumer handler is concise:

```javascript
export const handler = async (event) => {
  const records = event.Records.map(parseKinesisRecord);

  await Promise.all([
    writeToS3(records),
    updateDynamoDB(records)
  ]);
};
```

---

## What I'd do differently

This works well for a demo but there are a few things I'd revisit for production:

- **Dead letter queue.** If the consumer Lambda fails repeatedly, records currently just expire from Kinesis after 24h. A DLQ on the event source mapping would catch those.
- **Multi-region.** Everything lives in us-west-1. For a real tracking pixel serving global traffic, you'd want CloudFront in front of the API Gateway at minimum.
- **Schema validation.** The ingest Lambda trusts whatever comes in. Adding lightweight validation before writing to Kinesis would prevent garbage data from propagating downstream.

The core pattern — API Gateway → Lambda → Kinesis → Lambda → S3 — is solid for high-throughput event ingestion. Kinesis is the key: it decouples the fast, user-facing ingest path from the slower persistence layer, and gives you a retry buffer for free.

