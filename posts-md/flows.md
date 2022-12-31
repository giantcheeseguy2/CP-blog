title: Flows (Template)
date: 12-31-2022
tag: flows, template

---

## Goal

We are given a directed graph, and each edge has a capacity. The sum of flow going into a node must be equal to the sum of flow leaving a node. The flow going through an edge must be at most its capacity. Find the maximum flow going into the sink node, coming from the source.

## Solution

### Ford Fulkerson

For each edge \\((a_i, b_i)\\), lets draw an edge \\((b'_i, a'_i)\\) with capacity \\(0\\). \\(flow(a_i, b_i) = -flow(b'_i, a'_i)\\). Lets consider a residual graph of \\(capacity - flow\\). It is easy to see that if there is a positive path from the source to sink sending flow down that path will increase the answer. Thus, if we always remove a positive path from the residual graph, we will eventually converge onto the maximum flow. By adding the reverse edges, we are able to undo flow that we find to be unoptimal in the future. Since the flow only every increases, the complexity is bounded by \\(O(E \\cdot F)\\), where \\(F\\) is the flow of the graph.

### Dinic's

We can improve the time complexity of Ford Fulkerson by noticing that it is slow to only remove one path from the residual graph at a time. Instead, why not remove all paths of a given layer simultaneously. We construct a directed acyclic graph with a bfs on the positive residual graph. Now, we have multiple paths that we can remove. Lets run a dfs from the source, and go through the degree, sending as much flow as we can. 

## Code

### Dinic's

Our dfs will return the maximum flow sendable into \\(x\\) if given a limit of \\(sum\\). Note that there are some optimizations we can do, such as breaking early and removing a node from consideration after processing it. Note that we only process each edge at most once, so we can maintain a starting iterator for every node. This has \\(O(E \\cdot V^2)\\) complexity. or \\(O(E \\cdot \\sqrt{V})\\) for graphs with unit capacity.

```c++
void addedge(int a, int b, int v){
	g2[a].pb({b, sz});
	g2[b].pb({a, sz + 1});
	flow[sz] = {0, v};
	flow[sz + 1] = {0, 0};
	sz += 2;
}

bool bfs(){
	for(int i = s; i <= t; i++) depth[i] = st[i] = 0;
	queue<int> q;
	q.push(s);
	depth[s] = 1;
	while(!q.empty()){
		int x = q.front();
		q.pop();
		if(x == t) return true;
		for(int j = 0; j < g2[x].size(); j++){
			pii i = g2[x][j];
			if(!depth[i.ff] && flow[i.ss].ff < flow[i.ss].ss){
				depth[i.ff] = depth[x] + 1;
				q.push(i.ff);
			}
		}
	}
	return false;
}

int dfs(int x = s, int sum = INF){
	if(x == t || sum == 0) return sum;
	int ret = 0;
	for(; st[x] < g2[x].size(); st[x]++){
		pii i = g2[x][st[x]];
		if(flow[i.ss].ff < flow[i.ss].ss && depth[x] + 1 == depth[i.ff]){
			int sub = dfs(i.ff, min(sum, flow[i.ss].ss - flow[i.ss].ff));
			if(sub == 0) continue;
			flow[i.ss].ff += sub;
			flow[i.ss ^ 1].ff -= sub;
			ret += sub;
			sum -= sub;
		}
		if(!sum) break;
	}
	if(!ret) depth[x] = INF;
	return ret;
}
```

Retrieve the flow

```c++
int sum = 0;
while(bfs()) while(int x = dfs()) sum += x;
```

## Notes

- Min Cut (minimum cost to disconnect the source and sink by removing edges, with a cost being its capacity) = Max Flow (useful for some problems)