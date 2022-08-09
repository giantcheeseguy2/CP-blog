title: Tree (Tutorial)
date: 8-9-2022
tag: loj, zjoi, dp, pie, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/3706)

## Solution

This problem seems impossible to count directly, so lets find a solution involving PIE. Lets try to fix a set of nodes, \\(S\\) in the first tree to be non-leaves, and a set of nodes, \\(T\\) in the second tree to be non-leaves. \\(S + T = [N], S \\cap T = \\emptyset\\). Now lets say \\(F(S) = \\) number of ways to achieve \\(S\\) and \\(G(T) = \\) number of ways to achieve \\(T\\). The answer is then \\(\\sum_{S \\subseteq [N]} \\sum_{T \\subseteq [N]} F(S) \\cdot G(T)\\). Now lets try to find \\(F(S)\\). Lets define \\(S'\\) to be some subset of \\(S\\) such that every non leaf is contained within \\(S\\) but not necessarily all elements in \\(S\\) are non leaves. \\(F'(S')\\) is the number of ways to partition \\(S'\\). \\(T'\\) and \\(G'(T')\\) are defined to be the same for \\(T\\). Using PIE, we find that \\(F(S) = \\sum_{S' \\subseteq S} F'(S') \\cdot -1^{|S| - |S'|}\\) and \\(G(T) = \\sum_{T' \\subseteq T} G'(T') \\cdot -1^{|T| - |T'|}\\). Now, the answer is \\[\\sum_{S \\subseteq [N]} \\sum_{T \\subseteq [N]} \\sum_{S' \\subseteq S} \\sum_{T' \\subseteq T}  F'(S') \\cdot G'(T') \\cdot -1^{N - |T'| - |S'|}\\] We can notice that \\(S\\) and \\(T\\) can be determined using \\(-1\\) factor. Therefore, we can remove the sum over \\(S\\) and \\(T\\) and change the \\(-1\\) to \\(-2\\) to account for the possibility of the \\(-1\\) belonging in \\(S\\) or \\(T\\). Now our equation is \\[\\sum_{S' \\subseteq N} \\sum_{T' \\subseteq N}  F'(S') \\cdot G'(T') \\cdot -2^{N - |T'| - |S'|}\\]. We can solve this using a dp. \\(dp[i][j][k] = \\) index \\(i\\) with \\(j\\) elements in \\(S'\\) and \\(k\\) elements in \\(T'\\). Whenever a new index is visited, there are \\(j \\cdot k\\) possibilities to connect it to. In addition, you can add it \\(S'\\), \\(T'\\), or neither, multiplying by \\(-2\\). To find the answer for all \\(i\\) less than \\(N\\), we just want to end the dp early.

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
    int n, mod;
    cin >> n >> mod;
    int dp[2][n + 1][n + 1];
    memset(dp, 0, sizeof(dp));
    for(int i = 1; i <= n; i++) dp[0][1][i] = 1;
    for(int i = 2; i <= n; i++){
        for(int j = 1; j <= n; j++){
            for(int k = 1; k <= n; k++){
                if(j + 1 <= n) dp[1][j + 1][k] = (dp[1][j + 1][k] + (ll)dp[0][j][k]*j%mod*k%mod)%mod;
                if(k - 1 >= 1) dp[1][j][k - 1] = (dp[1][j][k - 1] + (ll)dp[0][j][k]*j%mod*k%mod)%mod;
                dp[1][j][k] = (dp[1][j][k] + (ll)dp[0][j][k]*j%mod*k%mod*(mod - 2)%mod)%mod;
            }
        }
        int ans = 0;
        for(int j = 1; j < i; j++) ans = (ans + (ll)dp[0][j][1]*j%mod)%mod;
        for(int j = 1; j <= n; j++) for(int k = 1; k <= n; k++){
            dp[0][j][k] = dp[1][j][k];
            dp[1][j][k] = 0;
        }
        cout << ans << endl;
    }
}
```