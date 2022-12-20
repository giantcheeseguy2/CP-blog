title: Sum Of Distances (Tutorial)
date: 12-13-2022
tag: usaco, dp, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1092)

## Solution

We want to be able to find the minimum distance to any one of the \\(N^K\\) nodes. If \\(x_i\\) is the \\(i\\)th node id in the \\(K\\)-tupe, then the distance should be the maximum of the minimum distances from \\(1\\) to \\(x_i\\) over all \\(i\\), since you can just oscillate the others back and forth until the time is right. However, this also means that all of the distances must have the same parity. Thus, lets store the shortest odd distance and even distance to every node for each of the \\(i\\) graphs. Now, we have three cases for a given tuple: There exists no common parity for all of them, the common parity is either even or odd, the common parity is both even and odd. For the first case, we can just ignore that tuple, since its not possible to reach it. For the second case, the distance is just the distance of the maximum of that common parity. For the third case, the distance is the minimum of the maximum of the parities. We can now use a dp to find the answer, where \\(dp[i][j][k][l] = \\) the number of paths using the first \\(i\\) graphs, where the maximum of the evens is \\(j\\), the maximum of the odds is \\(k\\), and \\(l\\) is our current state denoting which parities are shared. Storing the extra state seems meaningless, especially since it is only for the third case and we don't even use the larger one. Thus, we should try to remove it somehow. Without the third case, we could just count the amount for a distance using evens, and the amount for a distance using odds. However, to account for the third case, we can just subtract the amount that is overcounted, which is the amount for a distance using the maximum of odds and evens. This lets use remove our extra state. After writing out transitions, we can see that the case where the distance added is the new max is just a prefix sum, and the case where it is not can be processed lazily. This lets our transitions be in \\(O(1)\\) time. If we process the graphs in increasing order of size, then the final complexity is \\(O(\\sum N)\\).

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

int main(){
    setIO();
    int t;
    cin >> t;
    pair<int, vector<pii>> arr[t];
    for(int tt = 0; tt < t; tt++){
        int n, m;
        cin >> n >> m;
        vector<int> g[n + 1];
        for(int i = 0; i < m; i++){
            int a, b;
            cin >> a >> b;
            g[a].pb(b);
            g[b].pb(a);
        }
        int dist[n + 1][2];
        queue<pii> q;
        q.push({1, 0});
        for(int i = 1; i <= n; i++) dist[i][0] = dist[i][1] = -1;
        dist[1][0] = 0;
        while(!q.empty()){
            pii x = q.front();
            q.pop();
            for(int i : g[x.ff]){
                if(dist[i][!x.ss] == -1){
                    dist[i][!x.ss] = dist[x.ff][x.ss] + 1;
                    q.push({i, !x.ss});
                }
            }
        }
        arr[tt].ff = 0;
        for(int i = 1; i <= n; i++){
            arr[tt].ss.pb({dist[i][0], dist[i][1]});
            arr[tt].ff = max(arr[tt].ff, dist[i][0]);
            arr[tt].ff = max(arr[tt].ff, dist[i][1]);
        }
    }
    sort(arr, arr + t);
    vector<int> dp[t + 1][3];
    vector<int> pre[t + 1][3];
    dp[0][0].pb(1), dp[0][1].pb(1), dp[0][2].pb(1);
    pre[0][0].pb(1), pre[0][1].pb(1), pre[0][2].pb(1);
    for(int i = 1; i <= t; i++){
        dp[i][0].resize(arr[i - 1].ff + 1, 0);
        dp[i][1].resize(arr[i - 1].ff + 1, 0);
        dp[i][2].resize(arr[i - 1].ff + 1, 0);
        pre[i][0].resize(arr[i - 1].ff + 1, 0);
        pre[i][1].resize(arr[i - 1].ff + 1, 0);
        pre[i][2].resize(arr[i - 1].ff + 1, 0);
        vector<int> m1, m2, m3;
        m1.resize(arr[i - 1].ff + 1, 0);
        m2.resize(arr[i - 1].ff + 1, 0);
        m3.resize(arr[i - 1].ff + 1, 0);
        for(pii j : arr[i - 1].ss){
            if(j.ff != -1){
                m1[j.ff]++;
                if(min((int)pre[i - 1][0].size(), j.ff)) (dp[i][0][j.ff] += pre[i - 1][0][min((int)pre[i - 1][0].size(), j.ff) - 1]) %= MOD;
            }
            if(j.ss != -1){
                m2[j.ss]++;
                if(min((int)pre[i - 1][1].size(), j.ss)) (dp[i][1][j.ss] += pre[i - 1][1][min((int)pre[i - 1][1].size(), j.ss) - 1]) %= MOD;
            }
            if(j.ff != -1 && j.ss != -1){
                m3[max(j.ff, j.ss)]++;
                if(min((int)pre[i - 1][2].size(), max(j.ff, j.ss))) (dp[i][2][max(j.ff, j.ss)] += pre[i - 1][2][min((int)pre[i - 1][2].size(), max(j.ff, j.ss)) - 1]) %= MOD;
            }
        }
        int c1 = 0, c2 = 0, c3 = 0;
        for(int j = 0; j <= min((int)dp[i - 1][0].size() - 1, arr[i - 1].ff); j++){
            c1 += m1[j], c2 += m2[j], c3 += m3[j];
            (dp[i][0][j] += (ll)c1*dp[i - 1][0][j]%MOD) %= MOD;
            (dp[i][1][j] += (ll)c2*dp[i - 1][1][j]%MOD) %= MOD;
            (dp[i][2][j] += (ll)c3*dp[i - 1][2][j]%MOD) %= MOD;
        }
        pre[i][0][0] = dp[i][0][0];
        pre[i][1][0] = dp[i][1][0];
        pre[i][2][0] = dp[i][2][0];
        for(int j = 1; j <= arr[i - 1].ff; j++){
            pre[i][0][j] = (pre[i][0][j - 1] + dp[i][0][j])%MOD;
            pre[i][1][j] = (pre[i][1][j - 1] + dp[i][1][j])%MOD;
            pre[i][2][j] = (pre[i][2][j - 1] + dp[i][2][j])%MOD;
        }
    }
    int ans = 0;
    for(int i = 0; i <= arr[t - 1].ff; i++) ans = (ans + (ll)i*((dp[t][0][i] + dp[t][1][i])%MOD + MOD - dp[t][2][i])%MOD)%MOD;
    cout << ans << endl;
}
```