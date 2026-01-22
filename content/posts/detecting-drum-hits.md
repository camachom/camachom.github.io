---
title: "Detecting drum hits"
date: 2026-01-22
---

The building blocks of drumming are rudiments much like scales are to any melodic instrument. A simple but clean single stroke roll can make you sound like a pro.

I normally practice with a metronome but you can get more sophisticated. There are apps that provide visual feedback for every hit ("am i lagging, rushing or on the beat?") so you can adjust accordingly while practicing. I decided to build my own.

**Goal: Extract hit times and amplitudes from a drum recording.**

How accurate are conventional methods? The idea is to do my own classification (is it a ghost note, accent note, etc.) without AI and see how it performs. I'll add more sophistication with v1. 

For now, the script will analyze a file. The use case requires real-time analysis but it's unnecessary at the moment. Here is the [github repo](https://github.com/camachom/drum-dynamics) and a simple skeleton:

### Preprocessing audio:
1. [load_audio](https://github.com/camachom/drum-dynamics/blob/main/dynamics.py#L25) - get samples into numpy array
2. [compute_envelope](https://github.com/camachom/drum-dynamics/blob/main/dynamics.py#L25) - smooth the signal

### Hit detection:
3. [detect_onsets](https://github.com/camachom/drum-dynamics/blob/main/dynamics.py#L79) - find where hits occur
4. [measure_hits](https://github.com/camachom/drum-dynamics/blob/main/dynamics.py#L114) - get amplitude at each hit

### Analysis:
5. [classify_dynamics](https://github.com/camachom/drum-dynamics/blob/main/dynamics.py#L155) - what type of his is it? 

---

After some trial and error, the script works well:

```sh
Classified dynamics:
  time / amplitude (normalized) / classification 
  0.464s: 0.9101 (normal)
  0.952s: 1.0000 (normal)
  1.463s: 0.8162 (normal)
  ...
```

First, let's define an `envelope`. Raw audio signals are jagged because recordings are describing a wave at a specific interval (like 44.1 kHz). It's not continuous:

![Wave plot showing raw audio signal](/files/wave.png)

The rectangles are individual samples and the blue curve is what the envelope is trying to achieve.

In order to detect a `hit`, I defined a threshold:

```python
threshold = np.mean(envelope) * 1.2
```

How did I get to `1.2`? A `hit` has to meaningfully deviate from the rest of the curve, but by how much? It's unclear and there isn't a single number that works well for all recordings. The script requires manual tuning based on the input, which limits its generalizability.

The same issue happens when classifying dynamics:
```python
def calculate_dynamic(amplitude: float, ghost_percentile: float, accent_percentile: float) -> str:
    # ghost_percentile = 20th percentile
    if amplitude <= ghost_percentile:
        return 'ghost'
    # accent_percentile = 80th percentile
    elif amplitude >= accent_percentile:
        return 'accent'
    else:
        return 'normal'
```

Those numbers are arbitrary and simply seemed to work well. 

It's a good start but far from being useful. I'm curious how AI will improve this script. 


















