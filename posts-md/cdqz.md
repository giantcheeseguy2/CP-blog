title: CDQZ (Tutorial)
date: 12-3-2022
tag: luogu, centroid decomposition, segtree, tutorial

---

## Problem Statement

[Problem Link](https://www.luogu.com.cn/problem/P5311)

## Solution

How can we count the number of nodes reachable from \\(x\\)'s component in every query? Notice that for two nodes to be able to reach each other, the nodes on their path must all be in the range \\([l, r]\\). For a component, it actually doesn't matter which one we set as the root, the condition will still hold true between any node and that root. This suggests a solution where we do a centroid decomposition, with the queries being handled offline at the centroid with the largest layer possible, since every centroid connected to it with a lower layer will be contained in the higher centroid subtree. This will account for every possible relevant node since all paths from \\(x\\) have to have a midpoint somewhere between \\(x\\) and the root of the centroid tree. This means we can just manually check all the \\(log N\\) parents of \\(x\\) and put the query at the one with the largest layer. Then, to find the set of all reachable nodes, we know the max and min of the path from every node to the centroid, let this be \\([mn_i, mx_i]\\). Then, for every query, we are counting the number of intervals \\([mn_i, mx_i]\\) that are contained inside \\([l, r]\\). To extend this to distinct value queries, we can use a similar method to normal distinct value queries, except in this version, the entry point for each value will be the \\(mx_i\\), and the position that we update will be \\(mn_i\\). It is easy to see that this works.

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

vector<int> g[100005];
int col[100005], sub[100005];
bool vis[100005];

int dfs1(int x, int p = 0){
    sub[x] = 1;
	for(int i : g[x]){
        if(i == p || vis[i]) continue;
		sub[x] += dfs1(i, x);
	}
	return sub[x];
}

int centroid(int x, int tar, int p = 0){
	for(int i : g[x]){
        if(i == p || vis[i]) continue;
		if(sub[i]*2 > tar) return centroid(i, tar, x);
	}
	return x;
}

vector<pair<pii, int>> child[100005];
vector<pair<pii, int>> par[100005];

void dfs2(int x, int p, int t, int mn, int mx){
    mn = min(mn, x);
    mx = max(mx, x);
    child[t].pb({{mn, mx}, x});
    par[x].pb({{mn, mx}, t});
    for(int i : g[x]){
        if(i == p) continue;
        if(vis[i]) continue;
        dfs2(i, x, t, mn, mx);
    }
}

void build(int x, int p = 0){
	int c = centroid(x, dfs1(x));
	vis[c] = true;
    child[c].pb({{c, c}, c});
    for(int i : g[c]) if(!vis[i]) dfs2(i, c, c, c, c);
	for(int i : g[c]) if(!vis[i]) build(i, c);
}

vector<pair<pii, int>> que[100005];
int bit[100005];
int prv[100005];

void update(int x, int v){
    for(; x <= 1e5; x += x & (-x)) bit[x] += v;
}

int query(int x, int ret = 0){
    for(; x; x -= x & (-x)) ret += bit[x];
    return ret;
}

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    for(int i = 1; i <= n; i++) cin >> col[i];
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    build(1);
    int ans[q];
    for(int i = 0; i < q; i++){
        int l, r, x;
        cin >> l >> r >> x;
        for(auto j : par[x]){
            if(l <= j.ff.ff && j.ff.ss <= r){
                x = j.ss;
                break;
            }
        }
        que[x].pb({{l, r}, i});
    }
    for(int i = 1; i <= n; i++){
        if(!que[i].size()) continue;
        vector<pair<pii, pii>> v;
        for(auto j : child[i]) v.pb({{j.ff.ss, 0}, {j.ff.ff, col[j.ss]}});
        for(auto j : que[i]) v.pb({{j.ff.ss, 1}, {j.ff.ff, j.ss}});
        sort(v.begin(), v.end());
        vector<int> vis;
        for(auto j : v){
            if(j.ff.ss){
                ans[j.ss.ss] = query(j.ff.ff) - query(j.ss.ff - 1);
            } else {
                vis.pb(j.ss.ss);
                if(j.ss.ff > prv[j.ss.ss]){
                    if(prv[j.ss.ss]) update(prv[j.ss.ss], -1);
                    prv[j.ss.ss] = j.ss.ff;
                    update(prv[j.ss.ss], 1);
                }
            }
        }
        for(int i : vis) if(prv[i]){
            update(prv[i], -1);
            prv[i] = 0;
        }
    }
    for(int i = 0; i < q; i++) cout << ans[i] << endl;
}
```