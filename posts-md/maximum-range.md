title: Maximum Range (Tutorial)
date: 11-29-2022
tag: cf, scc, graph, flows, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/412659/problem/B)

## Solution

Lets try to find the maximum difference between two edges first. Obviously, the cycle cannot go through a bridge, so lets consider each edge biconnected component (each node has at least two disjoint paths to every other node) seperately. These are just the components after removing all the bridges. It seems intuitive that for each component, the answer could always contain the maximum and minimum edges. If there exists two disjoint paths between all nodes, then if we create a dummy node for each of the two edges, and add extra edges to its endpoints, then there will be at least two edge disjoint paths between those two nodes, so it is always possible. Now, we just have to find these two disjoint paths. We want to find two edge disjoint paths between the two dummy nodes, which is exactly the problem that flows solves. Since the graph only has unit capacities, dinics will run in \\(O(min(M^{1/2},2n^{2/3}) \\cdot M)\\) time. Now we have a remaining graph that consists of two paths with unit capacity. A smart way to construct this is to find a euler circuit of the graph since each every node is guranteed to have an even degree.

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

set<pii> g1[100005];
int low[100005], dfn[100005], comp[100005], tim = 0;
int mx[100005], mn[100005];
vector<int> child[100005];
stack<int> st;

void dfs1(int x, int p = -1){
	dfn[x] = low[x] = ++tim;
	st.push(x);
	for(auto i : g1[x]){
		if(i.ss == p) continue;
		if(!dfn[i.ff]){
			dfs1(i.ff, i.ss);
			low[x] = min(low[x], low[i.ff]);
		} else low[x] = min(low[x], dfn[i.ff]);
	}
	if(low[x] == dfn[x]){
        mx[x] = -INF, mn[x] = INF;
		while(st.top() != x){
			comp[st.top()] = x;
			st.pop();
		}
        comp[x] = x;
		st.pop();
	}
}

vector<int> ans;
bool vis[100005];
 
void dfs2(int x, int st, int p = -1){
    ans.pb(x);
	vis[x] = true;
	for(pii i : g1[x]){
        if(i.ss == p) continue;
		if(i.ff == st){
			cout << ans.size() << endl;
			for(int j : ans) cout << j << " ";
			exit(0);
		}
		if(!vis[i.ff]) dfs2(i.ff, st, i.ss);
	}
	ans.pop_back();
}

vector<pii> g2[100005];
pii flow[200005];
int depth[100005], ind[100005], s, t, sz;

void addedge(int a, int b, int v, int v1 = 0){
    g2[a].pb({b, sz});
    g2[b].pb({a, sz + 1});
    flow[sz] = {0, v};
    flow[sz + 1] = {0, v1};
    sz += 2;
}

bool bfs(){
    for(int i = s; i <= t; i++) depth[i] = ind[i] = 0;
	queue<int> q;
	q.push(s);
    depth[s] = 1;
	while(!q.empty()){
		int x = q.front();
		q.pop();
		if(x == t) return true;
        for(int j = 0; j < g2[x].size(); j++){
            pii i = g2[x][j];
			if(!depth[i.ff] && flow[i.ss].ff < flow[i.ss].ss){
                depth[i.ff] = depth[x] + 1;
                q.push(i.ff);
            }
		}
	}
	return false;
}

int dfs3(int x = s, int sum = INF){
    if(x == t || sum == 0) return sum;
    int ret = 0;
    for(; ind[x] < g2[x].size(); ind[x]++){
        pii i = g2[x][ind[x]];
        if(flow[i.ss].ff < flow[i.ss].ss && depth[x] + 1 == depth[i.ff]){
            int sub = dfs3(i.ff, min(sum, flow[i.ss].ss - flow[i.ss].ff));
            if(sub == 0) continue;
            flow[i.ss].ff += sub;
            flow[i.ss ^ 1].ff -= sub;
            ret += sub;
            sum -= sub;
        }
        if(!sum) break;
    }
    if(!ret) depth[x] = INF;
    return ret;
}

vector<pii> g3[100005];
vector<int> path;

void dfs4(int x){
    while(g3[x].size()){
        pii i = g3[x].back();
        g3[x].pop_back();
		if(!vis[i.ss]){
			vis[i.ss] = true;
			dfs4(i.ff);
		}
	}
    path.pb(x);
}

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    pair<pii, int> e[m];
    for(int i = 0; i < m; i++){
        int a, b, c;
        cin >> a >> b >> c;
        e[i] = {{a, b}, c};
        g1[a].insert({b, i});
        g1[b].insert({a, i});
    }
    for(int i = 1; i <= n; i++) if(!dfn[i]) dfs1(i);
    for(int i = 0; i < m; i++){
        if(comp[e[i].ff.ff] == comp[e[i].ff.ss]){
            mx[comp[e[i].ff.ff]] = max(mx[comp[e[i].ff.ff]], e[i].ss);
            mn[comp[e[i].ff.ff]] = min(mn[comp[e[i].ff.ff]], e[i].ss);
        } else {
            g1[e[i].ff.ff].erase({e[i].ff.ss, i});
            g1[e[i].ff.ss].erase({e[i].ff.ff, i});
        }
    }
    int ans = 0;
    for(int i = 1; i <= n; i++) ans = max(ans, mx[i] - mn[i]), child[comp[i]].pb(i);
    cout << ans << endl;
    for(int i = 1; i <= n; i++){
        if(comp[i] == i && mx[i] - mn[i] == ans){
            if(mx[i] == mn[i]) dfs2(i, i);
            int a, b;
            for(int j : child[i]){
                for(pii k : g1[j]){
                    if(e[k.ss].ss == mx[i]) b = k.ss;
                    if(e[k.ss].ss == mn[i]) a = k.ss;
                }
            }
            s = 0, t = n + 1;
            sz = 0;
            addedge(s, e[a].ff.ff, 1);
            addedge(s, e[a].ff.ss, 1);
            addedge(e[b].ff.ff, t, 1);
            addedge(e[b].ff.ss, t, 1);
            vector<pii> v;
            for(int j : child[i]){
                for(pii k : g1[j]){
                    if(k.ss == a || k.ss == b) continue;
                    if(j > k.ff) continue;
                    v.pb({k.ss, sz});
                    v.pb({k.ss, sz + 1});
                    addedge(j, k.ff, 1, 1);
                }
            }
            int sum = 0;
            while(bfs()) while(int x = dfs3()) sum += x;
            assert(sum == 2);
            g3[e[a].ff.ff].pb({e[a].ff.ss, a});
            g3[e[a].ff.ss].pb({e[a].ff.ff, a});
            g3[e[b].ff.ff].pb({e[b].ff.ss, b});
            g3[e[b].ff.ss].pb({e[b].ff.ff, b});
            for(pii j : v){
                if(flow[j.ss].ff == flow[j.ss].ss){
                    g3[e[j.ff].ff.ff].pb({e[j.ff].ff.ss, j.ff});
                    g3[e[j.ff].ff.ss].pb({e[j.ff].ff.ff, j.ff});
                }
            } 
            dfs4(e[a].ff.ff);
            path.pop_back();
            cout << path.size() << endl;
            for(int i : path) cout << i << " ";
            cout << endl;
            return 0;
        }
    }
}
```