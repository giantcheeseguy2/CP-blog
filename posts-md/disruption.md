title: Disruption (Tutorial)
date: 9-16-2022
tag: usaco, tree, hld, segtree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=842)

## Solution

Check the minimum edge between two components after removing an edge is too hard. Instead, we can update all of the extra edges before hand, since an extra edge will only possibly affect all edges on the path between its too endpoints. This can be done using a hld supporting chmin.

## Code

```c++
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

int seg[200005], head[50005], par[50005], sub[50005], in[50005], depth[50005], tim = 0;
vector<int> g[50005];

void dfs1(int x, int p){
    sub[x] = 1;
    for(int &i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
        sub[x] += sub[i];
        if(g[x][0] == p || sub[i] > sub[g[x][0]]) swap(i, g[x][0]);
    }
}

void dfs2(int x, int p){
    depth[x] = depth[p] + 1;
    par[x] = p;
    in[x] = tim++;
    for(int &i : g[x]){
        if(i == p) continue;
        head[i] = (i == g[x][0] ? head[x] : i);
        dfs2(i, x);
    }
}

void update(int l, int r, int v, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l > r) return;
    if(l <= ul && ur <= r){
        seg[cur] = min(seg[cur], v);
        return;
    }
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
}

int query(int x, int l = 0, int r = tim - 1, int cur = 0){
    if(l == r) return seg[cur];
    int mid = (l + r)/2;
    seg[cur*2 + 1] = min(seg[cur*2 + 1], seg[cur]);
    seg[cur*2 + 2] = min(seg[cur*2 + 2], seg[cur]);
    if(x <= mid) return query(x, l, mid, cur*2 + 1);
    else return query(x, mid + 1, r, cur*2 + 2);
}

void upd(int a, int b, int c){
    while(head[a] != head[b]){
        if(depth[head[a]] > depth[head[b]]) swap(a, b);
        update(in[head[b]], in[b], c);
        b = par[head[b]];
    }
    if(depth[a] > depth[b]) swap(a, b);
    update(in[a] + 1, in[b], c);
}

int main(){
    setIO();
    freopen("disrupt.in", "r", stdin);
    freopen("disrupt.out", "w", stdout);
    int n, q;
    cin >> n >> q;
    vector<pii> e;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        e.pb({a, b});
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs1(1, 1);
    head[1] = 1;
    dfs2(1, 1);
    for(int i = 0; i <= 4*tim; i++) seg[i] = INF;
    while(q--){
        int a, b, c;
        cin >> a >> b >> c;
        upd(a, b, c);
    }
    for(pii i : e){
        if(depth[i.ff] > depth[i.ss]) swap(i.ff, i.ss);
        int ans = query(in[i.ss]);
        cout << (ans == INF ? -1 : ans) << endl;
    }
}
```