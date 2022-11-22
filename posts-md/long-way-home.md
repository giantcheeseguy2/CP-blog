title: Long Way Home (Tutorial)
date: 11-21-2022
tag: cf, dijikstra, graph, convex hull, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1715/E)

## Solution

Our optimal path looks will be to take some roads, and in between some segment of roads, we might want to take a flight. Since the number of flights are small, lets iterate over the number of flights and try to process the roads in between simultaneously. Let \\(dist[i] = \\) the shortest distance from node \\(i\\) to node \\(1\\). In between flights, we can run a multisource dijikstra from every node to update \\(dist[i]\\) simultaneously. Now, we just have to somehow find the minimum distance to another node for each \\(i\\) while taking a flight. The distance of a flight, \\((u - v)^2\\), can be simplified to \\(u^2- 2 \\cdot u \\cdot v + v^2\\). Thus, \\(dist[i] = min(dist[i], dist[j] + j^2 - 2 \\cdot i \\cdot j + i^2)\\) over all \\(j\\). This can be maintained with convex hull trick by letting \\(dist[j] + j^2\\) be the y intercept and \\(-2 \\cdot j\\) be the slope.

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

struct Line {
	mutable ll k, m, p;
	bool operator<(const Line& o) const { return k < o.k; }
	bool operator<(ll x) const { return p < x; }
};

struct LineContainer : multiset<Line, less<>> {
	// (for doubles, use inf = 1/.0, div(a,b) = a/b)
	static const ll inf = LLONG_MAX;
	ll div(ll a, ll b) { // floored division
		return a / b - ((a ^ b) < 0 && a % b); }
	bool isect(iterator x, iterator y) {
		if (y == end()) return x->p = inf, 0;
		if (x->k == y->k) x->p = x->m > y->m ? inf : -inf;
		else x->p = div(y->m - x->m, x->k - y->k);
		return x->p >= y->p;
	}
	void add(ll k, ll m) {
		auto z = insert({k, m, 0}), y = z++, x = y;
		while (isect(y, z)) z = erase(z);
		if (x != begin() && isect(--x, y)) isect(x, y = erase(y));
		while ((y = x) != begin() && (--x)->p >= y->p)
			isect(x, erase(y));
	}
	ll query(ll x) {
		assert(!empty());
		auto l = *lower_bound(x);
		return l.k * x + l.m;
	}
};

ll dist[100005];
int n, m, k;
vector<pii> g[100005];

void dij(){
    priority_queue<pll, vector<pll>, greater<pll>> q;
    for(int i = 1; i <= n; i++) if(dist[i] < LLINF) q.push({dist[i], i});
    while(!q.empty()){
        pll x = q.top();
        q.pop();
        if(x.ff > dist[x.ss]) continue;
        for(pii i : g[x.ss]){
            if(dist[i.ff] > x.ff + i.ss){
                dist[i.ff] = x.ff + i.ss;
                q.push({dist[i.ff], i.ff});
            }
        }
    }
}

int main(){
    setIO();
    cin >> n >> m >> k;
    for(int i = 0; i < m; i++){
        int a, b, c;
        cin >> a >> b >> c;
        g[a].pb({b, c});
        g[b].pb({a, c});
    }
    for(int i = 1; i <= n; i++) dist[i] = LLINF;
    dist[1] = 0;
    for(int i = 0; i < k; i++){
        dij();
        LineContainer cht;
        for(int i = 1; i <= n; i++) cht.add(2*i, -(ll)i*i - dist[i]);
        for(int i = 1; i <= n; i++) dist[i] = min(dist[i], -(cht.query(i) - (ll)i*i));
    }
    dij();
    for(int i = 1; i <= n; i++) cout << dist[i] << " ";
    cout << endl;
}
```