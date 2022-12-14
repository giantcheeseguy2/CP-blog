title: Block Cut Tree (Template)
date: 11-25-2022
tag: template, block cut tree

---

## Goal

Our goal is to make a tree that is equivalent to a bridge tree, but for node biconnected components (removing one node won't disconnect the component). 

## Solution

Decompose a the graph into squares and circles. Circles will represent the original nodes, and squares will represent node biconnected component. Circles will have an edge to squares that represents that the circle is inside the node biconnected component represented by the square. Each edge will belong to at most one node biconnected component, so there will be a linear amount of squares. 

### Properties

- It is a tree
- Each edge will be between either a circle or a square since two adjacent nodes are also a node biconnected component
- Non-leaf circles are articulation points

## Code

If there are multiple node biconnected components, they will either be connected by an articulation point or not connected at all. Therefore, out algorithm should find all the articulation points, then seperate all the bccs accordingly. Tarjan can be used to find the articulation points. In the process of finding articulation points, we can actually maintain a stack of all the edges or nodes in the active subtree. Then, every time we find an articulation point, we just have to pop out the stack.

### Edges

Stores which edges are in each node biconnected component. Note that we should not consider down edges since those will have already been considered before (If \\(i\\) is visited after \\(x\\), then the edge from \\(i\\) to \\(x\\) would have already checked, so checking the edge from \\(x\\) to \\(i\\) would be overcounting). We also will pop out the root even if it is not an articulation point, since if it is not then the stack would only contain the root anyways. 

```c++
void dfs(int x, int p = 0){
	dfn[x] = low[x] = ++tim;
	for(pii i : g[x]
		if(i.ff == p) continue;
		if(!dfn[i.ff]){
			st.push(i.ss);
			dfs(i.ff, x);
			low[x] = min(low[x], low[i.ff]);
			if(low[i.ff] >= dfn[x]){
				while(st.top() != i.ss){
					//edge st.top() is in the tom block
					st.pop();
				}
				//edge st.top() is in the tom block
				st.pop();
				tom++;
			}
		} else if(dfn[i.ff] < dfn[x]) low[x] = min(low[x], dfn[i.ff]), st.push(i.ss);
	}
}
```

### Nodes

Creates the actual block cut tree. Note that this can be done with the edges as well, since all of the endpoints of the edges in the node biconnected component will be connected to the node biconnected component. However, there will be duplicates.

```c++
void dfs(int x, int p = 0){
	dfn[x] = low[x] = ++tim;
	s.push(x);
	for(int i : g[x]){
		if(i == p) continue;
		if(!dfn[i]){
			dfs(i, x);
			low[x] = min(low[x], low[i]);
			if(low[i] >= dfn[x]){
				g2[tom].pb(x); 
				g2[x].pb(tom);
				while(g2[tom].back() != i){
					g2[tom].pb(s.top());
					g2[s.top()].pb(tom);
					s.pop();
				}
				tom++;
			}
		} else low[x] = min(low[x], dfn[i]);
	}
}
```