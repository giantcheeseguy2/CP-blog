title: Hanadan (Tutorial)
date: 2-5-2023
tag: xyd, segtree, dp, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/37/problem/175)

## Solution

Dynamic knapsack can easily be done using dynacon, however, in this problem our dynacon is forced online and the memory is tight. If the problem was not online, we can notice that for each node, we only have to maintain the set of dp tables directly to the root, giving us a total of \\(maxv \\cdot log(q)\\) memory. To make this online, we just have to note the path of our traversal of the dynacon segtree when we do it offline. In fact, there is no reason for dynacon to be offline, since we can just traverse the segtree in inorder traversal to process the operations, and each node is only visited twice. 

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

int n, m, t;

vector<int> dp[60005];
vector<pii> upd[60005];

void update(int l, int r, int v, int w, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r){
        upd[cur].pb({v, w});
        return;
    }
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, w, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, w, mid + 1, ur, cur*2 + 2);
}

vector<pii> path;

void build(int l = 1, int r = n, int cur = 0){
    if(l == r){
        path.pb({cur, l});
        path.pb({cur, -2});
        return;
    }
    path.pb({cur, 0});
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    path.pb({cur, -1});
    build(mid + 1, r, cur*2 + 2);
    path.pb({cur, -2});
}

void touch(int ind){
    for(pii j : upd[ind]){
        for(int k = m; k >= j.ff; k--){
            dp[ind][k] = max(dp[ind][k], dp[ind][k - j.ff] + j.ss);
        }
    }
}

int main(){
    setIO();
    cin >> n >> m >> t;
    int prv = 0;
    int ind = 0;
    build();
    for(int i = 1; i <= n; i++){
        int tt;
        cin >> tt;
        if(tt == 1){
            int v, w, e;
            cin >> v >> w >> e;
            v -= t*prv;
            w -= t*prv;
            e -= t*prv;
            update(i, e, v, w);
        } else {
            int v;
            cin >> v;
            v -= t*prv;
            if(ind == 0){
                dp[0].resize(m + 1, -INF);
                dp[0][0] = 0; 
                touch(0);
            }
            do {
                ind++;
                //cout << path[ind].ff << " " << path[ind].ss << endl;
                if(path[ind].ss == -2){
                    vector<int> tmp;
                    swap(dp[path[ind].ff], tmp);
                } else if(path[ind].ss != -1) {
                    dp[path[ind].ff] = dp[path[ind - 1].ff];
                    touch(path[ind].ff);
                }
            } while(path[ind].ss != i);
            if(dp[path[ind].ff][v] < 0) cout << 0 << " " << 0 << endl, prv = 0;
            else cout << 1 << " " << dp[path[ind].ff][v] << endl, prv = dp[path[ind].ff][v] ^ 1;
        }
    }
}
```