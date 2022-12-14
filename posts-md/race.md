title: 262144 (Tutorial)
date: 9-16-2022
tag: cf, xor basis, graph

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/412294/problem/B)

## Solution

Notice that when taking an edge, we can go back and forth as many times as we want, so we only care about the parity of each type of edge taken in the path. As long as their parity is the same and each edge is visited at least once, or the start and end are the same node, then the answer is yes. As long as every type of edge is in the start node's component, then you can visit each one of them at least once without changing the parity, so that condition is easy to check. If the start and end nodes are not in the same component then it is obvious that they cannot reach each other. To keep track of the parity of all the edge types, we can use a bitmask. Taking an edge becomes xoring the bitmask by some value. At the end, we just need to check if the bitmask is all \\(1\\)s or all \\(0\\)s. If we build any spanning tree of the graph, we have two choices at any given node. We can either choose to use an edge that doesn't lie on the tree, or use a tree edge. If we consider the path between two nodes as the xor of all the tree edges between nodes, then taking a non tree edge is equivalent to taking the xor of that non tree edge, then taking the xor of tree edges between the two endpoints, since we have to exclude that from the path. Now, to check if we can get an xor value through some series of edges, we can just put the value for each edge into an xor basis per component. If it is possible to create the xor sum of the path using only tree edges, or the complementary of it, then the answer will be yes. 

## Code

```c++
#pragma GCC optimize("O3")
#pragma GCC optimization ("unroll-loops")
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

struct basis {

    int arr[30];

    void add(int x){
        for(int i = 29; i >= 0; i--){
            if(!(x & (1 << i))) continue;
            if(!arr[i]) arr[i] = x;
            x ^= arr[i];
        }
    }

    bool query(int x){
        for(int i = 29; i >= 0; i--){
            if(x & (1 << i)){
                x ^= arr[i];
            }
        }
        return (x == 0);
    }

};

vector<pii> g[200005];
int dep[200005];
int comp[200005];
int tar[200005];
bool vis[200005];

basis b[200005];

void dfs1(int x, int t){
    comp[x] = t;
    for(pii i : g[x]) if(!comp[i.ff]) dfs1(i.ff, t);
}

void dfs2(int x, int t){
    vis[x] = true;
    for(pii i : g[x]){
        tar[t] |= i.ss;
        if(vis[i.ff]){
            b[t].add(dep[i.ff] ^ dep[x] ^ i.ss);
        } else {
            dep[i.ff] = dep[x] ^ i.ss;
            dfs2(i.ff, t);
        }
    }
}

int main(){
    setIO();
    int n, m, k, q;
    cin >> n >> m >> k >> q;
    for(int i = 0; i < m; i++){
        int a, b, c;
        cin >> a >> b >> c;
        g[a].pb({b, 1 << (c - 1)});
        g[b].pb({a, 1 << (c - 1)});
    }
    for(int i = 1; i <= n; i++) if(!comp[i]) dfs1(i, i);
    for(int i = 1; i <= n; i++) if(comp[i] == i) dfs2(i, i);
    while(q--){
        int s, t;
        cin >> s >> t;
        if(s == t){
            cout << "Yes" << endl;
            continue;
        }
        if(comp[s] != comp[t] || tar[comp[s]] != (1 << k) - 1){
            cout << "No" << endl;
            continue;
        }
        int val = dep[s] ^ dep[t];
        if(b[comp[s]].query(val) || b[comp[s]].query((1 << k) - 1 - val)) cout << "Yes" << endl;
        else cout << "No" << endl;
    }
}
```