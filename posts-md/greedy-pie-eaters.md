title: Greedy Pie Eaters (Tutorial)
date: 10-30-2022
tag: usaco, dp, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=972)

## Solution

A range dp solution instantly comes to mind when reading this problem, but how can we do so? In order to be able to transition, there can only be two possible dp states: \\(dp[i][j] = \\) maximum sum in range \\([i, j]\\) or \\(dp[i][j] = \\) maxmimum sum in range \\([i, j]\\) where it is completely filled. The latter is easy to transition, but we cannot optimize it past \\(O(N^4)\\). What about the former? We should try to merge two intervals by adding a range, but there is no way to gurantee that it is able to put in. We can fix this by forcing a single empty index in between the two intervals that we are merging. Now, we just have to find the largest cow range that is within the interval and covers a single point. This can be done with another dp, lets call it \\(dp'[i][j][k] = \\) maximum cow that is within \\([i, j]\\) and covers point \\(k\\). Our final transition is \\(dp[i][j] = max(dp[i][k - 1] + dp'[i][j][k] + dp[k + 1][j])\\).

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
    freopen("pieaters.in", "r", stdin);
    freopen("pieaters.out", "w", stdout);
    int n, m;
    cin >> n >> m;
    int arr[n + 1][n + 2][n + 1];
    memset(arr, 0, sizeof(arr));
    for(int i = 0; i < m; i++){
        int a, b, c;
        cin >> a >> b >> c;
        for(int j = b; j <= c; j++) arr[j][b][c] = max(arr[j][b][c], a);
    }
    for(int i = 1; i < n; i++){
        for(int j = 1; j + i <= n; j++){
            int l = j, r = j + i;
            for(int k = l; k <= r; k++){
                arr[k][l][r] = max({arr[k][l][r], arr[k][l + 1][r], arr[k][l][r - 1]});
            }
        }
    }
    int dp[n + 2][n + 1];
    memset(dp, 0, sizeof(dp));
    for(int i = 1; i <= n; i++) dp[i][i] = arr[i][i][i];
    for(int i = 1; i < n; i++){
        for(int j = 1; j + i <= n; j++){
            int l = j, r = j + i;
            for(int k = l; k <= r; k++){
                dp[l][r] = max(dp[l][r], dp[l][k] + dp[k + 1][r]);
                dp[l][r] = max(dp[l][r], dp[l][k - 1] + dp[k + 1][r] + arr[k][l][r]);
            }
        }
    }
    cout << dp[1][n] << endl;
}
```