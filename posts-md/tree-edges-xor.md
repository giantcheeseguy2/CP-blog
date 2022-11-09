title: Tree Edges XOR (Tutorial)
date: 11-8-2022
tag: atcoder, ad hoc, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/agc052/tasks/agc052_b)

## Solution

The given operation seems hard to work with, so lets try to reduce it. Lets assign each node \\(i\\) a value \\(v_i\\), such that for every edge between \\(i\\) and \\(j\\), \\(v_i \\oplus v_j\\) is equal to its weight. This is always possible and can be done with a dfs. It turns out that the operation then becomes swapping two nodes connected by an edge. But how can we know if the trees can be formed from each other? If all the \\(v_i\\) on a tree xor to a constant value such as \\(0\\), since \\(N\\) is odd, there is only one valid assignment. To prove this, we have the \\(N - 1\\) restrictions from the edges, and the extra \\(N\\)th restriction from their total xor. After substituting the equations we can get a unique value for a single \\(v_i\\), which results in a unique value for all of the the \\(v_i\\). Note that this does not work when \\(N\\) is even since we cannot solve for a single value in the \\(N\\)th restriction. Thus, after satisfying all of the restrictions, we just have to check if the node values of both the initial and final trees are permutations of each other.

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

vector<pii> g[100005][2];
vector<int> v[2];

void dfs(int x, int t, int cur = 0, int p = 0){
    v[t].pb(cur);
    for(pii i : g[x][t]){
        if(i.ff == p) continue;
        dfs(i.ff, t, cur ^ i.ss, x);
    }
}

int main(){
    setIO();
    int n;
    cin >> n;
    for(int i = 0; i < n - 1; i++){
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        g[a][0].pb({b, c});
        g[b][0].pb({a, c});
        g[a][1].pb({b, d});
        g[b][1].pb({a, d});
    }
    for(int i = 0; i < 2; i++){
        dfs(1, i);
        int tot = 0;
        for(int j : v[i]) tot ^= j;
        for(int &j : v[i]) j ^= tot;
        sort(v[i].begin(), v[i].end());
    }
    cout << (v[0] == v[1] ? "YES" : "NO") << endl;
}
```