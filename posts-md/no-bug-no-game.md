title: No Bug No Game (Tutorial)
date: 1-3-2023
tag: cf, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/104090/problem/C)

## Solution

Notice that at most one item will satisfy the \\(sum < k\\) and \\(sum + p_i > k\\) case. Lets say you knew what this item was and you knew what \\(k - sum\\) was. Then the problem just becomes doing a 0-1 knapsack on the rest of the items. So lets fix the item and try to optimize. Recomputing the knapsack is slow, so instead, we will store a knapsack on the prefixes and suffixes. If we fix the item and \\(k - sum\\), we can merge the prefix and suffix, thus excluding the item, in \\(O(k)\\) time.

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
    int n, k;
    cin >> n >> k;
    int pre[n + 1][k + 1];
    int suf[n + 2][k + 1];
    for(int i = 0; i <= n; i++) for(int j = 0; j <= k; j++) pre[i][j] = -INF;
    for(int i = 0; i <= n + 1; i++) for(int j = 0; j <= k; j++) suf[i][j] = -INF;
    vector<int> arr[n + 1];
    for(int i = 1; i <= n; i++){
        int sz;
        cin >> sz;
        for(int j = 0; j < sz; j++){
            int x;
            cin >> x;
            arr[i].pb(x);
        }
    }
    pre[0][0] = 0;
    for(int i = 1; i <= n; i++){
        for(int j = 0; j < min(k, (int)arr[i].size()); j++) pre[i][j] = pre[i - 1][j];
        for(int j = arr[i].size(); j <= k; j++){
            pre[i][j] = max(pre[i - 1][j], pre[i - 1][j - arr[i].size()] + arr[i].back());
        }
    }
    suf[n + 1][0] = 0;
    for(int i = n; i >= 1; i--){
        for(int j = 0; j < min(k, (int)arr[i].size()); j++) suf[i][j] = suf[i + 1][j];
        for(int j = arr[i].size(); j <= k; j++){
            suf[i][j] = max(suf[i + 1][j], suf[i + 1][j - arr[i].size()] + arr[i].back());
        }
    }
    int ans = 0;
    for(int i = 0; i <= k; i++) ans = max(ans, pre[n][i]);
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= arr[i].size(); j++){
            for(int x = 0; x <= k - j; x++){
                ans = max(ans, pre[i - 1][x] + suf[i + 1][k - j - x] + arr[i][j - 1]);
            }
        }
    }
    cout << ans << endl;
}
```