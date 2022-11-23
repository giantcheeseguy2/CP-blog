title: Spring Cleaning (Tutorial)
date: 11-8-2022
tag: ceoi, codeforces, greedy, hld, segtree, tree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1403/problem/B)

## Solution

Lets first solve for the one query case. Let \\(val[i] =\\) the number of paths coming out of \\(i\\). Our first condition is that \\(val[i] > 0\\) for all \\(i\\) that are not the root. Our answer will be \\(\\sum val[i]\\). If \\(i\\) is a leaf node, then \\(val[i]\\) is always \\(1\\). Otherwise, \\(val[i]\\) will be \\(\\sum_{j} val[j]\\) initially, where \\(j\\) is a child of \\(i\\). Our potential operations are to subtract two from any \\(val[i] > 2\\), which represents merging two paths. It is only possible to pair the root \\(x\\) if \\(val[x]\\) is even. Since we are only subtracting \\(2\\) every time, any operations we may do will not affect the parity of \\(val[x]\\), and thus will not make a pairing impossible. This leads us to a greedy solution where as soon as \\(val[i] > 2\\), we subtract \\(2\\) until it is not: \\(val[i] = 2 - val[i]%2). We end up getting that if \\(val[i]\\) is even then it contributes two to the answer, and if it is odd, it contributes one to the answer. Now lets see the affect of attaching a node to a leaf. This just flips all the parity of \\(val[i]\\) on the path from that leaf to the root. We can maintain \\(val[i]%2\\) for all \\(i\\) with an hld that supports range flip and easily maintain the number of even and odd \\(val[i]\\).

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
int cur[100005];
int rt, tim = 0;
bool leaf[100005];
int sz[100005];
int in[100005];
int head[100005];
int par[100005];

void dfs1(int x, int p){
    if(g[x].size() == 1){
        cur[x] = sz[x] = 1;
        leaf[x] = true;
        return;
    }
    for(int &i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
        cur[x] += cur[i];
        sz[x] += sz[i];
        if(g[x][0] == p || sz[i] > sz[g[x][0]]) swap(g[x][0], i);
    }
    cur[x] = 2 - cur[x]%2;
}

void dfs2(int x, int p){
    in[x] = tim++;
    par[x] = p;
    for(int i : g[x]){
        if(i == p) continue;
        head[i] = (i == g[x][0] ? head[x] : i);
        dfs2(i, x);
    }
}

int seg[400005], tag[400005];

void push_down(int x, int l, int r){
    if(!tag[x]) return;
    int mid = (l + r)/2;
    seg[x*2 + 1] = mid - l + 1 - seg[x*2 + 1];
    tag[x*2 + 1] ^= 1;
    seg[x*2 + 2] = r - mid - seg[x*2 + 2];
    tag[x*2 + 2] ^= 1;
    tag[x] = 0;
}

void update(int l, int r, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l <= ul && ur <= r){
        tag[cur] ^= 1;
        seg[cur] = ur - ul + 1 - seg[cur];
        return;
    }
    push_down(cur, ul, ur);
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, mid + 1, ur, cur*2 + 2);
    seg[cur] = seg[cur*2 + 1] + seg[cur*2 + 2];
}

int query(int x, int l = 0, int r = tim - 1, int cur = 0){
    if(l == r) return seg[cur];
    push_down(cur, l, r);
    int mid = (l + r)/2;
    if(x <= mid) return query(x, l, mid, cur*2 + 1);
    else return query(x, mid + 1, r, cur*2 + 2);
}

void upd(int x){
    while(head[x] != head[rt]){
        update(in[head[x]], in[x]);
        x = par[head[x]];
    }
    update(in[head[x]], in[x]);
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
    rt = 1;
    for(int i = 1; i <= n; i++) if(g[i].size() > 1) rt = i;
    dfs1(rt, rt);
    head[rt] = rt;
    dfs2(rt, rt);
    for(int i = 1; i <= n; i++) if(cur[i] == 2) update(in[i], in[i]);
    while(q--){
        int t;
        cin >> t;
        vector<pii> v;
        for(int i = 0; i < t; i++){
            int x;
            cin >> x;
            if(leaf[x]){
                leaf[x] = false;
                v.pb({x, 0});
            } else {
                upd(x);
                v.pb({x, 1});
            }
        }
        if(query(in[rt]) == 0) cout << -1 << endl;
        else cout << n + t + seg[0] - 2 << endl;
        for(pii i : v){
            if(i.ss == 0) leaf[i.ff] = true;
            else upd(i.ff);
        }
    }
}
```