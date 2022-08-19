title: Wiring Engineering (Tutorial)
date: 8-18-2022
tag: codeforces, dp, simulated dp, divide and conquer, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/103409/problem/L)

## Solution

There is a trivial \\(O(N^2)\\) dp to calculate the answer for one query. \\(dp[i][j][0/1][0/1]\\) to indicate the maximal value at the \\(i\\)th and \\(j\\)th positions, as well as if they are taken or not. As with most dp, we can represent this as a graph, where the edges represent transitions. The answer is just the maximal path from \\(dp[a][b][0][0]\\) to \\(dp[c][d][0/1][0/1]\\). Shortest path queries in a DAG isn't solvable, but one special property of this graph is that it is a grid. Now, the shortest path queries can be solved using a divide and conquer. Lets consider some rectangle. We always want to split it itno two parts down the longer side. Since the graph is a grid, if two nodes are on different sides of the split line, then their longest path must pass through some node on the split line. It suffices to run a dp from every point in the middle line. and then process each query accordingly. The complexity of this is \\(O(N)\\) because each query will only be processed accross some split line once, where the split line is at most \\(N\\) size. The complexity of the divide and conquer is \\(O(N^3 log N)\\) which passes thanks to the high time limit. The complexity can be shown because \\(F(N) = 2 \\cdot F(N/2) + N^3\\) which reduces to \\(N^3 log N\\) by the master theorem. In addition, fixing the state of the split line node is too slow, so only fix it to either \\(dp[x][y][0][1]\\) or \\(dp[x][y][1][0]\\) depending on the dimension of the split line. This works because it is always optimal to buy a building somewhere on the split line, so even if the max for a single node changes, the total answer never changes.

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

int n, q;

int enc(int a, int b, int c, int d){
    return a*(n + 1)*2*2 + b*2*2 + c*2 + d;
}

int dist[2000000][2];
int arr[505][2];
int val[505][505];
int ans[300005];

void dij(int x, int y, int x1, int y1, int x2, int y2, int aa, int bb){
    for(int i = x1; i <= x2; i++){
        for(int j = y1; j <= y2; j++){
            for(int a = 0; a < 2; a++){
                for(int b = 0; b < 2; b++){
                    dist[enc(i, j, a, b)][0] = dist[enc(i, j, a, b)][1] = -INF;
                }
            }
        }
    }
    dist[enc(x, y, aa, bb)][0] = 0;
    for(int i = x; i <= x2; i++){
        for(int j = y; j <= y2; j++){
            dist[enc(i, j, 1, 1)][0] = max(dist[enc(i, j, 1, 1)][0], dist[enc(i, j, 1, 0)][0] + val[i][j] - arr[j][1]);
            dist[enc(i, j, 1, 1)][0] = max(dist[enc(i, j, 1, 1)][0], dist[enc(i, j, 0, 1)][0] + val[i][j] - arr[i][0]);
            dist[enc(i, j, 1, 0)][0] = max(dist[enc(i, j, 1, 0)][0], dist[enc(i, j, 0, 0)][0] - arr[i][0]);
            dist[enc(i, j, 0, 1)][0] = max(dist[enc(i, j, 0, 1)][0], dist[enc(i, j, 0, 0)][0] - arr[j][1]);
            for(int a = 0; a < 2; a++){
                for(int b = 0; b < 2; b++){
                    dist[enc(i + 1, j, 0, b)][0] = max(dist[enc(i + 1, j, 0, b)][0], dist[enc(i, j, a, b)][0]);
                    dist[enc(i, j + 1, a, 0)][0] = max(dist[enc(i, j + 1, a, 0)][0], dist[enc(i, j, a, b)][0]);
                }
            }
        }
    }
    dist[enc(x, y, aa, bb)][1] = 0;
    for(int i = x; i >= x1; i--){
        for(int j = y; j >= y1; j--){
            dist[enc(i, j, 1, 0)][1] = max(dist[enc(i, j, 1, 0)][1], dist[enc(i, j, 1, 1)][1] + val[i][j] - arr[j][1]);
            dist[enc(i, j, 0, 1)][1] = max(dist[enc(i, j, 0, 1)][1], dist[enc(i, j, 1, 1)][1] + val[i][j] - arr[i][0]);
            dist[enc(i, j, 0, 0)][1] = max(dist[enc(i, j, 0, 0)][1], dist[enc(i, j, 1, 0)][1] - arr[i][0]);
            dist[enc(i, j, 0, 0)][1] = max(dist[enc(i, j, 0, 0)][1], dist[enc(i, j, 0, 1)][1] - arr[j][1]);
            for(int a = 0; a < 2; a++){
                for(int b = 0; b < 2; b++){
                    dist[enc(i - 1, j, a, b)][1] = max(dist[enc(i - 1, j, a, b)][1], dist[enc(i, j, 0, b)][1]);
                    dist[enc(i, j - 1, a, b)][1] = max(dist[enc(i, j - 1, a, b)][1], dist[enc(i, j, a, 0)][1]);
                }
            }
        }
    }
}

void dnq(int x1, int y1, int x2, int y2, vector<pair<pair<pii, pii>, int>> que){
    if(x2 < x1 || y2 < y1) return;
    if(x2 - x1 >= y2 - y1){
        int mid = (x1 + x2)/2;
        vector<pair<pair<pii, pii>, int>> v1, v2, v3;
        for(auto j : que){
            if(j.ff.ss.ff < mid) v1.pb(j);
            else if(j.ff.ff.ff > mid) v2.pb(j);
            else v3.pb(j);
        }
        for(int i = y1; i <= y2; i++){
            for(int aa = 0; aa < 2; aa++){
                for(int bb = 0; bb < 2; bb++){
                    if(aa == 1 && bb == 1) continue;
                    if(aa == 0 && bb == 0) continue;
                    if(aa == 1 && bb == 0) continue;
                    dij(mid, i, x1, y1, x2, y2, aa, bb);
                    for(auto j : v3){
                        for(int a = 0; a < 2; a++){
                            for(int b = 0; b < 2; b++){
                                ans[j.ss] = max(ans[j.ss], dist[enc(j.ff.ff.ff, j.ff.ff.ss, 0, 0)][1] + dist[enc(j.ff.ss.ff, j.ff.ss.ss, a, b)][0]);
                            }
                        } 
                    }
                }
            }
        }
        dnq(x1, y1, mid - 1, y2, move(v1));
        dnq(mid + 1, y1, x2, y2, move(v2));
    } else {
        int mid = (y1 + y2)/2;
        vector<pair<pair<pii, pii>, int>> v1, v2, v3;
        for(auto j : que){
            if(j.ff.ss.ss < mid) v1.pb(j);
            else if(j.ff.ff.ss > mid) v2.pb(j);
            else v3.pb(j);
        }
        for(int i = x1; i <= x2; i++){
            for(int aa = 0; aa < 2; aa++){
                for(int bb = 0; bb < 2; bb++){
                    if(aa == 1 && bb == 1) continue;
                    if(aa == 0 && bb == 0) continue;
                    if(aa == 0 && bb == 1) continue;
                    dij(i, mid, x1, y1, x2, y2, aa, bb);
                    for(auto j : v3){
                        for(int a = 0; a < 2; a++){
                            for(int b = 0; b < 2; b++){
                                ans[j.ss] = max(ans[j.ss], dist[enc(j.ff.ff.ff, j.ff.ff.ss, 0, 0)][1] + dist[enc(j.ff.ss.ff, j.ff.ss.ss, a, b)][0]);
                            }
                        }
                    }
                }
            }
        }
        dnq(x1, y1, x2, mid - 1, move(v1));
        dnq(x1, mid + 1, x2, y2, move(v2));
    }
}

int main(){
    setIO();
    cin >> n >> q;
    for(int i = 1; i <= n; i++) cin >> arr[i][0];
    for(int i = 1; i <= n; i++) cin >> arr[i][1];
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= n; j++){
            cin >> val[i][j];
        }
    }
    vector<pair<pair<pii, pii>, int>> que;
    for(int i = 0; i < q; i++){
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        que.pb({{{a, c}, {b, d}}, i});
    }
    dnq(1, 1, n, n, move(que));
    for(int i = 0; i < q; i++) cout << ans[i] << "\n";
}
```