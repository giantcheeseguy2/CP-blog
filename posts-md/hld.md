title: Heavy Light Decomposition (Tutorial)
date: 4-22-2023
tag: hld, template

---

## Goal

We want to decompose our tree of size \\(N\\) into chains such that any path between two nodes can be represented as some continous segment of at most \\(log N\\) chains.

## Solution

Lets define the heavy child of a node as its child with the largest subtree size. Each chain will then be a sequence of nodes such that each node is the heavy child of the previous. If we keep jumping up the chains until the root, we can see that every time we switch chains, the amount of nodes skipped must double, since we are switching from a non heavy node. Thus, there are only at most \\(log N\\) chains from any node to the root. To perform path queries, we can just keep jumping up chains from the two ends until they meet at a single chain. Note that we will only every visit a prefix of a chain except for the final one. If we set the heavy child of a node to be the first one we visit in a dfs traversal, we can also gurantee that a chain of nodes is always a continous interval of dfs order values.

## Code

```c++
void dfs1(int x, int p){
    sz[x] = 1;
    for(int &i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
        sz[x] += sz[i];
        if(g[x][0] == p || sz[i] > sz[g[x][0]]) swap(g[x][0], i);
    }
}
 
void dfs2(int x, int p){
    rev[tim] = x;
    in[x] = tim++;
    par[x] = p;
    depth[x] = depth[p] + 1;
    for(int i : g[x]){
        if(i == p) continue;
        head[i] = (i == g[x][0] ? head[x] : i);
        dfs2(i, x);
    }
    out[x] = tim - 1; //[in[x], out[x]) is x's subtree
}

void query(int a, int b){
    while(head[a] != head[b]){
        if(depth[head[a]] > depth[head[b]]) swap(a, b);
        //[in[head[b]], in[b]] is on the path
        b = par[head[b]];
    }
    if(depth[a] > depth[b]) swap(a, b);
    //[in[a], in[b]] is on the path
    //a is the lca
}
```