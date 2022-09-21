title: Raindrops (Tutorial)
date: 9-20-2022
tag: cf, dp, bitsets, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/396358/problem/B)

## Solution

The first observation needed is that the answer can always be represented montonically, as in, all possible answers can be obtained by using some subsequence of increasing pillars, then inserting the rest of the pillars somewhere in between. Thus, we can reduce the problem to putting every pillar in one of the sections defined by the distinct pillar heights. Now, we can do a dp and try placing each pillar into any one of the sections. This may seem that it would overcount the case where a pillar has to start its own section initially, but this is accounted for. Lets say you are trying to put value \\(a\\) into section \\(b\\). If \\(b\\) has not started its own section yet, then we can place \\(b\\) into some section \\(c\\), which means a \\(b\\) was just formed out of nowhere. However, this is equivalent to placing \\(a\\) into section \\(c\\), with \\(b\\) starting its own section, so this doesn't actually overcount anything.

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

const int SUM = 50000;

int main(){
    setIO();
    int n;
    cin >> n;
    vector<int> v(n);
    for(int i = 0; i < n; i++) cin >> v[i];
    sort(v.begin(), v.end());
    if(v[n - 1] != v[n - 2]) v[n - 1] = v[n - 2];
    int mx = v.back();
    vector<int> dict;
    for(int i = 0; i < v.size(); i++){
        if(i == 0) dict.pb(v[i]);
        else if(v[i] != v[i - 1]) dict.pb(v[i]);
    }
    bitset<SUM + 1> dp[v.size() + 1];
    dp[0][0] = true;
    for(int i = 1; i <= v.size(); i++){
        dp[i] = dp[i - 1];
        for(int k : dict){
            if(k >= v[i - 1]){
                k -= v[i - 1];
                dp[i] |= dp[i - 1] << k;
            }
        }
    }
    for(int i = 0; i <= SUM; i++) if(dp[v.size()][i]) cout << i << " ";
    cout << endl;
}
```