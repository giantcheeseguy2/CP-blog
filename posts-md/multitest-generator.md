title: Multitest Generator (Tutorial)
date: 4-18-2023
tag: cf, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1798/problem/E)

## Solution

It is easy to see that the number of changes is at most \\(2\\), where we can always change the first value and the last value jumped to. It is also easy to check if the answer is \\(0\\), which can be done in linear time. Thus, we have to know if the answer is \\(1\\) or not. There are two ways an answer can be one. We either change the first value, or change some value that we will end up jumping to. The former is easy to check. For the latter, lets process the array backwards and see what happens. Let \\(dp[i][0]\\) denote the number of jumps it takes from \\(i\\) to get to the end, or \\(-INF\\) if you can't reach the end exactly. When changing \\(i\\), we can see that we will be able to transition from \\(i\\) to any \\(dp[j][0]\\) such that \\(j > i\\). Since, for every value of \\(dp[i][0]\\) other than \\(-INF\\), there must exist a value of \\(dp[i][0] - 1\\), our transitions will always cover some continuous interval starting from \\(0\\). Let \\(dp[i][1]\\) denote the set of values we can obtain after doing one jump. This turns out to also cover some continous interval starting from \\(1\\), since for every \\(dp[i][1]\\), \\(dp[i][1] - 1\\) must exist, in either a \\(dp[i][0]\\) or its original \\(dp[j][1]\\) transition. In the \\(dp[i][0]\\) case, we can just directly move to there, and in the other \\(dp[i][1]\\) case, we know that it also covers a continous interval so we can also just move there.

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
        int n;
        cin >> n;
        int arr[n + 1];
        for(int i = 1; i <= n; i++) cin >> arr[i];
        int dp[n + 2][2];
        int mx = -INF;
        dp[n + 1][1] = 0;
        dp[n + 1][0] = 0;
        int ans[n + 1];
        for(int i = n; i >= 1; i--){
            if(i + arr[i] + 1 > n + 1){
                dp[i][0] = -INF;
                dp[i][1] = 1;
            } else if(i + arr[i] + 1 <= n + 1){
                dp[i][0] = dp[i + arr[i] + 1][0] + 1;
                dp[i][1] = dp[i + arr[i] + 1][1] + 1;
            }
            dp[i][1] = max(dp[i][1], mx + 1);
            mx = max(mx, dp[i][0]);
            if(i < n){
                if(arr[i] == dp[i + 1][0]) ans[i] = 0;
                else if(arr[i] <= dp[i + 1][1] || dp[i + 1][0] > 0) ans[i] = 1;
                else ans[i] = 2;
            }
        }
        for(int i = 1; i < n; i++) cout << ans[i] << " ";
        cout << endl;
    }
}
```