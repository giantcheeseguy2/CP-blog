title: The Way Home (Tutorial)
date: 3-9-2023
tag: cf, dp, graph, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1801/problem/D)

## Solution

This seems like a convex hull trick problem, but in order to do so would require bellman ford and some suboptimal time complexity for merging hulls. So instead, lets consider a path from \\(1\\) to \\(N\\). Actually, we can notice that we only want to do performances at each prefix maximum value, since otherwise, we could've done performances before that for a better value. Thus, the problem becomes choosing some subsequence of increasing nodes to perform at, at always performing as little as possible to be able to go to the next city. We know we always want to do the minimum performances at an earlier node, since doing them at later nodes will always have more value. Of course, we should also store the maximum extra money we have after doing the minimum number of performances for a node. Finding the shortest path from one node to another can be precomputed using floyd warshall.

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
        int n, m, p;
        cin >> n >> m >> p;
        ll g[n + 1][n + 1];
        pll arr[n + 1];
        for(int i = 1; i <= n; i++) cin >> arr[i].ff, arr[i].ss = i;
        for(int i = 0; i <= n; i++) for(int j = 0; j <= n; j++) g[i][j] = LLINF;
        for(int i = 1; i <= n; i++) g[i][i] = 0;
        for(int i = 0; i < m; i++){
            ll a, b, c;
            cin >> a >> b >> c;
            g[a][b] = min(g[a][b], c);
        }
        for(int i = 1; i <= n; i++){
            for(int j = 1; j <= n; j++){
                for(int k = 1; k <= n; k++){
                    g[j][k] = min(g[j][k], g[j][i] + g[i][k]);
                }
            }
        }
        sort(arr + 1, arr + n + 1); 
        ll dp[n + 1], rem[n + 1];
        for(int i = 0; i <= n; i++) dp[i] = LLINF, rem[i] = 0;
        dp[1] = 0;
        rem[1] = p;
        for(int i = 1; i <= n; i++){
            int cur = arr[i].ss;
            for(int j = 1; j <= n; j++){
                if(g[cur][j] == LLINF) continue;
                ll add = max((ll)0, g[cur][j] - rem[cur]);
                if(dp[cur] + ceil0(add, arr[i].ff) < dp[j]){
                    dp[j] = dp[cur] + ceil0(add, arr[i].ff);
                    rem[j] = rem[cur] - g[cur][j] + ceil0(add, arr[i].ff)*arr[i].ff;
                } else if(dp[cur] + ceil0(add, arr[i].ff) == dp[j]){
                    rem[j] = max(rem[j], rem[cur] - g[cur][j] + ceil0(add, arr[i].ff)*arr[i].ff);
                }
            }
        }
        if(dp[n] == LLINF) cout << -1 << endl;
        else cout << dp[n] << endl;
    }
}
```