title: Sprinklers 2; Return Of Alfafa (Tutorial)
date: 10-17-2022
tag: usaco, dp, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=1044)

## Solution

The observation to make here is that the shape of the field will always resemble a staircase, where the bottom left section is sweet corn and the top right section is alfafa. Lets say \\(a\\) is the number of empty cells in bottom left excluding corners, and \\(b\\) is the number of empty cells in the top right excluding corners. Each corner can not be taken. If we know the shape of the staircase, the number of ways to achieve the structure is \\(2^a \\cdot 2^b\\). Let \\(dp[i][j] = \\) the number of ways to partition the first \\(i\\) rows, with the current staircase corner being at \\(j\\). We can either continue the corner or move it to the right. 

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

int pow2[4000005];
int inv = 500000004;

void build(){
    pow2[0] = 1;
    for(int i = 1; i <= 4000000; i++) pow2[i] = pow2[i - 1]*2%MOD;
}

int main(){
    setIO();
    freopen("sprinklers2.in", "r", stdin);
    freopen("sprinklers2.out", "w", stdout);
    build();
    int n;
    cin >> n;
    char arr[n + 1][n + 1];
    for(int i = 0; i <= n; i++) for(int j = 0; j <= n; j++) arr[i][j] = '.';
    int tot = 0;
    for(int i = 1; i <= n; i++) for(int j = 1; j <= n; j++) cin >> arr[i][j], tot += arr[i][j] == '.';
    int pre[n + 2][n + 2], suf[n + 2][n + 2];
    memset(pre, 0, sizeof(pre));
    memset(suf, 0, sizeof(suf));
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= n; j++) pre[i][j] = pre[i][j - 1] + (arr[i][j] == '.');
        suf[i][n] = arr[i][n] == '.';
        for(int j = n - 1; j >= 1; j--) suf[i][j] = suf[i][j + 1] + (arr[i][j] == '.');
    }
    //[1, j] - top right
    //(j, n] - bottom left
    int dp[n + 1][n + 1];
    memset(dp, 0, sizeof(dp));
    dp[0][0] = 2;
    for(int i = 1; i <= n; i++){
        int sum = 0;
        for(int j = 0; j <= n; j++){
            if(j && arr[i - 1][j] == '.') (sum += (ll)dp[i - 1][j - 1]*inv%MOD) %= MOD;
            if(j && arr[i][j] == '.') (dp[i][j] += (ll)sum*inv%MOD) %= MOD;
            (dp[i][j] += (i == 1 && j == 0 ? 1 : dp[i - 1][j])) %= MOD;
            (dp[i][j] = (ll)dp[i][j]*pow2[pre[i][j]]%MOD*pow2[suf[i][j + 1]]%MOD) %= MOD;
        }
    }
    int ans = dp[n][n];
    for(int i = 0; i < n; i++){
        if(arr[n][i + 1] == '.') (ans += (ll)dp[n][i]*inv%MOD) %= MOD;
    }
    cout << ans << endl;
}
```