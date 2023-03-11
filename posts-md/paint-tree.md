title: Paint Tree (Tutorial)
date: 2-21-2023
tag: atcoder, tree, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/arc108/tasks/arc108_f)

## Solution

We know that for alot of the configurations, the answer will just be the diameter, since if two endpoints of the diameter are the same color, it is guranteed to be the diameter. Thus, lets assume that the endpoints of a diameter are opposite colors. It seems intuitive that the maximum path will always be to one of the two diameters, since this is true on a normal tree. To prove this, lets say we have a pair of nodes \\(a\\) and \\(b\\) of the same color. If \\(b\\) is farther from \\(a\\) than the endpoint, then the endpoint will always be at least as far from than \\(b\\) from \\(a\\), since otherwise \\(a\\) would be an endpoint of the diameter. So, for every node not on the diameter, we have two options which is its distance to one of the \\(2\\) diameter endpoints. Now, for every possible choice in the nodes not on the diameter, we want to sum the maximum over the values. To do tihs, we can find the amount of times each maximum occurs. We can do this by fixing the max value, then finding the number of ways there are to choose the nodes such that all the values are \\(\\le\\) the max and at least one of the max occurs. We can do this by gradually increasing the max and using complementary counting.

## Code

```c++

```