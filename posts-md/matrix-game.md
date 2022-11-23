title: Matrix Game (Tutorial)
date: 11-23-2022
tag: loj, sdc, invariance, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/3500)

## Solution

What if we had no restrictions on the range of our final values. We can just set the extra row and column to \\(0\\), then solve for the rest of the conditions. It's easy to see that this is always possible. Now how can we add values to each cell to try to satisfy the extra conditions and not change the final result. If we want to add a value to a cell, then for either that row or column, we have to alternate adding or subtracting that value. This leaves us with an invariant that the the output matrix will not change as long as our only operations are choosing a value for each row and column, then alternating adding it for that respective row and column. If \\(r_i\\) is the value we are adding to the \\(i\\)th row, \\(c_j\\) is the value we are adding to the \\(j\\)th column, and \\(arr[i][j]\\) is the value we got by solving while the last row and column were set to \\(0\\), then we have to find \\(r_i\\) and \\(c_j\\) such that \\(0 \\le arr[i][j] + (-1)^j r_i + (-1)^i c_j \\le 10^6\\). Its easier to consider \\((-1)^i r_i\\) rather than \\((-1)^j r_i\\) and \\((-1)^j c_j\\) rather than \\((-1)^i c_j\\). Thus, if we multiply both sides by \\((-1)^{i + j}\\), then for every \\((i, j)\\), \\((-1)^{i + j + 1} arr[i][j] \\le (-1)^i r_i + (-1)^j c_j \\le (-1)^{i + j}(10^6 - arr[i][j])\\) must hold true. Enforcing bounds on some variables can be usually be solved with system of different constraints (sdc), so we should change \\((-1)^i r_i + (-1)^j c_j\\) to \\((-1)^i r_i - (-1)^{j + 1} c_j\\) to be able to apply sdc. Let \\(a_i = (-1)^i r_i\\) and \\(b_i = (-1)^{j + 1} c_j\\). Then we are solving an sdc for \\((-1)^{i + j + 1} arr[i][j] \\le a_i - b_j \\le (-1)^{i + j}(10^6 - arr[i][j])\\). Note that we can set any row or column to \\(0\\) as our initial starting point for the sdc, since every value is connected and they are all relative to each other. If there are any negative cycles then the system is impossible to satisfy and there is no solution. After solving for every \\(r_i\\) and \\(c_j\\) it is easy to reconstruct the answer.

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
#define int long long

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

int n, m;
int tar[305][305];
int arr[305][305];

vector<pii> g[605];
int val[605];
bool in[605];
int deg[605];

signed main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        cin >> n >> m;
        for(int i = 0; i < n - 1; i++){
            for(int j = 0; j < m - 1; j++){
                cin >> tar[i][j];
            }
        }
        for(int i = n - 2; i >= 0; i--){
            for(int j = m - 2; j >= 0; j--){
                arr[i][j] = tar[i][j] - arr[i + 1][j] - arr[i][j + 1] - arr[i + 1][j + 1]; 
            }
        }
        for(int i = 0; i < n + m; i++) g[i].clear(), val[i] = INF, in[i] = false, deg[i] = 0;
        for(int i = 0; i < n; i++){
            for(int j = 0; j < m; j++){
                if((i + j)%2 == 0){
                    g[i].pb({n + j, arr[i][j]});
                    g[n + j].pb({i, 1e6 - arr[i][j]});
                } else {
                    g[n + j].pb({i, arr[i][j]});
                    g[i].pb({n + j, 1e6 - arr[i][j]});
                }
            }
        }
        queue<int> q;
        q.push(0);
        val[0] = -1;
        in[0] = true;
        bool fail = false;
        while(!q.empty()){
            int x = q.front();
            in[x] = false;
            q.pop();
            for(pii i : g[x]){
                if(val[i.ff] > val[x] + i.ss){
                    val[i.ff] = val[x] + i.ss;
                    deg[i.ff]++;
                    if(deg[i.ff] > n + m){
                        fail = true;
                        break;
                    }
                    if(!in[i.ff]) q.push(i.ff), in[i.ff] = true;
                }
            }
            if(fail) break;
        }
        if(fail){
            cout << "NO" << endl;
            continue;
        }
        cout << "YES" << endl;
        for(int i = 0; i < n; i++) val[i] *= (i%2 == 0 ? 1 : -1);
        for(int i = 0; i < m; i++) val[n + i] *= (i%2 == 1 ? 1 : -1);
        for(int i = 0; i < n; i++){
            for(int j = 0; j < m; j++){
                int a = (j%2 == 0 ? 1 : -1), b = (i%2 == 0 ? 1 : -1);
                cout << arr[i][j] + a*val[i] + b*val[n + j] << " ";
            }
            cout << endl;
        }
    }
}
```