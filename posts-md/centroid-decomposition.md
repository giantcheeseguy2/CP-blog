title: Centroid Decomposition (Tutorial)
date: 12-3-2022
tag: template, centroid decomposition

---

## Goal

Divide and conquer on a tree.

## Solution

If the tree was a line we could choose the midpoint of a range each time, process the range accordingly with respect to that midpoint, then split it down the midpoint. This is just divide and conquer, which gives us a complexity of \\(N log N\\). But how can we choose the midpoint on a tree? Turns out, this value is just the centroid (every subtree of the centroid node has at most \\(\\frac{N}{2}\\) subtree size). Since this splits the tree in at least a half every time, it will be split into at most \\(log N\\) layers, and processing the centroid's subtree at each layer yields a complexity of \\(N log N\\). This lets us solve problems that can be solved with divide and conquer on an array. For example, we can count each path that is in a subtree of a centroid that also goes through the centroid. This obviously counts all possible paths in the tree in a faster time complexity. We just need to do some dfs for each direct child of a centroid and then somehow merge them all together.

## Centroid Tree

We can actually use centroid decomposition to change the structure of the tree. Similar to segtree on an array, we will just create a tree of all the centroids with an edge between two centroids with an adjacent layer. Propertie sof a centroid tree include the fact that it is \\(log N\\) height, and every path that involves a node \\(x\\) must go through at least one of the nodes on the centroid tree between \\(x\\) and the root. In fact, this node will be their lca on the centroid tree. This lets us support node updates and queries involving paths in an efficient manner, since we only have to walk through all \\(log N\\) parents and update them as intermediate nodes.

## Code

Note that to find the centroid, we just have to traverse the tree until there is no longer a subtree that has a size more than \\(\\frac{N}{2}\\). This can be done by always going into the subtree with size more than \\(\\frac{N}{2}\\).

```c++
int dfs(int x, int p = 0){
	sub[x] = 1;
	for(int i : g[x]){
		if(i == p || vis[i]) continue;
		sub[x] += dfs(i, x);
	}
	return sub[x];
}

int centroid(int x, int tar, int p = 0){
	for(int i : g[x]){
		if(i == p || vis[i]) continue;
		if(sub[i]*2 > tar) return centroid(i, tar, x);
	}
	return x;
}

void build(int x, int p = 0){
	int c = centroid(x, dfs1(x));
	vis[c] = true;
	//edge between c and p in the centroid tree
	for(int i : g[c]) if(!vis[i]) build(i, c);
}
```