title: Incident Vertices (Tutorial)
date: 7-30-2022
tag: codeforces, hld, persistent segtree, segtree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/fPOGh4kz36/contest/391358/problem/A)

## Solution

Lets simplify this problem to be on a 2d plane. The y axis represents the order in the hld traversal of the first tree, why the x axis represents the order of the hld traversal of the second tree. If we fill in all \\(N\\) points, then we can do a 2d rectangle query for every pair of hld intervals of the two trees. This yields us a complexity of \\(O(log^3 N)\\) per query. To optimize this to \\(O(log^2 N)\\), we have to reduce this into a path to root query. If \\(dist[i]\\) is the answer for a query from \\(i\\) to the root, then the answer is \\(dist[C] + dist[D] - dist[lca(C, D)] - dist[par[lca(C, D)]]\\). We can use a euler tour to support path to root queries by adding a \\(+1\\) on the index where a node first appears, and a \\(-1\\) when it last appears. Using persistent segtree to support this, we get a complexity of \\(O(log^2 N)\\) per query.

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

const int N = 200005;

struct graph {

    vector<int> g[N];
    int pos[N], sub[N], par[N], head[N], depth[N], in[N], tim = 0;

    vector<int> &operator[](int x){
        return g[x];
    }

    void dfs1(int x, int p){
        depth[x] = depth[p] + 1;
        par[x] = p;
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
        for(int i : g[x]){
            if(i == p) continue;
            head[i] = (i == g[x][0] ? head[x] : i);
            dfs2(i, x);
        }
    }

    void build(){
        dfs1(1, 1);
        dfs2(1, 1);
    }

    int lca(int a, int b){
        while(head[a] != head[b]){
            if(depth[head[a]] > depth[head[b]]) swap(a, b);
            b = par[head[b]];
        }
        if(depth[a] > depth[b]) swap(a, b);
        return a;
    }

    vector<pii> query(int a, int b){
        vector<pii> ret;
        while(head[a] != head[b]){
            if(depth[head[a]] > depth[head[b]]) swap(a, b);
            ret.pb({in[head[b]], in[b]});
            b = par[head[b]];
        }
        if(depth[a] > depth[b]) swap(a, b);
        ret.pb({in[a], in[b]});
        return ret;
    }
} g1, g2;

int seg[20000000], left0[20000000], right0[20000000], sz = 1;
int rt[N];
int n, q, t;

int copy(int x){
    seg[sz] = seg[x];
    left0[sz] = left0[x];
    right0[sz] = right0[x];
    return sz++;
}

void update(int x, int v, int cur, int l = 0, int r = n - 1){
    if(l == r){
        seg[cur] += v;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, v, left0[cur] = copy(left0[cur]), l, mid);
    else update(x, v, right0[cur] = copy(right0[cur]), mid + 1, r);
    seg[cur] = seg[left0[cur]] + seg[right0[cur]];
}

int query(int l, int r, int cur, int ul = 0, int ur = n - 1){
    if(l <= ul && ur <= r) return seg[cur];
    if(ur < l || ul > r) return 0;
    int mid = (ul + ur)/2;
    return query(l, r, left0[cur], ul, mid) + query(l, r, right0[cur], mid + 1, ur);
}

vector<int> v;
int in[N];

void dfs(int x, int p = 0){
    v.pb(x);
    in[x] = v.size();
    for(int i : g2[x]){
        if(i == p) continue;
        dfs(i, x);
    }
    v.pb(x);
}

int main(){
    setIO();
    cin >> n >> q >> t;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g1[a].pb(b);
        g1[b].pb(a);
    }
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g2[a].pb(b);
        g2[b].pb(a);
    }
    g1.build(), g2.build();
    dfs(1);
    int rt[v.size() + 1];
    rt[0] = sz++;
    for(int i = 1; i <= v.size(); i++){
        rt[i] = copy(rt[i - 1]);
        if(i == in[v[i - 1]]) update(g1.in[v[i - 1]], 1, rt[i]);
        else update(g1.in[v[i - 1]], -1, rt[i]);
    }
    int prv = 0;
    while(q--){
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        ((a += prv*t - 1) %= n)++;
        ((b += prv*t - 1) %= n)++;
        ((c += prv*t - 1) %= n)++;
        ((d += prv*t - 1) %= n)++;
        vector<pii> tar = g1.query(a, b);
        int lca = g2.lca(c, d);
        prv = 0;
        for(pii i : tar){
            prv += query(i.ff, i.ss, rt[in[c]]);
            prv += query(i.ff, i.ss, rt[in[d]]);
            prv -= query(i.ff, i.ss, rt[in[lca]]);
            if(g2.par[lca] != lca) prv -= query(i.ff, i.ss, rt[in[g2.par[lca]]]);
        }
        cout << prv << "\n";
    }
}
```