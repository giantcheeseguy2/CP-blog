title: Paint By Rectangles (Tutorial)
date: 8-16-2022
tag: usaco, segtree, dsu

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1212)

## Solution

If all the rectangles intersect, then you can use the euler formula to find the total number sections, as \\(f = e - v + 2\\). Calculating the number of edges and vertices are easy with a sweep. However, this is completely unrelated to the final solution. Lets maintain a dsu 

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

const int inf = 1e9;
const ll llinf = 1e18;
const int mod = 1e9 + 7;

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;

inline ll ceil0(ll a, ll b) {
    return a / b + ((a ^ b) > 0 && a % b);
}


int seg[1000000];
bool vis[1000000];
int par[300000];
int n, t;

int find(int x){
    if(x == par[x]) return x;
    return par[x] = find(par[x]);
}

void merge(int a, int b){
    if(a == 0 || b == 0) return;
    par[find(a)] = find(b);
}

void push_down(int cur){
    if(!seg[cur]) return;
    for(int i = cur*2 + 1; i <= cur*2 + 2; i++){
        if(vis[i]){
            merge(seg[i], seg[cur]);
            seg[i] = seg[cur];
        }
    }
    seg[cur] = 0;
}

void update(int l, int r, int v, int ul = 1, int ur = 2*n, int cur = 0){
    if(l <= ul && ur <= r){
        if(vis[cur]){
            merge(seg[cur], v);
            seg[cur] = v;
        }
        return;
    }
    if(ul > r || ur < l || ul > ur) return;
    push_down(cur);
    int mid = (ul + ur)/2;
    update(l, r, v, ul, mid, cur*2 + 1);
    update(l, r, v, mid + 1, ur, cur*2 + 2);
}

void upd(int x, int v, int l = 1, int r = 2*n, int cur = 0){
    if(l == x && x == r){
        vis[cur] = v;
        return;
    }
    if(l > x || r < x || l > r) return;
    push_down(cur);
    int mid = (l + r)/2;
    upd(x, v, l, mid, cur*2 + 1);
    upd(x, v, mid + 1, r, cur*2 + 2);
    vis[cur] = vis[cur*2 + 1] || vis[cur*2 + 2];
}

int query(int x, int l = 1, int r = 2*n, int cur = 0){
    if(l == x && x == r) return seg[cur];
    push_down(cur);
    int mid = (l + r)/2;
    if(x <= mid) return query(x, l, mid, cur*2 + 1);
    else return query(x, mid + 1, r, cur*2 + 2);
}

int comp[300000];
vector<pair<pii, int>> in[300000], out[300000];
sset<int> s[300000];
ll ans[300000], black[300000];
bool flip[300000];
int bit[300000];
int mn[300000];

void updateb(int x, int v){
    for(x; x <= 2*n; x += x & (-x)){
        bit[x] += v;
    }
}

int queryb(int x, int ret = 0){
    for(x; x; x -= x & (-x)) ret += bit[x];
    return ret;
}

int main(){
    setIO();
    cin >> n >> t;
    for(int i = 1; i <= n; i++){
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        in[a].pb({{b, d}, i});
        out[c].pb({{b, d}, i});
    }
    for(int i = 1; i <= n; i++) par[i] = i;
    for(int i = 1; i <= 2*n; i++){
        for(auto j : in[i]){
            upd(j.ff.ff, 1), upd(j.ff.ss, 1);
            update(j.ff.ff, j.ff.ss, j.ss);
        }
        for(auto j : out[i]){
            update(j.ff.ff, j.ff.ss, j.ss);
            upd(j.ff.ff, 0), upd(j.ff.ss, 0);
        }
    } 
    for(int i = 1; i <= n; i++) mn[i] = inf;
    for(int i = 1; i <= 2*n; i++){
        for(auto &j : in[i]) j.ss = find(j.ss), mn[j.ss] = min(mn[j.ss], i);
        for(auto &j : out[i]) j.ss = find(j.ss);
    }
    for(int i = 1; i <= n; i++) ans[find(i)] = 1;
    for(int i = 1; i <= 2*n; i++){
        for(auto j : in[i]){
            if(i == mn[j.ss]){
                flip[j.ss] = queryb(j.ff.ff)%2;
            }
            s[j.ss].insert(j.ff.ff), s[j.ss].insert(j.ff.ss);
            updateb(j.ff.ff, 1), updateb(j.ff.ss, -1);
            int a = s[j.ss].order_of_key(j.ff.ff), b = s[j.ss].order_of_key(j.ff.ss);
            ans[j.ss] += b - a - 1;
            black[j.ss] += ceil0(b, 2) - ceil0(a, 2) - 1;
        }
        for(auto j : out[i]){
            int a = s[j.ss].order_of_key(j.ff.ff), b = s[j.ss].order_of_key(j.ff.ss);
            ans[j.ss] += b - a - 1;
            black[j.ss] += ceil0(b, 2) - ceil0(a, 2);
            s[j.ss].erase(j.ff.ff), s[j.ss].erase(j.ff.ss);
            updateb(j.ff.ff, -1), updateb(j.ff.ss, 1);
        }
    }
    ll w = 0, b = 0;
    for(int i = 1; i <= n; i++){
        ll x = ans[i] - black[i], y = black[i];
        if(flip[i]) swap(x, y);
        w += x;
        b += y;
    }
    w++;
    if(t == 1){
        cout << w + b << endl;
    } else {
        cout << w << " " << b << endl;
    }
}
```