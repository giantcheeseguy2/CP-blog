title: Omkar and Tours (Tutorial)
date: 8-18-2022
tag: codeforces, dsu, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1583/H)

## Solution

Lets consider an offline solution where we sweep on capacity. Now, the problem becomes given a tree, find the path with the maximum edge weight to any node with a maximal value. This can actually be solved trivially using link cut tree with subtree queries by rerooting the target node every time, but lets find a better solution. Lets say that we had a set of all nodes with maximal value in a component, as well as the maximum edge weight between any pair of those nodes. Now when querying a node, the answer is either the maximum edge weight on the path of that node to any node in the set of maximal nodes or the maximal pairwise edge weight. When merging two components, if the maximal node values are different, then just delete the smaller set. Otherwise, merge with small to large. The new pairwise maximum is just the maximal edge weight on the path between any two nodes in the two components. The complexity is \\(O(N log N)\\).

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

vector<pair<int, pii>> g[200005];
int par[200005][20], sum[200005][20];
int depth[200005];

void dfs(int x, int p){
    par[x][0] = p;
    depth[x] = depth[p] + 1;
    for(auto i : g[x]){
        if(i.ff == p) continue;
        sum[i.ff][0] = i.ss.ss;
        dfs(i.ff, x);
    }
}

vector<int> comp[200005];
int dsu[200005];
int mx[200005];

int find(int x){
    if(x == dsu[x]) return x;
    return dsu[x] = find(dsu[x]);
}

int dist(int a, int b){
    int ret = 0;
    if(depth[a] > depth[b]) swap(a, b);
    for(int i = 19; i >= 0; i--){
        if(depth[par[b][i]] >= depth[a]){
            ret = max(ret, sum[b][i]);
            b = par[b][i];
        }
    }
    if(a == b) return ret;
    for(int i = 19; i >= 0; i--){
        if(par[a][i] != par[b][i]){
            ret = max(ret, sum[a][i]);
            ret = max(ret, sum[b][i]);
            a = par[a][i];
            b = par[b][i];
        }
    }
    ret = max({ret, sum[a][0], sum[b][0]});
    return ret;
}

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i];
    vector<pair<int, pii>> v;
    vector<pair<int, pii>> e;
    for(int i = 0; i < n - 1; i++){
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        e.pb({d, {a, b}});
        v.pb({c, {INF, e.size() - 1}});
        g[a].pb({b, {c, d}});
        g[b].pb({a, {c, d}});
    }
    dfs(1, 1);
    for(int i = 1; i < 20; i++){
        for(int j = 1; j <= n; j++){
            par[j][i] = par[par[j][i - 1]][i - 1];
            sum[j][i] = max(sum[j][i - 1], sum[par[j][i - 1]][i - 1]);
        }
    }
    pii ans[q];
    for(int i = 0; i < q; i++){
        int a, b;
        cin >> a >> b;
        v.pb({a, {b, i}});
    }
    for(int i = 1; i <= n; i++) comp[i].pb(i), dsu[i] = i;
    sort(v.rbegin(), v.rend());
    for(auto i : v){
        if(i.ss.ff == INF){
            int x = find(e[i.ss.ss].ss.ff);
            int y = find(e[i.ss.ss].ss.ss);
            if(comp[x].size() < comp[y].size()) swap(x, y);
            int a = arr[comp[x].back()], b = arr[comp[y].back()];
            if(a == b){
                mx[x] = max({mx[x], dist(comp[x].back(), comp[y].back()), mx[y]});
                for(int i : comp[y]) comp[x].pb(i);
                dsu[y] = x;
            } else if(a < b){
                dsu[x] = y;
            } else {
                dsu[y] = x;
            }
        } else {
            ans[i.ss.ss].ss = max(mx[find(i.ss.ff)], dist(i.ss.ff, comp[find(i.ss.ff)].back()));
            ans[i.ss.ss].ff = arr[comp[find(i.ss.ff)].back()];
        }
    }
    for(int i = 0; i < q; i++) cout << ans[i].ff << " " << ans[i].ss << endl;
}
```