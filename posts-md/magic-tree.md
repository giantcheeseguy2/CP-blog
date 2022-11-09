title: Magic Tree (Tutorial)
date: 11-9-2022
tag: ceoi, cf, small to large, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1193/problem/B)

## Solution

Lets first consider an \\(O(N \\cdot K)\\) solution. Let \\(dp[i][j] = \\) the maximum weight of fruit that can be harvested in \\(i\\)'s subtree if it is at time \\(j\\). We can maintain this in \\(O(N \\cdot K)\\) time if we use a prefix sum. However, we can make things simpler if we let \\(dp[i][j] = \\) the maximum fruit that can be harvested in \\(i\\)'s subtree if it is at time \\(j\\) or before, with no need to maintain a prefix sum. \\(dp[i][j] = max(dp[i][j - 1], val[i][j] + \\sum dp[k][j])\\), where \\(k\\) is a child of \\(i\\) and \\(val[i][j]\\) is the weight of the fruit at \\(i\\) that must be cut at time \\(j\\) (\\(0\\) if there is none). Notice that \\(dp[i][j]\\) is monotonically increasng with \\(j\\). Furthermore, the number of distinct values in \\(dp[i][j]\\) is bounded by the number of elements in \\(i\\)'s subtree. Thus, if we can somehow small to large the dp, then we will have a solution that runs in time. Lets maintain \\(dp[i][j]\\) as a difference array. If \\(val[i] = 0\\), then merging two subtrees would just be the combination of their difference arrays, since \\(dp[k][j] = \\) the sum of the difference array of \\(k\\) up until \\(j\\). Thus, \\(dp[i][j] = \\) sum of the sum of the combination of the difference arrays up until \\(j\\). Lets say \\(x\\) is the time that the fruit at \\(i\\) needs to be cut. Since there is only one \\(x\\), \\(dp[i][j] = \\sum dp[k][j]\\) up until \\(x\\). After that, \\(dp[i][j] = max(\\sum_{k} dp[k][j], dp[i][x] + val[i][x])\\). In other words, we want to update the continous range of differences after \\(x\\) such that \\(dp[i][x] + val[i][x] > \\sum dp[k][j]\\). This can be done by starting at position \\(x\\), then going through the difference array until the added sum is greater than \\(val[i][x]\\). This does not affect the complexity because every time we go through the difference array we can remove the element if it is smaller than \\(val[i][x]\\).

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

int n, m, lim;
vector<int> g[100005];
pii arr[100005];
map<int, ll> ma[100005];

void dfs(int x){
    for(int i : g[x]){
        dfs(i);
        if(ma[i].size() > ma[x].size()) swap(ma[i], ma[x]);
        ll sum = 0;
        ll cur = 0;
        for(auto j : ma[i]) ma[x][j.ff] += j.ss;
        ma[i].clear();
    }
    ma[x][arr[x].ff] += arr[x].ss;
    map<int, ll>::iterator it = ma[x].upper_bound(arr[x].ff);
    ll sum = 0;
    while(it != ma[x].end()){
        sum += (*it).ss;
        if(sum >= arr[x].ss){
            ma[x][(*it).ff] -= arr[x].ss - (sum - (*it).ss);
            break;
        }
        it = ma[x].erase(it);
    }
}

int main(){
    setIO();
    cin >> n >> m >> lim;
    for(int i = 2; i <= n; i++){
        int x;
        cin >> x;
        g[x].pb(i);
    }
    for(int i = 1; i <= n; i++) arr[i] = {0, 0};
    for(int i = 0; i < m; i++){
        int x, d, w;
        cin >> x >> d >> w;
        arr[x] = {d, w};
    }
    lim++;
    dfs(1);
    ll ans = 0;
    for(auto i : ma[1]) ans += i.ss;
    cout << ans << endl;
}
```