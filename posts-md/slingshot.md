title: Slingshot (Tutorial)
date: 9-16-2022
tag: usaco, segtree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=816)

## Solution

The hardest part of this problem is noticing that we can only use a slingshot once. We can then reduce the problem to either the walking distance to the slingshot and the slingshot cost or the direct walking distance. Lets say \\(s1\\) and \\(s2\\) are the start and end of the slingshot respectively, and \\(x1\\) and \\(x2\\) are the start and end positions. The distance from \\(x1\\) to \\(s1\\) is either \\(s1 - x1\\) or \\(x1 - s1\\) depending on which is greater. The same is true for \\(x1\\) and \\(s2\\). Now, we can break up the slingshots into \\(4\\) cases depending on those factors, and do a 2d range minimum query for each. This can be done offline using a segtree.

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

vector<ll> dict;

int ind(int x){
    return lower_bound(dict.begin(), dict.end(), x) - dict.begin();
}

ll bit[400005][2];

void update(int x, ll v, int t){
    for(x++; x <= dict.size(); x += x & (-x)) bit[x][t] = min(bit[x][t], v);
}

ll query(int x, int t){
    ll ret = LLINF;
    for(x++; x; x -= x & (-x)) ret = min(ret, bit[x][t]);
    return ret;
}

int main(){
    setIO();
    freopen("slingshot.in", "r", stdin);
    freopen("slingshot.out", "w", stdout);
    int n, q;
    cin >> n >> q;
    pair<pii, int> arr[n];
    for(int i = 0; i < n; i++){
        cin >> arr[i].ff.ff >> arr[i].ff.ss >> arr[i].ss;
        dict.pb(arr[i].ff.ff);
        dict.pb(arr[i].ff.ss);
    }
    pii que[q];
    for(int i = 0; i < q; i++){
        cin >> que[i].ff >> que[i].ss;
        dict.pb(que[i].ff);
        dict.pb(que[i].ss);
    }
    sort(dict.begin(), dict.end());
    dict.resize(unique(dict.begin(), dict.end()) - dict.begin());
    vector<pii> in[dict.size()];
    for(int i = 0; i < n; i++) arr[i].ff.ff = ind(arr[i].ff.ff), arr[i].ff.ss = ind(arr[i].ff.ss);
    for(int i = 0; i < q; i++) que[i].ff = ind(que[i].ff), que[i].ss = ind(que[i].ss);
    for(int i = 0; i < n; i++) in[arr[i].ff.ff].pb({i, -1});
    for(int i = 0; i < q; i++) in[que[i].ff].pb({que[i].ss, i});
    ll ans[q];
    for(int i = 0; i < q; i++) ans[i] = LLINF;
    for(int i = 1; i <= dict.size(); i++) bit[i][0] = bit[i][1] = LLINF;
    for(int i = 0; i < dict.size(); i++){
        for(pii j : in[i]){
            if(j.ss == -1){
                update(arr[j.ff].ff.ss, arr[j.ff].ss - dict[arr[j.ff].ff.ff] - dict[arr[j.ff].ff.ss], 0);
                update(dict.size() - 1 - arr[j.ff].ff.ss, arr[j.ff].ss - dict[arr[j.ff].ff.ff] + dict[arr[j.ff].ff.ss], 1);
            }
        }
        for(pii j : in[i]){
            if(j.ss != -1){
                ans[j.ss] = min(ans[j.ss], dict[i] + dict[j.ff] + query(j.ff, 0));
                ans[j.ss] = min(ans[j.ss], dict[i] - dict[j.ff] + query(dict.size() - 1 - j.ff, 1));
            }
        }
    }
    for(int i = 1; i <= dict.size(); i++) bit[i][0] = bit[i][1] = LLINF;
    for(int i = dict.size() - 1; i >= 0; i--){
        for(pii j : in[i]){
            if(j.ss == -1){
                update(arr[j.ff].ff.ss, arr[j.ff].ss + dict[arr[j.ff].ff.ff] - dict[arr[j.ff].ff.ss], 0);
                update(dict.size() - 1 - arr[j.ff].ff.ss, arr[j.ff].ss + dict[arr[j.ff].ff.ff] + dict[arr[j.ff].ff.ss], 1);
            }
        }
        for(pii j : in[i]){
            if(j.ss != -1){
                ans[j.ss] = min(ans[j.ss], -dict[i] + dict[j.ff] + query(j.ff, 0));
                ans[j.ss] = min(ans[j.ss], -dict[i] - dict[j.ff] + query(dict.size() - 1 - j.ff, 1));
            }
        }
    }
    for(int i = 0; i < q; i++){
        cout << min(ans[i], (ll)abs(dict[que[i].ff] - dict[que[i].ss])) << endl;
    }
}
```