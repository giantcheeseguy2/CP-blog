title: Shuttle Bus (Tutorial)
date: 9-7-2022
tag: cf, dp, tree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/103860/problem/B)

## Solution

First of all, we can denote the weight of an edge as the number of people who will walk through the edge. In other words, the weight of the edge is just the number of people in that edge's subtree. Now, we have reduced the problem to: given a tree, find \\(k\\) paths from the root that cover a maximal amount of weight where intersection is not counted. This can be done by greedily choosing the largest path from the root, then erasing the edge values. However, this greedy is too slow, so we can simulate it by decomposing the tree into the largest possible chain, then taking the sum of the \\(k\\) largest chains. Computing the chains can be done using dp, and maintaining the \\(k\\) largest can be done with two multisets. Now to solve for all roots, we just have to reroot the tree dp.

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

multiset<ll> s1, s2;
ll active = 0;
int n, k;

void add(ll x){
    active += *s1.insert(x);
    if(s1.size() > k){
        active -= *s2.insert(*s1.begin());
        s1.erase(s1.begin());
    }
}

void rem(ll x){
    if(s2.find(x) != s2.end()) s2.erase(s2.find(x));
    else {
        active -= x;
        s1.erase(s1.find(x));
        if(!s2.empty()){
            active += *s1.insert(*s2.rbegin());
            s2.erase(prev(s2.end()));
        }
    }
}

vector<int> g[200005];
ll dp[200005], sub[200005];
ll weight[200005];
ll arr[200005];
ll sum = 0;
multiset<pll> adj[200005];
int head[200005], nxt[200005];

void calc(int x){
    dp[x] = nxt[x] = 0;
    if(adj[x].size()){
        pll v = *adj[x].rbegin();
        dp[x] = v.ff;
        head[v.ss] = x;
        nxt[x] = v.ss;
    }
    dp[x] += weight[x];
}

void dfs1(int x, int p = 0){
    weight[x] = arr[x];
    head[x] = x;
    for(int i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
        weight[x] += weight[i];
        adj[x].insert({dp[i], i});
    }
    calc(x);
    sum += weight[x];
}

ll ans[200005];
bool in[200005];

void move(int a, int b){
    head[nxt[a]] = nxt[a];
    head[nxt[b]] = nxt[b];
    if(nxt[a] && !in[nxt[a]]) in[nxt[a]] = true, add(dp[nxt[a]]);
    if(nxt[b] && !in[nxt[b]]) in[nxt[b]] = true, add(dp[nxt[b]]);
    if(in[a] && head[a] == a) rem(dp[a]), in[a] = false;
    if(in[b] && head[b] == b) rem(dp[b]), in[b] = false;
    head[a] = a, head[b] = b;
    sum -= weight[a], sum -= weight[b];
    swap(weight[a], weight[b]);
    weight[a] = weight[b] - weight[a];
    sum += weight[a], sum += weight[b];
    adj[a].erase(adj[a].find({dp[b], b}));
    calc(a);
    adj[b].insert({dp[a], a});
    calc(b);
    if(nxt[a] && in[nxt[a]]) rem(dp[nxt[a]]), in[nxt[a]] = false;
    if(nxt[b] && in[nxt[b]]) rem(dp[nxt[b]]), in[nxt[b]] = false;
    if(!in[a] && head[a] == a) add(dp[a]), in[a] = true;
    if(!in[b] && head[b] == b) add(dp[b]), in[b] = true;
}

void dfs2(int x, int p = 0){
    ans[x] = sum - active;
    for(int i : g[x]){
        if(i == p) continue;
        move(x, i);
        dfs2(i, x);
        move(i, x);
    }
}

int main(){
    setIO();
    cin >> n >> k;
    for(int i = 1; i <= n; i++) cin >> arr[i];
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs1(1);
    for(int i = 1; i <= n; i++) if(head[i] == i) add(dp[i]), in[i] = true;
    dfs2(1);
    for(int i = 1; i <= n; i++) cout << ans[i] << "\n";
}
```