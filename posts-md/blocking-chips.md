title: Blocking Chips (Tutorial)
date: 2-21-2023
tag: cf, tree, binary search, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1795/problem/F)

## Solution

Finding an optimal way to play the game seems impossible, so instead, lets try to rephrase our problem. If we know the path of each chip ahead of time, then our problem is actually equivalent to placing down node indepedent paths on the tree that have fixed starting points. This means we can actually binary search on our answer, since placing down paths that have a shorter length is always easier than a longer length. Thus, we just have to be able to check if we can place down some paths of fixed length with fixed starting points. For each starting point, the path will either go up or down, and for each node, we can have a path coming up go through the node then go back down. So for each node \\(x\\), lets store \\(dp[x]\\), which is the maximum length we can go down. The value will be negative if we need to have it go up. Calculating \\(dp[x]\\) can be done with some casework when merging.

## Code

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

vector<int> g[200005];
int tag[200005];
int dp[200005];
int n;
vector<int> v;

void dfs1(int x, int p = 0){
    if(p) g[x].erase(find(g[x].begin(), g[x].end(), p));
    for(int i : g[x]){
        dfs1(i, x);
    }
}

void dfs2(int x){
    if(!g[x].size()){
        dp[x] = tag[x] + 1;
        return;
    }
    vector<int> v;
    for(int i : g[x]){
        dfs2(i);
        v.pb(dp[i]);
    }
    sort(v.begin(), v.end());
    int cnt = tag[x] != 0;
    for(int i : v) cnt += i < 0;
    if(cnt > 1) dp[x] = -INF;
    else {
        if(tag[x] != 0){
            if(v.back() + tag[x] + 1 < 0) dp[x] = tag[x] + 1;
            else dp[x] = 0;
        } else if(cnt){
            if(v.back() + v.front() + 1 < 0) dp[x] = v.front() + 1; 
            else dp[x] = 0;
        } else {
            dp[x] = v.back() + 1;
        }
    }
}

bool check(int x){
    for(int i : v) tag[i] = -1;
    for(int i = 0; i < x; i++) tag[v[i%v.size()]]--;
    dfs2(1);
    return dp[1] >= 0;
}

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        cin >> n;
        for(int i = 0; i < n - 1; i++){
            int a, b;
            cin >> a >> b;
            g[a].pb(b);
            g[b].pb(a);
        }
        int q;
        cin >> q;
        v.clear();
        while(q--){
            int x;
            cin >> x;
            v.pb(x);
        }
        dfs1(1);
        int l = 0, r = n;
        while(l < r){
            int mid = (l + r + 1)/2;
            if(check(mid)) l = mid;
            else r = mid - 1;
        }
        cout << l << endl;
        for(int i = 1; i <= n; i++) g[i].clear(), tag[i] = 0;
    }
}
```