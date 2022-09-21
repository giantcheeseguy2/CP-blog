title: Redistricting (Tutorial)
date: 9-19-2022
tag: usaco, segtree, dp, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=900)

## Solution

The \\(N^2\\) solution is trivial. \\(dp[i] = \\) answer at index \\(i\\). Let \\(pre[i]\\) be the number of `G` - the number of `H`. \\(dp[i]\\) can transition to \\(j\\), with a value that depends on \\(pre[i] - pre[j]\\). The transitions can be accelerated using a segtree to store \\(-pre[j]\\) and some casework.

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

vector<pii> dict;

int seg[2000000];
int n, k;

void update(int x, int v, int l = 0, int r = dict.size() - 1, int cur = 0){
    if(l == r){
        seg[cur] = v;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, v, l, mid, cur*2 + 1);
    else update(x, v, mid + 1, r, cur*2 + 2);
    seg[cur] = min(seg[cur*2 + 1], seg[cur*2 + 2]);
}

int query(int l, int r, int ul = 0, int ur = dict.size() - 1, int cur = 0){
    if(l > r) return INF;
    if(l <= ul && ur <= r) return seg[cur];
    int mid = (ul + ur)/2;
    if(r <= mid) return query(l, r, ul, mid, cur*2 + 1);
    if(l > mid) return query(l, r, mid + 1, ur, cur*2 + 2);
    return min(query(l, r, ul, mid, cur*2 + 1), query(l, r, mid + 1, ur, cur*2 + 2));
}

int ind(pii x){
    return lower_bound(dict.begin(), dict.end(), x) - dict.begin();
}

int main(){
    setIO();
    freopen("redistricting.in", "r", stdin);
    freopen("redistricting.out", "w", stdout);
    cin >> n >> k;
    int pre[n + 1];
    pre[0] = 0;
    for(int i = 1; i <= n; i++){
        char x;
        cin >> x;
        pre[i] = pre[i - 1] + (x == 'G' ? 1 : -1);
    }
    for(int i = 0; i <= n; i++) dict.pb({pre[i], i});
    sort(dict.begin(), dict.end());
    for(int i = 0; i < dict.size(); i++) update(i, INF);
    int dp[n + 1];
    dp[0] = 0;
    update(ind({0, 0}), 0);
    for(int i = 1; i <= n; i++){
        if(i - k - 1 >= 0) update(ind({pre[i - k - 1], i - k - 1}), INF);
        dp[i] = min(query(0, ind({pre[i], INF}) - 1) + 1, query(ind({pre[i], INF}), dict.size() - 1));
        update(ind({pre[i], i}), dp[i]);
    }
    cout << dp[n] << endl;
}
```