---
title: "Adding a dependency is buying blind"
pubDate: "2026-02-05"
description: "A short reflection on how we add dependencies without deep code review."
tags:
  - Software Engineering
---

Surprisingly, startups sometimes get acquired without the buyer scrutinizing code quality. I find it terrifying, but there are good reasons why this happens. Code quality is hard to measure and there's no industry standard. The buyer might also be interested in data, talent or IP and not necessarily in the codebase.

The irony is that we do this as engineers all the time. Adding a dependency is copy-pasting code into your project. I normally look at how active the project is, stars on GitHub, known vulnerabilities, and whether it solves the problem at hand. However, it's incredibly rare for engineers to deep dive into library internals before adding a dependency.

Basically buying blind.
