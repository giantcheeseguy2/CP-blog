title: Link Cut Tree (Tutorial)
date: 10-23-2022
tag: usaco, aliens trick, tree, dp, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/2478)

## Solution

Lets first come up an \\(O(N \\cdot K)\\) solution. Let \\(dp[i][j][0/1/2]\\) = the maximum answer at node \\(i\\), choosing \\(j\\) paths so far, and the \\(0/1/2\\) denote if \\(i\\) is the endpoint of a path, middle of a path, or unchosen. At node \\(i\\), you can merge two paths into one, start a new path, or continue an existing path. Notice that if \\(f(K)\\) is the answer for \\(K\\), then \\(f(K + 1) - f(K) \\le f(k) - f(k - 1)\\). In other words, the function is monotonic. Furthermore, solving for the answer without a restriction of the number of paths is actually easier than with the restriction. Thus, we can use aliens trick to remove the \\(j\\) state. We just need a second value in the dp that stores the number of paths chosen so far.

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

ll sub;
vector<pll> g[300005];
pair<ll, int> dp[300005][3];

void dfs(int x, int p = 0){
    dp[x][0] = {0, 0};
    for(auto i : g[x]){
        if(i.ff == p) continue;
        dfs(i.ff, x);
        pair<ll, int> mx = max({dp[i.ff][0], dp[i.ff][1], dp[i.ff][2]});
        dp[x][0].ff += mx.ff;
        dp[x][0].ss += mx.ss;
    }
    dp[x][1] = {dp[x][0].ff - sub, dp[x][0].ss + 1};
    vector<pair<ll, int>> v1;
    for(auto i : g[x]){
        if(i.ff == p) continue;
        pair<ll, int> mx = max({dp[i.ff][0], dp[i.ff][1], dp[i.ff][2]});
        dp[x][1] = max(dp[x][1], {dp[x][0].ff - mx.ff + dp[i.ff][1].ff + i.ss, dp[x][0].ss - mx.ss + dp[i.ff][1].ss});
        v1.pb({dp[i.ff][1].ff + i.ss - mx.ff, dp[i.ff][1].ss - mx.ss});
    }
    v1.pb({-LLINF, 0}), v1.pb({-LLINF, 0});
    sort(v1.rbegin(), v1.rend());
    dp[x][2] = {v1[0].ff + v1[1].ff + dp[x][0].ff + sub, v1[0].ss + v1[1].ss + dp[x][0].ss - 1};
}

int check(ll x){
    sub = x;
    dfs(1);
    pair<ll, int> ret = max({dp[1][0], dp[1][1], dp[1][2]});
    return ret.ss - 1;
}

int main(){
    setIO();
    int n, k;
    cin >> n >> k;
    for(int i = 0; i < n - 1; i++){
        int a, b, c;
        cin >> a >> b >> c;
        g[a].pb({b, c});
        g[b].pb({a, c});
    }
    ll l = -3e11, r = 3e11;
    while(l < r){
        ll mid = (l + r + 1)/2;
        int ind = check(mid);
        if(ind < k) r = mid - 1;
        else l = mid;
    }
    sub = l;
    dfs(1);
    pair<ll, int> ans = max({dp[1][0], dp[1][1], dp[1][2]}); 
    cout << ans.ff + sub*(k + 1) << endl;
}
```