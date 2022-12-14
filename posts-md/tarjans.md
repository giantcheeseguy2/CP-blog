title: Tarjan's Algorithm (Template)
date: 11-30-2022
tag: template, scc

---

## Finding Strongly Connected Components

We want to be able to find to find all strongly connected components (all pairs of nodes have a path to each other) in both directed and undirected graphs. In undirected graphs, there must be two edge disjoint paths between every pair of nodes. 

## Solution

Lets construct a dfs tree for the graph and assign each node \\(x\\) its discovery time, \\(dfn[x]\\). The idea is to store \\(low[x]\\) for every node \\(x\\), the smallest discovery time of any reachable nodes. If \\(low[x] = dfn[x]\\), then node \\(x\\) will be the "root" of its strongly connected component. To reconstruct the components, we can just keep a stack of the active nodes during the dfs and pop out the stack after processing node \\(x\\). Nodes that are added to the stack after \\(x\\) are always reachable by \\(x\\), and if they are already contained in their own strongly connected component, then they will have been removed by the time we return to \\(x\\). Therefore, if \\(low[x] = dfn[x]\\) after processing \\(x\\), then all nodes in the stack that have been visited after \\(x\\) should be in \\(x\\)'s component. Note that we can to change the definition of \\(low[x]\\) to be the smallest discovery time of any reachable nodes from \\(x\\) after some series of dfs tree edges followed by a single non dfs tree edge, since if \\(low[x] = dfn[x]\\) then it will still mean that \\(x\\) cannot reach anywhere about itself in the dfs tree, and thus is the root of its component.

### Directed

Note for the directed case, we need to make sure that \\(i\\) is inside the stack with \\(in[i]\\), since we don't want to consider \\(i\\) if its already been found to be in a strongly connected component. It is guranteed that if a node has been visited and is not in the stack, then it is already in a strongly connected component.

```c++
void dfs(int x){
	dfn[x] = low[x] = ++tim;
	in[x] = true;
	st.push(x);
	for(int i : g[x]){
		if(!dfn[i]){
			dfs(i);
			low[x] = min(low[x], low[i]);
		} else if(in[i]) low[x] = min(low[x], dfn[i]);
	}
	if(low[x] == dfn[x]){
		while(st.top() != x){
			in[s.top()] = false;
			comp[st.top()] = x;
			st.pop();
		}
		in[x] = false;
		comp[x] = x;
		st.pop();
	}
}
```

### Undirected

There is no need to gurantee that \\(i\\) is in the stack if it has been visited before, since the edges are undirected. So if a node has been visited before, and it is visited again, then they are all part of the same strongly connected component. We should also store the id of the parent edge, since we don't want to be able to go back through the same edge.

```c++
void dfs(int x, int p = -1){
	dfn[x] = low[x] = ++tim;
	s.push(x);
	for(pii i : g[x]){
		if(i.ss == p) continue;
		if(!dfn[i.ff]){
			dfs(i.ff, i.ss);
			low[x] = min(low[x], low[i.ff]);
		} else low[x] = min(low[x], dfn[i.ff]);
	}
	if(low[x] == dfn[x]){
		while(st.top() != x){
			comp[st.top()] = x;
			st.pop();
		}
		comp[x] = x;
		st.pop();
	}
}
```

## Finding Articulation Points And Bridges

We can also use tarjan's algorithm to find articulation points (the number of components after removing the point is more than the number of components before), and bridges (the number of components after removing the edge is more than the number of components before). Note that for these cases, we need to define \\(low[x]\\) to be the smallest discovery time of any reachable nodes from \\(x\\) after some series of dfs tree edges followed by a single non dfs tree edge, since we don't want to be reusing the dfs tree edges when finding bridges or articulation points.

## Solution

### Articulation Points

If \\(low[i] \\ge dfn[x]\\), then \\(i\\) cannot reach anywhere above \\(x\\) using a different path. Therefore, if we remove \\(x\\), then the component above \\(x\\) will be disconnected from the component of \\(i\\). Note that this condition is always true for the root even though the root is not always an articulaton point, so we can check it seperately. If the root is able to go to more than one child through unused edges, then it must be connecting at least two edge biconnected components. 

```c++
void dfs(int x, int p = -1){
	dfn[x] = low[x] = ++tim;
	int sz = 0;
	for(pii i : g[x]){
		if(i.ss == p) continue;
		if(!dfn[i.ff]){
			dfs(i.ff, i.ss);
			low[x] = min(low[x], low[i.ff]);
			sz++;
			if(low[i] >= dfn[x] && p != -1){
				//x is articulation point
			}
		} else low[x] = min(low[x], dfn[i.ff]);
	}
	if(p == -1 && sz > 1){
		//x is articulation point
	}
}
```

### Bridges

One easy way to check for this is to go through every edge after the fact and see if they are in between two nodes with different components. However, we can also do this inside the dfs similarly to articulation points. If \\(low[i] < dfn[x]\\), then \\(i\\) cannot find a way back to \\(x\\) using a different path. Therefore, the only connection between \\(x\\)'s component and \\(i\\)'s component is the edge from \\(x\\) to \\(i\\).

```c++
void dfs(int x, int p = -1){
	dfn[x] = low[x] = ++tim;
	int sz = 0;
	for(pii i : g[x]){
		if(i.ss == p) continue;
		if(!dfn[i.ff]){
			dfs(i.ff, i.ss);
			low[x] = min(low[x], low[i.ff]);
			sz++;
			if(low[i] > dfn[x]){
				//i.ss is a bridge
			}
		} else low[x] = min(low[x], i.dfn[ff]);
	}
	if(p == -1 && sz > 1){
		//x is articulation point
	}
}
```
### Block Cut Tree

Check out the seperate blog for this one.