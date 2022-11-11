title: Sheikh (Tutorial)
date: 11-10-2022
tag: cf, brute force, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1732/C2)

## Solution

Notice that \\(f(l, r)\\) is monotonic, as in \\(f(l - 1, r) \\ge f(l, r)\\) and \\(f(l, r + 1) \\ge f(l, r)\\). This is because when adding a value \\(v\\), the difference in the xor must be at most \\(v\\), so taking an extra index will never have a negative cost. Thus, we can immediately know the maximum value of the interval, which is just the function of the entire interval. So we just want to find a smaller subarray \\([l, r]\\) so that \\(f(l, r)\\) is equal to the maximum value. To check if we can remove an index \\(a_i\\), we need to make sure the change in xor is equal to \\(a_i\\), since removing it must not change the answer. This can happen at most \\(31\\) times with a nonzero \\(a_i\\). So lets remove all the \\(0\\)s, and then brute force the at most \\(31^2\\) combinations of the endpoints. Everything can be maintained using a prefix sum.

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

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        int n, q;
        cin >> n >> q;
        vector<int> v;
        ll pre[n + 1][2];
        pre[0][0] = pre[0][1] = 0;
        for(int i = 1; i <= n; i++){
            int x;
            cin >> x;
            pre[i][0] = pre[i - 1][0] + x;
            pre[i][1] = pre[i - 1][1] ^ x;
            if(x) v.pb(i);
        }
        while(q--){
            int l, r;
            cin >> l >> r;
            int l1 = l, r1 = r;
            ll mx = pre[r][0] - pre[l - 1][0] - (pre[r][1] ^ pre[l - 1][1]);
            l = lower_bound(v.begin(), v.end(), l) - v.begin();
            r = upper_bound(v.begin(), v.end(), r) - v.begin() - 1;
            if(l > r) cout << l1 << " " << l1 << endl;
            else {
                pair<int, pii> ans = {r1 - l1 + 1, {l1, r1}};
                for(int i = l; i <= min(r, l + 31); i++){
                    for(int j = r; j >= max(i, r - 31); j--){
                        if(pre[v[j]][0] - pre[v[i] - 1][0] - (pre[v[j]][1] ^ pre[v[i] - 1][1]) == mx){
                            ans = min(ans, {v[j] - v[i] + 1, {v[i], v[j]}});
                        }
                    }
                }
                cout << ans.ss.ff << " " << ans.ss.ss << endl;
            }
        }
    }
}
```