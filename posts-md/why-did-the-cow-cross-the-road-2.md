title: Why Did The Cow Cross The Road 2 (Tutorial)
date: 9-19-2022
tag: usaco, segtree, dp, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=721)

## Solution

The \\(N^2\\) dp is trivial. \\(dp[i][j] = \\) the answer if you are currently at \\(i\\) and \\(j\\) on the two crosswalks. You can either skip one of them, or take the pair if \\(|i - j| \le 4\\). Notice that the number of transitions is actually bounded by \\(4 \cdot N\\), so there is no need to consider all \\(N^2\\) states. We can use a segtree to maintain this.

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

int bit[100005], n;

void update(int x, int v){
    for(; x <= n; x += x & (-x)) bit[x] = max(bit[x], v);
}

int query(int x, int ret = 0){
    for(; x; x -= x & (-x)) ret = max(ret, bit[x]);
    return ret;
}

int main(){
    setIO();
    freopen("nocross.in", "r", stdin);
    freopen("nocross.out", "w", stdout);
    cin >> n;
    int arr[n + 1][2];
    vector<pii> nxt[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i][0];
    int pos[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i][1], pos[arr[i][1]] = i;
    for(int i = 1; i <= n; i++){
        for(int j = max(1, arr[i][0] - 4); j <= min(n, arr[i][0] + 4); j++){
            nxt[i].pb({pos[j], 0});
        }
    }
    for(int i = 1; i <= n; i++){
        for(pii &j : nxt[i]) j.ss = query(j.ff - 1) + 1;
        for(pii j : nxt[i]) update(j.ff, j.ss);
    }
    cout << query(n) << endl;
}
```