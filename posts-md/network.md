title: Network (Tutorial)
date: 11-4-2022
tag: cf, segtree, tree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/401418/problem/A)

## Solution

The first observation is that the added edge must lie on the diameter. IF the edge is not on the diameter, then the new answer is either still the diameter, or the distance of the endpoints of the diameter to the edge plus the weight of the new edge. For the second case, it would be at least as optimal to put the new edge on the diameter anyway, since it is shorter for the endpoints of the diameter, which are already the furthest possible from the edge. Now we only have to check a line instead of an entire tree. Lets say the tree is rooted at an endpoint of some diameter, the depth of node \\(i\\) is \\(d_i\\), and the longest path coming out of \\(i\\) that is not the diameter is \\(m_i\\). If \\(i\\) is an ancestor of \\(j\\), we want to minimize the maximum of \\(min(d_j - d_i + m_i + m_j, |d_j - d_a| + |d_i - d_b| + m_i + m_j + L)\\) if we add the edge from \\(a\\) to \\(b\\). Minimizing the maximum suggests a binary search solution. To do this, we just have to break the min function into two cases. \\(x\\) is a valid upper bound if \\(d_j - d_i + m_i + m_j \\le x\\) or \\(d_j - d_i + m_i + m_j > x\\) and \\(|d_j - d_a| + |d_i - d_b| + m_i + m_j + L \\le x\\). We can split the absolute value into 4 cases and solve for \\(d_a\\) and \\(d_b\\):

\\(d_a + d_b \\le x + d_j + d_i - m_i - m_j - L\\)

\\(d_a - d_b \\le x + d_j - d_i - m_i - m_j - L\\)

\\(-d_a + d_b \\le x - d_j + d_i - m_i - m_j - L\\)

\\(-d_a - d_b \\le x - d_j + d_i - m_i - m_j - L\\)

So we only need to find the min of \\(x \\pm d_j \\pm d_i - m_i - m_j - L\\) that satisfies \\(d_j - d_i + m_i + m_j > x\\). This can be maintained by a segtree. After solving, we can iterate over \\(b\\) and check if there exists a \\(d_a\\) that exists in the interval we are given after solving for \\(d_a\\).

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

vector<pii> g[100005];
pll chain[100005], dp[100005];
int par[100005];
 
void dfs(int x, int p = 0){
    vector<pll> v(2, {0, x});
    for(pii i : g[x]){
        if(i.ff == p) continue;
        dfs(i.ff, x);
        v.pb({chain[i.ff].ff + i.ss, chain[i.ff].ss});
    }
    sort(v.rbegin(), v.rend());
    dp[x].ff = v[0].ff + v[1].ff;
    dp[x].ss = v[0].ss;
    chain[x] = v[0];
}

vector<int> v;
ll depth[100005], sub[100005];
ll mx[100005];

void dfs2(int x, int p = 0){
    sub[x] = 0;
    for(pii i : g[x]){
        if(i.ff == p) continue;
        depth[i.ff] = depth[x] + i.ss;
        dfs2(i.ff, x);
        sub[x] = max(sub[x], sub[i.ff] + i.ss);
    }
}

ll nxt[100005];

void dfs3(int x, int p = 0, ll cur = 0, int tar = -1){
    if(tar != -1){
        mx[tar] = max(mx[tar], cur);
        vector<ll> v(2, 0);
        for(pii i : g[x]){
            if(i.ff == p) continue;
            dfs3(i.ff, x, cur + i.ss, tar);
        }
        return;
    }
    v.pb(x);
    bool found = false;
    for(pii i : g[x]){
        if(i.ff == p) continue;
        if(sub[x] == sub[i.ff] + i.ss && !found) dfs3(i.ff, x), found = true;
        else dfs3(i.ff, x, i.ss, x);
    }
}

vector<ll> dict;

int ind(ll x){
    return lower_bound(dict.begin(), dict.end(), x) - dict.begin();
}

ll bit0[100005], bit1[100005];

void upd(int x, ll v0, ll v1){
    for(; x <= dict.size(); x += x & (-x)){
        bit0[x] = min(bit0[x], v0);
        bit1[x] = min(bit1[x], v1);
    }
}

pll que(int x, pll ret = {LLINF, LLINF}){
    for(; x; x -= x & (-x)){
        ret.ff = min(ret.ff, bit0[x]);
        ret.ss = min(ret.ss, bit1[x]);
    }
    return ret;
}

int n, add;
vector<ll> s;

bool check(ll mid){
    ll mx00 = LLINF, mx01 = LLINF, mx10 = LLINF, mx11 = LLINF; 
    for(int i = 0; i <= dict.size(); i++) bit0[i] = bit1[i] = LLINF;
    for(int i : v){
        pll x = que(ind(depth[i] + mx[i] - mid));
        mx00 = min(mx00, mid + x.ss - mx[i] + depth[i] - add);
        mx01 = min(mx01, mid + x.ss - mx[i] - depth[i] - add);
        mx10 = min(mx10, mid + x.ff - mx[i] + depth[i] - add);
        mx11 = min(mx11, mid + x.ff - mx[i] - depth[i] - add);
        upd(ind(depth[i] - mx[i]) + 1, -mx[i] - depth[i], -mx[i] + depth[i]);
    }
    for(int i : v){
        ll r = min(mx00 - depth[i], mx01 + depth[i]);
        ll l = max(depth[i] - mx10, -mx11 - depth[i]);
        if(l > r) continue;
        if(lower_bound(s.begin(), s.end(), l) != upper_bound(s.begin(), s.end(), r)) return true;
    }
    return false;
}

int main(){
    setIO();
    while(cin >> n >> add){
        if(n == 0) break;
        v.clear();
        dict.clear();
        s.clear();
        for(int i = 1; i <= n; i++) g[i].clear(), depth[i] = mx[i] = m1[i] = m2[i] = 0;
        for(int i = 0; i < n - 1; i++){
            int a, b, c;
            cin >> a >> b >> c;
            g[a].pb({b, c});
            g[b].pb({a, c});
        }
        dfs(1);
        pll rt = {0, 0};
        for(int i = 1; i <= n; i++) rt = max(rt, dp[i]);
        dfs2(rt.ss);
        dfs3(rt.ss);
        for(int i : v) dict.pb(depth[i] - mx[i]), s.pb(depth[i]);
        sort(dict.begin(), dict.end());
        dict.resize(unique(dict.begin(), dict.end()) - dict.begin());
        sort(s.begin(), s.end());
        s.resize(unique(s.begin(), s.end()) - s.begin());
        ll l = 0, r = depth[v.back()];
        while(l < r){
            ll mid = (l + r)/2;
            if(check(mid)) r = mid;
            else l = mid + 1;
        }
        cout << l << endl;
    }
}
```