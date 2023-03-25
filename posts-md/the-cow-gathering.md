title: The Cow Gathering (Tutorial)
date: 3-25-2023
tag: usaco, tree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=866)

## Solution

The problem obviously reduces to a dag, since only leaves of the tree can be removed, and there are some extra edges denoting conditions. We just have to solve the problem for all roots The obvious case is when an edge points to a child, which immediately causes a fail. Otherwise, its not that simple to see when a cycle would occur given a root. Instead, lets try to look at this problem from a different angle by only looking at transitions from root to root. The trivial case is when you are transitioning from a root that works. In this case, as long as you are going to a node with no outgoing edges, it will be fine, since the node has an outgoing edge, then it obviously cannot be a valid edge. Otherwise, it is always valid to transition because flipping the direction of an edge won't be able to create a cycle. On the other hand, transitioning from an invalid root is hard, since we have to know how many cycles there are and check if flipping an edge breaks each of them, then construct new cycles after the transition. To solve this, we can note some other property of the problem. If two nodes are valid, it makes intuitive sense that all nodes in between those two are also valid. Thus, the set of valid nodes must form a connected subtree. So, as long as we can start off in a valid node, our transitions will be trivial and solved. To find a valid node, we can just greedily remove leaves while its possible. If we end up unable to remove all the nodes then there are no valid nodes.

## Code

```c++
#pragma GCC optimize("O3")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse,sse2,sse3,ssse3,sse4,popcnt,abm,mmx,tune=native")
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
vector<int> req[100005];
vector<int> rev[100005];
int deg[100005];
int adj[100005];
int in[100005];
int out[100005];
int sz = 0;

void dfs1(int x, int p = 0){
    in[x] = sz++;
    for(int i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
    }
    out[x] = sz;
}

int ans[100005];

void dfs2(int x, int p = 0){
    ans[x] = 1;
    for(int i : g[x]){
        if(i == p) continue;
        if(!req[i].size()) dfs2(i, x);
    }
}

int main(){
    setIO();
    freopen("gathering.in", "r", stdin);
    freopen("gathering.out", "w", stdout);
    int n, m;
    cin >> n >> m;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
        adj[a]++;
        adj[b]++;
    }
    for(int i = 0; i < m; i++){
        int a, b;
        cin >> a >> b;
        req[a].pb(b);
        deg[b]++;
    }
    queue<int> q;
    for(int i = 1; i <= n; i++){
        if(adj[i] == 1 && deg[i] == 0){
            q.push(i);
        }
    }
    int cur = 0;
    int rt = -1;
    while(!q.empty()){
        int x = q.front();
        q.pop();
        cur++;
        if(cur == n){
            rt = x;
        }
        for(int i : g[x]){
            adj[i]--;
            if(adj[i] == 1 && deg[i] == 0){
                q.push(i);
            }
        }
        for(int i : req[x]){
            deg[i]--;
            if(adj[i] == 1 && deg[i] == 0){
                q.push(i);
            }
        }
    }
    if(rt == -1){
        for(int i = 1; i <= n; i++) cout << 0 << endl;
        return 0;
    }
    dfs1(rt);
    dfs2(rt);
    for(int i = 1; i <= n; i++) cout << ans[i] << endl;
}
```