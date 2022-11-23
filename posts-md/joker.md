title: Joker (Tutorial)
date: 11-22-2022
tag: boi, cf, divide and conquer, dsu, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1386/problem/C)

## Solution

Note that checking for an odd cycle is equivalent to checking if a graph is not bipartite. This can actually be maintained using a small to large dsu, where we can make a flip tag on a component when merging. Instead of pushing down the flip tag, we can actually walk up the dsu to the parent to collect all the tags and get the color of each node. To get the \\(O(200 \\cdot N)\\) subtask, we use this dsu and process the queries of the first \\(200\\) indeces in decreasing order of their rightbound. Actually, notice that each index \\(i\\) has a \\(nxt[i]\\), where all queries where \\(l = i\\) and \\(r \\le nxt[i]\\), are valid and all queries where \\(l = i\\) and \\(r > nxt[i]\\). Next notice that \\(nxt[i]\\) is always monotonically increasing with \\(i\\). One way to solve for all monotonically increasing values is to use a divide and conquer, \\(dnq(l_0, r_0, l_1, r_1)\\), where \\([l0, r0]\\) is the range of \\(i\\) we are considering and \\([l_1, r_1]\\) is the range of \\(nxt[i]\\) that corresponds to that range. When considering \\(dnq(l_0, r_0, l_1, r_1)\\), we will assume that the edges \\([1, l0)\\) and \\((r1, M]\\) are already merged. We can split \\([l_0, r_0]\\) into two equal sized parts, and solve for their corresponding ranges. Since at each layer, we only require at most \\(r_1 - l_1 + r_0 - l_0 + 2\\) operations, and we always split the two intervals, we have a \\(O(N log^2 N)\\) solution.

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

int par[200005], sz[200005];
int flip[200005];
pii e[200005];
int n, m, q;
vector<pii> que[200005];

int find(int x){
    if(x == par[x]) return x;
    return find(par[x]);
}

int col(int x){
    if(x == par[x]) return flip[x];
    return col(par[x]) ^ flip[x];
}

int fail = 0;
vector<pair<pii, pii>> hist;

void merge(int a, int b){
    if(find(a) == find(b)){
        int cnt = 0;
        if(col(a) == col(b)) fail++, cnt++;
        hist.pb({{0, -cnt}, {0, 0}});
    } else {
        int x = find(a), y = find(b);
        if(sz[x] < sz[y]) swap(x, y);
        int cnt = 0;
        if(col(a) == col(b)) flip[y] ^= 1, cnt++;
        sz[x] += sz[y];
        par[y] = x;
        hist.pb({{1, cnt}, {x, y}});
    }
}

void undo(){
    assert(hist.size());
    pair<pii, pii> x = hist.back();
    hist.pop_back();
    if(x.ff.ff == 0) fail += x.ff.ss;
    else {
        sz[x.ss.ff] -= sz[x.ss.ss];
        par[x.ss.ss] = x.ss.ss;
        flip[x.ss.ss] ^= x.ff.ss;
    }
}

int nxt[200005];

//[1, l0) and (r1, m] are on
void dnq(int l0, int r0, int l1, int r1){
    //cout << l0 << " " << r0 << " " << l1 << " " << r1 << endl;
    if(l1 == r1){
        for(int i = l0; i <= r0; i++) nxt[i] = l1;
        return;
    }
    if(l0 == r0){
        nxt[l0] = l1;
        return;
    }
    int mid = (l0 + r0)/2;
    int c0 = 0, c1 = 0;
    for(int i = l0; i <= mid; i++) merge(e[i].ff, e[i].ss), c0++;
    int ind = r1;
    while(!fail){
        merge(e[ind].ff, e[ind].ss);
        c1++;
        ind--;
    }
    while(c1) undo(), c1--;
    dnq(mid + 1, r0, ind, r1);
    while(c0) undo(), c0--;
    for(int i = r1; i > ind; i--) merge(e[i].ff, e[i].ss);
    dnq(l0, mid, l1, ind);
    for(int i = r1; i > ind; i--) undo();
}

int main(){
    setIO();
    cin >> n >> m >> q;
    for(int i = 1; i <= m; i++) cin >> e[i].ff >> e[i].ss;
    for(int i = 0; i < q; i++){
        int l, r;
        cin >> l >> r;
        que[l].pb({r, i});
    }
    for(int i = 1; i <= n; i++) par[i] = i, sz[i] = 1;
    for(int i = m; i >= 1; i--) merge(e[i].ff, e[i].ss);
    if(!fail){
        for(int i = 0; i < q; i++){
            cout << "NO" << endl; 
        }
        return 0;
    }
    int l1 = 0;
    while(fail){
        undo();
        l1++;
    }
    l1--;
    while(hist.size()) undo();
    for(int i = 1; i < m; i++) merge(e[i].ff, e[i].ss);
    int r1 = m - !fail;
    for(int i = 1; i < m; i++) undo();
    if(r1 < m) merge(e[m].ff, e[m].ss);
    dnq(1, m, l1, r1);
    //for(int i = 1; i <= m; i++) cout << nxt[i] << " ";
    //cout << endl;
    int ans[q];
    for(int i = 1; i <= m; i++){
        for(pii j : que[i]){
            ans[j.ss] = j.ff <= nxt[i];
        }
    }
    for(int i = 0; i < q; i++){
        if(ans[i]) cout << "YES" << endl;
        else cout << "NO" << endl;
    }
}
```