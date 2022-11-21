title: Smaller LCA (Tutorial)
date: 11-20-2022
tag: cf, tree, dp, segtree, hld, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/411094/problem/B)

## Solution

First of all, if a pair has a product greater than \\(N\\), we can add it to every answer, then just ignore there. Therefore there will only be \\(\\sum_{i} \\frac{N}{i}\\) pairs that we must consider. This evaluates to around \\(N log N\\) pairs total. Now lets say we know the answer for a given root \\(i\\). When we reroot the tree from \\(i\\) to \\(j\\), our answer will decrease by the number of important pairs that cover the \\((i, j)\\) edge \\(\\ge i\\), and increase by the number of important pairs that cover the \\((i, j)\\) edge \\(\\ge j\\). We can store two seperate segtrees, one for the parent node's value and one for the child node's value, and process all the updates in increasing product, and we want to be able to update every edge on a path, while only increasing edges that are smaller (have been toggled on previously). This can be done using a segtree and hld, however it would result in an \\(O(N log^3 N)\\) solution which is too slow. Balanced hld can be used to optimize to \\(O(N log^2 N)\\), but there is an easier way. Notice that if we process the updates backwards, we no longer have to account for the toggling on and off, and the problem just becomes a point update path query. This can be maintained with point update subtree query by adding to the endpoints, then subtracting from the lca. The original answer can be computed just by brute forcing all the pairs initially.

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

vector<int> g[300005];
vector<int> que[300005][2];
vector<pii> upd[300005];
int in[300005], par[300005], head[300005], sub[300005], depth[300005], tim = 0;
int weight[300005], out[300005], n;

void dfs1(int x, int p = 0){
    if(p){
        que[x][0].pb(x);
        que[p][1].pb(x);
    }
    sub[x] = 1;
    for(int &i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
        sub[x] += sub[i];
        if(g[x][0] == p || sub[i] > sub[g[x][0]]) swap(i, g[x][0]);
    }
}

void dfs2(int x, int p){
    in[x] = tim++;
    par[x] = p;
    depth[x] = depth[p] + 1;
    weight[x] = 1 + (head[x] == x ? n - sub[x] : 0);
    for(int i : g[x]){
        if(i == p) continue;
        head[i] = (i == g[x][0] ? head[x] : i);
        dfs2(i, x);
        if(i != g[x][0]) weight[x] += sub[i];
    }
    out[x] = tim - 1;
}

int bit[300005][2];

int down[300005], up[300005];
ll cur = 0;
ll ans[300005];

void update(int x, int v){
    for(x++; x <= tim; x += x & (-x)) bit[x][0] += v, bit[x][1] += v;
}

int query(int x, int t, int ret = 0){
    for(x++; x; x -= x & (-x)) ret += bit[x][t];
    return ret;
}

int lca(int a, int b){
    int prod = a*b;
    while(head[a] != head[b]){
        if(depth[head[a]] > depth[head[b]]) swap(a, b);
        int x = b;
        bool a = true;
        b = par[head[b]];
    }
    if(depth[a] > depth[b]) swap(a, b);
    if(a <= prod) cur++;
    return a;
}

void dfs3(int x, int p = 0){
    ans[x] = cur;
    for(int i : g[x]){
        if(i == p) continue;
        cur += down[i] - up[i];
        dfs3(i, x);
        cur += up[i] - down[i];
    }
}

int main(){
    setIO();
    cin >> n;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs1(1);
    head[1] = 1;
    dfs2(1, 1);
    cur = (ll)n*(n + 1)/2;
    for(int i = 1; i <= n; i++){
        for(int j = i + 1; (ll)i*j <= n; j++){
            cur--;
            upd[i*j].pb({i, j});
        }
    }
    for(int i = n; i >= 1; i--){
        for(pii j : upd[i]){
            update(in[j.ff], 1);
            update(in[j.ss], 1);
            update(in[lca(j.ff, j.ss)], -2);
        }
        for(int j : que[i][0]) down[j] = query(out[j], 0) - query(in[j] - 1, 0);
        for(int j : que[i][1]) up[j] = query(out[j], 1) - query(in[j] - 1, 1);
    }
    dfs3(1);
    for(int i = 1; i <= n; i++) cout << ans[i] << endl;
}
```