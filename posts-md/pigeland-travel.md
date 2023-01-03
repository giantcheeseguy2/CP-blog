title: Pigeland (Tutorial)
date: 1-3-2023
tag: cf, tree, hld, binary lifting, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/415667/problem/A)

## Solution

It seems intuitive that when we move a car, we should move it entirely from its start position to end position. We can verify this by solving the \\(M!\\) subtask. Now, we just have to find some way to order the cars such that they never intersect. This can be done with two ways: binary lifting or hld. For the binary lifting solution, we notice that if car \\(b\\) is car \\(a\\)'s path, then car \\(b\\) must be moved before car \\(a\\). Thus, by drawing an edge from \\(b\\) to \\(a\\), our answer is a topological ordering on the graph. If there are any cycles, it is impossible. Then, we just simulate the topological ordering to make sure that the endpoints don't affect the answer. The graph can be done with binary lifting, in a similar fashion to a segtree graph. The other solution uses alot more bashing. A car is able to be moved if there are no cars on its path, and its endpoint does not lie on any car's path. Maintaining whether there are any paths that cover the endpoint can be done easily with an hld. However, to maintain whether any cars lie on a path, we have to update all paths that cover a node, which is hard. Notice that we only care when all nodes on a path dissappear, so we can tag the segtree nodes touched on the hld traversal of a path. When a segtree node no longer has any active nodes in its subtree, we can relax all paths that have tagged it. It is easy to see that this algorithm has a complexity of \\(O(N log^2 N)\\).

## Code

Solution with hld

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

vector<int> g[120005];
int par[120005], depth[120005], sub[120005];
int head[12005];
int in[120005], tim;

void dfs1(int x, int p = 0){
    depth[x] = depth[p] + 1;
    par[x] = p;
    sub[x] = 1;
    for(int &i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
        sub[x] += sub[i];
        if(g[x][0] == p || sub[i] > sub[g[x][0]]) swap(g[x][0], i);
    }
}

void dfs2(int x, int p = 0){
    in[x] = tim++;
    for(int i : g[x]){
        if(i == p) continue;
        head[i] = (i == g[x][0] ? head[x] : i);
        dfs2(i, x);
    }
}

vector<int> seg[500005][2];
int active[120005];
int cnt[500005];

void add(int l, int r, int v, int tar, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l <= ul && ur <= r){
        if(cnt[cur] > (ul <= tar && tar <= ur)){
            seg[cur][ul <= tar && tar <= ur].pb(v), active[v]++;
        }
        return;
    }
    int mid = (ul + ur)/2;
    if(l <= mid) add(l, r, v, tar, ul, mid, cur*2 + 1);
    if(r > mid) add(l, r, v, tar, mid + 1, ur, cur*2 + 2);
}

void ins(int x, int ul = 0, int ur = tim - 1, int cur = 0){
    cnt[cur]++;
    if(ul == ur) return;
    int mid = (ul + ur)/2;
    if(x <= mid) ins(x, ul, mid, cur*2 + 1);
    else ins(x, mid + 1, ur, cur*2 + 2);
}

queue<int> q;

void rem(int x, int ul = 0, int ur = tim - 1, int cur = 0){
    cnt[cur]--;
    if(cnt[cur] == 1){
        for(int i : seg[cur][1]){
            active[i]--;
            if(active[i] == 0) q.push(i);
        }
        seg[cur][1].clear();
    }
    if(cnt[cur] == 0){
        for(int i : seg[cur][0]){
            active[i]--;
            if(active[i] == 0) q.push(i);
        }
        seg[cur][0].clear();
    }
    if(ul == ur) return;
    int mid = (ul + ur)/2;
    if(x <= mid) rem(x, ul, mid, cur*2 + 1);
    else rem(x, mid + 1, ur, cur*2 + 2);
}

int mn[500005];
int tag[500005];

void push_down(int x){
    if(!tag[x]) return;
    for(int i = 2*x + 1; i <= 2*x + 2; i++){
        mn[i] += tag[x];
        tag[i] += tag[x];
    }
    tag[x] = 0;
}

int id[120005];

void update(int l, int r, int v, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l <= ul && ur <= r){
        tag[cur] += v;
        mn[cur] += v;
        return;
    }
    push_down(cur);
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
    mn[cur] = min(mn[cur*2 + 1], mn[cur*2 + 2]);
}

int query(int x, int l = 0, int r = tim - 1, int cur = 0){
    if(l == r) return mn[cur];
    push_down(cur);
    int mid = (l + r)/2;
    if(x <= mid) return query(x, l, mid, cur*2 + 1);
    else return query(x, mid + 1, r, cur*2 + 2);
}

void prune(int ul = 0, int ur = tim - 1, int cur = 0){
    if(mn[cur] <= 1){
        if(ul == ur){
            if(id[ul] != -1){
                active[id[ul]]--;
                if(active[id[ul]] == 0) q.push(id[ul]);
            }
            mn[cur] = INF;
        } else {
            push_down(cur);
            int mid = (ul + ur)/2;
            prune(ul, mid, cur*2 + 1);
            prune(mid + 1, ur, cur*2 + 2);
            mn[cur] = min(mn[cur*2 + 1], mn[cur*2 + 2]);
        }
    }
}

int sum[120005];

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        int n;
        cin >> n;
        for(int i = 0; i <= n; i++) g[i].clear(), sum[i] = 0, active[i] = 1, id[i] = -1;
        for(int i = 0; i <= 4*n; i++) seg[i][0].clear(), seg[i][1].clear(), cnt[i] = 0, mn[i] = tag[i] = 0;
        while(!q.empty()) q.pop();
        tim = 0;
        for(int i = 0; i < n - 1; i++){
            int a, b;
            cin >> a >> b;
            g[a].pb(b);
            g[b].pb(a);
        }
        dfs1(1);
        head[1] = 1;
        dfs2(1);
        int m;
        cin >> m;
        vector<pii> v;
        for(int i = 0; i < m; i++){
            int a, b;
            cin >> a >> b;
            v.pb({a, b});
            ins(in[a]); 
            id[in[b]] = i;
        }
        for(int i = 0; i < m; i++){
            int a = v[i].ff, b = v[i].ss;
            while(head[a] != head[b]){
                if(depth[head[a]] > depth[head[b]]) swap(a, b);
                add(in[head[b]], in[b], i, in[v[i].ff]);
                update(in[head[b]], in[b], 1);
                b = par[head[b]];
            }
            if(depth[a] > depth[b]) swap(a, b);
            add(in[a], in[b], i, in[v[i].ff]);
            update(in[a], in[b], 1);
        } 
        prune();
        /*for(int i = 0; i < m; i++){
            int a = v[i].ff, b = v[i].ss;
            if(!active[i]) q.push(i);
        }*/
        //for(int i = 0; i < m; i++) cout << active[i] << " ";
        //cout << endl;
        while(!q.empty()){
            int x = q.front();
            q.pop();
            int a = v[x].ff, b = v[x].ss;
            rem(in[a]);
            while(head[a] != head[b]){
                if(depth[head[a]] > depth[head[b]]) swap(a, b);
                update(in[head[b]], in[b], -1);
                b = par[head[b]];
            }
            if(depth[a] > depth[b]) swap(a, b);
            update(in[a], in[b], -1);
            prune();
            //cout << x << ": ";
            //for(int i = 0; i < m; i++) cout << active[i] << " ";
            //cout << endl;
        }
        bool val = true;
        for(int i = 0; i < m; i++) val &= active[i] == 0;
        cout << (val ? "Yes" : "No") << endl;
    }
}
```