title: Bombs In The Capital (Tutorial)
date: 1-30-2023
tag: xyd, dp, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/34/problem/167)

## Solution

Notice the overly complicated transition basically forces you to directly transition between values. There is definitly no way to optimize it since it has a mod, product, and xor, so lets just try to brute force transitions and pray that the total amount of transitions is bounded. After doing this, we can see that it is in fact bounded since the code will pass.

## Code

I do some scuffed thing where I only store the 5 best values for each subtree and use segtree graph to accelerate transitions. It shouldn't work but it does.

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
const int MOD = 998244353;

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;

inline ll ceil0(ll a, ll b) {
    return a / b + ((a ^ b) > 0 && a % b);
}

ll pos[300005], rad[300005];
int val[300005];
vector<int> g[2000005];
int n;

int f(int x, int y){
    return ((x ^ y) + (ll)x*y%MOD)%MOD;
}

vector<pll> dict;
int id[2000005];
int sz;

int ind(ll x){
    return lower_bound(dict.begin(), dict.end(), pll{x, -1}) - dict.begin();
}

int build(int l = 0, int r = n - 1, int cur = 0){
    if(l == r) return id[cur] = l;
    int mid = (l + r)/2;
    int a = build(l, mid, cur*2 + 1), b = build(mid + 1, r, cur*2 + 2);
    id[cur] = sz++;
    g[id[cur]].pb(a), g[id[cur]].pb(b);
    return id[cur];
}

void add(int l, int r, int v, int ul = 0, int ur = n - 1, int cur = 0){
    if(l > r) return;
    if(l <= ul && ur <= r){
        g[v].pb(id[cur]);
        return;
    }
    int mid = (ul + ur)/2;
    if(l <= mid) add(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) add(l, r, v, mid + 1, ur, cur*2 + 2);
}

vector<pair<int, ll>> dp[2000005];
ll ans[300005];
bool vis[2000005];
const int MX = 5;
vector<int> order;
vector<int> disc;

void dfs(int x){
    vis[x] = true;
    for(int i : g[x]){
        if(!vis[i]) dfs(i);
    }
    order.pb(x);
}

int vind(int x){
    return lower_bound(disc.begin(), disc.end(), x) - disc.begin();
}

int mp[300005];
bool in[300005];

bool comp(pair<int, ll> a, pair<int, ll> b){
    return a.ss > b.ss;
}

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

int main(){
    setIO();
    cin >> n;
    for(int i = 1; i <= n; i++) cin >> pos[i];
    for(int i = 1; i <= n; i++) cin >> rad[i];
    for(int i = 1; i <= n; i++) cin >> val[i];
    sz = n;
    build(); 
    for(int i = 1; i <= n; i++) dict.pb({pos[i], i}), disc.pb(val[i]);
    sort(disc.begin(), disc.end());
    disc.resize(unique(disc.begin(), disc.end()) - disc.begin());
    sort(dict.begin(), dict.end());
    for(int i = 1; i <= n; i++) mp[i] = vind(val[i]);
    for(int i = 1; i <= n; i++){
        int cur = ind(pos[i]);
        add(ind(pos[i] - rad[i]), cur - 1, cur);
        add(cur + 1, ind(pos[i] + rad[i] + 1) - 1, cur);
    }
    for(int i = 0; i < n; i++){
        if(!vis[i]) dfs(i);
    }
    reverse(order.begin(), order.end());
    for(int x : order){
        int v = (x < n ? mp[dict[x].ss] : -1);
        if(v != -1){
            bool found = false;
            for(pair<int, ll> &i : dp[x]){
                if(i.ff == v){
                    i.ss = max(i.ss, ans[dict[x].ss]);
                    found = true;
                }
            }
            if(!found){
                dp[x].pb({v, ans[dict[x].ss]});
            }
            sort(dp[x].begin(), dp[x].end(), comp);
        }
        if(dp[x].size() == 0) continue;
        for(int i : g[x]){
            if(dp[i].size() == 0){
                dp[i] = dp[x];
            } else {
                vector<pair<int, ll>> nw;
                int a = 0, b = 0;
                while(nw.size() < MX && a < dp[x].size() && b < dp[i].size()){
                    if(in[dp[i][b].ff]){
                        b++;
                    } else if(in[dp[x][a].ff]){
                        a++;
                    } else if(dp[x][a].ss >= dp[i][b].ss){
                        in[dp[x][a].ff] = true;
                        nw.pb(dp[x][a]);
                        a++;
                    } else {
                        in[dp[i][b].ff] = true;
                        nw.pb(dp[i][b]);
                        b++;
                    }
                }
                while(nw.size() < MX && b < dp[i].size()){
                    nw.pb(dp[i][b]), b++;
                }
                while(nw.size() < MX && a < dp[x].size()){
                    nw.pb(dp[x][a]), a++;
                }
                for(pll j : nw) in[j.ff] = false;
                swap(dp[i], nw);
            }
            if(i < n){
                for(pll j : dp[x]){
                    ans[dict[i].ss] = max(ans[dict[i].ss], j.ss + f(disc[j.ff], val[dict[i].ss]));
                }
            }
        }
        dp[x].clear();
    }
    for(int i = 1; i <= n; i++) cout << ans[i] << "\n";
}
```