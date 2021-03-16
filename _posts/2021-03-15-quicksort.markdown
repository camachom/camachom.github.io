---
layout: post
title: "Copy pasting quicksort"
date: 2021-03-15
---

I googled `hoare partition quicksort javascript` and tested the implementation of the top three results. To validate correctness, I used LeetCode's [Sorting](https://leetcode.com/problems/sort-an-array/) test suite.

![Quicksort Google](/assets/images/quicksort.png)

### In defense of the authors

I purposely ignored any context the authors might've disclosed in their text. The idea was to get the code to run as quickly as possible with the least amount of modifications. I was trying to mimic a copy-paste frenzied developer who has exhausted their patience and whose tunnel vision has limited their typing to `Command-C`/`Command-V`. Will this Google binge pay off?

### Results

The [first](https://itnext.io/a-sort-of-quick-guide-to-quicksort-and-hoares-partitioning-scheme-in-javascript-7792112c6d1?gi=98f309ebdbdc) implementation was the most successful. It failed for arrays with one element, but passed all other tests. I was able to take care of that edge case by adding a simple conditional.

The [second](https://gist.github.com/shuboc/46ba75900b1e8ff1b5952ee94b33bd0c) implementation needed more work. I like that it followed the pseudocode in the quicksort [Wikipedia](https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme) article. However, it could not sort inputs with duplicates.

The [last](https://rohan-paul.github.io/javascript/2018/01/11/Quick-Sort_Algorithm-in-JavaScript/) implementation had a bug that took me an hour to figure out. Without knowing the details of the algorithm, you can still appreciate this lesson:

```javascript
function partitionHoare(array, left, right) {
	var pivot = Math.floor((left + right) / 2);

	while (left <= right) {
		while (array[left] < arr[pivot]) {
			left++;
		}
		while (array[right] > arr[pivot]) {
			right--;
		}

		if (left <= right) {
			swap(array, left, right);
			left++;
			right--;
		}
	}
	return left;
}
```

Notice that `pivot` is an index. The loop is mutating `array` by swapping elements. Therefore, `array[pivot]` can potentially take on different values between iterations. That's exactly what happens with this input array: `[-1,2,-8,-10]`.

Here's a fix:

```javascript
function partitionHoare(array = [], left, right) {
	var pivot = array[Math.floor((left + right) / 2)];

	while (left <= right) {
		while (array[left] < pivot) {
			left++;
		}
		while (array[right] > pivot) {
			right--;
		}

		if (left <= right) {
			swap(array, left, right);
			left++;
			right--;
		}
	}
	return left;
}
```

In this case, `pivot` is an element not an index. The expression on line 2 is evaluate before the loop so any changes to `array` will not affect `pivot`.
