---
title: "Installing OpenBSD 7.6 on a Raspberry Pi 4?"
date: 2025-04-08
---

I’ll save you some time: just read the official documentation. I did it the hard way—starting with ChatGPT for instructions, and then diving into blog posts for solutions when things went wrong.

When I plugged the SD card with `miniroot76.img` into my Raspberry Pi, I’d briefly see the `OpenBSD BOOTAA64 boot>` prompt, only to have the screen go blank seconds later.

I attempted:

- Modifying `config.txt` in the boot partition to force safe HDMI configuration
- Using an older version of OpenBSD. The oldest I could find was 7.0
- Changing the boot order so that I could use a USB stick instead of an SD card
- Using the full installation image (`install76.img `) instead of `miniroot76.img`

Nothing worked. I knew using the serial console was a possibility, but I did not have the cable. The installation instructions I found online kept getting more unhinged. When I landed on an [18 step guide](https://www.reddit.com/r/raspberry_pi/comments/1jtpmgh/installing_openbsd_76_on_raspberry_4b_rpi4_guide/) requiring two USB sticks and an SD card, I knew it was time to throw in the towel. Luckily I had a NUC to use instead.

In case you still want to use a Pi, the [official installation instructions](https://ftp.openbsd.org/pub/OpenBSD/7.6/arm64/INSTALL.arm64) has the answer. Under `Install on Raspberry Pi:`:

> ...note that once the kernel has started running, by default you
> will only see output on the serial console. To switch to displaying on
> the monitor instead, watch for the OpenBSD BOOTAA64 "boot>" prompt,
> and type "set tty fb0".

Problem solved.
