title: Routing (Tutorial)
date: 3-16-2023
tag: cf, bitmask, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1804/problem/E)

## Solution

Our problem is equivalent to finding a hamiltonian cycle such that every node is either on or adjacent to the cycle. We can check every bitmask to see if the second condition is satisfied pretty easily. Thus, we only have to check if a mask is a hamiltonian cycle in \\(O(2^N \\cdot N^2)\\). Obviously, we can fix every starting node and run hamiltonian cycle for a compleity of \\(O(2^N \\cdot N^3)\\). However, this is too slow. To optimize, we can see that it seems kind of pointless to rerun the hamiltonian cycle for every starting node. Instead, we can actually encode this into the dp state. Since it is a cycle, any node in the cycle can be the starting node, so lets just let the lowest set bit represent the starting node. Thus, every state will have exactly one starting node, and we won't let it transition to any other state with a different starting node.

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

vector<int> g[25];
bool vis[25];
int tag[25];

void dfs(int x){
    vis[x] = true;
    for(int i : g[x]){
        tag[i]++;
        if(!vis[i]){
            dfs(i);
        }
    }
}

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    for(int i = 1; i <= m; i++){
        int a, b;
        cin >> a >> b;
        a--, b--;
        g[a].pb(b);
        g[b].pb(a);
    }
    int cnt[1 << n];
    memset(cnt, 0, sizeof(cnt));
    for(int i = 0; i < (1 << n); i++){
        for(int j = 0; j < n; j++){
            if(!(i & (1 << j))) vis[j] = true;
            else vis[j] = false;
            tag[j] = 0;
        }
        for(int j = 0; j < n; j++){
            if(!vis[j]){
                dfs(j);
                break;
            }
        }
        bool all = true;
        for(int j = 0; j < n; j++){
            all &= vis[j];
            if(!(i & (1 << j))) all &= tag[j] > 0;
        }
        if(!all) continue;
        cnt[i]++;
    }
    pii dp[1 << n][n];
    for(int j = 0; j < (1 << n); j++) for(int k = 0; k < n; k++) dp[j][k] = {-1, -1};
    bool found = false;
    pii tar = {-1, -1};
    for(int i = 0; i < n; i++) dp[1 << i][i] = {-1, 0};
    for(int i = 1; i < (1 << n); i++){
        int t = -1;
        for(int j = 0; j < n; j++){
            if(i & (1 << j)){
                t = j;
                break;
            }
        }
        for(int j = 0; j < n; j++){
            if(dp[i][j].ff == -1 && dp[i][j].ss == -1) continue;
            for(int k : g[j]){
                if(cnt[i] && k == t){
                    found = true;
                    tar = {i, j};
                    break;
                }
                if(!(i & (1 << k)) && k > t){
                    dp[i ^ (1 << k)][k] = {i, j};
                }
            }
            if(found) break;
        }
        if(found) break;
    }
    if(!found){
        cout << "No" << endl;
        return 0;
    }
    int orig = tar.ff;
    vector<int> v;
    while(tar.ff != -1){
        v.pb(tar.ss);
        tar = dp[tar.ff][tar.ss];
    }
    int ans[n];
    for(int i = 0; i < v.size(); i++) ans[v[i]] = v[(i + 1)%v.size()];
    for(int j = 0; j < n; j++) if(!(orig & (1 << j))){
        for(int k : g[j]){
            if(orig & (1 << k)){
                ans[j] = k;
                break;
            }
        }
    }
    cout << "Yes" << endl;
    for(int i = 0; i < n; i++) cout << ans[i] + 1 << " ";
    cout << endl;
}
```