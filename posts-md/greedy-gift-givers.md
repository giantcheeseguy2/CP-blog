title: Greedy Gift Givers (Tutorial)
date: 9-16-2022
tag: usaco, binary search, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=770)

## Solution

Lets try to brute force the first position that is blocked indefinitely. How can we check if everything before it will infinitely cycle? A slow way would be to simulate it. Go through every value, and there are two cases: either it goes behind the target position and shifts it forward by one, or goes in front of it and does nothing. Since we cycle infinitely the order that we process the indeces actually doesn't matter. If we can process it in the worse case, where the smallest value indeces go first, then that will just give us the solution after simulating it some amount of times. Now, we can optimize this further by reducing the linear search to a binary serach, since if a cow is excluded, then everything behind it is excluded as well.

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

int n;
int arr[100005];

bool check(int x){
    vector<int> v;
    for(int i = 0; i < n - x; i++) v.pb(arr[i]);
    sort(v.begin(), v.end());
    bool vis = false;
    for(int i : v){
        if(i < x) x++;
        else {
            vis = true;
            break;
        }
    }
    return vis;
}

int main(){
    setIO();
    freopen("greedy.in", "r", stdin);
    freopen("greedy.out", "w", stdout);
    cin >> n;
    for(int i = 0; i < n; i++) cin >> arr[i];
    int l = 0, r = n;
    while(l < r){
        int mid = (l + r + 1)/2;
        if(check(mid)) l = mid;
        else r = mid - 1;
    }
    cout << l << endl;
}
```