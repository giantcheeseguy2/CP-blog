title: Heart Of Banyan Tree (Tutorial)
date: 3-25-2023
tag: xyd, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/76/problem/321)

## Solution



## Code

```c++
#pragma GCC optimize("O3")
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

vector<int> g[100005];
int n;

int sub[100005];
int dp[100005];
int par[100005];

void dfs1(int x, int p = 0){
    par[x] = p;
    sub[x] = 1;
    dp[x] = 1;
    pii mx = {0, 0};
    for(int i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
        sub[x] += sub[i];
        mx = max(mx, {sub[i], i});
    }
    if(!mx.ff) return;
    if(dp[mx.ss] >= sub[x] - sub[mx.ss] - 1) dp[x] = dp[mx.ss] - (sub[x] - sub[mx.ss] - 1) + 1;
    else {
        if(dp[mx.ss]%2 == (sub[x] - sub[mx.ss] - 1)%2) dp[x] = 1;
        else dp[x] = 2;
    }
}

int ans[100005];
multiset<pii, greater<pii>> mx;

void dfs2(int x, int p = 0, int d = 1){
    for(int i : g[x]){
        if(i == p) continue;
        mx.insert({sub[i], dp[i]});
    }
    if(!mx.size()) ans[x] = 1;
    else {
        pii v = *mx.begin();
        if(v.ss <= n - d - v.ff && v.ss%2 == (n - d - v.ff)%2) ans[x] = 1;
        else ans[x] = 0;
    }
    for(int i : g[x]){
        if(i == p) continue;
        mx.erase(mx.find({sub[i], dp[i]}));
        dfs2(i, x, d + 1);
        mx.insert({sub[i], dp[i]});
    }
    for(int i : g[x]){
        if(i == p) continue;
        mx.erase(mx.find({sub[i], dp[i]}));
    }
}

int main(){
    setIO();
    int w, t;
    cin >> w >> t;
    for(int tt = 1; tt <= t; tt++){
        cin >> n;
        for(int i = 1; i <= n; i++) g[i].clear();
        for(int i = 1; i < n; i++){
            int a, b;
            cin >> a >> b;
            g[a].pb(b);
            g[b].pb(a);
        }
        dfs1(1);
        dfs2(1);
        for(int i = 1; i <= n; i++){
            cout << ans[i];
            if(w == 3) break;
        }
        cout << endl;
    }
}
```