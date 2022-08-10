title: Tree Coloring (Tutorial)
date: 8-10-2022
tag: loj, hld, segtree, link-cut tree, tree, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/2001)

## Solution

Lets solve queries of type 1 and 3 first. If every node stores the number of distinct values from itself to the root, then for subtree queries, just return a range max of its subtree using euler tour. Lets maintain a \\(1\\) or a \\(0\\) for every node, denoting if it's parent is a different color. Every time we update a \\(0\\) to a \\(1\\) we can add \\(1\\) to the subtree, and every time we update a \\(1\\) to a \\(0\\) we can subtract \\(1\\) from the subtree. To update, we just go up the tree and flip all the \\(1\\)s to \\(0\\)s, as well as flip the \\(0\\)s connected to the path to \\(1\\)s. This ressembles the access function on a link-cut tree, which proves that only \\(N log N\\) total nodes will be updated after the queries. Finding the nodes to update can be done using hld and walk on segment tree. Queries of the second kind between nodes \\(a\\) and \\(b\\) is just the distinct from \\(a\\) and \\(b\\) to the root minus the lca. This works because there are only updates to root. (My code doesn't actually do this, it uses a seperate hld to maintain).

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

vector<int> g[100005];
int sz[100005], in[100005], head[100005], depth[100005], par[100005];
int out[100005], rev[100005];
int tim;
 
void dfs1(int x, int p){
    sz[x] = 1;
    for(int &i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
        sz[x] += sz[i];
        if(g[x][0] == p || sz[i] > sz[g[x][0]]) swap(g[x][0], i);
    }
}
 
void dfs2(int x, int p){
    rev[tim] = x;
    in[x] = tim++;
    par[x] = p;
    depth[x] = depth[p] + 1;
    for(int i : g[x]){
        if(i == p) continue;
        head[i] = (i == g[x][0] ? head[x] : i);
        dfs2(i, x);
    }
    out[x] = tim - 1;
}

int seg[400005], tag[400005];
pii edge[400005];

void push_down(int cur, int l, int r){
    if(tag[cur] == -1) return;
    edge[cur*2 + 1] = edge[cur*2 + 2] = {tag[cur], tag[cur]};
    tag[cur*2 + 1] = tag[cur*2 + 2] = tag[cur];
    int mid = (l + r)/2;
    seg[cur*2 + 1] = 0;
    seg[cur*2 + 2] = 0;
    tag[cur] = -1;
}

void update(int l, int r, int v, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l <= ul && ur <= r){
        seg[cur] = 0;
        edge[cur] = {v, v};
        tag[cur] = v;
        return;
    }
    if(ur < l || ul > r) return;
    push_down(cur, ul, ur);
    int mid = (ul + ur)/2;
    update(l, r, v, ul, mid, cur*2 + 1);
    update(l, r, v, mid + 1, ur, cur*2 + 2);
    seg[cur] = seg[cur*2 + 1] + seg[cur*2 + 2] + (edge[cur*2 + 1].ss != edge[cur*2 + 2].ff);
    edge[cur].ff = edge[cur*2 + 1].ff;
    edge[cur].ss = edge[cur*2 + 2].ss;
}

int query(int l, int r, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l <= ul && ur <= r) return seg[cur];
    push_down(cur, ul, ur);
    int mid = (ul + ur)/2;
    if(r <= mid) return query(l, r, ul, mid, cur*2 + 1);
    if(l > mid) return query(l, r, mid + 1, ur, cur*2 + 2);
    return query(l, r, ul, mid, cur*2 + 1) + query(l, r, mid + 1, ur, cur*2 + 2) + (edge[cur*2 + 1].ss != edge[cur*2 + 2].ff);
}

int type(int x, int ul = 0, int ur = tim - 1, int cur = 0){
    if(ul == x && x == ur) return edge[cur].ff;
    push_down(cur, ul, ur);
    int mid = (ul + ur)/2;
    if(x <= mid) return type(x, ul, mid, cur*2 + 1);
    else return type(x, mid + 1, ur, cur*2 + 2);
}

int sum(int a, int b, int ret = 0){
    int prva = type(in[a]), prvb = type(in[b]);
    while(head[a] != head[b]){
        if(depth[head[a]] > depth[head[b]]) swap(a, b), swap(prva, prvb);
        ret += query(in[head[b]], in[b]) + (type(in[b]) != prvb);
        prvb = type(in[head[b]]);
        b = par[head[b]];
    }
    if(depth[a] > depth[b]) swap(a, b), swap(prva, prvb);
    ret += query(in[a], in[b]) + (type(in[a]) != prva) + (type(in[b]) != prvb);
    return ret;
}

int seg2[400005], tag2[400005];

void push_down2(int x){
    if(tag2[x] == 0) return;
    for(int i = x*2 + 1; i <= x*2 + 2; i++){
        seg2[i] += tag2[x];
        tag2[i] += tag2[x];
    }
    tag2[x] = 0;
}

void update2(int l, int r, int v, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l <= ul && ur <= r){
        seg2[cur] += v;
        tag2[cur] += v;
        return;
    }
    push_down2(cur);
    int mid = (ul + ur)/2;
    if(l <= mid) update2(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update2(l, r, v, mid + 1, ur, cur*2 + 2);
    seg2[cur] = max(seg2[cur*2 + 1], seg2[cur*2 + 2]);
}

int query2(int l, int r, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l <= ul && ur <= r) return seg2[cur];
    if(ur < l || ul > r) return -INF;
    push_down2(cur);
    int mid = (ul + ur)/2;
    return max(query2(l, r, ul, mid, cur*2 + 1), query2(l, r, mid + 1, ur, cur*2 + 2));
}

int seg3[400005];
int prv[100005];

int st(int x, int l = 0, int r = tim - 1, int cur = 0){
    if(l == r) return seg3[cur];
    int mid = (l + r)/2;
    if(x <= mid) return st(x, l, mid, cur*2 + 1);
    else return st(x, mid + 1, r, cur*2 + 2);
}

void flip(int x, int l = 0, int r = tim - 1, int cur = 0){
    if(l == r){
        if(seg3[cur]){
            update2(in[rev[l]], out[rev[l]], -1);
            seg3[cur] = 0;
        } else {
            update2(in[rev[l]], out[rev[l]], 1);
            seg3[cur] = 1;
        }
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) flip(x, l, mid, cur*2 + 1);
    else flip(x, mid + 1, r, cur*2 + 2);
    seg3[cur] = seg3[cur*2 + 1] + seg3[cur*2 + 2];
}

vector<int> vv;

void walk(int l, int r, int ul = 0, int ur = tim - 1, int cur = 0){
    if(!seg3[cur]) return;
    if(l <= ul && ur <= r){
        if(ul == ur){
            seg3[cur] = 0;
            update2(in[rev[ul]], out[rev[ul]], -1);
            if(prv[par[rev[ul]]] != par[rev[ul]]) flip(in[prv[par[rev[ul]]]]);
            prv[par[rev[ul]]] = rev[ul];
            return;
        }
        int mid = (ul + ur)/2;
        if(seg3[cur*2 + 1]) walk(l, r, ul, mid, cur*2 + 1);
        if(seg3[cur*2 + 2]) walk(l, r, mid + 1, ur, cur*2 + 2);
        seg3[cur] = seg3[cur*2 + 1] + seg3[cur*2 + 2];
        return;
    }
    int mid = (ul + ur)/2;
    if(l <= mid) walk(l, r, ul, mid, cur*2 + 1);
    if(r > mid) walk(l, r, mid + 1, ur, cur*2 + 2);
    seg3[cur] = seg3[cur*2 + 1] + seg3[cur*2 + 2];
}

void add(int x, int v){
    //cout << a << " " << b << endl;
    while(head[x] != head[1]){
        walk(in[head[x]], in[x]);
        update(in[head[x]], in[x], v);
        x = par[head[x]];
    }
    walk(in[1], in[x]);
    update(in[1], in[x], v);
}

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs1(1, 1);
    head[1] = 1;
    dfs2(1, 1);
    for(int i = 1; i <= n; i++){
        update(in[i], in[i], i);
        if(i > 1) flip(in[i]);
        prv[i] = i;
    }
    for(int i = n + 1; i <= n + q; i++){
        int t;
        cin >> t;
        if(t == 1){
            int x;
            cin >> x;
            add(x, i);
            if(prv[x] != x) flip(in[prv[x]]), prv[x] = x;
        } else if(t == 2){
            int a, b;
            cin >> a >> b;
            cout << sum(a, b) + 1 << "\n";
        } else {
            int x;
            cin >> x;
            cout << query2(in[x], out[x]) + 1 << "\n";
        }
    }
}
```