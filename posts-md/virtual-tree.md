title: Virtual Tree (Tutorial)
date: 4-22-2023
tag: virtual tree, template

---

## What is a virtual tree

Given a tree with \\(N\\) nodes and a subset of \\(K\\) nodes, we want to construct a new tree that will maintain the relative structure of the \\(K\\) nodes. Define relevant nodes to be any node that is the lca of any pair of nodes in our subset (including the nodes themselves). The virtual tree will keep all relevant nodes and compress the remaining nodes into edges between relevant nodes.

# Virtual tree algorithm

First of all, there will always be at most \\(2 \\cdot K\\) relevant nodes (consider the full binary tree case). Define \\(dfn[i]\\) to be the dfs order of \\(i\\), or the first time \\(i\\) is visited by a dfs. Also, assume that the root of the tree is always a relevant node for convenience. 

Lets try to simulate a dfs like process on the relevant nodes. We will have a monotonic stack of nodes sorted by increasing \\(dfn\\). Lets say \\(a\\) is the top of our stack, \\(b\\) is the next node we are considering, and \\(c\\) is their lca. 

Pop the stack while the top has a larger \\(dfn\\) value and then add \\(c\\) to the top if it does not already exist. Add \\(b\\) after \\(c\\) and go to process the next node. This is linear with \\(O(1)\\) lca. We will add edges between relevant nodes as we pop them out of the stack. There will be an edge from the node popped and the next node in the stack. Some path query algorithm can be used to compress nodes on a path into a single edge.

## Code

Implementation left as an exercise to the reader.