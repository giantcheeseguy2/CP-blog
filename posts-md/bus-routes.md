title: Bus Routes (Tutorial)
date: 5-19-2023
tag: cf, tree, binary search, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1827/problem/E)

## Solution

First, we can notice that we only need to consider the leaves when checking for all pair reachability, since that is always the worst case. Lets see when two leaves can reach each other. This is when one of the paths that cover them intersect. Now, when can three leaves reach all pairs? This is when there is at least one node of overlap between all of the nodes. Thus, we it is intuitive to realize that all pair reachability is satisfied only when there is at least one node of overlap between all that paths that cover each leaf. Now, we just have to somehow add \\(1\\) to all values reachable by one path from a given leaf. This is doable by using the fact that the amount of nodes covered by a set of nodes sorted by preorder (dfs order) is \\(\\sum depth[x_i] - \\sum depth[lca(x_i, x_{i + 1})] - depth[lca(x_i)] + 1\\). Thus, to add \\(1\\) to all the covered nodes, we can use a sort of prefix sums on tree where we add \\(1\\) to the endpoints of the paths for each leaf and then subtract one from the lca of adjacent endpoints. We also have to subtract \\(1\\) from the parent of the lca. This can be done easily for each leaf since the total number of endpoints is bounded by \\(M\\). Then, we can just check if any nodes are covered by all the leaves easily. However, how can we find a counterexample in the no case? Well, checking if a pair of nodes intersect is easy, since we can root the tree at one of the nodes, and find the highest depth reachable by the other node, then check if that is covered. By doing this, we can actually check if there are any pairs with a single given node. The problem is then just to find that node. Finding this node is the same as finding a node such that exists at least one bad pair. We can actually find one such node by adding the set of nodes covered by each leaf one by one until there no longer exists an intersection node. This can be done using binary search, since checking the amount covered by a set of leaves takes linear time.

## Code

```c++
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse4,popcnt,abm,mmx,tune=native")
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

vector<int> g[500005];

int par[500005];
int lg[1000005];
int n, tim = 0;
int in[500005];
pii mn[20][1000005];
vector<int> ord;

void dfs1(int x, int p = 0, int d = 0){
    in[x] = tim;
    mn[0][tim++] = {d, x};
    for(int i : g[x]){
        if(i == p) continue;
        dfs1(i, x, d + 1);
        mn[0][tim++] = {d, x};
    }
}

void build(int rt){
    tim = 0;
    dfs1(rt);
    for(int i = 1; i < 20; i++){
        for(int j = 0; j + (1 << i) < tim; j++){
            mn[i][j] = min(mn[i - 1][j], mn[i - 1][j + (1 << (i - 1))]);
        }
    }
}

int lca(int a, int b){
    a = in[a], b = in[b];
    if(a > b) swap(a, b);
    return min(mn[lg[b - a + 1]][a], mn[lg[b - a + 1]][b - (1 << lg[b - a + 1]) + 1]).ss;
}

vector<int> upd[500005];
vector<pii> precomp[500005];
int sum[500005];

bool comp(int a, int b){
    return in[a] < in[b];
}

void fill(int x){
    for(pii i : precomp[x]){
        sum[i.ff] += i.ss;
    }    
}

void dfs2(int x, int p = 0){
    par[x] = p;
    for(int i : g[x]){
        if(i == p) continue;
        dfs2(i, x);
    }
    ord.pb(x);
}

vector<int> v;

int find(int x){
    for(int i = 1; i <= n; i++) sum[i] = 0;
    for(int i = 0; i < x; i++) fill(v[i]);
    for(int i : ord){
        for(int j : g[i]){
            if(j != par[i]){
                sum[i] += sum[j];
            }
        }
    }
    int ret = 0;
    for(int i = 1; i <= n; i++) ret = max(ret, sum[i]);
    return ret;
}

bool st[500005];

void dfs3(int x, int p = 0){
    for(int i : g[x]){
        if(i == p) continue;
        dfs3(i, x);
        st[x] |= st[i];
    }
}

const int BUFSIZE = 20 << 20;
char Buf[BUFSIZE + 1], *buf = Buf;

template<class T>
void scan(T &x){
    int neg = 1;
    for(x = 0; *buf < '0' || *buf > '9'; buf++) if(*buf == '-') neg = -1;
    while(*buf >= '0' && *buf <= '9') x = x*10 + (*buf - '0'), buf++;
    x *= neg;
}

void setIO(){
    fread(Buf, 1, BUFSIZE, stdin);
}

int main(){
    setIO();
    for(int i = 2; i <= 1000000; i++) lg[i] = lg[i/2] + 1;
    int t;
    scan(t);
    for(int tt = 1; tt <= t; tt++){
        int m;
        scan(n), scan(m);
        for(int i = 0; i < n - 1; i++){
            int a, b;
            scan(a), scan(b);
            g[a].pb(b);
            g[b].pb(a);
        }
        for(int i = 1; i <= n; i++) if(g[i].size() == 1) v.pb(i);
        build(1);
        for(int i = 0; i < m; i++){
            int a, b;
            scan(a), scan(b);
            if(a == b) continue;
            if(g[a].size() == 1) upd[a].pb(b);
            if(g[b].size() == 1) upd[b].pb(a);
        }
        ord.clear();
        dfs2(1);
        for(int i : v){
            upd[i].pb(i);
            sort(upd[i].begin(), upd[i].end(), comp);
            for(int j : upd[i]) precomp[i].pb({j, 1});
            int prv = upd[i].size();
            int cur = upd[i][0];
            for(int j = 1; j < prv; j++){
                cur = lca(cur, upd[i][j]);
                precomp[i].pb({lca(upd[i][j - 1], upd[i][j]), -1});
            }
            precomp[i].pb({par[cur], -1});
        }
        if(find(v.size()) == v.size()){
            cout << "YES" << "\n";
        } else {
            cout << "NO" << "\n";
            int l = 1, r = v.size();
            while(l < r){
                int mid = (l + r)/2;
                if(find(mid) == mid) l = mid + 1;
                else r = mid;
            }
            for(int i : upd[v[l - 1]]) st[i] = true;
            dfs3(v[l - 1]);
            int ans = -1;
            for(int i : v){
                bool found = false;
                for(int j : upd[i]){
                    if(st[j] || st[lca(j, i) ^ lca(v[l - 1], j) ^ lca(v[l - 1], i)]) found = true;
                }
                if(!found){
                    ans = i;
                    break;
                }
            }
            cout << v[l - 1] << " " << ans << "\n";
        }
        v.clear();
        for(int i = 1; i <= n; i++) g[i].clear(), upd[i].clear(), st[i] = false, precomp[i].clear();
    }
}
```