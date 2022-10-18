title: United Cows Of Farmer John (Tutorial)
date: 10-17-2022
tag: usaco, segtree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=1140)

## Solution

Lets try to fix an interval \\([l, r]\\) where \\(b_l\\) and \\(b_r\\) don't appear in the interval. The answer for that interval is just the number of cows that appear exactly once in \\([l + 1, r - 1]\\). Now, lets iterate over \\(r\\) and try to maintain the answer for all \\(l\\) simultaneously. Lets define \\(prv[i]\\) as previous index with the same type as \\(i\\). \\(pprv[i]\\) will be the index of the next previous index with the same type as \\(i\\). First of all, when transitioning to \\(i\\), \\(prv[i]\\) can no longer be a valid \\(l\\), so we should set it to \\(0\\), and never update it again. We should also subtract \\(1\\) from the range \\([pprv[i] + 1, prv[i] - 1]\\), since those left endpoints have just lost a value that only occurs once. Finally, we add \\(1\\) to the range \\([prv[i] + 1, i - 1]\\), since those left endpoints have just gained a value that only occurs once. This can be maintained with a lazy segtree with a few modifications to allow permanent removal of indeces. For every \\(i\\), the answer then increases by the sum of \\([prv[i] + 1, i - 2]\\), since the interval must be at least size \\(3\\), and \\(i\\) cannot occur again.

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

int seg[800005], tag[800005], n;
int sz[800005];

void build(int l = 1, int r = n, int cur = 0){
	if(l == r){
		sz[cur] = 1;
		return;
	}
	int mid = (l + r)/2;
	build(l, mid, cur*2 + 1);
	build(mid + 1, r, cur*2 + 2);
	sz[cur] = sz[cur*2 + 1] + sz[cur*2 + 2];
}

void push_down(int x, int l, int r){
	if(!tag[x]) return;
	for(int i = x*2 + 1; i <= x*2 + 2; i++){
		seg[i] += sz[i]*tag[x];
		tag[i] += tag[x];
	}
	tag[x] = 0;
}

void update(int l, int r, int v, int ul = 1, int ur = n, int cur = 0){
	if(l > r) return;
	if(l <= ul && ur <= r){
		seg[cur] += v*sz[cur];
		tag[cur] += v;
		return;
	}
	push_down(cur, ul, ur);
	int mid = (ul + ur)/2;
	if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
	if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
	seg[cur] = seg[cur*2 + 1] + seg[cur*2 + 2];
}

void upd(int x, int l = 1, int r = n, int cur = 0){
	if(l == r){
		seg[cur] = 0;
		tag[cur] = 0;
		sz[cur] = 0;
		return;
	}
	push_down(cur, l, r);
	int mid = (l + r)/2;
	if(x <= mid) upd(x, l, mid, cur*2 + 1);
	else upd(x, mid + 1, r, cur*2 + 2);
	seg[cur] = seg[cur*2 + 1] + seg[cur*2 + 2];
	sz[cur] = sz[cur*2 + 1] + sz[cur*2 + 2];
}

int query(int l, int r, int ul = 1, int ur = n, int cur = 0){
	if(l > r) return 0;
	if(l <= ul && ur <= r) return seg[cur];
	if(ur < l || ul > r) return 0;
	push_down(cur, ul, ur);
	int mid = (ul + ur)/2;
	return query(l, r, ul, mid, cur*2 + 1) + query(l, r, mid + 1, ur, cur*2 + 2);
}

int main(){
	setIO();
	cin >> n;
	int arr[n + 1];
	for(int i = 1; i <= n; i++) cin >> arr[i];
	int prv[n + 1];
	int pprv[n + 1];
	memset(prv, 0, sizeof(prv));
	memset(pprv, 0, sizeof(pprv));
	ll ans = 0;
	build();
	for(int i = 1; i <= n; i++){
		ans += query(prv[arr[i]] + 1, i - 2);
		update(pprv[arr[i]] + 1, prv[arr[i]] - 1, -1);
		update(prv[arr[i]] + 1, i - 1, 1);
		if(prv[arr[i]]) upd(prv[arr[i]]);
		pprv[arr[i]] = prv[arr[i]];
		prv[arr[i]] = i;
	}
	cout << ans << endl;
}
```