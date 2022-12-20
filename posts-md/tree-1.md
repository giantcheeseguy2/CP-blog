title: Tree (Tutorial)
date: 12-18-2022
tag: cf, math, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/412114/problem/B)

## Solution

In this problem, we are only given the degrees of the possible tree. This seems very similar to a problem that prufer sequences solves, where the number of trees with a given degree sequence of \\(deg_i\\) is \\(\\frac{(n - 2)!}{\\prod (deg_i - 1)!}\\). Now that we can count the number of trees, lets try to find how to calculate the total distance travelled on a given tree. We will always want to move to the centroid, since it splits the tree the most evenly. Obviously, we cannot construct a tree every time and check. It would instead be easier to count the contribution of every possible edge to the answer. Given an edge we know that its contribution will be the amount of people moving across the edge and towards the centroid. Due to the properties of centroids, this means that if an edge splits the tree into two subtrees of size \\(a\\) and \\(b\\), its contribution to the answer will be \\(min(a, b)\\). This actually makes it much easier to find the answer. Now, we just have to fix an edge and the size of its two subtrees. Now the only question is how to assign the degrees to each subtree. 

## Code

```c++

```