title: Subtree Activation (Tutorial)
date: 2-10-2023
tag: usaco, tree, dp, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1286)

## Solution

Consider an optimal strategy for satisfying every node in a subtree, then returning it to its inactive state. Obviously, we will have to activate every node in the subtree, then deactivate every node in the subtree. This gives us an initial cost of twice the subtree size. The only way to further save operations is to activate nodes in an order that results in satisfying as many subtrees as possible. There is no other way to save operations, since after a node is satisfied, all its children are now independent and must be satisfied seperately. When satisfying a node, we can start at some leaf and just keep activating each node's respective subtree as we go up. This lets us skip some path from a leaf to the root. We can apply this same idea when deactivating the subtree. This lets us skip another path from a leaf to the root. Note that we cannot skip the same node twice. Thus, let \\(dp[i] = \\) the minimum cost to satisfy all nodes in \\(i\\)'s subtree. Initially, \\(dp[i] = 2*size[i] - \\sum dp[j]\\), where \\(j\\) is a child of \\(i\\), and we want to skip nodes that maximize the amount of cost skipped. Since the two paths to the leaves cannot overlap, we can use an extra array to store \\(dp1[i] = \\) the maximium cost skipped using a path to one leaf, and \\(dp2[i] = \\) the maximum cost skipped using a path to two leaves. For \\(dp1\\), we can merge two \\(dp2\\) at a node to avoid overcounting. Note that whenever we skip a node, we still have to satisfy its degree that isn't skipped, so we should count that as well.

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

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

int main(){
    setIO();
    int n;
    cin >> n;
    vector<int> g[n + 1];
    for(int i = 2; i <= n; i++){
        int x;
        cin >> x;
        g[x].pb(i);
    }
    int sub[n + 1];
    ll dp[n + 1][2];
    ll ans[n + 1];
    memset(ans, 0, sizeof(ans));
    memset(dp, 0, sizeof(dp));
    for(int i = n; i >= 1; i--){
        sub[i] = 1;
        if(g[i].size() == 0){
            dp[i][0] = dp[i][1] = 2;
            ans[i] = 2;
            continue;
        }
        ll m1 = 0, m2 = 0, deg = 0;
        for(int j : g[i]){
            sub[i] += sub[j];
            deg += ans[j];
            dp[i][1] = max(dp[i][1], dp[j][1]);
            if(dp[j][0] >= m1){
                m2 = m1;
                m1 = dp[j][0];
            } else if(dp[j][0] > m2){
                m2 = dp[j][0];
            }
        }
        ans[i] = deg + 2*sub[i] - max(dp[i][1], m1 + m2);
        dp[i][0] = max((ll)0, m1 + ans[i] - deg);
        dp[i][1] = max((ll)0, max(dp[i][1], m1 + m2) + ans[i] - deg);
    }
    cout << ans[1] << endl;
}
```