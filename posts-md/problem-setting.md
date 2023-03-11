title: Problem Setting (Tutorial)
date: 3-4-2023
tag: usaco, sos, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1309)

## Solution

Problem \\(i\\) must occur after problem \\(j\\) if for any problem setter, it has a hard instead of an easy. If we represent an `H` as a \\(1\\) and `E` as a \\(0\\) to simplify things, then \\(i\\) can only occur after \\(j\\) if \\(j\\) is a subset of \\(i\\). This immediately motivates a solution of counting paths in a dag, where each node has multiple possibilities and a bitmask of `E` and `H`. To optimize this, we can accelerate the dag transitions using sum over subsets. 

## Code

```c++
#pragma GCC optimize("O3")
#pragma GCC optimization ("unroll-loops")
#pragma GCC target("sse,sse2,sse3,ssse3,sse4,popcnt,abm,mmx,tune=native")
#include <bits/stdc++.h>
using namespace std;

#define pb push_back
#define ff first
#define ss second

typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;

const int INF = 1e9;
const ll LLINF = 1e18;
const int MOD = 1e9 + 7;

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

int fact[100005];
int ifact[100005];

int perm(int a, int b){
    return (ll)fact[a]*ifact[a - b]%MOD;
}

int fpow(int a, int b){
    int ret = 1;
    while(b){
        if(b%2 == 1) ret = (ll)ret*a%MOD;
        a = (ll)a*a%MOD;
        b /= 2;
    }
    return ret;
}

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    fact[0] = 1;
    for(int i = 1; i <= n; i++) fact[i] = (ll)fact[i - 1]*i%MOD;
    for(int i = 0; i <= n; i++) ifact[i] = fpow(fact[i], MOD - 2);
    char arr[n][m];
    for(int i = 0; i < m; i++){
        for(int j = 0; j < n; j++){
            cin >> arr[j][i];
        }
    }
    int st[n];
    for(int i = 0; i < n; i++){
        st[i] = 0;
        for(int j = 0; j < m; j++){
            if(arr[i][j] == 'H'){
                st[i] |= 1 << j;
            }
        }
    }
    int e[1 << m];
    memset(e, 0, sizeof(e));
    for(int i = 0; i < n; i++) e[st[i]]++;
    int dp[1 << m];
    int sos[1 << m][m + 1];
    int ans = 0;
    memset(dp, 0, sizeof(dp));
    memset(sos, 0, sizeof(sos));
    for(int i = 0; i < (1 << m); i++){
        for(int j = 1; j <= m; j++){
            if(i & (1 << (j - 1))){
                sos[i][j] = (sos[i][j - 1] + sos[i ^ (1 << (j - 1))][j - 1])%MOD;
            } else {
                sos[i][j] = sos[i][j - 1];
            }
        }
        if(e[i]){
            int prod = 0;
            for(int j = 1; j <= e[i]; j++){
                prod = (prod + perm(e[i], j))%MOD;
            }
            int sum = (ll)prod*sos[i][m]%MOD;
            dp[i] = (prod + sum)%MOD;
            for(int j = 0; j <= m; j++) sos[i][j] = (sos[i][j] + dp[i])%MOD;
            ans = (ans + dp[i])%MOD;
        }
    }
    cout << ans << endl; 
}
```