title: Chef And Pair Flips (Tutorial)
date: 11-18-2022
tag: codechef, greedy, graph, tutorial

---

## Problem Statement

[Problem Link](https://www.codechef.com/APRIL21B/problems/PAIRFLIP)

## Solution

The first step is to take the xor of the two matrices, where `?` stay as `?` after the operation. Now we just want to apply the operation to get rid of all the \\(1\\)s only. Intuitively, our optimal strategy involves two types of operations: use one move to flip two \\(1\\)s in the same row or column or use two moves to flip two \\(1\\)s that share a \\(0\\) in some intermediate cell. Note that if we have an odd number of \\(1\\)s, we will have to turn a `?` into \\(1\\) to make it an even amount, or if there are none, it is impossible. We should do as many operations of the first type as possible, and use operations of the second type to finish, but how can we do this optimally? As with many constructive problems, lets try to rephrase the operation using a graph. A \\(1\\) would either serve as a node or edge. It is hard to perform the operation when it is a node, but if we make a \\(1\\) at cell \\((i, j)\\) as an edge between nodes \\(i\\) and \\(n + j\\), the operation becomes as many paths of length \\(2\\) from each component as possible. The remaining edges can be solved using the second operation. Removing paths of length \\(2\\) on a graph can be solved with a greedy by creating a dfs tree and greedily matching the adjacent edges with the lowest depth. Now, we can see that an even component can be solved with the first operation only, and the odd components can be solved with even operations then one of the second operations. Thus, we should add our `?` to reduce the number of odd components if possible.
        
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

vector<pii> g[400005];
bool vis[400005];
int comp[400005], sz[400005];
vector<pii> ans;

void dfs1(int x, int t){
    vis[x] = true;
    comp[x] = t;
    for(pii i : g[x]){
        if(vis[i.ff]) continue;
        dfs1(i.ff, t);
    }
}

bool rem[400005];
int depth[400005];

void dfs2(int x, int p = -1){
    vis[x] = true;
    vector<int> v;
    for(pii i : g[x]){
        if(!vis[i.ff]){
            depth[i.ff] = depth[x] + 1;
            dfs2(i.ff, i.ss);
        }
        if(depth[i.ff] > depth[x] && !rem[i.ss]) v.pb(i.ss);
    }
    while(v.size() > 1){
        ans.pb({v[v.size() - 1], v[v.size() - 2]});
        rem[v[v.size() - 1]] = rem[v[v.size() - 2]] = true;
        v.pop_back(), v.pop_back();
    }
    if(v.size() && p != -1){
        ans.pb({v[0], p});
        rem[p] = rem[v[0]] = true;
    }
}

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        int n, m, e;
        cin >> n >> m >> e;
        for(int i = 1; i <= n + m; i++) vis[i] = false, g[i].clear(), sz[i] = 0;
        int arr[n + 1][m + 1];
        for(int i = 1; i <= n; i++){
            for(int j = 1; j <= m; j++){
                char c;
                cin >> c;
                if(c == '?') arr[i][j] = 2;
                else arr[i][j] = c - '0';
            }
        }
        for(int i = 1; i <= n; i++){
            for(int j = 1; j <= m; j++){
                char c;
                cin >> c;
                if(c == '?') arr[i][j] = 2;
                else if(arr[i][j] != 2) arr[i][j] ^= c - '0';
            }
        }
        vector<pii> id;
        for(int i = 1; i <= n; i++){
            for(int j = 1; j <= m; j++){
                if(arr[i][j] == 1){
                    g[i].pb({n + j, id.size()});
                    g[n + j].pb({i, id.size()});
                    id.pb({i, j});
                }
            }
        }
        for(int i = 1; i <= n + m; i++) if(!vis[i]) dfs1(i, i);
        for(int i = 1; i <= n; i++){
            for(int j = 1; j <= m; j++){
                if(arr[i][j] == 1 && comp[i] == comp[n + j]){
                    sz[comp[i]]++;
                }
            }
        }
        if(id.size()%2 == 1){
            for(int i = 1; i <= n; i++){
                for(int j = 1; j <= m; j++){
                    if(arr[i][j] == 2){
                        if(sz[comp[i]]%2 == 1){
                            g[i].pb({n + j, id.size()});
                            g[n + j].pb({i, id.size()});
                            id.pb({i, j});
                            break;
                        }
                        if(sz[comp[n + j]]%2 == 1){
                            g[i].pb({n + j, id.size()});
                            g[n + j].pb({i, id.size()});
                            id.pb({i, j});
                            break;
                        }
                    }
                }
                if(id.size()%2 == 0) break;
            }
            if(id.size()%2 == 1){
                for(int i = 1; i <= n; i++){
                    for(int j = 1; j <= m; j++){
                        if(arr[i][j] == 2){
                            g[i].pb({n + j, id.size()});
                            g[n + j].pb({i, id.size()});
                            id.pb({i, j});
                            break;
                        }
                    }
                    if(id.size()%2 == 0) break;
                }
            }
        }
        if(id.size()%2 == 1){
            cout << -1 << endl;
            continue;
        }
        for(int i = 1; i <= n + m; i++) vis[i] = false, depth[i] = 0;
        ans.clear();
        for(int i = 0; i < id.size(); i++) rem[i] = false;
        for(int i = 1; i <= n + m; i++) if(!vis[i]) dfs2(i);
        vector<pii> v;
        for(int i = 0; i < id.size(); i++) if(!rem[i]) v.pb(id[i]);
        vector<pair<pair<char, int>, pii>> fin;
        for(int i = 1; i < v.size(); i += 2){
            fin.pb({{'R', v[i - 1].ff}, {v[i - 1].ss, v[i].ss}});
            fin.pb({{'C', v[i].ss}, {v[i - 1].ff, v[i].ff}});
        }
        for(pii i : ans){
            if(id[i.ff].ff == id[i.ss].ff){
                fin.pb({{'R', id[i.ff].ff}, {id[i.ff].ss, id[i.ss].ss}});
            } else {
                fin.pb({{'C', id[i.ff].ss}, {id[i.ff].ff, id[i.ss].ff}});
            }
        }
        for(auto i : fin){
            if(i.ff.ff == 'R'){
                if(arr[i.ff.ss][i.ss.ff] != 2) arr[i.ff.ss][i.ss.ff] ^= 1;
                if(arr[i.ff.ss][i.ss.ss] != 2) arr[i.ff.ss][i.ss.ss] ^= 1;
            } else {
                if(arr[i.ss.ff][i.ff.ss] != 2) arr[i.ss.ff][i.ff.ss] ^= 1;
                if(arr[i.ss.ss][i.ff.ss] != 2) arr[i.ss.ss][i.ff.ss] ^= 1;
            }
        }
        for(int i = 1; i <= n; i++) for(int j = 1; j <= m; j++) assert(arr[i][j] == 2 || arr[i][j] == 0);
        cout << fin.size() << endl;
        if(e){
            for(auto i : fin) cout << i.ff.ff << " " << i.ff.ss << " " << i.ss.ff << " " << i.ss.ss << endl;
        }
    }
}
```