title: Communication Towers (Tutorial)
date: 4-22-2023
tag: cf, segtree, dsu, graph, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1814/problem/F)

## Solution

We can easily check if a single tower is reachable from node \\(1\\) with dynamic connectivity. We can just model a segtree over each distinct frequency and add each edge during the intersection of possibile frequencies of its two endpoints. We just have to make the dsu persistent to allow for merge when entering a node and undo when leaving a node. However, how can we check all reachable nodes from the root in reasonable time? We cannot manually check each node when at a leaf of the dynacon segtree, so we should try to find some way to do it during the dsu. Instead, at each leaf we should find a faster way to identify all nodes in something's component. This motivates building a graph of our dsu, where merging two nodes means adding a dummy node, creating directed edges from the dummy nodes to the parents of the nodes, then setting the dummy node as the new parent. This way, we can check which nodes are reachable from node \\(1\\) without visiting any other nodes by just running a search from the parent of node \\(1\\). However, this is still to slow to be ran at every leaf, but we can actually wait until finishing the dynacon to run the search from any of the parents of node \\(1\\) at the leaves. It is easy to see that this will run in reasonable time.

## Code

```c++
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse4,popcnt,abm,mmx,tune=native")
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

vector<pii> upd[800005];

void touch(int l, int r, pii x, int ul = 1, int ur = 2e5, int cur = 0){
    if(r < ul || l > ur) return;
    if(l <= ul && ur <= r){
        upd[cur].pb(x);
        return;
    }
    int mid = (ul + ur)/2;
    touch(l, r, x, ul, mid, cur*2 + 1);
    touch(l, r, x, mid + 1, ur, cur*2 + 2);
}

int par[200005];
int id[200005];
int sz[200005];
vector<pair<pii, int>> hist;

int find(int x){
    if(x == par[x]) return x;
    return find(par[x]);
}

int ind;

void merge(int a, int b){
    a = find(a), b = find(b);
    if(sz[a] > sz[b]) swap(a, b);
    hist.pb({{a, b}, id[b]});
    id[b] = ind++;
    par[a] = b;
    sz[b] += sz[a];
}

void undo(){
    int a = hist.back().ff.ff, b = hist.back().ff.ss;
    id[b] = hist.back().ss;
    par[a] = a;
    sz[b] -= sz[a];
    hist.pop_back();
}

vector<int> g[10000005];
queue<int> q;
bool vis[10000005];

void dfs(int l = 1, int r = 2e5, int cur = 0){
    int cnt = 0;
    for(pii i : upd[cur]){
        i.ff = find(i.ff), i.ss = find(i.ss);
        if(i.ff != i.ss){
            cnt++;
            g[ind].pb(id[i.ff]);
            g[ind].pb(id[i.ss]);
            merge(i.ff, i.ss);
        }
    }
    if(l != r){
        int mid = (l + r)/2;
        dfs(l, mid, cur*2 + 1);
        dfs(mid + 1, r, cur*2 + 2);
    } else {
        int x = id[find(1)];
        if(!vis[x]){
            q.push(x);
            vis[x] = true;
        }
    }
    for(int i = 0; i < cnt; i++) undo();
}

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    pii arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i].ff >> arr[i].ss;
    for(int i = 0; i < m; i++){
        int a, b;
        cin >> a >> b;
        if(arr[a].ss >= arr[b].ff || arr[b].ss >= arr[a].ff){
            touch(max(arr[a].ff, arr[b].ff), min(arr[a].ss, arr[b].ss), {a, b});
        }
    }
    for(int i = 1; i <= n; i++) id[i] = par[i] = i, sz[i] = 1;
    ind = n + 1;
    dfs();
    while(!q.empty()){
        int x = q.front();
        q.pop();
        for(int i : g[x]){
            if(!vis[i]){
                q.push(i);
                vis[i] = true;
            }
        }
    }
    for(int i = 1; i <= n; i++) if(vis[i]) cout << i << " ";
    cout << endl;
}
```