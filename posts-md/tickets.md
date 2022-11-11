title: Tickets (Tutorial)
date: 9-15-2022
tag: usaco, segtree, graph, shortest path, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1164)

## Solution

The fact that each checkpoint can open up an interval immediately suggests a segtree graph solution. If there was no condition to reach both \\(1\\) and \\(N\\), and we only wanted to reach \\(N\\), then we could build a segtree graph with \\(0\\) weighted edges where each leaf node points to its respective segment with some weight. This works because when finding shortest path between two nodes, each node will obviously only be used at most once. Now, lets consider running the algorithm from \\(1\\) and \\(N\\) on the reverse graph. The answer for a position \\(i\\) will be the minimum of the distance from \\(i\\) to \\(j\\) plus the distance from \\(1\\) and \\(N\\) to \\(j\\) for all \\(j\\). To do this, we can run a multisource dijikstra from every node, with a starting value of the distance from \\(1\\) and \\(N\\) to \\(j\\) on the reverse graph. The answer of a node is then just the shortest path to that node.

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
typedef pair<int, int> pii;
typedef pair<ll, ll>   pll;

const int inf = 1e9;
const ll llinf = 1e18;
const int mod = 1e9 + 7;
const double PI = acos(-1);

struct chash {
    const uint64_t C = ll(2e18*PI)+71;
    const int RANDOM = rand();
    ll operator()(ll x) const {
        return __builtin_bswap64((x^RANDOM)*C);
    }
};

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;
template<class K, class V> using gphash = gp_hash_table<K, V, chash, equal_to<K>, direct_mask_range_hashing<>, linear_probe_fn<>, hash_standard_resize_policy< hash_exponential_size_policy<>, hash_load_check_resize_trigger<>, true> >;

inline ll ceil0(ll a, ll b) {
    return a / b + ((a ^ b) > 0 && a % b);
}

inline ll floor0(ll a, ll b) {
    return a / b - ((a ^ b) < 0 && a % b);
}

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

int n;
vector<pll> g[1000000];

void build(int l = 1, int r = n, int cur = 0){
    if(l >= r) return;
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    build(mid + 1, r, cur*2 + 2);
    g[cur*2 + 2].pb({cur, 0});
    g[cur*2 + 1].pb({cur, 0});
}

int node(int x, int l = 1, int r = n, int cur = 0){
    if(l == x && x == r) return cur;
    int mid = (l + r)/2;
    if(x <= mid) return node(x, l, mid, cur*2 + 1);
    else return node(x, mid + 1, r, cur*2 + 2);
}

void add(int x, int v, int l, int r, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r){
        g[cur].pb({x, v});
        return;
    }
    if(ul > r || ur < l || ul > ur) return;
    int mid = (ul + ur)/2;
    add(x, v, l, r, ul, mid, cur*2 + 1);
    add(x, v, l, r, mid + 1, ur, cur*2 + 2);
}

ll d[1000000][3];

void find(int x, int ind){
    priority_queue<pll, vector<pll>, greater<pll>> q;
    d[x][ind] = 0;
    q.push({0, x});
    while(!q.empty()){
        pll st = q.top();
        q.pop();
        if(st.ff > d[st.ss][ind]) continue;
        for(pll i : g[st.ss]){
            if(d[st.ss][ind] + i.ss < d[i.ff][ind]){
                d[i.ff][ind] = d[st.ss][ind] + i.ss;
                q.push({d[i.ff][ind], i.ff});
            }
        }
    }
}

int main(){
    setIO();
    int t;
    cin >> n >> t;
    build();
    int mx = 4*n + t;
    for(int i = 0; i <= mx; i++) d[i][0] = llinf;
    for(int i = 0; i <= mx; i++) d[i][1] = llinf;
    for(int i = 0; i < t; i++){
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        add(4*n + 1 + i, 0, c, d);
        g[4*n + 1 + i].pb({node(a), b});
    }
    find(node(1), 0);
    find(node(n), 1);
    priority_queue<pll, vector<pll>, greater<pll>> q;
    for(int i = 0; i <= mx; i++) d[i][2] = d[i][0] + d[i][1];
    for(int i = 0; i <= mx; i++) if(d[i][2] < llinf) q.push({d[i][2], i});
    while(!q.empty()){
        pll st = q.top();
        q.pop();
        if(st.ff > d[st.ss][2]) continue;
        for(pll i : g[st.ss]){
            if(d[st.ss][2] + i.ss < d[i.ff][2]){
                d[i.ff][2] = d[st.ss][2] + i.ss;
                q.push({d[i.ff][2], i.ff});
            }
        }
    }
    for(int i = 1; i <= n; i++){
        cout << (d[node(i)][2] >= llinf ? -1 : d[node(i)][2]) << endl;
    }
}
```