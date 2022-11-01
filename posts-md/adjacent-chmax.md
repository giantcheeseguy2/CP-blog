title: Adjacent Chmax (Tutorial)
date: 10-31-2022
tag: usaco, dp, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=972)

## Solution

The value at index \\(i\\), \\(v_i\\) can cover the interval to the previous value \\(\\ge v_i\\) and the next value \\(\\ge v_i\\), lets call this \\([l_i, r_i]\\). So this problem is basically the same as counting the number of ways to construct an array using a set of given intervals. Let \\(dp[i][j] = \\) the number of ways when at the \\(i\\)th index's value with the array constructed up to index \\(j\\). Now you just have to transition the number of ways to add an interval that is contained within \\([l_i, r_i]\\). This can be done with a prefix sum.

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
const int MOD = 998244353;

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
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i];
    int dp[n + 1][n + 1];
    memset(dp, 0, sizeof(dp));
    dp[0][0] = 1;
    for(int i = 1; i <= n; i++){
        int l = i, r = i;
        while(l - 1 >= 1 && arr[l - 1] <= arr[i]) l--;
        while(r + 1 <= n && arr[r + 1] <= arr[i]) r++;
        for(int j = 0; j <= n; j++) dp[i][j] = dp[i - 1][j];
        int sum = 0;
        for(int j = l; j <= r; j++){
            sum = (sum + dp[i - 1][j - 1])%MOD;
            dp[i][j] = (dp[i][j] + sum)%MOD;
        }
    }
    cout << dp[n][n] << endl;
}
```