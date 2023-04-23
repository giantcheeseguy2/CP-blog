title: K-d Tree (Tutorial)
date: 4-21-2023
tag: k-d tree, template

---

## K-dimensional queries

Lets say we are given a set of \\(N\\) points in k-dimensional space, and we want to be able to apply some operation such as addition onto a subspace and query some value such as sum of a subspace.

## K-d Tree

Lets build a segment tree like structure on our points. If we are building our tree on \\(K\\) dimensions, when we are at a depth of \\(d\\) in our tree, we will split our remaining points based on the median of the coordinates in the \\(d\\) dimension and recurse. This will take \\(O(N log N)\\) with \\(O(N)\\) median finding in each layer.

For queries, simply recurse down the tree until the space represented by a node is completely enclosed by our query space. The complexity is \\(O(K \\cdot N^{1 - \\frac{1}{K}})\\) for any rectangular space query. Complexity is not guranteed for any other shapes but is still very optimized, and rotations can be used to cheese hard test data

## Implementation

Left as an exercise to the reader