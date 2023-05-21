title: Two Centroids (Tutorial)
date: 5-19-2023
tag: cf, tree, segtree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1827/problem/D)

## Solution

First, we should figure out how to calculate the cost of a tree with no updates. We know that for a tree to have two centroids, there must be one edge with half the nodes on either side. Thus, the answer is \\(min(|n - 2 \\cdot sz[x]|)\\), where \\(sz[x]\\) is the subtree size of \\(x\\), over all the nodes. Actually, we can get rid of the absolute value, since we only need to consider \\(sz[x] \\le \\frac{n}{2}\\), because the value of two nodes across an edge will be equivalent, so if \\(sz[x]\\) is greater, then we can just take its neighbor. Thus, we now only need to find the maximum \\(sz[x]\\) such that \\(sz[x] \\ le \\frac{n}{2}\\). Now, how can we solve this with changing \\(n\\) and \\(sz[x]\\)? Its hard to maintain the value in all nodes simultaneously, so how can we reduce the set of nodes to check? It seems intuitive that we should only check nodes related to the centroid, and this is indeed the case. The centroid is defined as a node where all of its children have a size of \\(\\le n/2\\), and it turns out, one of these children will always be the maximum \\(sz[x] \\le \\frac{n}{2}\\). This must be true, since all nodes other than the centroid will always have at least one \\(sz[x] > \\frac{n}{2}\\). It will always be optimal to move towards that node, since it will only increase the subtree size of the other children. So, now all we have to do is maintain the centroid and the maximum child subtree size. If the centroid never changes, then we can do this by maintaining subtree sums and just rechecking the one subtree size that changes per update. However, we are unable to recheck the whole degree of a centroid in the case that it moves. We can actually notice that whenever the centroids moves, that is when it goes into a subtree with \\(sz[x] > \\frac{n}{2}\\), the tree will have two centroids and thus the maximum \\(sz[x]\\) on the degree will always be \\(\\frac{n}{2}\\), and there will be no need to recheck the degree. This is true because when a new node is added the maximum new subtree size will be \\(\\frac{n}{2} + 1\\), and thus moving into it will result in a new maximum subtree size of \\(\\frac{n}{2}\\), which will be the size of the previous centroid's subtree.

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

vector<int> g[500005];
int bit[500005];
int tim;
int in[500005], out[500005];
int par[500005][20];
int depth[500005];

void dfs(int x, int p){
    depth[x] = depth[p] + 1;
    par[x][0] = p;
    in[x] = tim++;
    for(int i : g[x]){
        if(i == p) continue;
        dfs(i, x);
    }
    out[x] = tim - 1;
}

void update(int x, int v){
    for(; x < tim; x += x & (-x)) bit[x] += v;
}

int query(int x, int ret = 0){
    for(; x; x -= x & (-x)) ret += bit[x];
    return ret;
}

int anc(int a, int b){
    for(int i = 19; i >= 0; i--){
        if(depth[par[a][i]] > depth[b]) a = par[a][i];
    }
    if(par[a][0] == b) return a;
    return -1;
}

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        int n;
        cin >> n;
        int arr[n + 1];
        for(int i = 2; i <= n; i++){
            cin >> arr[i];
            g[arr[i]].pb(i);
        }
        tim = 1;
        depth[1] = 0;
        dfs(1, 1);
        for(int i = 1; i < 20; i++){
            for(int j = 1; j <= n; j++){
                par[j][i] = par[par[j][i - 1]][i - 1];
            }
        }
        int cur = 1;
        int mx = 0;
        update(in[1], 1);
        int sz = 1;
        for(int i = 2; i <= n; i++){
            update(in[i], 1);
            sz++;
            int x = anc(i, cur);
            if(x == -1){
                mx = max(mx, sz - (query(out[cur]) - query(in[cur] - 1)));
            } else {
                mx = max(mx, query(out[x]) - query(in[x] - 1));
            }
            if(mx > sz/2){
                if(x == -1) cur = par[cur][0];
                else cur = x;
                mx = sz/2;
            }
            cout << sz - 2*mx << " ";
        }
        cout << endl;
        for(int i = 1; i <= n; i++) update(in[i], -1), g[i].clear();
    }
}
```