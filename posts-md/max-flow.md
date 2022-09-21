title: Max Flow (Tutorial)
date: 9-19-2022
tag: usaco, hld, tree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=576)

## Solution

This is a template problem that can be solved with hld.

## Code

```c++
#include <bits/stdc++.h>
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
typedef pair<ll, ll>   pll;
typedef pair<ld, ld> pld;

const int inf = 1e9;
const ll llinf = 1e18;
const int mod = 1e9 + 7;
const double PI = acos(-1);

struct chash {
	const uint64_t C = ll(2e18*PI)+71;
	const int RANDOM = rand();
	ll operator()(ll x) const {
		return __builtin_bswap64((x^RANDOM)*C);
	}
};

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;
template<class K, class V> using gphash = gp_hash_table<K, V, chash, equal_to<K>, direct_mask_range_hashing<>, linear_probe_fn<>, hash_standard_resize_policy< hash_exponential_size_policy<>, hash_load_check_resize_trigger<>, true> >;

inline ll ceil0(ll a, ll b) {
	return a / b + ((a ^ b) > 0 && a % b);
}

inline ll floor0(ll a, ll b) {
	return a / b - ((a ^ b) < 0 && a % b);
}

void setIO() {
	ios_base::sync_with_stdio(0); cin.tie(0);
}

int n, k, t;
vector<int> g[100000];
int depth[100000], head[100000], par[100000], sz[100000];
int in[100000], out[100000];

int seg[1000000], add[1000000];

void push_down(int x){
	for(int i = x*2 + 1; i <= x*2 + 2; i++){
		seg[i] += add[x];
		add[i] += add[x];
	}
	add[x] = 0;
}

void update(int l, int r, int ul = 0, int ur = t, int cur = 0){
	if(l <= ul && ur <= r){
		add[cur]++;
		seg[cur]++;
		return;
	}
	if(ul > r || ur < l || ul > ur) return;
	push_down(cur);
	int mid = (ul + ur)/2;
	update(l, r, ul, mid, cur*2 + 1);
	update(l, r, mid + 1, ur, cur*2 + 2);
}

int query(int x, int l = 0, int r = t, int cur = 0){
	if(l == x && x == r) return seg[cur];
	push_down(cur);
	int mid = (l + r)/2;
	if(x <= mid) return query(x, l, mid, cur*2 + 1);
	else return query(x, mid + 1, r, cur*2 + 2);
}

void dfs1(int x, int p){
	par[x] = p;
	depth[x] = depth[p] + 1;
	sz[x] = 1;
	for(int &i : g[x]){
		if(i == p) continue;
		dfs1(i, x);
		sz[x] += sz[i];
		if(g[x][0] == p || sz[i] > sz[g[x][0]]) swap(i, g[x][0]);
	}
}

void dfs2(int x, int p){
	in[x] = t++;
	for(int i : g[x]){
		if(i == p) continue;
		head[i] = (i == g[x][0] ? head[x] : i);
		dfs2(i, x);
	}
	out[x] = t;
}

void upd(int a, int b){
	while(head[a] != head[b]){
		if(depth[head[a]] < depth[head[b]]) swap(a, b);
		update(in[head[a]], in[a]);
		a = par[head[a]];
	}
	if(depth[a] > depth[b]) swap(a, b);
	update(in[a], in[b]);
}

int main(){
	freopen("maxflow.in", "r", stdin);
	freopen("maxflow.out", "w", stdout);
	setIO();
	cin >> n >> k;
	for(int i = 0; i < n - 1; i++){
		int a, b;
		cin >> a >> b;
		g[a].pb(b);
		g[b].pb(a);
	}
	dfs1(1, 1);
	head[1] = 1;
	dfs2(1, 1);
	while(k--){
		int a, b;
		cin >> a >> b;
		upd(a, b);
	}
	int ans = 0;
	for(int i = 1; i <= n; i++){
		ans = max(ans, query(in[i]));
	}
	cout << ans << endl;
}
```