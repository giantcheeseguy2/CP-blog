title: High Card Low Card (Tutorial)
date: 9-19-2022
tag: usaco, segtree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=577)

## Solution

Obviously, Bessie will want to play her largest cards in the high card wins section, while playing the smallest cards in the low card wins section. To see how many games bessie can win in a section is either counting the maximum number of pairings such that Bessie's card is greater or lower. This can be done by greedily matching each card to the closest smaller/greater card. Now, lets try to iterate over the optimal position, while transitioning fast. This can be maintained with a segtree with some casework in the merging.

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

struct st{
	int b = 0, e = 0, w = 0;
};

st seg[1000000];
int n;

void update(int x, int t, int v, int l = 0, int r = 2*n, int cur = 0){
	if(l == x && x == r){
		if(t == 0) seg[cur].b += v;
		else seg[cur].e += v;
		return;
	}
	int mid = (l + r)/2;
	if(x <= mid) update(x, t, v, l, mid, cur*2 + 1);
	else update(x, t, v, mid + 1, r, cur*2 + 2);
	seg[cur].w = seg[cur*2 + 1].w + seg[cur*2 + 2].w;
	if(seg[cur*2 + 1].b >= seg[cur*2 + 2].e){
		seg[cur].b = seg[cur*2 + 1].b - seg[cur*2 + 2].e + seg[cur*2 + 2].b;
		seg[cur].e = seg[cur*2 + 1].e;
		seg[cur].w += seg[cur*2 + 2].e;
	} else {
		seg[cur].b = seg[cur*2 + 2].b;
		seg[cur].e = seg[cur*2 + 2].e - seg[cur*2 + 1].b + seg[cur*2 + 1].e;
		seg[cur].w += seg[cur*2 + 1].b;
	}
}

st seg2[1000000];

void update2(int x, int t, int v, int l = 0, int r = 2*n, int cur = 0){
	if(l == x && x == r){
		if(t == 0) seg2[cur].b += v;
		else seg2[cur].e += v;
		return;
	}
	int mid = (l + r)/2;
	if(x <= mid) update2(x, t, v, l, mid, cur*2 + 1);
	else update2(x, t, v, mid + 1, r, cur*2 + 2);
	seg2[cur].w = seg2[cur*2 + 1].w + seg2[cur*2 + 2].w;
	if(seg2[cur*2 + 1].b >= seg2[cur*2 + 2].e){
		seg2[cur].b = seg2[cur*2 + 1].b - seg2[cur*2 + 2].e + seg2[cur*2 + 2].b;
		seg2[cur].e = seg2[cur*2 + 1].e;
		seg2[cur].w += seg2[cur*2 + 2].e;
	} else {
		seg2[cur].b = seg2[cur*2 + 2].b;
		seg2[cur].e = seg2[cur*2 + 2].e - seg2[cur*2 + 1].b + seg2[cur*2 + 1].e;
		seg2[cur].w += seg2[cur*2 + 1].b;
	}
}

int main(){
	freopen("cardgame.in", "r", stdin);
	freopen("cardgame.out", "w", stdout);
	setIO();
	cin >> n;
	set<int> s;
	for(int i = 1; i <= 2*n; i++) s.insert(i);
	vector<int> b, e;
	for(int i = 0; i < n; i++){
		int x;
		cin >> x;
		e.pb(x);
		s.erase(x);
		update(x, 1, 1);
	}
	for(int i : s) b.pb(i), update(i, 0, 1);
	sort(b.rbegin(), b.rend());
	int ans = seg[0].w;
	for(int i = 0; i < n; i++){
		update2(2*n - b[i], 0, 1);
		update2(2*n - e[i], 1, 1);
		update(b[i], 0, -1);
		update(e[i], 1, -1);
		ans = max(ans, seg[0].w + seg2[0].w);
	}
	cout << ans << endl;
}
```