title: Sloth (Tutorial)
date: 10-25-2022
tag: cf, tree, dp, matrix, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/891/D)

## Solution

Lets try to solve this problem for all the edges going out of a single node first. Let \\(dp[i][0/1][0/1] = \\) the number of ways you can choose a node such that \\(i\\)'s subtree excluding \\(i\\) is perfectly matched, with the first \\(0/1\\) denoting if node \\(i\\) is matched or not and the second one denotes how many unmatched nodes there are in the subtree (excluding \\(i\\)). Transitions when adding \\(j\\)'s subtree to \\(i\\), are as follows: 

\\(dp[i][0][0] = dp[i][0][0] \\cdot dp[j][1][0]\\)

\\(dp[i][1][0] = dp[i][0][0] \\cdot dp[j][0][0] + dp[i][1][0] \\cdot dp[j][1][0]\\)

\\(dp[i][0][1] = dp[i][0][1] \\cdot dp[j][1][0] + dp[i][0][0] \\cdot (dp[j][0][0] + dp[j][1][1])\\)

\\(dp[i][1][1] = dp[i][0][0] \\cdot dp[j][0][1] + dp[i][0][1] \\cdot dp[j][0][0] + dp[i][1][0] \\cdot (dp[j][1][1] + dp[j][0][0]) + dp[i][1][1] \\cdot dp[j][1][0]\\)

Now we can compute \\(dp[i][0/1][0/1]\\), but in order to solve the problem we must be able to somehow reroot the dp. Lets call adding \\(i\\) to \\(j\\) as \\(i \\oplus j\\). In order to remove the contribution of a child node we want to somehow maintain a prefix and suffix of these values. In other words, we want to be able to turn \\((((i \\oplus j_1) \\oplus j_2) \\dots ) \\oplus j_n\\) into \\(((i \\oplus j_1) \\oplus j_2) \\oplus ((j_3 \\oplus j_4) \\dots  \\oplus j_n)\\). Unfortunately, our current operation is not associative, so lets see if theres a way to transform it to be associative. Actually, our current operation ressembles a convolution,  so lets see if we can transform \\(dp[j]\\) into a form such that adding \\(j\\) to \\(i\\) will be a convolution combining \\(dp[i]\\) and a transformed \\(dp[j]\\). In fact, this transform does exist:

\\(dp'[j][0][0] = dp[j][1][0]\\)

\\(dp'[j][1][0] = dp[j][0][0]\\)

\\(dp'[j][0][1] = dp[j][0][0] + dp[j][1][1]\\)

\\(dp'[j][1][1] = dp[j][0][1]\\)

Now our operation can be written as:

\\(dp[i][0][0] = dp[i][0][0] \\cdot dp'[j][0][0]\\);

\\(dp[i][1][0] = dp[i][0][0] \\cdot dp'[j][1][0] + dp[i][1][0] \\cdot dp'[j][0][0]\\)

\\(dp[i][0][1] = dp[i][0][0] \\cdot dp'[j][0][1] + dp[i][0][1] \\cdot dp'[j][0][0]\\)

\\(dp[i][1][1] = dp[i][0][0] \\cdot dp'[j][1][1] + dp[i][0][1] \\cdot dp'[j][1][0] + dp[i][1][0] \\cdot dp'[0][1] + dp[i][1][1] \\cdot dp'[j][0][0]\\)

So if we maintain a prefix and suffix sums of the convolution, we can successfully exclude a node and reroot the dp. We just have to run a dfs and check the combine the dp for adjacent nodes.

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

struct node {
    array<array<ll, 2>, 2> arr;

    node(){
        arr[0][0] = 1;
        arr[0][1] = arr[1][0] = arr[1][1] = 0;
    }

    node val(){
        node ret;
        ret[1][1] = arr[0][1];
        ret[0][1] = arr[0][0] + arr[1][1];
        ret[1][0] = arr[0][0];
        ret[0][0] = arr[1][0];
        return ret;
    }

    array<ll, 2> &operator[](int x){
        return arr[x];
    }

    const array<ll, 2> &operator[](int x) const {
        return arr[x];
    }
};

vector<int> g[500005];
node dp[500005];
int sz[500005], n;

node merge(node a, node b){
    node c;
    c[1][1] = a[0][0]*b[1][1] + a[1][0]*b[0][1] + a[0][1]*b[1][0] + a[1][1]*b[0][0];
    c[0][1] = a[0][0]*b[0][1] + a[0][1]*b[0][0];
    c[1][0] = a[0][0]*b[1][0] + a[1][0]*b[0][0];
    c[0][0] = a[0][0]*b[0][0];
    return c;
}

void dfs1(int x, int p = 0){
    if(p) g[x].erase(find(g[x].begin(), g[x].end(), p));
    sz[x] = 1;
    for(int i : g[x]){
        dfs1(i, x);
        sz[x] += sz[i];
        dp[x] = merge(dp[x], dp[i].val());
    }
}

ll ans = 0;

void dfs2(int x, node p = node()){
    if(!g[x].size()) return;
    vector<node> suf;
    suf.pb(dp[g[x].back()].val());
    for(int i = g[x].size() - 2; i >= 0; i--){
        suf.pb(merge(dp[g[x][i]].val(), suf.back()));
    }
    reverse(suf.begin(), suf.end());
    node cur;
    if(x != 1) cur = merge(cur, p.val());
    for(int i = 0; i < g[x].size(); i++){
        node tmp = cur;
        //for(int j = i + 1; j < g[x].size(); j++) tmp = merge(tmp, dp[g[x][j]].val());
        if(i + 1 < g[x].size()) tmp = merge(tmp, suf[i + 1]);
        if(tmp[1][0] == 1 && dp[g[x][i]][1][0] == 1) ans += (ll)sz[g[x][i]]*(n - sz[g[x][i]]);
        else ans += (tmp[0][0] + tmp[1][1])*(dp[g[x][i]][0][0] + dp[g[x][i]][1][1]);
        dfs2(g[x][i], tmp);
        cur = merge(cur, dp[g[x][i]].val());
    }
}

int main(){
    setIO();
    cin >> n;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs1(1);
    dfs2(1);
    cout << ans << endl;
}
```