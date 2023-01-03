title: Minimum Cost Paths (Tutorial)
date: 1-3-2023
tag: usaco, binary search, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1093)

## Solution

The large bound on \\(N\\) and small bound on \\(M\\) suggest that we should sweep on \\(M\\) and maintain the answer for all \\(N\\) somehow. If we wanted to compute the answer for all \\(N\\) in \\(O(N)\\) time, we could just also sweep on \\(N\\) and either take the previous element on the same layer and add \\(c_i\\) or take the same element on the previous layer and add \\(x^2\\). Since \\(x^2\\) is quadratic and \\(c_i\\) is linear, there will always exist a point where after that point we always want to take the previous element on the same layer. Everything before that point we will take the \\(x^2\\). Thus, we want to split a piecewise function at every layer. Since we always remove some suffix of the function after we find our point, we can binary search for the first point where \\(c_i\\) becomes more optimal than \\(x^2\\), and remove everything after that. This amortizes to \\(O(N log N)\\). Note that we must also store the layer that each piece of the function was added in, so we can know how many \\(x^2\\) to add. The value for each position at the layer it is added can be found by knowing its starting point and slope. \\(O(N log^2 N)\\) also passes.

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

//x index, value, y index
vector<pair<ll, pll>> v;
ll arr[200005];

ll query(ll x, ll y){
    int ind = upper_bound(v.begin(), v.end(), pair<ll, pll>{x, {LLINF, LLINF}}) - v.begin() - 1;
    return arr[v[ind].ss.ss]*(x - v[ind].ff) + v[ind].ss.ff + x*x*(y - v[ind].ss.ss);
}

int main(){
    setIO();
    ll n, m;
    cin >> n >> m;
    arr[0] = 0;
    for(int i = 1; i <= m; i++) cin >> arr[i];
    int q;
    cin >> q; 
    vector<pii> que[m + 1];
    for(int i = 0; i < q; i++){
        int a, b;
        cin >> a >> b;
        que[b].pb({a, i});
    }
    v.pb({1, {0, 1}});
    ll ans[q];
    for(pii j : que[1]) ans[j.ss] = query(j.ff, 1);
    for(int i = 2; i <= m; i++){
        int l = 2, r = n;
        while(l < r){
            int mid = (l + r)/2;
            ll a = query(mid, i), b = query(mid - 1, i) + arr[i];
            if(a > b) r = mid;
            else l = mid + 1;
        }
        ll a = query(l, i), b = query(l - 1, i) + arr[i];
        if(a > b){
            while(v.back().ff >= l) v.pop_back();
            v.pb({l, {b, i}});
        }
        for(pii j : que[i]) ans[j.ss] = query(j.ff, i);
    }
    for(int i = 0; i < q; i++) cout << ans[i] << endl;
}
```