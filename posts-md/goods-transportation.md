title: Goods Transportation (Tutorial)
date: 8-1-2022
tag: codeforces, flows, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/724/problem/E)

## Solution

This problem seems like a flows problem. In fact, there is a flows solution. For every \\(i\\), draw an edge from source to \\(i\\) with \\(p_i\\) capacity, and draw an edge from \\(i\\) to sink with \\(s_i\\) capacity. Then, draw an edge between every pair \\(i < j\\) with capacity \\(c\\). The answer is just the max flow. Obviously, this graph is too dense to run flows, so lets try to optimize. Notice that the max flow is equal to the min cut (the minimum over all partitions of the nodes into two sets, one containing the source and the other containing the sink, sum of edge weights from nodes in the first set to second set). Min cut can be solved for using dynamic programming. \\(dp[i][j]\\) is the min cut using the first \\(i\\) nodes, and with \\(j\\) nodes in the first set. When transitioning, \\(dp[i][j] = min(dp[i - 1][j - 1] + s_i, dp[i - 1][j] + p_i + c \\cdot j) \\). \\(s_i\\) and \\(p_i\\) are the edge weights from \\(i\\) to the source/sink of the opposite set. \\(c \\cdot j\\) is the sum of edge weights of edges from the first set leading to the second set when adding \\(i\\) to the second set. 

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
    int n, c;
    cin >> n >> c;
    int arr[n + 1], cap[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i];
    for(int i = 1; i <= n; i++) cin >> cap[i]; 
    ll dp[2][n + 1];
    for(int j = 0; j <= n; j++) dp[0][j] = dp[1][j] = LLINF;
    dp[0][0] = 0;
    for(int i = 1; i <= n; i++){
        for(int j = 0; j <= n; j++){
            //put into set A
            if(j) dp[1][j] = min(dp[1][j], dp[0][j - 1] + cap[i]);
            //put into set B
            dp[1][j] = min(dp[1][j], dp[0][j] + arr[i] + (ll)j*c);
        }
        for(int j = 0; j <= n; j++) dp[0][j] = dp[1][j], dp[1][j] = LLINF;
    }
    ll ans = LLINF;
    for(int i = 0; i <= n; i++) ans = min(ans, dp[0][i]);
    cout << ans << endl;
}
```