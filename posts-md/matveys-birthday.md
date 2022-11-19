title: Matvey's Birthday (Tutorial)
date: 11-18-2022
tag: usaco, greedy, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/718/E)

## Solution

A path through the graph will only visit each character at most twice, so the maximum path length is going to be \\(15\\). In order to find the minimum distance between two indeces, we can either directly go between them or choose some intermediate character. So if \\(dist[i][j]\\) is the shortest distance from index \\(i\\) to character \\(j\\) (`a`-`h` will be mapped to \\(0\\)-\\(7\\)), then the distance between two indeces is \\(min(|i - j|, min(dist[i][c] + dist[j][c] + 1))\\) for any intermediate character \\(c\\). To compute \\(dist\\), we can create a dummy node for each character. Entering the dummy node will cost \\(1\\) weight, and leaving will cost \\(0\\) weight. A dummy node will be able to go to any index with the same character, and any index with the same character will be able to enter. We can use a multisource \\(0/1\\) bfs to solve it. Now, to check and count the diameter, we can break up the equation for minimum distance into two parts. We can brute force the part where \\(|i - j| \\le 15\\) with a cost of \\(8^2\\). Otherwise, we can just discard that part of the equation. So how can we count the maximum number distance and number of nodes for the largest \\(dist[i][c] + dist[j][c] + 1\\). We can't only account for a single character, since it would overcount, so we have to somehow encode the distance of an index to every other character simultaneously in an efficient manner. Lets say \\(dp[i][j]\\) is the minimum distance from any character \\(i\\) to any character \\(j\\). Obviously, \\(dp[s[i]][c] \\le dist[i][c] \\le dp[s[i]][c] + 1\\), since you can always go into the dummy node for \\(s[i]\\), so it is always at most \\(1\\) step worse. Now, we can maintain a bitmask at each index that denotes for every \\(c\\), whether \\(dist[i][c]\\) is either \\(1\\) or \\(0\\) greater than \\(dp[s[i]][c]\\). If we maintain a count, \\(cnt[i][j]\\), which will store the number of indeces that have a character \\(i\\), and a bitmask of \\(j\\), it is sufficient to compute the answer. The time complexity of this part is \\(O(N \\cdot 8^2 \\cdot 2^8)\\) which somehow passes.

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
    int n;
    cin >> n;
    string s;
    cin >> s;
    int arr[n];
    for(int i = 0; i < n; i++) arr[i] = s[i] - 'a';
    int mx = 15;
    vector<pii> g[n + 8];
    g[n + arr[0]].pb({0, 0}), g[0].pb({n + arr[0], 1});
    for(int i = 1; i < n; i++){
        g[i].pb({i - 1, 1});
        g[i - 1].pb({i, 1});
        g[n + arr[i]].pb({i, 0}); 
        g[i].pb({n + arr[i], 1});
    }
    int dist[n + 8][8];
    int dp[8][8];
    for(int i = 0; i < 8; i++){
        deque<int> q;
        for(int j = 0; j < n + 8; j++) dist[j][i] = INF;
        for(int j = 0; j < n; j++) if(arr[j] == i) q.pb(j), dist[j][i] = 0;
        while(!q.empty()){
            int x = q.front();
            q.pop_front();
            for(pii j : g[x]){
                if(j.ss && dist[j.ff][i] > dist[x][i] + 1) dist[j.ff][i] = dist[x][i] + 1, q.push_back(j.ff);
                if(!j.ss & dist[j.ff][i] > dist[x][i]) dist[j.ff][i] = dist[x][i], q.push_front(j.ff);
            }
        }
        for(int j = 0; j < 8; j++) dp[i][j] = INF;
        for(int j = 0; j < n; j++) dp[i][arr[j]] = min(dp[i][arr[j]], dist[j][i]);
    }
    int lim = 0;
    ll ans = 0;
    int cnt[8][1 << 8];
    memset(cnt, 0, sizeof(cnt));
    int val[n];
    for(int i = 0; i < n; i++){
        val[i] = 0;
        for(int j = 0; j < 8; j++){
            val[i] += (dist[i][j] - dp[arr[i]][j]) << j;
        }
    }
    for(int i = 0; i < n; i++){
        for(int j = max(0, i - mx + 1); j < i; j++){
            int mn = i - j;
            for(int k = 0; k < 8; k++) mn = min(mn, dist[j][k] + dist[i][k] + 1);
            if(mn > lim){
                lim = mn;
                ans = 0;
            }
            if(mn == lim) ans++;
        }
        if(i >= mx) cnt[arr[i - mx]][val[i - mx]]++;
        for(int k = 0; k < 8; k++){
            for(int j = 0; j < (1 << 8); j++){
                if(cnt[k][j]){
                    int mn = mx;
                    for(int x = 0; x < 8; x++) mn = min(mn, dp[k][x] + ((j >> x) & 1) + dist[i][x] + 1);
                    if(mn > lim){
                        lim = mn;
                        ans = 0;
                    }
                    if(mn == lim){
                        ans += cnt[k][j];
                    }
                }
            }
        } 
    }
    cout << lim << " " << ans << endl;
}
```