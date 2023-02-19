title: Kakuro 1 (Tutorial)
date: 1-30-2023
tag: cf, flows, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/420481/problem/A)

## Solution

The small bounds and the structure of the problem makes it intuititive to consider a flows solution. We can construct a graph of rows and columns, with each white cell representing an edge from a row to a column with its cost. The only issue is that we have to somehow support sending both positive and negative flow with the mcmf. If we can get rid of the case of sending negative flow, then we will be able to apply mcmf. Thus, lets set everything to the base case initially (all white cells are \\(1\\) and all row and column requirements are their respective sum) and go from there. Now, we have some initial cost that we are trying to improve by either undoing our previous subtractions or doing an addition. Now that we are only performing additions and no matter what we change, it will always be a valid solution, we can run mcmf. To deal with edges that cannot change, we can just make those edge weights infinite, so if the mcmf can't find a way to undo the infinite weights then the answer will be infinity. To deal with the undoing and adding seperately, we can just make two edges instead of one for each white cell, one having negative weight and the other having positive weight. Note that mcmf will always find the best cost flows first, so we only have to run it until the cost becomes positive.

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

typedef __int128 ll;
typedef long double ld;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef pair<ld, ld> pld;

const ll INF = 1e15;
const ll LLINF = 1e18;
const int MOD = 1e9 + 7;

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;

inline ll ceil0(ll a, ll b) {
    return a / b + ((a ^ b) > 0 && a % b);
}

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

struct node {
    ll t, v, c, d, r, dc, rc;
};

int s, t;
int sz = 0;
vector<pii> g[10005];
pll edge[10005];
int flow[10005];

void addedge(int a, int b, ll v, ll c){
    g[a].pb({b, sz});
    g[b].pb({a, sz + 1});
    edge[sz] = {v, c};
    edge[sz + 1] = {0, -c};
    sz += 2;
}

bool in[10005];
ll dist[10005];
pii par[10005];
ll lim[10005];

int spfa(){
    for(int i = s; i <= t; i++) dist[i] = LLINF, in[i] = false, lim[i] = INF;
    queue<int> q;
    q.push(s);
    in[s] = true;
    dist[s] = 0;
    while(!q.empty()){
        int x = q.front();
        in[x] = false;
        q.pop();
        for(pii i : g[x]){
            if(dist[i.ff] > dist[x] + edge[i.ss].ss && flow[i.ss] < edge[i.ss].ff){
                dist[i.ff] = dist[x] + edge[i.ss].ss;
                par[i.ff] = {x, i.ss};
                lim[i.ff] = min((ll)lim[x], edge[i.ss].ff - flow[i.ss]);
                if(!in[i.ff]){
                    in[i.ff] = true;
                    q.push(i.ff);
                }
            }
        }
    }
    return lim[t];
}

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    node arr[n + 1][m + 1];
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= m; j++){
            int x;
            cin >> x;
            arr[i][j].t = x;
        }
    }
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= m; j++){
            if(arr[i][j].t == 0) continue;
            if(arr[i][j].t == 4){
                int x;
                cin >> x;
                arr[i][j].v = x;
            }
            if(arr[i][j].t & 1){
                int x;
                cin >> x;
                arr[i][j].d = x;
            }
            if(arr[i][j].t & 2){
                int x;
                cin >> x;
                arr[i][j].r = x;
            }
        }
    }
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= m; j++){
            if(arr[i][j].t == 0) continue;
            if(arr[i][j].t == 4){
                int x;
                cin >> x;
                arr[i][j].c = x;
                if(arr[i][j].c == -1) arr[i][j].c = INF;
            }
            if(arr[i][j].t & 1){
                int x;
                cin >> x;
                arr[i][j].dc = x;
                if(arr[i][j].dc == -1) arr[i][j].dc = INF;
            }
            if(arr[i][j].t & 2){
                int x;
                cin >> x;
                arr[i][j].rc = x;
                if(arr[i][j].rc == -1) arr[i][j].rc = INF;
            }
        }
    }
    pii id[n + 1][m + 1];
    for(int i = 1; i <= n; i++) for(int j = 1; j <= m; j++) id[i][j] = {-1, -1};
    vector<ll> val;
    vector<ll> cost;
    val.pb(0), cost.pb(0);
    ll ans = 0;
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= m; j++){
            if(arr[i][j].t & 1){
                int cur = i + 1;
                while(cur <= n && arr[cur][j].t == 4){
                    id[cur][j].ff = val.size();
                    cur++;
                }
                val.pb(max((ll)0, arr[i][j].d - (cur - i - 1)));
                cost.pb(arr[i][j].dc);
                ans += (ll)abs((int)arr[i][j].d - (cur - i - 1))*arr[i][j].dc;
            }
        }
    }
    int mid = val.size();
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= m; j++){
            if(arr[i][j].t & 2){
                int cur = j + 1;
                while(cur <= m && arr[i][cur].t == 4){
                    id[i][cur].ss = val.size();
                    cur++;
                }
                val.pb(max((ll)0, arr[i][j].r - (cur - j - 1)));
                cost.pb(arr[i][j].rc);
                ans += (ll)abs((int)arr[i][j].r - (cur - j - 1))*arr[i][j].rc;
            }
        }
    }
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= m; j++){
            if(arr[i][j].t == 4){
                ans += (ll)(arr[i][j].v - 1)*arr[i][j].c;
                addedge(id[i][j].ff, id[i][j].ss, arr[i][j].v - 1, -arr[i][j].c);
                addedge(id[i][j].ff, id[i][j].ss, INF, arr[i][j].c);
            }
        }
    }
    s = 0, t = val.size();
    for(int i = 1; i < mid; i++){
        addedge(s, i, val[i], -cost[i]);
        addedge(s, i, INF, cost[i]);
    }
    for(int i = mid; i < val.size(); i++){
        addedge(i, t, val[i], -cost[i]);
        addedge(i, t, INF, cost[i]);
    }
    while(ll sub = spfa()){
        if(dist[t] > 0) break;
        int x = t;
        while(x != s){
            flow[par[x].ss] += sub;
            flow[par[x].ss ^ 1] -= sub;
            x = par[x].ff;
        }
        ans += (ll)sub*dist[t];
    }
    if(ans >= INF) cout << -1 << endl;
    else cout << (long long)ans << endl;
}
```