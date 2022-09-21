title: Tree Boxes (Tutorial)
date: 9-20-2022
tag: usaco, ad hoc, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=948)

## Solution

There exists a solution which involves binarizing the tree, but this will use \\(2 \cdot N\\) positions. This cannot be optimized further, so lets try to find a better solution. Lets say we were at a node with only leaves. Then, we can put the leaves on a diagonal of a square, with that node being in the top left corner. This method works even if the node is not just a leaf. Now, we have a nice construction that can be done using a recursion.

## Code

```c++
#include "grader.h"
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;
using namespace std;

#define pb push_back
#define ff first
#define ss second

typedef long long ll;
typedef long double ld;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef pair<ld, ld> pld;

const int INF = 1e9;
const ll LLINF = 1e18;
const int MOD = 1e9 + 7;

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;

inline ll ceil0(ll a, ll b) {
    return a / b + ((a ^ b) > 0 && a % b);
}

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

vector<int> g[100005];
int par[100005][20], depth[100005];
int sz[100005];

void dfs(int x, int p){
    par[x][0] = p;
    depth[x] = depth[p] + 1;
    sz[x] = 1;
    for(int i : g[x]){
        if(i == p) continue;
        dfs(i, x);
        sz[x] += sz[i];
    }
}

int lca(int a, int b){
    if(depth[a] > depth[b]) swap(a, b);
    for(int i = 19; i >= 0; i--) if(depth[par[b][i]] >= depth[a]) b = par[b][i];
    if(a == b) return a;
    for(int i = 19; i >= 0; i--) if(par[a][i] != par[b][i]) a = par[a][i], b = par[b][i];
    return par[a][0];
}

int jump(int a, int b){
    for(int i = 19; i >= 0; i--) if(depth[par[a][i]] > depth[b]) a = par[a][i];
    return a;
}

void addRoad(int a, int b){
    a++, b++;
    g[a].pb(b);
    g[b].pb(a);
}

pii pos[100005];

void build(int v, int p, int x1, int y1, int x2, int y2){
    setFarmLocation(v - 1, x1, y1);
    pos[v] = {x1, y1};
    int x = x1, y = y2;
    for(int i : g[v]){
        if(i == p) continue;
        build(i, v, x, y - sz[i] + 1, x + sz[i] - 1, y);
        x += sz[i], y -= sz[i];
    }
}

void buildFarms(){
    int n = getN();
    dfs(1, 1);
    for(int i = 1; i < 20; i++) for(int j = 1; j <= n; j++) par[j][i] = par[par[j][i - 1]][i - 1];
    build(1, 1, 1, 1, sz[1], sz[1]); 
}

void notifyFJ(int a, int b){
    a++, b++;
    if(depth[a] > depth[b]) swap(a, b);
    int c = lca(a, b);
    addBox(pos[c].ff, pos[c].ss, pos[b].ff, pos[b].ss);
    if(c != a){
        c = jump(a, c);
        addBox(pos[c].ff, pos[c].ss, pos[a].ff, pos[a].ss);
    }
}
```