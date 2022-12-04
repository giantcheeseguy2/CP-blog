title: Partition And Sum (Tutorial)
date: 12-2-2022
tag: cf, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/412114/problem/A)

## Solution

What does a partition of the array represent? It is actually uniquely determined by the prefix sums at the inbetween positions of the partition. So this problem actually becomes counting distinct sequences of the array after converting each index to its prefix sum. Note that we have to force every value to be taken, so the answer in this case is \\(dp[n - 1]\\) instead of \\(dp[n]\\). Another way to think about the problem after getting the prefix sum reduction is to greedily transition. The intuitive transitions is to let \\(dp[i] = \\sum dp[j]\\), where \\(j < i\\) and it is the rightmost occurence of its prefix sum value. This works since the rightmost occurence of each value will store the data for every occurence of that value and then some, so counting anything else would just be overcounting. 

## Code

Distinct subsequences 

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
    int n;
    cin >> n;
    ll pre[n + 1];
    pre[0] = 0;
    for(int i = 1; i <= n; i++){
        int x;
        cin >> x;
        pre[i] = pre[i - 1] + x;
    }
    int dp[n];
    dp[0] = 1;
    int sum = 1;
    map<ll, int> prv;
    for(int i = 1; i < n; i++){
        dp[i] = (ll)dp[i - 1]*2%MOD;
        if(prv.find(pre[i]) != prv.end()) dp[i] = (dp[i] + MOD - dp[prv[pre[i]] - 1])%MOD;
        prv[pre[i]] = i;
    }
    cout << dp[n - 1] << endl;
}
```

Greedy

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
    int n;
    cin >> n;
    ll pre[n + 1];
    pre[0] = 0;
    for(int i = 1; i <= n; i++){
        int x;
        cin >> x;
        pre[i] = pre[i - 1] + x;
    }
    int dp[n + 1];
    dp[0] = 1;
    int sum = 1;
    map<ll, int> prv;
    for(int i = 1; i <= n; i++){
        dp[i] = sum;
        sum = (sum + dp[i])%MOD;
        if(prv.find(pre[i]) != prv.end()) sum = (sum + MOD - dp[prv[pre[i]]])%MOD;
        prv[pre[i]] = i;
    }
    cout << dp[n] << endl;
}
```