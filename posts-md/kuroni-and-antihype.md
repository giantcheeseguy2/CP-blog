title: Kuroni And Antihype (Tutorial)
date: 4-22-2023
tag: cf, mst, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1305/G)

## Solution

There doesn't seem to be any obvious strategy for invitations, so instead, lets look at the structure of the problem. The invitations are equivalent to having a forest where \\(i\\) invites \\(j\\) if \\(i\\) is a parent of \\(j\\). Now, the cost of this forest will be the sum of \\((deg_i - 1) \\cdot a_i\\). Note that we should increase the degree of all the roots by \\(1\\), since they don't have any parents. This is actually equivalent to adding an extra element with value \\(0\\) into the array and setting it as the root, which also merges our forest into a tree. Now, the answer for a given tree is actually the sum of \\((deg_i - 1) \\cdot a_i\\). Note that this holds true for the root as well, since we are assuming that the root has value \\(0\\). So, we want to construct a tree such with edges between nodes that have a bitwise and of \\(0\\) and maximizes the sum of \\((deg_i - 1) \\cdot a_i\\). Having a sum based on degree is tricky to work with, and we can notice that it is equivalent to the sum of edges in the tree where an edge between \\(i\\) and \\(j\\) has weight \\(a_i + a_j\\). We just have to subtract sum of \\(a_i\\) from the answer later. Thus, our problem has been reduced to finding the maximum spanning tree in a dense graph. This can be solved using boruvka's algorithm, where in each step we will merge every unmerged component with another component that it has the largest edge weight to. It is easy to see that there will be at most \\(log N\\) steps, and we now just have to find for each value, the largest value such that their bitwise and is \\(0\\) and it is maximized as well as being in a different component. This can be done with a sum over subsets that stores the two distinct components with maximum value that is in a subset.

## Code

```c++
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse4,popcnt,abm,mmx,tune=native")
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

const int MX = 1 << 18;

int par[200005];
pair<pii, pii> dp[MX];

int find(int x){
    if(x == par[x]) return x;
    return par[x] = find(par[x]);
}

pair<pii, pii> merge(pair<pii, pii> a, pii b){
    if(b.ss == a.ff.ss){
        a.ff.ff = max(a.ff.ff, b.ff);
        return a;
    }
    if(b.ss == a.ss.ss){
        a.ss.ff = max(a.ss.ff, b.ff);
        if(a.ss.ff > a.ff.ff) swap(a.ff, a.ss);
        return a;
    }
    if(b.ff > a.ff.ff){
        a.ss = a.ff;
        a.ff = b;
    } else if(b.ff > a.ss.ff){
        a.ss = b;
    }
    return a;
}

int flip(int x){
    return x ^ (MX - 1);
}

pii nxt[200005];

int main(){
    setIO();
    int n;
    cin >> n;
    n++;
    int arr[n + 1];
    arr[n] = 0;
    for(int i = 1; i < n; i++) cin >> arr[i];
    for(int i = 1; i <= n; i++) par[i] = i;
    int sz = n;
    ll ans = 0;
    while(sz > 1){
        for(int i = 0; i < MX; i++) dp[i] = {{-INF, -INF}, {-INF, -INF}};
        for(int i = 1; i <= n; i++){
            dp[arr[i]] = merge(dp[arr[i]], {arr[i], find(i)});
            nxt[i] = {-INF, -INF};
        }
        for(int i = 0; i < 18; i++){
            for(int j = 0; j < MX; j++){
                if(j & (1 << i)){
                    dp[j] = merge(merge(dp[j], dp[j ^ (1 << i)].ff), dp[j ^ (1 << i)].ss);
                }
            }
        }
        for(int i = 1; i <= n; i++){
            pair<pii, pii> x = dp[flip(arr[i])];
            if(x.ff.ff != -INF && find(x.ff.ss) != find(i)){
                nxt[find(i)] = max(nxt[find(i)], {x.ff.ff + arr[i], find(x.ff.ss)});
            }
            if(x.ss.ff != -INF && find(x.ss.ss) != find(i)){
                nxt[find(i)] = max(nxt[find(i)], {x.ss.ff + arr[i], find(x.ss.ss)});
            }
        }
        for(int i = 1; i <= n; i++){
            if(i != find(i)) continue;
            if(find(i) == find(nxt[i].ss)) continue;
            ans += nxt[i].ff;
            par[find(i)] = find(nxt[i].ss);
            sz--;
        }
    }
    for(int i = 1; i <= n; i++) ans -= arr[i];
    cout << ans << endl;
}
```