title: Language (Tutorial)
date: 12-4-2022
tag: cf, segtree merge, tree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/398570/problem/B)

## Solution

How can we count all pairs. We should either do it by update or by node. If we did it by update, we would have to somehow exclude all the overlapping pairs, which seems very hard. If we did it by node, we only have to maintain the total set of nodes covered by updates that overlap the node, which seems much easier. To do this, we have to be able to know the total set of nodes covered by some given nodes. If we sort the nodes by preorder traversal, then for a set of nodes \\(x_i\\), the total area covered \\(\\sum depth[x_i] - \\sum depth[lca(x_i, x_{i + 1})] - depth[lca(x_i)] + 1\\). To support toggling on and off, we can actually put this on a segtree that stores the nodes in the correct order, and consider the lca when merging. We should also store the minimum depth of any lca or node. Now, we can do a dfs on the tree, and toggle nodes on the endpoints of the update and toggle them off at the parent of their lca.

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

vector<int> g[100005];
int par[100005][20], depth[100005];
int in[100005], rev[100005], tim = 1;

void dfs1(int x, int p){
    rev[tim] = x;
    in[x] = tim++;
    par[x][0] = p;
    depth[x] = depth[p] + 1;
    for(int i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
    }
}

int lca(int a, int b){
    if(depth[a] > depth[b]) swap(a, b);
    for(int i = 19; i >= 0; i--) if(depth[par[b][i]] >= depth[a]) b = par[b][i];
    if(a == b) return a;
    for(int i = 19; i >= 0; i--) if(par[a][i] != par[b][i]) a = par[a][i], b = par[b][i];
    return par[a][0];
}

int seg[10000005], rpos[10000005], lpos[10000005], cnt[10000005], mn[10000005];
int left0[10000005], right0[10000005];
int sz = 1;

void pull(int x){
    seg[x] = seg[left0[x]] + seg[right0[x]];
    mn[x] = min(mn[left0[x]], mn[right0[x]]);
    int a = rpos[left0[x]], b = lpos[right0[x]];
    if(!a){
        lpos[x] = lpos[right0[x]];
        rpos[x] = rpos[right0[x]];
        return;
    }
    if(!b){
        lpos[x] = lpos[left0[x]];
        rpos[x] = rpos[left0[x]];
        return;
    }
    int c = lca(rev[a], rev[b]);
    mn[x] = min(mn[x], depth[c]);
    seg[x] -= depth[c];
    //cout << rev[pos[left0[x]]] << " " << rev[pos[right0[x]]] << " " << seg[x] << " " << seg[left0[x]] << " " << seg[right0[x]] << endl;
    rpos[x] = rpos[right0[x]];
    lpos[x] = lpos[left0[x]];
}

int id[10000005];

void update(int x, int v, int cur, int l = 1, int r = tim - 1){
    if(l == r){
        cnt[cur] += v;
        id[cur] = l;
        if(cnt[cur]){
            lpos[cur] = rpos[cur] = l;
            mn[cur] = depth[rev[l]];
            seg[cur] = depth[rev[l]];
        } else {
            mn[cur] = INF;
            lpos[cur] = rpos[cur] = seg[cur] = 0;
        }
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, v, (left0[cur] ? left0[cur] : left0[cur] = sz++), l, mid);
    else update(x, v, (right0[cur] ? right0[cur] : right0[cur] = sz++), mid + 1, r);
    pull(cur);
}

int merge(int a, int b){
    if(a == 0 || b == 0) return a ^ b;  
    left0[a] = merge(left0[a], left0[b]);
    right0[a] = merge(right0[a], right0[b]);
    if(!left0[a] && !right0[a]){
        cnt[a] += cnt[b];
        if(id[b]) id[a] = id[b];
        if(cnt[a]){
            lpos[a] = rpos[a] = id[a];
            seg[a] = depth[rev[id[a]]];
            mn[a] = depth[rev[id[a]]];
        } else {
            seg[a] = rpos[a] = lpos[a] = 0;
            mn[a] = INF;
        }
        return a;
    } else pull(a);
    return a;
}

vector<pii> ins[100005];
vector<pii> out[100005];
int rt[100005];
ll ans = 0;

void dfs2(int x, int p = 0){
    rt[x] = sz++; 
    for(pii i : ins[x]){
        update(in[i.ff], 1, rt[x]);
        update(in[i.ss], 1, rt[x]);
    }
    for(int i : g[x]){
        if(i == p) continue;
        dfs2(i, x);
        rt[x] = merge(rt[x], rt[i]);
    } 
    if(mn[rt[x]] != INF){
        //cout << x << " " << seg[rt[x]] - mn[rt[x]] << " " << mn[rt[x]] << endl;
        ans += seg[rt[x]] - mn[rt[x]];
    }
    for(pii i : out[x]){
        update(in[i.ff], -2, rt[x]);
        update(in[i.ss], -2, rt[x]);
    }
}

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    mn[0] = INF;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs1(1, 1);
    for(int i = 1; i < 20; i++){
        for(int j = 1; j <= n; j++){
            par[j][i] = par[par[j][i - 1]][i - 1];
        }
    }
    for(int i = 0; i < m; i++){
        int a, b;
        cin >> a >> b;
        if(a == b) continue;
        int c = lca(a, b);
        ins[a].pb({a, b});
        ins[b].pb({a, b});
        out[c].pb({a, b});
    }
    dfs2(1);
    cout << ans/2 << endl;
}
```