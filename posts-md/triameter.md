title: Triameter (Tutorial)
date: 2-22-2023
tag: cf, tree, small to large, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1712/F)

## Solution

The new formula for distance on our tree is \\(d(a, b) = min(dist(a, b), f_a + f_b + x)\\), where \\(f_x\\) is the distance from \\(x\\) to the closest leaf. These two terms are not seperate because of the min, so we have to somehow calculate the reltions for all pairs of nodes. This problem is often done doing small to large. Notice that while \\(dist\\) must be merged through the lca, the \\(f_x\\) do not. So when we are merging two subtrees, we only have to consider the maximum depth for each \\(f_x\\), since we want to find the maximum anyways. So iterate over all pairs of values of \\(f\\) and update the answer accordingly. This is obviously too slow, so lets see how it can be optimized. We already know that if either of the terms is less than the current answer, there is no need to update it. Thus, we only have to consider values where \\(f_a + f_b + x > ans\\). So if we are fixing \\(f_a\\), then we know that \\(f_b > ans - f_a - x\\). Now that we have some bounds on \\(f\\), we have to find the maximum depth with \\(f\\) values \\(> f_a\\) and \\(> ans - f_a - x\\) in each respective subtree. This works in \\(O(N log N)\\), since our merged size is \\(max(a, b)\\) instead of \\(a + b\\), making the small to large part linear. The merging time is what gives the log. However, we can still do better. Looking at \\(f\\), we can see that it is monotonic, because for every node \\(x\\) there exists a \\(y\\) in \\(x\\)'s subtree such that \\(f_y < f_x\\) and \\(depth[y] > depth[x]\\). Thus, our maximum depth over \\(f\\) is decreasing as \\(f\\) increases. So that means, for a fixed \\(f_a\\), if our \\(f_{ans - f_a - x + 1}\\) doesnt work, then \\(f_a\\) will not work for any larger \\(ans\\). So for each \\(f_a\\), it will only be able to increase \\(ans\\) so many times. And \\(ans\\) will only be able to increased \\(N\\) times, since it is bounded by the diameter. Thus, if for each \\(f_a\\) we only go through \\(f_b\\) until it is invalid and increase \\(ans\\) as we update, then we will have a linear solution.

## Code

```c++
//https://codeforces.com/contest/1712/problem/F
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

vector<int> g[1000005];
int down[1000005], up[1000005];
int depth[1000005];

void dfs(int x, int p = 0, int mn = INF){
    if(x == 1 && g[x].size() == 1) mn = 0;
    up[x] = mn;
    if(!g[x].size()) return;
    int suf[g[x].size()];
    suf[g[x].size() - 1] = INF;
    for(int i = g[x].size() - 2; i >= 0; i--) suf[i] = min(suf[i + 1], down[g[x][i + 1]] + 1);
    int sum = INF;
    for(int i = 0; i < g[x].size(); i++){
        dfs(g[x][i], x, min(mn, min(sum, suf[i])) + 1);
        sum = min(sum, down[g[x][i]] + 1);
    }
}

int main(){
    setIO();
    int n;
    cin >> n; 
    for(int i = 2; i <= n; i++){
        int p;
        cin >> p;
        g[p].pb(i);
        depth[i] = depth[p] + 1;
    }
    for(int i = n; i >= 1; i--){
        if(!g[i].size()){
            down[i] = 0;
            continue;
        }
        down[i] = INF;
        for(int j : g[i]){
            down[i] = min(down[i], down[j] + 1);
        }
    }
    dfs(1);
    int q;
    cin >> q;
    for(int i = 0; i < q; i++){
        int x;
        cin >> x;
        vector<int> dp[n + 1];
        int ans = 0;
        for(int i = n; i >= 1; i--){
            if(!g[i].size()){
                dp[i].pb(depth[i]);
                continue;
            }
            int sub = min(up[i], down[i]);
            int tar = max(0, ans - sub - x + 1);
            while(tar < dp[g[i][0]].size() && dp[g[i][0]][tar] - depth[i] > ans){
                ans++;
                tar = max(0, ans - sub - x + 1);
            }
            swap(dp[i], dp[g[i][0]]); 
            for(int j = 1; j < g[i].size(); j++){
                int tar = max(0, ans - sub - x + 1);
                while(tar < dp[g[i][j]].size() && dp[g[i][j]][tar] - depth[i] > ans){
                    ans++;
                    tar = max(0, ans - sub - x + 1);
                }
                if(dp[i].size() > dp[g[i][j]].size()) swap(dp[i], dp[g[i][j]]);
                for(int k = 0; k < dp[i].size(); k++){
                    int tar = max(0, ans - k - x + 1);
                    while(tar < dp[g[i][j]].size() && dp[i][k] + dp[g[i][j]][tar] - 2*depth[i] > ans){
                        ans++;
                        tar = max(0, ans - k - x + 1);
                    }
                }
                swap(dp[i], dp[g[i][j]]);
                for(int k = 0; k < dp[g[i][j]].size(); k++){
                    dp[i][k] = max(dp[i][k], dp[g[i][j]][k]);
                }
            } 
            if(sub == dp[i].size()) dp[i].pb(depth[i]);
        }
        cout << ans << " ";
    }
    cout << endl;
}
```