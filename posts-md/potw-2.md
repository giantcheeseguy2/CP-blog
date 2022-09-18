title: Harker Math Club POTW 2 (Tutorial)
date: 9-18-2022
tag: math, tutorial

---

## Problem Statement

Alice and Bob are playing cup pong. They each start with 10 cups, and the probability of each person hitting another's cup is \\(n/11\\) if the opponent has \\(n\\) cups left. What is the probability that Bob wins, assuming Alice goes first

## Solution

Let \\(f(a, b, c) = \\) the probability Bob wins if Alice has \\(a\\) cups remaining and Bob has \\(b\\) cups remaining. \\(c\\) will be a \\(0\\) if it is Alice's turn and a \\(1\\) if it is Bob's turn. \\(f(a, b, c) = \frac{f(a - 1, b, c \oplus 1) \cdot a}{11} + \frac{f(a, b, c \oplus 1) \cdot (11 - a)}{11}\\). The base cases are \\(f(0, b, 0) = 1\\) and \\(f(a, 0, 1) = 0\\), where either Bob wins or Alice wins. Now, it may seem that we have to use a geometric series to account for the fact that \\(f(a, b, 0)\\) is in terms of \\(f(a, b, 1)\\), which is then in terms of \\(f(a, b, 0)\\), but if we plug in \\(f(a, b, 1)\\), then solve for \\(f(a, b, 0)\\), then everything works out. This can be done for \\(f(a, b, 1)\\) as well. In the end, we get the formulas \\(f(a, b, 1) = \frac{\frac{f(a - 1, b, 0) \cdot a}{11} + \frac{f(a, b - 1, 1) \cdot b}{11} \cdot \frac{11 - a}{11}}{1 - \frac{11 - b}{11} \cdot \frac{11 - a}{11}}\\) and \\(f(a, b, 0) = \frac{\frac{f(a, b - 1, 1) \cdot b}{11} + \frac{f(a - 1, b, 0) \cdot a}{11} \cdot \frac{11 - b}{11}}{1 - \frac{11 - a}{11} \cdot \frac{11 - b}{11}}\\). Solving for \\(f(10, 10, 0)\\), we get a probability of around \\(48.6\\%\\).