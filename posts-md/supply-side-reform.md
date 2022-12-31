title: Supply Side Reform (Tutorial)
date: 12-31-2022
tag: cf, trie, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/401418/problem/B)

## Solution

Seeing that we are doing pattern matching in a randomly generated binary string, immediately suggests that our pattern will have an expected length of at most some small constant. Lets consider doing the problem offline and try to maintain \\(data(i, j)\\) for every \\(j\\). Now, whenever we add a new \\(j\\), we can check all the strings starting from \\(j\\) with length up to some constant \\(c\\) using a trie, and update the prefix accordingly. Naively updating is too slow, but notice that since \\(c\\) is small, and our prefix is always monotonic, we can either discretize the indeces or for each length, maintain the rightmost index that has a prefix of that length. We can pass the problem by setting \\(c = 40\\). 

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

const int MX = 40;

int leaf[3000005];
int nxt[3000005][2];
int sz = 1;

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    string s;
    cin >> s;
    vector<pii> que[n + 1];
    for(int i = 0; i < q; i++){
        int l, r;
        cin >> l >> r;
        que[r].pb({l, i});
    }
    ll ans[q + 1];
    int mx[MX + 1];
    memset(ans, 0, sizeof(ans));
    memset(mx, 0, sizeof(mx));
    for(int i = 1; i <= n; i++){
        int cur = 0;
        int len = 0;
        for(int j = i; j <= min(n, i + MX); j++){
            cur = (nxt[cur][s[j - 1] - '0'] ? nxt[cur][s[j - 1] - '0'] : nxt[cur][s[j - 1] - '0'] = sz++);
            len++;
            mx[len] = max(mx[len], leaf[cur]);
            leaf[cur] = i;
        }
        for(pii j : que[i]){
            int prv = j.ff - 1;
            for(int k = MX; k >= 1; k--){
                if(mx[k] > prv){
                    ans[j.ss] += (ll)k*(mx[k] - prv);
                    prv = mx[k];
                }
            }
        }
    }
    for(int i = 0; i < q; i++) cout << ans[i] << "\n";
}
```