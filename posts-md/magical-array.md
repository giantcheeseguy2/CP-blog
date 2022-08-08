title: Magical Array (Tutorial)
date: 8-3-2022
tag: codeforces, invariance, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1704/problem/D)

## Solution

For this problem, thinking about reconstructing the array \\(b\\) will get you nowhere, so lets try to find a different solution. How can we identify if some array \\(c\\) can be made from \\(b\\) using only operation \\(1\\)? We should try to find an invariance, something that doesn't change after any amount of operations. Obviously the sum is an invariant, but the sum of \\(i \\cdot c[i]\\) is also an invariant. This is true because moving a value from \\(l\\) to \\(l - 1\\), decreases that sum by \\(1\\), while moving a value from \\(r\\) to \\(r + 1\\) increases the sum by \\(1\\). However, in the second operation, this invariance does not hold. In this case, moving a value from \\(r\\) to \\(r + 2\\) increases the sum by \\(2\\). Now, we have a way to find both the special array and the number of operations to form it. Finding the special array is just the array with the largest sum. Each second operation increases the sum by \\(1\\), so the number of operations is the difference in sum between special and non special.

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

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        int n, m;
        cin >> n >> m;
        pll sum[n];
        for(int i = 0; i < n; i++){
            sum[i] = {0, i};
            for(int j = 1; j <= m; j++){
                ll x;
                cin >> x;
                sum[i].ff += j*x;
            }
        }
        sort(sum, sum + n);
        cout << sum[n - 1].ss + 1 << " " << sum[n - 1].ff - sum[0].ff << "\n";
    }
}
```