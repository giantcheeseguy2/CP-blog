title: Mana Collection (Tutorial)
date: 2-10-2023
tag: usaco, convex hull trick, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1285)

## Solution

Notice that instead of choosing a starting point, then finding some ending path, we can start from the ending point, since we always want to collect the last time we visit a node. This means that we have to find a path starting from the given node that maximizes \\(m_i \\cdot v_i\\) where \\(v_i\\) is the first time we visit a node. This can be done in \\(N!\\) time. However, in this solution, the first time we visit a node is dependent on the query time, which makes it hard to answer queries. Lets seperate this by making our answer \\(\\sum m_i \\cdot t - m_i \\cdot v_i\\). In this case, \\(v_i\\) is the time it takes to reach \\(i\\) from the root. Our answer is now of the form \\(m \\cdot t + b\\), which is linear. \\(b\\) and \\(m\\) are both dependent on the subset of the nodes chosen. \\(m\\) is just the sum of the subset, but we want to somehow be able to maximize \\(b\\) for a given subset. We can try using a bitmask dp, but the transitions depend on the remaining set of nodes not chosen for the subset. Thus, if we reverse it, by choosing our ending node first and going backwards, our transitions will only depend on the set of nodes we have already chosen, since it increases by the \\(sum \\cdot edge length\\) for each transition. \\(dp[i][j] = \\) the maximum \\(b\\) for a mask of \\(i\\) ending at node \\(j\\). This also conveniently lets us know the maximum \\(b\\) for the starting position of each path. For evaluating the maximum answer over all the linear functions of all subsets, we can just insert all of the linear functions into a line container for each starting node and query that line container.

## Code

```c++
#pragma GCC optimize("O3")
#pragma GCC optimization ("unroll-loops")
#pragma GCC target("sse,sse2,sse3,ssse3,sse4,popcnt,abm,mmx,tune=native")
#include <bits/stdc++.h>
using namespace std;

#define pb push_back
#define ff first
#define ss second

typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;

const int INF = 1e9;
const ll LLINF = 1e18;

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

struct Line {
	mutable ll k, m, p;
	bool operator<(const Line& o) const { return k < o.k; }
	bool operator<(ll x) const { return p < x; }
};

struct LineContainer : multiset<Line, less<>> {
	// (for doubles, use inf = 1/.0, div(a,b) = a/b)
	static const ll inf = LLONG_MAX;
	ll div(ll a, ll b) { // floored division
		return a / b - ((a ^ b) < 0 && a % b); }
	bool isect(iterator x, iterator y) {
		if (y == end()) return x->p = inf, 0;
		if (x->k == y->k) x->p = x->m > y->m ? inf : -inf;
		else x->p = div(y->m - x->m, x->k - y->k);
		return x->p >= y->p;
	}
	void add(ll k, ll m) {
		auto z = insert({k, m, 0}), y = z++, x = y;
		while (isect(y, z)) z = erase(z);
		if (x != begin() && isect(--x, y)) isect(x, y = erase(y));
		while ((y = x) != begin() && (--x)->p >= y->p)
			isect(x, erase(y));
	}
	ll query(ll x) {
		assert(!empty());
		auto l = *lower_bound(x);
		return l.k * x + l.m;
	}
};

int n, m;

int main(){
    setIO();
    cin >> n >> m;
    ll dist[n][n];
    ll arr[n];
    for(int i = 0; i < n; i++) cin >> arr[i];
    for(int i = 0; i < n; i++){
        for(int j = 0; j < n; j++){
            dist[i][j] = LLINF;
        }
    }
    for(int i = 0; i < n; i++) dist[i][i] = 0;
    for(int i = 0; i < m; i++){
        int a, b, c;
        cin >> a >> b >> c;
        a--, b--;
        dist[b][a] = c;
    }
    for(int i = 0; i < n; i++){
        for(int j = 0; j < n; j++){
            for(int k = 0; k < n; k++){
                dist[j][k] = min(dist[j][k], dist[j][i] + dist[i][k]);
            }
        }
    }
    ll dp[1 << n][n];
    for(int i = 0; i < (1 << n); i++) for(int j = 0; j < n; j++) dp[i][j] = LLINF;
    for(int i = 0; i < n; i++) dp[1 << i][i] = 0;
    LineContainer que[n];
    for(int i = 0; i < (1 << n); i++){
        ll sum = 0;
        for(int j = 0; j < n; j++) if(i & (1 << j)) sum += arr[j];
        for(int j = 0; j < n; j++){
            if(!(i & (1 << j))) continue;
            if(dp[i][j] == LLINF) continue;
            que[j].add(sum, -dp[i][j]);
            for(int k = 0; k < n; k++){
                if(i & (1 << k)) continue;
                if(dist[k][j] == LLINF) continue;
                dp[i ^ (1 << k)][k] = min(dp[i ^ (1 << k)][k], dp[i][j] + sum*dist[k][j]);
            }
        }
    }
    int q;
    cin >> q;
    while(q--){
        int s, e;
        cin >> s >> e;
        e--;
        cout << que[e].query(s) << endl;
    }
}
```