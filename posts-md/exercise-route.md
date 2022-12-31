title: Exercise Route (Tutorial)
date: 12-30-2022
tag: usaco, tree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=901)

## Solution

Counting the number of routes directly is hard. Instead, lets try to fix one of the extra edges that we take, and see how many ways there are to complete the route. Given two extra edges, it is intuitive that there is either zero or one ways to complete the route. Therefore, for each extra edge, we have to somehow count the number of other extra edges that can complete the route. Notice that this is only possible if the paths to the endpoints of the edges intersect with at least one edge. If they don't intersect, then any potential route between the two extra edges will always go over a node at least twice. It is easy to see that it is always possible to form a route if the paths do intersect. Now, we have changed the problem into: given some paths, count the number of pairs of paths that intersect each other. Lets look at the cases when two paths intersect. If the two paths share an lca, then either the left, right, or both edges going up to the lca must intersect. Otherwise, only either the left or right sides of a path will intersect. Thus, it suffices to break apart the path into the edges going up to the lca, and the edges going down from the lca, and subtract the case where both left and right sides at the lca intersect. Now, we are given some paths going straight down, and we want to count the number of intersections. The number of pairs of intersections of some line segments, is the number of segments that have a left endpoint inside another segment. However, if multiple line segments have the same left endpoint, there will be an overcount, where each pair of two different segments is counted twice instead of once. We can account for this seperately. Moving this algorithm on a tree is easy, we can just maintain the number of starting positions from a node to the root, then add and subtract it accordingly. 

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

vector<int> g[200005];
int par[200005][20];
int depth[200005];

void dfs1(int x, int p = 0){
    par[x][0] = p;
    depth[x] = depth[p] + 1;
    for(int i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
    }
}

int lca(int a, int b){
    if(depth[a] > depth[b]) swap(a, b);
    for(int i = 19; i >= 0; i--) if(depth[par[b][i]] >= depth[a]) b = par[b][i];
    if(a == b) return a;
    for(int i = 19; i >= 0; i--){
        if(par[b][i] != par[a][i]){
            b = par[b][i];
            a = par[a][i];
        }
    }
    return par[a][0];
}

pii path(int a, int b){
    int bb = b;
    for(int i = 19; i >= 0; i--) if(depth[par[b][i]] > depth[a]) b = par[b][i];
    return {b, bb};
}

ll ans = 0;

vector<int> in[400005], out[400005];
int cnt[400005];
int cnti = 0;

void dfs2(int x, int p = 0){
    for(int i : in[x]){
        ans -= cnti;
    } 
    for(int i : in[x]){
        cnti++;
    }  
    for(int i : out[x]){
        ans += cnti - 1;
    }
    for(int i : g[x]){
        if(i == p) continue;
        dfs2(i, x);
    } 
    for(int i : in[x]){
        cnti--;
    }
}

int main(){
    setIO();
    freopen("exercise.in", "r", stdin);
    freopen("exercise.out", "w", stdout);
    int n, m;
    cin >> n >> m;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs1(1, 1);
    for(int i = 1; i < 20; i++){
        for(int j = 1; j <= n; j++){
            par[j][i] = par[par[j][i - 1]][i - 1];
        }
    }
    map<pii, int> ma;
    for(int i = n - 1; i < m; i++){
        int a, b;
        cin >> a >> b;
        int c = lca(a, b);
        int aa = -1, bb = -1;
        if(a != c){
            pii x = path(c, a);
            aa = x.ff;
            in[x.ff].pb(i);
            out[x.ss].pb(i);
        }
        if(b != c){
            pii x = path(c, b);
            bb = x.ff;
            in[x.ff].pb(i);
            out[x.ss].pb(i);
        }
        if(aa != -1 && bb != -1){
            if(aa > bb) swap(aa, bb);
            ma[{aa, bb}]++;
        }
    }
    dfs2(1);
    for(auto i : ma) ans -= (ll)i.ss*(i.ss - 1)/2;
    for(int i = 1; i <= n; i++) ans -= (ll)in[i].size()*(in[i].size() - 1)/2;
    cout << ans << endl;
}
```