title: Cow Dating (Tutorial)
date: 9-16-2022
tag: usaco, probabilities, two pointer, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=924)

## Solution

The probability that exactly one cow is chosen in an interval can be calculated easily with an equation. First of all, it is sort of intuitive that if the right endpoint is fixed, then the answer for any left endpoint will be some increasing then decreasing function. Thus, maintaining a two pointer will find the correct answer. You can prove that you never want to move the left pointer backwards by reducing the formula for adding a value.

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
typedef pair<int, int> pii;
typedef pair<ll, ll>   pll;

const int inf = 1000000000;
const int mod = 1000000007;
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

long double mx = 1e6;

long double prob, inv;

void add(long double x){
	prob *= (mx - x)/mx;
	prob += (x/mx)*inv;
	inv *= (mx - x)/mx;
}

void remove(long double x){
	inv /= (mx - x)/mx;
	prob -= (x/mx)*inv;
	prob /= (mx - x)/mx;
}

bool nxt(long double x){
	long double tmp = prob;
	remove(x);
	if(prob > tmp){
		add(x);
		return true;
	} else {
		add(x);
		return false;
	}
}

int main(){
	setIO();	
	int n;
	cin >> n;
	long double arr[n];
	for(int i = 0; i < n; i++) cin >> arr[i];
	long double ans = 0.;
	prob = 0.;
	inv = 1.;
	int l = 0;
	for(int i = 0; i < n; i++){
		add(arr[i]);
		while(l < i && nxt(arr[l])) remove(arr[l++]);
		ans = max(ans, prob);
	}
	cout << floor(ans*mx) << endl;
}
```