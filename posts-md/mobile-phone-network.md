title: Mobile Phone Network (Tutorial)
date: 2-26-2023
tag: cf, hld, tree, mst, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1023/problem/F)

## Solution

Our problem is to assign a maximal value to our edges such that all of them are on the mst. So lets first find an mst which has all our edges on it, since no matter what values our edges have, as long as they will be on the mst it will not choose different extra edges to be on the mst. Now, we want to maximize the value for each edge such that it is still on the mst. Considering all the edges that we are competing against, we just have to assign it to be the minimum of that. So we can maintain this with a path chmin on a tree. If no extra edges are covering one of our edges, then the answer is infinite.

## Code

```c++
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

int seg[2000005], head[500005], par[500005], sub[500005], in[500005], depth[500005], tim = 0;
int val[500005];
vector<pii> g[500005];

void dfs1(int x, int p, int v = 1){
    val[x] = v;
    sub[x] = 1;
    for(pii &i : g[x]){
        if(i.ff == p) continue;
        dfs1(i.ff, x, i.ss);
        sub[x] += sub[i.ff];
        if(g[x][0].ff == p || sub[i.ff] > sub[g[x][0].ff]) swap(i, g[x][0]);
    }
}

void dfs2(int x, int p){
    depth[x] = depth[p] + 1;
    par[x] = p;
    in[x] = tim++;
    for(pii &i : g[x]){
        if(i.ff == p) continue;
        head[i.ff] = (i == g[x][0] ? head[x] : i.ff);
        dfs2(i.ff, x);
    }
}

void update(int l, int r, int v, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l > r) return;
    if(l <= ul && ur <= r){
        seg[cur] = min(seg[cur], v);
        return;
    }
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
}

int query(int x, int l = 0, int r = tim - 1, int cur = 0){
    if(l == r) return seg[cur];
    int mid = (l + r)/2;
    seg[cur*2 + 1] = min(seg[cur*2 + 1], seg[cur]);
    seg[cur*2 + 2] = min(seg[cur*2 + 2], seg[cur]);
    if(x <= mid) return query(x, l, mid, cur*2 + 1);
    else return query(x, mid + 1, r, cur*2 + 2);
}

void upd(int a, int b, int c){
    while(head[a] != head[b]){
        if(depth[head[a]] > depth[head[b]]) swap(a, b);
        update(in[head[b]], in[b], c);
        b = par[head[b]];
    }
    if(depth[a] > depth[b]) swap(a, b);
    update(in[a] + 1, in[b], c);
}

int dsu[500005];

int find(int x){
    if(dsu[x] == x) return x;
    return dsu[x] = find(dsu[x]);
}

int main(){
    setIO();
    int n, k, m;
    cin >> n >> k >> m;
    vector<pair<int, pii>> e;
    for(int i = 0; i < k; i++){
        int a, b;
        cin >> a >> b;
        e.pb({0, {a, b}});
    }
    for(int i = 0; i < m; i++){
        int a, b, c;
        cin >> a >> b >> c;
        e.pb({c, {a, b}});
    } 
    for(int i = 1; i <= n; i++) dsu[i] = i;
    sort(e.begin(), e.end());
    vector<pair<int, pii>> v;
    for(auto i : e){
        if(find(i.ss.ff) != find(i.ss.ss)){
            g[i.ss.ff].pb({i.ss.ss, i.ff});
            g[i.ss.ss].pb({i.ss.ff, i.ff});
            dsu[find(i.ss.ff)] = find(i.ss.ss);
        } else {
            v.pb(i);
        }
    }
    dfs1(1, 1);
    head[1] = 1;
    dfs2(1, 1);
    for(int i = 0; i <= 4*tim; i++) seg[i] = INF + 1;
    for(auto i : v){
        upd(i.ss.ff, i.ss.ss, i.ff);
    }
    ll ans = 0;
    for(int i = 2; i <= n; i++){
        if(val[i]) continue;
        int x = query(in[i]);
        if(x == INF + 1){
            cout << -1 << endl;
            return 0;
        }
        ans += x;
    }
    cout << ans << endl;
}
```