title: Subsequence Reversals (Tutorial)
date: 9-16-2022
tag: usaco, dp, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=698)

## Solution

Just do a range dp with 4 states for an \\(N^4\\) solution. Maintain the maximum for a leftmost chosen and rightmost chosen value of a range.

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

const int MX = 50;

int main(){
    setIO();
    freopen("subrev.in", "r", stdin);
    freopen("subrev.out", "w", stdout);
    int n;
    cin >> n;
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i];
    int dp[n + 1][n + 1][MX + 1][MX + 1];
    memset(dp, 0, sizeof(dp));
    for(int i = 1; i <= n; i++) dp[i][i][arr[i]][arr[i]] = 1;
    for(int i = 0; i < n; i++){
        for(int j = 1; j + i <= n; j++){
            int l = j, r = j + i;
            if(l == r){
                dp[l][r][arr[l]][arr[r]] = 1; 
            } else {
                if(arr[r] <= arr[l]){
                    dp[l][r][arr[r]][arr[l]] = max(dp[l][r][arr[r]][arr[l]], dp[l + 1][r - 1][arr[r]][arr[l]] + 2);
                }
                for(int x = 1; x <= MX; x++){
                    if(arr[r] >= x) dp[l][r][x][arr[r]] = max(dp[l][r][x][arr[r]], dp[l][r - 1][x][arr[r]] + 1);
                    if(arr[l] >= x) dp[l][r][x][arr[l]] = max(dp[l][r][x][arr[l]], dp[l + 1][r - 1][x][arr[l]] + 1);
                    if(arr[l] <= x) dp[l][r][arr[l]][x] = max(dp[l][r][arr[l]][x], dp[l + 1][r][arr[l]][x] + 1);
                    if(arr[r] <= x) dp[l][r][arr[r]][x] = max(dp[l][r][arr[r]][x], dp[l + 1][r - 1][arr[r]][x] + 1);
                }
                for(int a = 1; a <= MX; a++){
                    for(int b = a; b <= MX; b++){
                        dp[l][r][a][b] = max(dp[l][r][a][b], dp[l + 1][r][a][b]);
                        dp[l][r][a][b] = max(dp[l][r][a][b], dp[l][r - 1][a][b]);
                    }
                }
            }
            for(int b = 1; b <= MX; b++){
                for(int a = 1; a <= b; a++){
                    dp[l][r][a][b] = max(dp[l][r][a][b], dp[l][r][a][b - 1]);
                }
            }
            for(int a = MX - 1; a >= 1; a--){
                for(int b = a; b <= MX; b++){
                    dp[l][r][a][b] = max(dp[l][r][a][b], dp[l][r][a + 1][b]);
                }
            }
        }
    }
    cout << dp[1][n][1][MX] << endl;
}
```