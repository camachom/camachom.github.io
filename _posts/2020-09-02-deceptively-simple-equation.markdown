---
layout: mathPost
title: "A Deceptively Simple Equation"
date: 2020-09-02
---

I'm currently taking Differnetial Equations, and I have never felt more mathy. That dosen't mean I don't occasionally get stuck on simple algebra. Consider this equation from a homework problem:

$$
2a_{2} + 3a_{1}x + 4a_{0} = 0,
\text{where \(a_{2}, a_{1}, a_{0}\) are constants}
$$

I was unable to simplify any further and hit a roadblock. After 10 minutes of staring at the same equation, I stopped trying to be analytical and took a less precise but more intuitive approach (at least for me).

$$
\text{Since \(2a_{2}, 4a_{0}\) are constants, we can just call them C}
$$

$$
3a_{1}x + C = 0
$$

From here, it's easier to see that there are only two possibilities.

1. $$3a_{1}x$$ is the negation of C for some non-zero, real value

    $$
    3a_{1}x = -C
    $$

2. $$a_{1}$$ and C are both equal to 0

    $$
    0x + 0 = 0
    $$

Lets consider the first option. Since $$3a_{1}$$ is a constant, we can divide both sides by $$3a_{1}$$ and call our new constant $$D$$:

$$
\frac {3a_{1}x} {3a_{1}} = \frac {-C} {3a_{1}}
$$

$$
x = D
$$

Here, it's important to recognize that this is a function.

$$
f(x) = x = D
$$

And now we can see that this does not make sense. $$x$$ is an independent variable and no single constant (say $$3$$ or $$15.5$$) can satisfy all possible values of x.

Therefore, option two is the answer!

$$
a_{1} = 0
$$

$$
C = 2a_{2} + 4a_{0} = 0
$$

$$
a_{2} = -2a_{0}
$$
