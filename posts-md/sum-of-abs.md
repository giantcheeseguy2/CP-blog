title: Sum Of Abs (Tutorial)
date: 2-26-2023
tag: atcoder, flows, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/arc107/tasks/arc107_f)

## Solution

The absolute value makes this problem seem impossible to deal with. However, notice that \\(|x|\\) is equivalent to \\(max(-x, x)\\). So if we instead make this problem, assign each node either a \\(-1\\) or \\(1\\) coefficient, and find the max over all valid configurations. Actually, removing nodes can be said as adding a \\(0\\) coefficient. So now, we have the condition that we assign each node one of three coefficients, and we cannot have two adjacent nodes having the \\(-1\\) and \\(1\\) coefficients. This seems much more managable. The values of the coefficients don't actually matter, since for each node, you will be assigning it a value of \\(b_i\\), \\(-a_i\\), or \\(-b_i\\). Actually, we since we are trying to find the max over all ways to choose something with some conditions, this is a standard flows technique. Lets draw an edge from \\(s -> i\\), \\(i -> i + N\\), and \\(i + N -> t\\). We will let these edges contain the values for each coefficient in order of \\(-1\\), \\(0\\), and \\(1\\). Obviously, the min cut will always choose one of the three edges for each path from \\(s\\) to \\(t\\). We are trying to find the max cut, not min cut, so lets just negate every value. Also, flows doesn't support negative capacities, so we can just add some constant to each edge capacity. Since the cut will always consist of \\(N\\) edges, we can just add back in the constant \\(N\\) times after we are done finding the flows. Now, we just have to impose our conditions, such that if there is an edge between \\(i\\) and \\(j\\), we will never take \\(s -> i\\) and \\(j + n -> t\\) or vice versa. If we look at the flow graph for ony two nodes, we can see that to impose this restriction by adding an edge from \\(j + n -> i\\) and \\(i + n -> j\\) with infinite capacity, since it will never be optimal to put thoes on the min cut. Thus, our problem is solved.

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

vector<pii> g[1000];
int depth[1000], st[1000];
int sz = 0, s, t;
pii flow[10000];

void addedge(int a, int b, int v){
	g[a].pb({b, sz});
	g[b].pb({a, sz + 1});
	flow[sz] = {0, v};
	flow[sz + 1] = {0, 0};
	sz += 2;
}

bool bfs(){
	for(int i = s; i <= t; i++) depth[i] = st[i] = 0;
	queue<int> q;
	q.push(s);
	depth[s] = 1;
	while(!q.empty()){
		int x = q.front();
		q.pop();
		if(x == t) return true;
		for(int j = 0; j < g[x].size(); j++){
			pii i = g[x][j];
			if(!depth[i.ff] && flow[i.ss].ff < flow[i.ss].ss){
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
		if(flow[i.ss].ff < flow[i.ss].ss && depth[x] + 1 == depth[i.ff]){
			int sub = dfs(i.ff, min(sum, flow[i.ss].ss - flow[i.ss].ff));
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

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    int a[n + 1], b[n + 1];
    ll sum = 0;
    for(int i = 1; i <= n; i++) cin >> a[i];
    for(int i = 1; i <= n; i++) cin >> b[i], sum -= b[i];
    s = 0, t = 2*n + 1;
    int add = 1e6;
    for(int i = 1; i <= n; i++){
        addedge(s, i, b[i] + add);
        addedge(i, i + n, a[i] + add);
        addedge(i + n, t, -b[i] + add);
    }
    for(int i = 0; i < m; i++){
        int a, b;
        cin >> a >> b;
        addedge(a + n, b, INF);
        addedge(b + n, a, INF);
    }
    int ans = 0;
    while(bfs()) while(int x = dfs()) ans += x;
    cout << n*add - ans << endl;
}
```