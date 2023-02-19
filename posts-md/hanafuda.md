title: Hanafuda (Tutorial)
date: 2-4-2023
tag: xyd, flows, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/37/problem/177)

## Solution

Our problem is equivalent to playing a game on a graph, where players take turns moving a token to an adjacent node and are unable to move to the same position twice and whoever can't make a move loses. The edges are between cards that either share a color or a number. Since Grammy plays two cards initially, it is equivalent to her choosing a starting vertex and a first move, with the game proceeding as normal from there. Thus, solving for all initial cards is the same as solving for the winner of all initial nodes. It is hard to use any kind of dp to calculate the answer for all nodes simultaneously, since the states always depend on the path you have taken so far. Thus, lets try to find the win condition given a single node, which is actually a maximum matching problem. Consider the maximum matching of a graph. If the starting node is in every max matching of the graph, then it is easy to see that the first player can just always take the edge used in the max matching. The second player will also have no choice but to return the token to a used edge in the max matching, since if they didn't, then the initial node would not be in every maximum matching. We can also show that if the initial node is not in every matching, then the second person always wins, since every odd length path from the node will always have an extra edge from the max matching at the end, otherwise it would not be a max matching. Thus, we just have to check which nodes are contained on every bipartite matching. This is just when a node has no path remaining to it from the source, since this means we have taken it and cannot "undo" it anymore. Our final issue is that our graph is very dense, however, this can be fixed by adding dummy nodes for each color and number and connecting them to our graph nodes with a capacity of infinity.

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

int m, c;
int n1, n2;
pii arr1[40005], arr2[40005];
int depth[100005];
vector<pii> g[100005];
int flow[500005];
int edge[500005];
int st[100005];
int s, t, sz = 0;

void addedge(int a, int b, int v){
    g[a].pb({b, sz});
    g[b].pb({a, sz + 1});
    edge[sz] = v;
    sz += 2;
}

bool bfs(){
    for(int i = s; i <= t; i++) depth[i] = INF, st[i] = 0;
    depth[s] = 1;
    queue<int> q;
    q.push(s);
    while(!q.empty()){
        int x = q.front();
        q.pop();
        if(x == t) return true;
        for(pii i : g[x]){
            if(flow[i.ss] < edge[i.ss] && depth[i.ff] == INF){
                depth[i.ff] = depth[x] + 1;
                q.push(i.ff);
            }
        }
    }
    return false;
}

int dfs(int x = s, int sum = INF){
    if(x == t || sum == 0) return sum;
    int ret = 0;
    for(; st[x] < g[x].size(); st[x]++){
        pii i = g[x][st[x]];
        if(flow[i.ss] < edge[i.ss] && depth[x] + 1 == depth[i.ff]){
            int sub = dfs(i.ff, min(sum, edge[i.ss] - flow[i.ss]));
            if(sub == 0) continue;
            flow[i.ss] += sub;
            flow[i.ss ^ 1] -= sub;
            ret += sub;
            sum -= sub;
        }
        if(!sum) break;
    }
    if(!ret) depth[x] = INF;
    return ret;
}

int main(){
    setIO();
    cin >> m >> c;
    cin >> n1;
    for(int i = 1; i <= n1; i++) cin >> arr1[i].ff >> arr1[i].ss;
    cin >> n2;
    for(int i = 1; i <= n2; i++) cin >> arr2[i].ff >> arr2[i].ss;
    s = 0, t = n1 + n2 + m + c + 1;
    int in[n1 + 1];
    for(int i = 1; i <= n1; i++){
        in[i] = sz;
        addedge(s, i, 1);
        addedge(i, n1 + n2 + arr1[i].ff, INF);
        addedge(i, n1 + n2 + m + arr1[i].ss, INF);
    }
    for(int i = n1 + 1; i <= n1 + n2; i++){
        addedge(i, t, 1);
        addedge(n1 + n2 + arr2[i - n1].ff, i, INF);
        addedge(n1 + n2 + m + arr2[i - n1].ss, i, INF);
    }
    while(bfs()) while(dfs()) continue;
    bfs();
    for(int i = 1; i <= n1; i++) cout << (depth[i] == INF) << endl;
}
```