title: Removal Sequences (Tutorial)
date: 2-21-2023
tag: cf, graph, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1795/problem/G)

## Solution

Lets consider the removal by layers. We first will remove the layer with all nodes with a correct degree. Notice that this layer must not have edges to each other since otherwise one of the nodes would go below their required degree. Now, we reduced the problem back to itself, so we can continue to remove one layer at a time. Thus, the set of the degree that is removed before a node is removed is fixed. We can create a dag based on this removal graph, then we know that if \\(a\\) can reach \\(b\\), then \\(a\\) must be before \\(b\\). Now, its just reachability queries on a dag, which has a complexity lower bound of \\(N^2\\). However, using bitsets can get it down to \\(\\frac{N^2}{64}\\), which will run in time. However, this still uses \\(O(N^2)\\) memory which is too much. To fix this, we can do a sort of sliding window and only store \\(64\\) bits at a time. This has \\(O(N)\\) memory.

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

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        int n, m;
        cin >> n >> m;
        int arr[n + 1];
        for(int i = 1; i <= n; i++) cin >> arr[i];
        vector<int> g[n + 1];
        int deg[n + 1];
        memset(deg, 0, sizeof(deg));
        for(int i = 0; i < m; i++){
            int a, b;
            cin >> a >> b;
            deg[a]++, deg[b]++;
            g[a].pb(b);
            g[b].pb(a);
        }
        queue<int> q;
        for(int i = 1; i <= n; i++) if(deg[i] == arr[i]) q.push(i), deg[i] = -1;
        vector<int> dag[n + 1];
        vector<pii> v;
        while(!q.empty()){
            int x = q.front();
            q.pop();
            for(int i : g[x]){
                if(deg[i] == -1) continue;
                v.pb({x, i});
                deg[i]--;
                if(deg[i] == arr[i]){
                    q.push(i);
                    deg[i] = -1;
                }
            }
        }
        reverse(v.begin(), v.end());
        ll ans = (ll)n*(n + 1)/2;
        for(int i = 1; i <= n; i += 63){
            ll dp[n + 1];
            memset(dp, 0, sizeof(dp));
            for(int j = i; j <= min(n, i + 62); j++) dp[j] = (ll)1 << (j - i);
            for(pii j : v){
                dp[j.ff] |= dp[j.ss];
            }
            for(int j = 1; j <= n; j++){
                ans -= __builtin_popcountll(dp[j]);
            }
        }
        cout << ans << endl;
    }
}
```