title: Bessie's Snow Cow (Tutorial)
date: 9-16-2022
tag: usaco, tree, euler tour, segtree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=973)

## Solution

Lets maintain a set of nodes that are colored with a updated with a color for every color. Every one of those nodes contributes an answer of \\(1\\) to every element in the subtree. To prevent overcounting, we can also subtract \\(1\\) for every node in an updated node's subtree, then removing them, which amortizes. Thus, we only need a euler tour and a segtree with lazy propagation to suport subtree add subtree sum.

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

int n, q, tim = 0;
ll seg[400005], tag[400005];

void push_down(int x, int l, int r){
    if(!tag[x]) return;
    int mid = (l + r)/2;
    seg[x*2 + 1] += (mid - l + 1)*tag[x];
    seg[x*2 + 2] += (r - mid)*tag[x];
    tag[x*2 + 1] += tag[x];
    tag[x*2 + 2] += tag[x];
    tag[x] = 0;
}

void update(int l, int r, int v, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l <= ul && ur <= r){
        seg[cur] += (ll)v*(ur - ul + 1);
        tag[cur] += v;
        return;
    }
    push_down(cur, ul, ur);
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
    seg[cur] = seg[cur*2 + 1] + seg[cur*2 + 2];
}

ll query(int l, int r, int ul = 0, int ur = tim - 1, int cur = 0){
    if(l <= ul && ur <= r) return seg[cur];
    int mid = (ul + ur)/2;
    push_down(cur, ul, ur);
    if(r <= mid) return query(l, r, ul, mid, cur*2 + 1);
    if(l > mid) return query(l, r, mid + 1, ur, cur*2 + 2);
    return query(l, r, ul, mid, cur*2 + 1) + query(l, r, mid + 1, ur, cur*2 + 2);
}

int in[100005], out[100005];
int rev[100005];
vector<int> g[100005];
set<pii> pos[100005];

void dfs(int x, int p){
    rev[tim] = x;
    in[x] = tim++;
    for(int i : g[x]){
        if(i == p) continue;
        dfs(i, x);
    }
    out[x] = tim;
}

int main(){
    setIO();
    freopen("snowcow.in", "r", stdin);
    freopen("snowcow.out", "w", stdout);
    cin >> n >> q;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs(1, 1);
    while(q--){
        int t;
        cin >> t;
        if(t == 1){
            int x, v;
            cin >> x >> v;
            set<pii>::iterator it = pos[v].upper_bound({in[x], -1});
            if(it != pos[v].begin() && (*prev(it)).ss >= out[x]) continue;
            it = pos[v].lower_bound({in[x], -1});
            while(it != pos[v].end() && (*it).ss <= out[x]){
                update((*it).ff, (*it).ss - 1, -1);
                it = pos[v].erase(it);
            }
            pos[v].insert({in[x], out[x]});
            update(in[x], out[x] - 1, 1);
        } else {
            int x;
            cin >> x;
            cout << query(in[x], out[x] - 1) << endl;
        }
    }
}
```