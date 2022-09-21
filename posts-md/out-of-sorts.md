title: Out Of Sorts (Tutorial)
date: 9-20-2022
tag: usaco, ad hoc, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=840)

## Solution

The first observation needed is that an index only dissapears once its left and right both become partition points. This is also it's contribution to the answer. So now, we only have to figure out when something becomes a partition point. Notice that after every bubble sort, if a value belongs to the left of a point, but is currently to the right, then it will move to the left by exactly one. Then the amount of time before a point becomes a partiton point is just the distance to the furthest value that belongs on the left but is on the right. After finding this, we can just go through the array and sum the max of adjacent partition points.

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

int main(){
    setIO();
    //freopen("sort.in", "r", stdin);
    //freopen("sort.out", "w", stdout);
    int n;
    cin >> n;
    pii arr[n];
    for(int i = 0; i < n; i++) cin >> arr[i].ff, arr[i].ss = i;
    sort(arr, arr + n);
    int val[n + 1], pos[n + 1];
    for(int i = 0; i < n; i++) val[arr[i].ss + 1] = i + 1;
    for(int i = 1; i <= n; i++) pos[val[i]] = i;
    int inv[n + 2];
    memset(inv, 0, sizeof(inv)); 
    int mx = 0;
    for(int i = 2; i <= n; i++){
        mx = max(mx, pos[i - 1]);
        inv[i] = mx - i + 1;
    }
    ll ans = 0;
    for(int i = 1; i <= n; i++){
        ans += max(1, max(inv[i], inv[i + 1]));
    }
    cout << ans << endl;
}
```