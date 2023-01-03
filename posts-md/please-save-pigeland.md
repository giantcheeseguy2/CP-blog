title: Please Save Pigeland (Tutorial)
date: 1-3-2023
tag: cf, math, tree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/104090/problem/M)

## Solution

It is easy to see that our step length should be the gcd of all the distances to all the infected cities. Thus, our answer for a node is \\(\\frac{sum}{gcd}\\) where \\(sum\\) is the sum of all distances to other infected cities and \\(gcd\\) is the gcd of all distances to infected cities. The sum can be computed easily. To reroot the gcd, we first have to figure out how to add to a set of numbers and retrieve the gcd. We can use the property of gcd such that \\(gcd(a, b) = gcd(a, b - a)\\) if \\(a \\le b\\). Extending this to multiple numbers, notice that we the total gcd is the gcd of the smallest value and the difference array. Since adding to a set of numbers doesn't change the difference array, we only have to increase the smallest value to retrieve the gcd after addition. However, this isn't enough to reroot the gcd. In order to exclude a subtree, we will have to be able to merge two sets of numbers as well. Lets say \\(a\\) is the minimum value and \\(b\\) is the gcd of the difference array. Merging two sets \\((a_0, b_0)\\) and \\((a_1, b_1)\\) becomes \\((min(a_0, a_1), gcd(b_0, b_1, |a_0 - a_1|))\\). Thus, we can exclude a subtree to simulate going rerooting down that subtree. Remember to pass the state of the parent as a parameter of the dfs.

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

vector<pii> g[500005];
pll sub[500005];
int cnt[500005];
bool vis[500005];
ll sum = 0, tot = 0;

pll add(pll x, ll v){
    if(x.ff == -1) return x;
    return {x.ff + v, x.ss};
}

pll merge(pll a, pll b){
    if(a.ff == -1) return b;
    if(b.ff == -1) return a;
    return {min(a.ff, b.ff), __gcd(a.ss, __gcd(b.ss, abs(a.ff - b.ff)))};
}

ll eval(pll x){
    if(x.ff == -1) return 0;
    return __gcd(x.ff, x.ss);
}

void dfs1(int x, int p = 0){
    sub[x] = {-1, -1};
    if(vis[x]){
        sub[x] = {0, 0};
        cnt[x] = 1;
    }
    for(int i = 0; i < g[x].size(); i++){
        if(g[x][i].ff == p){
            g[x].erase(g[x].begin() + i);
            break;
        }
    }
    for(pii i : g[x]){
        dfs1(i.ff, x);
        sub[x] = merge(sub[x], add(sub[i.ff], i.ss));
        cnt[x] += cnt[i.ff];
        sum += (ll)i.ss*cnt[i.ff];
    }
}

ll ans = LLINF;

//cnt, gcd
void dfs2(int x, int p = 0, pair<ll, pll> par = {0, {-1, -1}}){
    if(tot == 0){
        cout << 0 << endl;
        exit(0);
    }
    ans = min(ans, sum/tot);
    int n = g[x].size();
    vector<pair<ll, pll>> pre(n + 1), suf(n + 2);
    suf[n + 1] = pre[0] = {0, {-1, -1}};
    for(int i = 1; i <= n; i++){
        pre[i] = {pre[i - 1].ff + cnt[g[x][i - 1].ff], merge(pre[i - 1].ss, add(sub[g[x][i - 1].ff], g[x][i - 1].ss))};
    }
    for(int i = n; i >= 1; i--){
        suf[i] = {suf[i + 1].ff + cnt[g[x][i - 1].ff],  merge(suf[i + 1].ss, add(sub[g[x][i - 1].ff], g[x][i - 1].ss))};
    }
    for(int i = 1; i <= n; i++){
        pair<ll, pll> v = {suf[i + 1].ff + pre[i - 1].ff, merge(suf[i + 1].ss, pre[i - 1].ss)};
        v.ff += par.ff;
        v.ss = merge(v.ss, par.ss);
        if(vis[x]){
            v.ss = merge(v.ss, {0, 0});
            v.ff++;
        }
        sum += v.ff*g[x][i - 1].ss;
        sum -= (ll)cnt[g[x][i - 1].ff]*g[x][i - 1].ss;
        ll prv = tot;
        v.ss = add(v.ss, g[x][i - 1].ss);
        tot = __gcd(eval(v.ss), eval(sub[g[x][i - 1].ff]));
        dfs2(g[x][i - 1].ff, x, v);
        tot = prv;
        sum -= v.ff*g[x][i - 1].ss;
        sum += (ll)cnt[g[x][i - 1].ff]*g[x][i - 1].ss;
    }
}

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    for(int i = 0; i < m; i++){
        int x;
        cin >> x;
        vis[x] = true;
    }
    for(int i = 0; i < n - 1; i++){
        int a, b, c;
        cin >> a >> b >> c;
        g[a].pb({b, c});
        g[b].pb({a, c});
    }
    dfs1(1);
    tot = eval(sub[1]);
    dfs2(1);
    cout << 2*ans << endl;
}
```