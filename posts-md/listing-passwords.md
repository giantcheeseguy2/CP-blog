title: Listing Passwords (Tutorial)
date: 8-15-2022
tag: codeforces, binary lifting, dsu, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/103388/problem/L)

## Solution

First of all, for a \\(O(N \\cdot Q)\\) solution, we can use a dsu to merge indeces that are forced to be the same. The answer is then just \\(2^x\\) where \\(x\\) is the number of components with only `?`. To optimize this, lets append a reverse \\(s\\) to \\(s\\). The problem then becomes a range dsu where you merge \\(a\\) and \\(b\\), \\(a + 1\\) and \\(b + 1\\), and so on. This can be solved using some sort of binary lifting. Lets decompose our array into some layers, where the \\(i\\)th index in the \\(j\\)th layer represents the interval \\([i, i + 2^j - 1]\\). Adding an edge between \\((a, j)\\) and \\((b, j)\\) meaning that \\([a, a + 2^j - 1]\\) will be merged with \\([b, b + 2^j - 1]\\). Now requirements can be handled in \\(O(log N)\\). The only thing left now is to push down the requirements. Lets start at the highest layer and push it down to the next layer. However, every push down doubles the amount of edges. Notice that we only have to push down any spanning tree for any layer, meaning that the number of edges pushed down is always bounded by \\(N\\). Therefore, at most \\(O(N log N)\\) will ever be pushed down. After all the edges are obtained for the smallest layer, run a dsu to merge everything accordingly.

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

int par[600005];

int find(int x){
    if(x == par[x]) return x;
    return par[x] = find(par[x]);
}

vector<pii> edge[20];

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    int arr[2*n + 1];
    for(int i = 1; i <= n; i++) arr[i] = i;
    for(int i = 1; i <= n; i++) arr[n + i] = n - i + 1;
    int pos[n + 1];
    for(int i = n + 1; i <= 2*n; i++) pos[arr[i]] = i;
    string s;
    cin >> s;
    for(int i = 0; i < m; i++){
        int l, r;
        cin >> l >> r;
        int len = (r - l + 1);
        r = pos[r];
        for(int j = 19; j >= 0; j--){
            if(len & (1 << j)){
                edge[j].pb({l, r});
                l += (1 << j);
                r += (1 << j);
            }
        }
    }
    for(int i = 19; i >= 1; i--){
        for(int j = 1; j <= 2*n; j++) par[j] = j;
        vector<pii> nxt;
        for(pii j : edge[i]){
            if(find(j.ff) != find(j.ss)){
                nxt.pb(j);
                nxt.pb({j.ff + (1 << (i - 1)), j.ss + (1 << (i - 1))});
                par[find(j.ff)] = find(j.ss);
            }
        }
        for(pii j : nxt) edge[i - 1].pb(j);
    }
    for(int i = 1; i <= n; i++) par[i] = i;
    for(pii j : edge[0]){
        par[find(arr[j.ff])] = find(arr[j.ss]);
    }
    bool vis[n + 1];
    bool type[n + 1][2];
    memset(type, false, sizeof(type));
    memset(vis, false, sizeof(vis));
    for(int i = 1; i <= n; i++){
        if(s[i - 1] != '?'){
            if(type[find(i)][!(s[i - 1] - '0')]){
                cout << 0 << endl;
                return 0;
            }
            vis[find(i)] = true;
            type[find(i)][s[i - 1] - '0'] = true;
        }
    }
    int tot = 0;
    for(int i = 1; i <= n; i++) if(find(i) == i) tot += !vis[i];
    int ans = 1;
    for(int i = 0; i < tot; i++) ans = ans*2%MOD;
    cout << ans << endl;
}
```