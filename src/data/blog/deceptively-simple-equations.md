---
title: "Deceptively Simple System of Equations"
pubDate: "2020-09-02"
description: "A tricky algebra problem from Differential Equations and how to solve it."
tags:
  - Math
mathjax: true
---

I'm currently taking Differential Equations, and I have never felt more mathy. That doesn't mean I don't occasionally get stuck on simple algebra. Consider these equations from a homework problem:

$$
2a_{2} + 3a_{1}x + 4a_{0} = 0
$$

$$
a_{2} + a_{1} + a_{0} = 1
$$

$$
\text{where } a_{0}, a_{1}, a_{2} \text{ are constants}
$$

System of equations are introduced in high school, so I've solved tons of these problems before using the [elimination technique](https://www.khanacademy.org/math/algebra-home/alg-system-of-equations/alg-equivalent-systems-of-equations/v/solving-systems-of-equations-by-elimination) (I don't know any Linear Algebra yet).

I had given up on this problem until my professor (and a friend) showed me a couple of tricks.

$$
2a_{2} + 3a_{1}x + 4a_{0} = 3a_{1}x + (2a_{2} + 4a_{0}) = 0
$$

It's important to note that this function is a 1st degree polynomial. That means:

$$
3a_{1}x + (2a_{2} + 4a_{0}) = 0x + 0
$$

The coefficients in a polynomial are just constants. Consider $3a_{1}x$. The coefficient $3a_{1}$ is just some number (like 5 or 100), and can never be something like $1/x$ and cancel out $x$. Similarly, combining $2a_{2} + 4a_{0}$ will always result in a number since two constants can't result in an $x$ or $x^2$ for example.

Therefore, the only way to get $0x$ is if $3a_{1} = 0$. And the only way to get $0$ (referring to the last term of the equation on the right) is if $2a_{2} + 4a_{0} = 0$.

The pattern should be apparent now. For every term of degree $n$, we equate the coefficient of the left side to the coefficient on right side of the equation:

$$
3a_{1} = 0
$$

Where $3a_{1}$ is the coefficient of $3a_{1}x$ and $0$ is the coefficient of $0x$.

$$
2a_{2} + 4a_{0} = 0
$$

Where $2a_{2} + 4a_{0}$ and $0$ are the constants being added to both equations.

The rest of this problem is familiar territory. By simplifying the equations above, we get:

$$
a_{1} = 0
$$

$$
a_{2} = -2a_{0}
$$

If we plug these values into the original equation $(a_{2} + a_{1} + a_{0} = 1)$, we get:

$$
-2a_{0} + 0 + a_{0} = 1
$$

And we finally get the answer!

$$
a_{0} = -1
$$

$$
a_{1} = 0
$$

$$
a_{2} = 2
$$
