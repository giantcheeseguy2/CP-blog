title: Password (Tutorial)
date: 7-30-2022
tag: codeforces, bitmask, dp, bfs, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/fPOGh4kz36/contest/391763/problem/A)

## Solution

Lets represent the \\(1\\)s and \\(0\\)s as a difference array where a \\(1\\) represents flipping the bit. Now, flipping an interval \\([l, r]\\) can be represented as flipping the bit at \\(l\\) and \\(r + 1\\). If we add an edge between these two positions for every interval, we can also represent the minimum cost to flip an interval \\([l, r]\\) as the shortest path between \\(l\\) and \\(r + 1\\). The target array can also be represented as flipping some amount of intervals, so we just want to find a way to perfectly match all the positions such that the cost is minimum. This can be done using a bitmask dp. Final complexity is \\(O(K \\cdot N + 2^{2K}(2K)^2)\\).

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

int dist[20005];
int n, k, l;
vector<int> dict;

void bfs(int x){
    for(int i = 1; i <= n + 1; i++) dist[i] = INF;
    dist[x] = 0;
    queue<int> q;
    q.push(x);
    while(!q.empty()){
        int st = q.front();
        q.pop();
        for(int i : dict){
            if(st + i <= n + 1 && dist[st + i] == INF){
                dist[st + i] = dist[st] + 1;
                q.push(st + i);
            }
            if(st - i >= 1 && dist[st - i] == INF){
                dist[st - i] = dist[st] + 1;
                q.push(st - i);
            }
        }
    }
}

int val[50][50];

int main(){
    setIO();
    cin >> n >> k >> l;
    int arr[k];
    for(int i = 0; i < k; i++) cin >> arr[i];
    for(int i = 0; i < l; i++){
        int x;
        cin >> x;
        dict.pb(x);
    }
    sort(dict.begin(), dict.end());
    dict.resize(unique(dict.begin(), dict.end()) - dict.begin());
    sort(arr, arr + k);
    vector<int> v;
    for(int i = 0; i < k; i++){
        int j = i + 1;
        while(j < k && arr[j] == arr[j - 1] + 1) j++;
        v.pb(arr[i]);
        v.pb(arr[j - 1] + 1);
        i = j - 1;
    }
    k = v.size();
    for(int i = 0; i < k; i++){
        bfs(v[i]);
        for(int j = 0; j < k; j++){
            if(j == i) continue;
            val[i][j] = dist[v[j]];
        }
    }
    int dp[1 << k];
    for(int i = 0; i < (1 << k); i++) dp[i] = INF;
    dp[0] = 0;
    for(int i = 0; i < (1 << k); i++){
        if(dp[i] == INF) continue;
        vector<int> v;
        for(int j = 0; j < k; j++) if(!(i & (1 << j))) v.pb(j);
        for(int j : v) for(int k : v){
            if(j == k) continue;
            dp[i ^ (1 << j) ^ (1 << k)] = min(dp[i ^ (1 << j) ^ (1 << k)], dp[i] + val[j][k]);
        }
    }
    cout << (dp[(1 << k) - 1] == INF ? -1 : dp[(1 << k) - 1]) << endl;
}
```