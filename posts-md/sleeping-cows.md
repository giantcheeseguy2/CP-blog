title: Sleeping Cows (Tutorial)
date: 1-3-2023
tag: usaco, dp, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1068)

## Solution

For each cow, it can fit into any barn larger than it, and vice versa. Thus, if we store the cows and barns together sorted by size, we can count the number of all matchings (not neccesarily maximal) with a dp. \\(dp[i][j] = \\) the number of ways to match using the first \\(i\\) elements with \\(j\\) active cows. If we choose to take a cow, then we increase \\(j\\). If we choose to take a barn, then we decrease \\(j\\). Now how can we gurantee that this matching is maximal? A matching is maximal if the smallest cow that isn't chosen is larger than the largest barn that isn't chosen. So lets fix the smallest cow (note that multiple cows of the same size should be distinct) and compute the dp accordingly. Everything cow smaller than the fixed cow must be chosen, and every barn greater than the fixed cow must be chosen. This yields a \\(O(N^3)\\) solution. To optimize this, notice that the transitions before the fixed cow are all the same, and the transitions after the fixed cow are all the same. Thus, we can use an extra state in our dp and compute the fixed cow on the fly.

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
    int n;
    cin >> n;
    vector<pii> v;
    for(int i = 0; i < n; i++){
        int x;
        cin >> x;
        v.pb({x, 0});
    }
    for(int i = 0; i < n; i++){
        int x;
        cin >> x;
        v.pb({x, 1});
    }
    sort(v.begin(), v.end());
    int ans = 0;
    int dp[v.size() + 1][n + 1][2];
    memset(dp, 0, sizeof(dp));
    dp[0][0][0] = 1;
    for(int i = 1; i <= v.size(); i++){
        for(int k = 0; k <= n; k++){
            if(v[i - 1].ss){
                (dp[i][k][0] += dp[i - 1][k][0]) %= MOD;
                if(k < n){
                    (dp[i][k][0] += (ll)dp[i - 1][k + 1][0]*(k + 1)%MOD) %= MOD;
                    (dp[i][k][1] += (ll)dp[i - 1][k + 1][1]*(k + 1)%MOD) %= MOD;
                }
            } else {
                (dp[i][k][1] += dp[i - 1][k][1]) %= MOD;
                (dp[i][k][1] += dp[i - 1][k][0]) %= MOD;
                if(k){
                    (dp[i][k][1] += dp[i - 1][k - 1][1]) %= MOD;
                    (dp[i][k][0] += dp[i - 1][k - 1][0]) %= MOD;
                }
            }
        }
    }
    cout << (dp[v.size()][0][0] + dp[v.size()][0][1])%MOD << endl;
}
```