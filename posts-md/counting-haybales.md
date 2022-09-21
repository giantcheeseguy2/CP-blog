title: Counting Haybales (Tutorial)
date: 9-20-2022
tag: usaco, segtree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=578)

## Solution

This is a template problem that can be solved with lazy segtree.

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

pll seg[1000000];
ll add[1000000];

int n;

void push_down(int x, int l, int r){
	seg[x*2 + 1].ss += add[x];
	seg[x*2 + 2].ss += add[x];
	add[x*2 + 1] += add[x];
	add[x*2 + 2] += add[x];
	int mid = (l + r)/2;
	seg[x*2 + 1].ff += add[x]*(mid - l + 1);
	seg[x*2 + 2].ff += add[x]*(r - mid);
	add[x] = 0;
}

void update(int l, int r, ll v, int ul = 0, int ur = n, int cur = 0){
	if(l <= ul && ur <= r){
		seg[cur].ff += v*(ur - ul + 1);
		seg[cur].ss += v;
		add[cur] += v;
		return;
	}
	if(ul > r || ur < l || ul > ur) return;
	push_down(cur, ul, ur);
	int mid = (ul + ur)/2;
	update(l, r, v, ul, mid, cur*2 + 1);
	update(l, r, v, mid + 1, ur, cur*2 + 2);
	seg[cur].ff = seg[cur*2 + 1].ff + seg[cur*2 + 2].ff;
	seg[cur].ss = min(seg[cur*2 + 1].ss, seg[cur*2 + 2].ss);
}

pll query(int l, int r, int ul = 0, int ur = n, int cur = 0){
	if(l <= ul && ur <= r) return seg[cur];
	if(ul > r || ur < l || ul > ur) return {0, llinf};
	push_down(cur, ul, ur);
	int mid = (ul + ur)/2;
	pll a = query(l, r, ul, mid, cur*2 + 1), b = query(l, r, mid + 1, ur, cur*2 + 2);
	return {a.ff + b.ff, min(a.ss, b.ss)};
}

int main(){
	freopen("haybales.in", "r", stdin);
	freopen("haybales.out", "w", stdout);
	setIO();
	int q;
	cin >> n >> q;
	for(int i = 1; i <= n; i++){
		int x;
		cin >> x;
		update(i, i, x);
	}
	while(q--){
		char t;
		cin >> t;
		int a, b, c;
		cin >> a >> b;
		if(t == 'M') cout << query(a, b).ss << endl;
		if(t == 'S') cout << query(a, b).ff << endl;
		if(t == 'P') cin >> c, update(a, b, c);
	}
}
```