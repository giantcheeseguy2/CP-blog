title: Bear And Rectangle Strips (Tutorial)
date: 11-11-2022
tag: cf, greedy, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/771/E)

## Solution

We can start off with the trivial \\(O(N^2)\\) solution. Let \\(dp[i][j] = max({dp[i - 1][j], dp[i][j - 1], dp[a][a] + 1, dp[b][j] + 1, dp[i][c] + 1})\\), where \\(a\\) is the rightmost position where we can put down a height \\(2\\) rectangle, \\(b\\) is the rightmost position where we can put down a rectangle in the top row, and \\(c\\) is the rightmost position such that we can put down a rectangle in the bottom row. These three values can be maintained using a prefix sum and map. We can actually remove the two transitions to \\((i - 1, j)\\) and \\((i, j - 1)\\), if we let \\(a\\) equal the rightmost position such that we can put down a rectangle contained in the range \\([a, min(i, j)]\\). The same can be done for the other two, with \\(b\\) being the rightmost position such that we can put down a rectangle contained in the range \\([b, i]\\), and \\(c\\) being the rightmost position such that we can put down a rectangle contained in the range \\([c, j]\\). Notice that we actually only have to transition to either \\(b\\) or \\(c\\), but never both, since it will be accounted for in future transitions. We actually only need a linear amount of states. Assuming that \\(i\\) and \\(j\\) represents left endpoints of rectangles in the top and bottom rows, \\((i, j)\\) only has one possible transition to another state where \\(i'\\) and \\(j'\\) are also leftpoints of rectangles in the top and bottom rows. Therefore, in the worst case, a chain of transitions will only have at most \\(2N\\) length. Note that for the \\(dp[a][a]\\) transition case, it doesn't necessarily have to be on the chain. However, from \\(dp[a][a]\\), we will return to the chain in at most \\(2\\) moves, so we can ignore that case. We can maintain this sparse dp by doing a top down dfs with a map.

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

map<pii, int> dp;
int prv[300005][3];
ll pre[300005][3];

int dfs(int x, int y){
    if(x == 0 && y == 0) return 0;
    if(dp.find({x, y}) != dp.end()) return dp[{x, y}];
    int nxt = prv[min(x, y)][2];
    int ret = 0;
    if(nxt != -1) ret = max(ret, dfs(prv[min(x, y)][2], prv[min(x, y)][2]) + 1);
    if(prv[y][1] > prv[x][0]){
        if(prv[y][1] != -1) ret = max(ret, dfs(x, prv[y][1]) + 1);
    } else {
        if(prv[x][0] != -1) ret = max(ret, dfs(prv[x][0], y) + 1);
    }
    //cout << x << " " << y << " " << ret << endl;
    return dp[{x, y}] = ret;
}

int main(){
    setIO();
    int n;
    cin >> n;
    ll arr[n + 1][2];
    pre[0][0] = pre[0][1] = pre[0][2] = 0;
    for(int i = 1; i <= n; i++){
        cin >> arr[i][0];
        pre[i][0] = pre[i - 1][0] + arr[i][0];
    }
    for(int i = 1; i <= n; i++){
        cin >> arr[i][1];
        pre[i][1] = pre[i - 1][1] + arr[i][1];
    }
    for(int i = 1; i <= n; i++) pre[i][2] = pre[i - 1][2] + arr[i][0] + arr[i][1];
    map<ll, int> m[3];
    for(int i = 0; i < 3; i++){
        prv[0][i] = -1;
        m[i][0] = 0;
    }
    for(int i = 1; i <= n; i++){
        for(int j = 0; j < 3; j++){
            prv[i][j] = max(prv[i - 1][j], (m[j].find(pre[i][j]) == m[j].end() ? -1 : m[j][pre[i][j]]));
            m[j][pre[i][j]] = i;
        }
    }
    cout << dfs(n, n) << endl;
}
```