title: Gifts From Grandfather Ahmed (Tutorial)
date: 4-11-2023
tag: cf, math, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1798/problem/F)

## Solution

Finding a subset of size \\(x\\) in an array of size \\(2 \\cdot x - 1\\) that is a multiple of \\(x\\) is always possible by EGZ (Erdos Ginzburg Ziv) theorem. This is very similar to what is required in our problem, which is finding a subset of size \\(s_i\\) that is a multiple of \\(s_i\\). But how can we know how to optimally distribute the values such that for every group, we will end up with at least \\(2 \\cdot x - 1\\) elements remaining. Actually, this is always true if we process the elements in sorted order, since the remaining elements will always be at least \\(s_i + s_{i + 1}\\) and \\(s_{i + 1} > s_i\\). For the largest element, we will just use our extra value. Thus, it is always possible. When finding a subset that sums to a multiple, we can use dynamic programming since the bounds are small.

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
    int n, m;
    cin >> n >> m;
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i];
    pii val[m];

    for(int i = 0; i < m; i++){
        cin >> val[i].ff;
        val[i].ss = i;
    }
    sort(val, val + m);
    vector<int> ans[m];
    bool vis[n + 1];
    memset(vis, false, sizeof(vis));
    for(int i = 0; i < m; i++){
        int lim = val[i].ff;
        pii dp[n + 1][lim][lim + 1];
        for(int j = 0; j <= n; j++){
            for(int k = 0; k < lim; k++){
                for(int l = 0; l <= lim; l++){
                    dp[j][k][l] = {-1, -1};
                }
            }
        }
        dp[0][0][0] = {0, 0};
        for(int j = 1; j <= n; j++){
            for(int k = 0; k < lim; k++){
                for(int l = 0; l <= lim; l++){
                    if(!vis[j] && l){
                        int nxt = ((k - arr[j])%lim + lim)%lim;
                        if(dp[j - 1][nxt][l - 1].ff != -1){
                            dp[j][k][l] = {nxt, l - 1};
                        }
                    }
                    if(dp[j - 1][k][l].ff != -1){
                        dp[j][k][l] = {k, l};
                    }
                }
            }
        }
        if(dp[n][0][lim].ff == -1){
            int req = -1;
            for(int i = 0; i < lim; i++){
                if(dp[n][i][lim - 1].ff != -1){
                    req = lim - i;
                    break;
                }
            }
            pii cur = {lim - req, lim - 1};
            ans[val[i].ss].pb(req);
            cout << req << endl;
            for(int j = n; j > 0; j--){
                if(dp[j][cur.ff][cur.ss].ss < cur.ss){
                    vis[j] = true;
                    ans[val[i].ss].pb(arr[j]);
                }
                cur = dp[j][cur.ff][cur.ss];
            }
            continue;
        }
        pii cur = {0, lim};
        for(int j = n; j > 0; j--){
            if(dp[j][cur.ff][cur.ss].ss < cur.ss){
                vis[j] = true;
                ans[val[i].ss].pb(arr[j]);
            }
            cur = dp[j][cur.ff][cur.ss];
        }
    }
    for(int i = 0; i < m; i++){
        for(int j : ans[i]) cout << j << " ";
        cout << endl;
    }
}
```