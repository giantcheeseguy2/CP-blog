title: Probabilistic Recharger (Tutorial)
date: 1-23-2023
tag: tree, dp, math, probabilities, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/28/problem/143)

## Solution

The expected number of charging units is just the sum of probability for each charging unit to be active. For a single charging unit, we can do a tree dp with that unit as the node, where \\(dp[x] = \\) the probability that node \\(x\\) is active. Now, we have to somehow solve for all roots, which can be done by rerooting the tree dp. Rerooting the dp 

## Code

I use two states in my dp, even though only one is needed. Rerooting needs to be handled in a special way because of this.

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

struct node {
    array<ld, 2> arr;

    ld &operator[](int x){
        return arr[x];
    }

    node(){
        arr[1] = 0;
        arr[0] = 1;
    }

    node(ld x){
        arr[1] = x;
        arr[0] = 1 - x;
    }

    node val(ld x){
        node ret;
        ret[0] = arr[1]*(1 - x) + arr[0];
        ret[1] = arr[1]*x;
        return ret;
    }
};

vector<pii> g[500005];
ld e[500005], arr[500005];

node merge(node a, node b){
    node c;
    c[1] = a[1] + a[0]*b[1];
    c[0] = a[0]*b[0];
    return c;
}

node dp[500005];

void dfs1(int x, int p = 0){
    for(pii i : g[x]){
        if(i.ff == p){
            g[x].erase(find(g[x].begin(), g[x].end(), i));
            break;
        }
    }
    dp[x] = node(arr[x]);
    for(pii i : g[x]){
        if(i.ff == p) continue;
        dfs1(i.ff, x);
        dp[x] = merge(dp[x], dp[i.ff].val(e[i.ss]));
    }
}

ld ans = 0;

void dfs2(int x, node p = node(), int pe = -1){
    if(x != 1){
        ans += merge(dp[x], p.val(e[pe]))[1];
    }
    if(!g[x].size()) return;
    vector<node> suf;
    suf.pb(dp[g[x].back().ff].val(e[g[x].back().ss]));
    for(int i = g[x].size() - 2; i >= 0; i--){
        suf.pb(merge(dp[g[x][i].ff].val(e[g[x][i].ss]), suf.back()));
    }
    reverse(suf.begin(), suf.end());
    node cur = node(arr[x]);
    if(x != 1) cur = merge(cur, p.val(e[pe]));
    for(int i = 0; i < g[x].size(); i++){
        node tmp = cur;
        if(i + 1 < g[x].size()) tmp = merge(tmp, suf[i + 1]);
        dfs2(g[x][i].ff, tmp, g[x][i].ss);
        cur = merge(cur, dp[g[x][i].ff].val(e[g[x][i].ss]));
    }
}

int main(){
    setIO();
    int n;
    cin >> n;
    for(int i = 0; i < n - 1; i++){
        int a, b, c;
        cin >> a >> b >> c;
        e[i] = (ld)c/100;
        g[a].pb({b, i});
        g[b].pb({a, i});
    }
    for(int i = 1; i <= n; i++) cin >> arr[i], arr[i] /= 100;
    dfs1(1);
    dfs2(1);
    ans += dp[1][1];
    cout << fixed << setprecision(7) << ans << endl;
}
```