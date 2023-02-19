title: Name (Tutorial)
date: 0-00-0000
tag: tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=925)

## Solution

The problem is hard until you realize that you are given a forest of trees, not a general graph. Since all the trees are seperate, we only care about all pairs of paths between nodes. After calculating this, we are able to run a knapsack dp. For each state, we just need to store the number of paths and total sum of path lengths. This way, we are able to transition between states properly. Our initial state will have weight \\(X \\cdot K\\) to account for the \\(K\\) extra roads we are adding. Now, we know the number of combinations, but this isn't quite the answer. We still have to account for the \\(K!\\) permutations to choose the roads and \\(2^{K - 1}\\) ways to choose the endpoints of the roads. However, this now overcounts the \\(K\\) rotations for each permutation which are not distinct. Thus, we should just multiply our answer by \\(2^{K - 1} \\cdot K!\\). Also, we should treat all paths over length \\(Y\\) as the same length to bound the complexity. This results in a complexity of \\(O(K \\cdot Y^2)\\), which is still a bit too slow. To optimize, we know that we don't actually have to iterate over every transition for a farm, only the ones that exist. This somehow passes.

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

const int MX = 2500;

int comp[1505];
vector<pii> g[1505];
int cnt[1505][MX + 1];
int len[1505][MX + 1];
vector<int> vis[1505];

void dfs1(int x, int t, int p = 0){
	comp[x] = t;
	for(pii i : g[x]){
		if(i.ff == p) continue;
		dfs1(i.ff, t, x);
	}
}

void dfs2(int x, int p = 0, int d = 0){
	if(p){
		cnt[comp[x]][min(d, MX)]++;
		(len[comp[x]][min(d, MX)] += d) %= MOD;
	}
	for(pii i : g[x]){
		if(i.ff == p) continue;
		dfs2(i.ff, x, d + i.ss);
	}
}

pii comb(pii a, pii b){
	return {((ll)a.ss*b.ff%MOD + (ll)a.ff*b.ss%MOD)%MOD, (ll)a.ss*b.ss%MOD};
}

int main(){
	setIO();	
	//freopen("mooriokart.in", "r", stdin);
	//freopen("mooriokart.out", "w", stdout);
	int n, m, x, y;	
	cin >> n >>  m >> x >> y;
	for(int i = 0; i < m; i++){
		int a, b, c;
		cin >> a >> b >> c;
		g[a].pb({b, c});
		g[b].pb({a, c});
	}
	int sz = 1;
	for(int i = 1; i <= n; i++){
		if(!comp[i]){
			dfs1(i, sz++);
		}
	}
	for(int i = 1; i <= n; i++) dfs2(i);
	for(int i = 1; i < sz; i++){
		for(int j = 0; j <= MX; j++){
			if(cnt[i][j]){
				vis[i].pb(j);
			}
		}
	}
	int div2 = (MOD + 1)/2;
	pii dp[y + 1];
	for(int i = 0; i <= y; i++) dp[i] = {0, 0};
	dp[min(y, (sz - 1)*x)] = {(sz - 1)*x, 1};
	for(int i = 1; i < sz; i++){
		pii nw[y + 1];
		memset(nw, 0, sizeof(nw));
		for(int k = y; k >= 0; k--){
			for(int j : vis[i]){
				pii x = comb(dp[k], {(ll)len[i][j]*div2%MOD, (ll)cnt[i][j]*div2%MOD});
				nw[min(y, k + j)] = {(nw[min(y, k + j)].ff + x.ff)%MOD, (nw[min(y, k + j)].ss + x.ss)%MOD};
			}
		}
		for(int k = 0; k <= y; k++) dp[k] = nw[k];
	}
	for(int i = 1; i < sz - 1; i++) dp[y].ff = (ll)dp[y].ff*i%MOD;
	for(int i = 1; i < sz - 1; i++) dp[y].ff = (ll)dp[y].ff*2%MOD;
	cout << dp[y].ff << endl;
}
```