title: Heart Of Banyan Tree (Tutorial)
date: 3-25-2023
tag: xyd, tree, dp, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/76/problem/321)

## Solution

Lets consider the case where we only want to solve for the root first. How can we get the heart to end at the root? Instead of considering the token's actual path, which is hard, lets see the affect of adding a node on the heart. If the heart is at a node, and two nodes in seperate subtrees of the heart are activated, they will actually cancel each other out. So, to keep our node at the root, we will be subtracting one from pairs of subtrees until all of them are empty or there is one left. The algorithm for doing this, is actually to choose the two largest subtrees and subtract them, and keep doing that. Furthermore, if there is only one subtree left, it is easy to see that there is always some way to subtract pairs such that the remaining one is the largest subtree. For the remaining elements in the largest subtree, we have to be able to cancel them out somehow, so our strategy will be to walk our heart into the largest subtree, cancel out the excess elements, then pair up subtrees like we did before. Thus, if we have \\(dp[i] = \\) minimum amount of elements that cannot be cancelled out after walking into \\(i\\), then we will be able to cancel out the excess in the largest subtree. Our set of possible values for that subtree will be \\(dp[i], dp[i] + 2, dp[i] + 4, ..., size of subtreee\\). Now, there are two cases to consider when calculating \\(dp[i]\\). Lets say \\(j\\) is the largest child of \\(i\\). If the amount nodes outside the largest subtree is smaller than \\(dp[j]\\), then it is obviously impossible to completely cancel out, and \\(dp[i] = dp[j] - outside nodes\\). Otherwise, \\(dp[i] = 1 or 2\\) depending on whether the parity of amount of outside nodes is equal to \\(dp[j]\\). First of all, we know that we can reduce the amount of nodes outside \\(j\\) to some single smaller value by just cancelling out. Since we chose the largest subtree, this single smaller value will always be within the set of values that \\(j\\) can be come. The only thing that may cause it not to be is a difference in parity, since we can only remove nodes in pairs of \\(2\\). Now, to extend this to any node, we can just merge a node and everything on the path to the root into a single one and reduce it to the root case. Thus, we can just run a dfs and maintain the largest subtree on the way. 

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