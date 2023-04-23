title: Long Legs (Tutorial)
date: 4-22-2023
tag: cf, brute force, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1814/problem/B)

## Solution

A simple strategy for the robot would be to fix some target length \\(x\\), change the leg length to \\(x\\), then jump that length. However, how do we deal with the remaining length? Actually, since the remainder is always smaller than \\(x\\), we can just do that jump while we are still changing leg length. Thus, for a given \\(x\\), the answer is \\(\\lceil \\frac{a}{x} \\rceil + \\lceil \\frac{b}{x} \\rceil + x - 1\\). Since we know the answer is bounded by around \\(\\sqrt{10^9}\\), we can just iterate over \\(x\\) up to some value like \\(10^5\\) and find the minimum of all those.

## Code

```c++
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse4,popcnt,abm,mmx,tune=native")
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
        int a, b;
        cin >> a >> b;
        ll ans = LLINF;
        for(int i = 1; i <= 1e5; i++){
            ans = min(ans, ceil0(a, i) + ceil0(b, i) + i - 1);
        }
        cout << ans << endl;
    }
}
```