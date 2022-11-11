title: The Beach (Tutorial)
date: 11-10-2022
tag: cf, dijikstra, graph, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1754/problem/F)

## Solution

Lets try to iterate over every possible place to put down a new sunbed. Notice that every existing sunbed will only be moved at most once to free up room. In all cases, moving a sunbed twice would require two adjacent open spaces, and thus it would not be optimal to move it. Let \\(dist[i][j] = \\) the minimum cost to free up the cell \\((i, j)\\) (\\(0\\) if it is already empty). We can see that \\(dist[i][j]\\) can transition to the \\(8\\) adjacent positions through the two possible operations, each having their own cost. We have to find the path with minimum cost to an empty cell for all positions simultaneously. This can be done with a multisource dijikstra. 

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
int n, m, p, q;
 
int enc(int x, int y){
    return m*x + y;
}
 
vector<pii> g[300005];
ll dist[300005];
int moves[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
 
bool val(int x, int y){
    return x < n && y < m && x >= 0 && y >= 0;
}
 
int main(){
    setIO();
    cin >> n >> m;
    cin >> p >> q;
    char arr[n][m];
    for(int i = 0; i <= enc(n - 1, m - 1); i++) dist[i] = LLINF;
    priority_queue<pll, vector<pll>, greater<pll>> que;
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            cin >> arr[i][j];
            if(arr[i][j] == '.') dist[enc(i, j)] = 0, que.push({0, enc(i, j)});
        }
    }
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            if(arr[i][j] == '.' || arr[i][j] == '#') continue;
            if(arr[i][j] == 'R'){
                for(int k = 0; k < 4; k++){
                    if(k == 2) continue;
                    int x = i + moves[k][0], y = j - 1 + moves[k][1];
                    if(val(x, y) && arr[x][y] != '#'){
                        g[enc(x, y)].pb({enc(i, j), p});
                    }
                }
                if(val(i, j - 2)) g[enc(i, j - 2)].pb({enc(i, j), q});
            }
            if(arr[i][j] == 'L'){
                for(int k = 0; k < 4; k++){
                    if(k == 0) continue;
                    int x = i + moves[k][0], y = j + 1 + moves[k][1];
                    if(val(x, y) && arr[x][y] != '#'){
                        g[enc(x, y)].pb({enc(i, j), p});
                    }
                }
                if(val(i, j + 2)) g[enc(i, j + 2)].pb({enc(i, j), q});
            }
            if(arr[i][j] == 'U'){
                for(int k = 0; k < 4; k++){
                    if(k == 1) continue;
                    int x = i + 1 + moves[k][0], y = j + moves[k][1];
                    if(val(x, y) && arr[x][y] != '#'){
                        g[enc(x, y)].pb({enc(i, j), p});
                    }
                }
                if(val(i + 2, j)) g[enc(i + 2, j)].pb({enc(i, j), q});
            }
            if(arr[i][j] == 'D'){
                for(int k = 0; k < 4; k++){
                    if(k == 3) continue;
                    int x = i - 1 + moves[k][0], y = j + moves[k][1];
                    if(val(x, y) && arr[x][y] != '#'){
                        g[enc(x, y)].pb({enc(i, j), p});
                    }
                }
                if(val(i - 2, j)) g[enc(i - 2, j)].pb({enc(i, j), q});
            }
        }
    }
    while(!que.empty()){
        pll x = que.top();
        que.pop();
        if(x.ff > dist[x.ss]) continue;
        for(pll i : g[x.ss]){
            if(dist[x.ss] + i.ss < dist[i.ff]){
                dist[i.ff] = dist[x.ss] + i.ss;
                que.push({dist[i.ff], i.ff});
            }
        }
    }
    ll ans = LLINF;
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            for(int k = 0; k < 4; k++){
                int x = i + moves[k][0], y = j + moves[k][1];
                if(val(x, y)){
                    ans = min(ans, dist[enc(i, j)] + dist[enc(x, y)]);
                }
            }
        }
    }
    cout << (ans == LLINF ? -1 : ans) << endl;
}
```