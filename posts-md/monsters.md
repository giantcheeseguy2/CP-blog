title: Monsters (Tutorial)
date: 4-18-2023
tag: cf, graph, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1810/problem/E)

## Solution

Lets see how to find the reachable area from a given starting node that has a \\(0\\). We can maintain a priority queue of the nodes on the degree of the set of taken nodes sorted by \\(a_i\\), which will gurantee we always take an optimal group. We can also notice that anytime a group touches another group, they are merged into one. Simultaneously updating the groups is hard, so lets process each starting node one by one. We can just maintain a residual degree for each group after processing, and whenever a group reaches a group from another starting node, we can use small to large merging to merge the two degrees. However, there is actually an easier solution where we don't have to merge degrees. Actually, we can simply ignore a starting node if it is already visited, since then it is already merged, and only process new starting nodes. We can see that each node is only visited at most \\(log N\\) times, since for two groups to be merging together, the new one must be larger than the old one (otherwise the old group would've visited the new group first). Thus, it must at least double every single merge.

## Code

```c++
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse4,popcnt,abm,mmx,tune=native")
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
        for(int i = 0; i < m; i++){
            int a, b;
            cin >> a >> b;
            g[a].pb(b);
            g[b].pb(a);
        }
        int vis[n + 1];
        memset(vis, 0, sizeof(vis));
        bool found = false;
        for(int i = 1; i <= n; i++){
            if(!arr[i] && !vis[i]){
                priority_queue<pii, vector<pii>, greater<pii>> q;
                q.push({0, i});
                int sz = 0;
                while(!q.empty()){
                    pii x = q.top();
                    q.pop();
                    if(vis[x.ss] == i) continue;
                    if(sz < x.ff) break;
                    sz++;
                    vis[x.ss] = i;
                    for(int j : g[x.ss]){
                        if(vis[j] != i){
                            q.push({arr[j], j});
                        }
                    }
                }
                found |= sz == n;
            }
        }
        cout << (found ? "YES" : "NO") << endl;
    }
}
```