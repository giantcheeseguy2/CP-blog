title: Favorite Game (Tutorial)
date: 11-20-2022
tag: cf, dp, bitmask, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1523/F)

## Solution

The small \\(N\\) immediately suggests a dp where we store some bitmask of the towers visited. Furthermore, our path will consit of potentially visiting some set of towers in between or before quests. Let \\(dp[i][j] = \\) the answer if we are currently on quest \\(i\\) with a mask of \\(j\\) visited towers. Transitioning between quests can be easily done in time by just checking all previous quests with the same bitmask. However, how can simulate visiting towers in between the quests? If we choose to activate some new towers in between quests, it is always optimal to end on the tower chain, and we don't actually care which tower or quest we were on previously. We can't store time as a state, so we should store the minimum time to reach a state. We can't store the maximum answer as well as the minimum time, so we can actually store the answer as a state since it is bounded by \\(M\\). This can be done with \\(dp1[i][j] = \\) the minimum time to be in the tower chain of mask \\(i\\) while having an answer of \\(j\\). We can solve update \\(dp1\\) in between the quests when we are computing \\(dp\\). Transitions can be done by precomputing the distance from every quest or tower to a mask of towers. 

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

int val(pii a, pii b){
    return abs(a.ff - b.ff) + abs(a.ss - b.ss);
}

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    pii arr[n];
    for(int i = 0; i < n; i++) cin >> arr[i].ff >> arr[i].ss;
    pair<int, pii> que[q];
    for(int i = 0; i < q; i++){
        cin >> que[i].ss.ff >> que[i].ss.ss >> que[i].ff;
    }
    sort(que, que + q); 
    int dist1[q][1 << n];
    for(int i = 0; i < q; i++){
        for(int j = 0; j < (1 << n); j++){
            dist1[i][j] = INF;
            for(int k = 0; k < n; k++) if(j & (1 << k)) dist1[i][j] = min(dist1[i][j], val(que[i].ss, arr[k]));
        }
    }
    int dist2[n][1 << n];
    for(int i = 0; i < n; i++){
        for(int j = 0; j < (1 << n); j++){
            dist2[i][j] = INF;
            for(int k = 0; k < n; k++) if(j & (1 << k)) dist2[i][j] = min(dist2[i][j], val(arr[i], arr[k]));
        }
    }
    int dp1[1 << n][q + 1], dp2[q][1 << n];
    for(int i = 0; i < (1 << n); i++){
        for(int j = 0; j <= q; j++){
            dp1[i][j] = INF;
            if(j < q) dp2[j][i] = -INF;
        }
    }
    for(int i = 0; i < n; i++) dp1[1 << i][0] = 0;
    for(int i = 0; i < (1 << n); i++){
        for(int j = 0; j < n; j++){
            if(!(i & (1 << j))) continue;
            dp1[i][0] = min(dp1[i][0], dp1[i ^ (1 << j)][0] + dist2[j][i ^ (1 << j)]);
        }
    }
    int ans = 0;
    for(int i = 0; i < q; i++){
        dp2[i][0] = 1;
        for(int j = 0; j < (1 << n); j++){
            for(int k = 0; k < i; k++){
                int x = que[i].ff - que[k].ff;
                if(dist1[k][j] + dist1[i][j] <= x || val(que[i].ss, que[k].ss) <= x){
                    dp2[i][j] = max(dp2[i][j], dp2[k][j] + 1);
                }
            }
            for(int k = 0; k <= q; k++){
                if(dp1[j][k] + dist1[i][j] <= que[i].ff){
                    dp2[i][j] = max(dp2[i][j], k + 1);
                }
            }
            ans = max(ans, dp2[i][j]);
            if(dp2[i][j] >= 0){
                dp1[j][dp2[i][j]] = min(dp1[j][dp2[i][j]], que[i].ff);
                for(int x = 0; x < n; x++){
                    if(!(j & (1 << x))) dp1[j ^ (1 << x)][dp2[i][j]] = min(dp1[j ^ (1 << x)][dp2[i][j]], que[i].ff + val(arr[x], que[i].ss));
                }
            }
        } 
        for(int j = 0; j < (1 << n); j++){
            for(int k = 0; k < n; k++){
                if(!(j & (1 << k))) continue;
                for(int x = 0; x <= q; x++){
                    dp1[j][x] = min(dp1[j][x], dp1[j ^ (1 << k)][x] + dist2[k][j ^ (1 << k)]);
                }
            }
        }
    }
    cout << ans << endl;
}
```