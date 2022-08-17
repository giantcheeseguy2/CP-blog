title: Peaks Plus (Tutorial)
date: 7-21-2022
tag: luogu, persistent segtree, segtree merge, kruskal tree, binary lifting, tutorial

---

## Problem Statement

[Problem Link](https://www.luogu.com.cn/problem/P7834)

## Solution

Solving this problem offline is trivial. Do a dsu where each component stores an ordered set, and use small to large to merge. Then, for each query, query the kth largest value in the ordered set of the query's component. This gives us an \\(O(n log^2 n)\\) solution. We can also use segment tree merge instead of small to large for an \\(O(n log n)\\) solution. Notice that we can use a kruskal tree to maintain the set of all vertices in each component at a given time, and by merging persistent segtrees, we can query the kth largest value. of a component at a given time. This gives us a \\(O(n log n)\\) solution.

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

int seg[10000000], left0[10000000], right0[10000000];
int sz = 1;

int copy(int x){
    seg[sz] = seg[x];
    left0[sz] = left0[x];
    right0[sz] = right0[x];
    return sz++;
}

vector<int> dict;

void update(int x, int cur, int l = 0, int r = dict.size() - 1){
    if(l == r){
        seg[cur]++;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, left0[cur] = copy(left0[cur]), l, mid);
    else update(x, right0[cur] = copy(right0[cur]), mid + 1, r);
    seg[cur] = seg[left0[cur]] + seg[right0[cur]];
}

int merge(int a, int b){
    if(!a && ! b) return 0;
    if(!a || !b) return copy(a ^ b);
    int ret = copy(a);
    left0[ret] = merge(left0[a], left0[b]);
    right0[ret] = merge(right0[a], right0[b]);
    seg[ret] = seg[a] + seg[b];
    return ret;
}

int query(int x, int cur, int l = 0, int r = dict.size() - 1){
    if(seg[cur] < x) return -1;
    if(l == r) return dict[l];
    int mid = (l + r)/2;
    if(seg[right0[cur]] < x) return query(x - seg[right0[cur]], left0[cur], l, mid);
    else return query(x, right0[cur], mid + 1, r);
}

int par[600005][21];
int dsu[600005];
int val[600005];
int rt[600005];

int find(int x){
    if(dsu[x] == x) return x;
    return dsu[x] = find(dsu[x]);
}

int main(){
    setIO();
    int n, m, q;
    cin >> n >> m >> q;
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i], dict.pb(arr[i]);
    sort(dict.begin(), dict.end());
    dict.resize(unique(dict.begin(), dict.end()) - dict.begin());
    for(int i = 1; i <= n; i++){
        rt[i] = sz++;
        update(lower_bound(dict.begin(), dict.end(), arr[i]) - dict.begin(), rt[i]);
    }
    pair<int, pii> e[m + 1];
    for(int i = 1; i <= m; i++) cin >> e[i].ss.ff >> e[i].ss.ss >> e[i].ff;
    for(int i = 1; i <= n + m; i++) dsu[i] = i;
    sort(e + 1, e + m + 1);
    for(int i = 1; i <= m; i++){
        int a = find(e[i].ss.ff), b = find(e[i].ss.ss);
        par[a][0] = par[b][0] = n + i;
        par[n + i][0] = n + i;
        dsu[a] = n + i;
        dsu[b] = n + i;
        val[n + i] = e[i].ff;
        rt[n + i] = (a != b ? merge(rt[a], rt[b]) : copy(rt[a]));
    }
    for(int i = 1; i < 20; i++) for(int j = 1; j <= n + m; j++) par[j][i] = par[par[j][i - 1]][i - 1];
    int prv = 0;
    while(q--){
        int a, b, c;
        cin >> a >> b >> c;
        b ^= prv;
        a = (a ^ prv)%n + 1;
        c = (c ^ prv)%n + 1;
        for(int i = 19; i >= 0; i--) if(val[par[a][i]] <= b) a = par[a][i];
        cout << (prv = query(c, rt[a])) << "\n";
        if(prv == -1) prv = 0;
    }
}
```