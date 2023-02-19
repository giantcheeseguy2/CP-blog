title: Dangerous Cities (Tutorial)
date: 1-30-2023
tag: xyd, tree, graph, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/34/problem/166)

## Solution

The graph of each node to its shelter is clearly a functional graph. It is further required that  further required that each node only has an indegree of one. This means our functional graph can only consist of cycles and no chains, and since this graph must be in a similar shape to a tree, this only allows us to have cycles of length two. In other words, if \\(i\\) has a shelter in \\(j\\), then \\(j\\) has a shelter in \\(i\\). since we want to have every node be part of a pair, this is equivalent to finding a perfect matching of the tree. A tree can only have at most one perfect matching, so we can immediately know which cities are paired or if the answer is impossible. Now, we have to find the lexicograhically smallest assignment for this. We have some conditions on which nodes must be used before another node, so this is actually finding the lexicographically smallest topological of a dag.

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

vector<int> g[500005];
bool dp[500005][2];
int nxt[500005];

void dfs1(int x, int p = 0){
    dp[x][0] = true;
    vector<int> v;
    for(int i : g[x]){
        if(i == p) continue;
        v.pb(i);
        dfs1(i, x);
        dp[x][0] &= dp[i][1];
    }
    bool suf[v.size() + 1];
    suf[v.size()] = true;
    for(int i = v.size() - 1; i >= 0; i--){
        suf[i] = suf[i + 1] && dp[v[i]][1];
    }
    bool pre = true;
    for(int i = 0; i < v.size(); i++){
        if(pre && suf[i + 1] && dp[v[i]][0]){
            dp[x][1] = true;
            nxt[x] = v[i];
            break;
        }
        pre &= dp[v[i]][1];
    }
}

vector<pii> v;

void dfs2(int x, int t = 1, int p = 0){
    for(int i : g[x]){
        if(i == p) continue;
        if(t == 1 && i == nxt[x]){
            v.pb({x, i});
            dfs2(i, 0, x);
        } else {
            dfs2(i, 1, x);
        }
    }
}

int main(){
    setIO();
    int n;
    cin >> n;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    } 
    dfs1(1);
    if(!dp[1][1]){
        cout << -1 << endl;
        return 0;
    }
    dfs2(1);
    int in[n + 1];
    vector<int> topo[n + 1];
    memset(in, 0, sizeof(in));
    for(pii i : v){
        for(int j : g[i.ff]) if(j != i.ss) topo[i.ss].pb(j), in[j]++;
        for(int j : g[i.ss]) if(j != i.ff) topo[i.ff].pb(j), in[j]++;
    }
    int ans[n + 1], cur = 1;
    priority_queue<int, vector<int>, greater<int>> q;
    for(int i = 1; i <= n; i++) if(in[i] == 0) q.push(i);
    while(!q.empty()){
        int x = q.top();
        q.pop();
        ans[cur++] = x;
        for(int i : topo[x]){
            in[i]--;
            if(in[i] == 0){
                q.push(i);
            }
        }
    }
    for(int i = 1; i <= n; i++) cout << ans[i] << " ";
    cout << endl;
}
```