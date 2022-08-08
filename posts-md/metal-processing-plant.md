title: Metal Processing Plant (Tutorial)
date: 8-3-2022
tag: codeforces, mst, 2-sat, binary search, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/101221/attachments) (Problem G)

## Solution

Lets first try to fix an edge for the first group, then binary search on the smallest edge of the second group. Checking can be done using 2-sat. This yields us a \\(O(N^4 log N)\\) solution. Optimizing the 2-sat further is difficult, so lets try to reduce the number of edges we fix from \\(N^2\\) to \\(N\\). If adding an edge forms an even length cycle, it will be impossible to satisfy that condition, since after assigning the endpoints of the edge into the same group, it will become an odd cycle. Therefore, there is no need to consider it. If adding an edge forms an odd length cycle, it is possible to satisfy, however, that the endpoints of the edge must always belong to the same group, so it will be impossible to add any edges with a smaller weight. In other words, only consider the edges on the maximum spanning tree as well as the first edge that forms an odd cycle in the tree. 

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

stack<int> s;
int n;
bool vis[405];
int val[205][205];
int a, b;

void dfs1(int x){
    vis[x] = true;
    for(int i = 0; i < 2*n; i++){
        if(i/2 == x/2) continue;
        if(vis[i]) continue;
        if(x%2 == 0 && i%2 == 1 && val[x/2][i/2] > a) dfs1(i);
        if(x%2 == 1 && i%2 == 0 && val[x/2][i/2] > b) dfs1(i);
    }
    s.push(x);
}

vector<int> path;

void dfs2(int x){
    vis[x] = true;
    path.pb(x/2);
    for(int i = 0; i < 2*n; i++){
        if(i/2 == x/2) continue;
        if(vis[i]) continue;
        if(x%2 == 1 && i%2 == 0 && val[x/2][i/2] > a) dfs2(i);
        if(x%2 == 0 && i%2 == 1 && val[x/2][i/2] > b) dfs2(i);
    }
}

bool check(){
    for(int i = 0; i < 2*n; i++) vis[i] = false;
    while(!s.empty()) s.pop();
    for(int i = 0; i < 2*n; i++) if(!vis[i]) dfs1(i);
    for(int i = 0; i < 2*n; i++) vis[i] = false;
    while(!s.empty()){
        int x = s.top();
        s.pop();
        if(!vis[x]){
            path.clear();
            dfs2(x);
            sort(path.begin(), path.end());
            if(unique(path.begin(), path.end()) - path.begin() != path.size()) return false;
        }
    }
    return true;
}

int find(int x){
    int l = 0, r = INF;
    a = x;
    while(l < r){
        int mid = (l + r)/2;
        b = mid;
        if(check()) r = mid;
        else l = mid + 1;
    }
    b = l;
    if(!check()) return 2*INF;
    return x + l;
}

int par[205];

int dsu(int x){
    if(par[x] == x) return x;
    return par[x] = dsu(par[x]);
}

int col[205];
vector<int> g[205];

void dfs(int x, int p = 0){
    for(int i : g[x]){
        if(i == p) continue;
        col[i] = !col[x];
        dfs(i, x);
    }
}

int main(){
    setIO();
    cin >> n;
    if(n <= 2){
        cout << 0 << endl;
        return 0;
    }
    vector<pair<int, pii>> v;
    for(int i = 0; i < n; i++){
        for(int j = i + 1; j < n; j++){
            int x;
            cin >> x;
            val[i][j] = val[j][i] = x;
            v.pb({x, {i, j}});
        }
    }
    for(int i = 0; i < n; i++) par[i] = i;
    sort(v.rbegin(), v.rend());
    int ans = 2*INF;
    for(auto i : v){
        if(dsu(i.ss.ff) != dsu(i.ss.ss)){
            ans = min(ans, find(i.ff));
            par[dsu(i.ss.ff)] = dsu(i.ss.ss);
            g[i.ss.ff].pb(i.ss.ss);
            g[i.ss.ss].pb(i.ss.ff);
        }
    }
    dfs(0);
    for(auto i : v){
        if(col[i.ss.ff] == col[i.ss.ss]){
            ans = min(ans, find(i.ff));
            break;
        }
    }
    cout << ans << endl;
}
```