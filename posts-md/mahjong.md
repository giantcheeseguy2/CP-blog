title: Mahjong (Tutorial)
date: 11-21-2022
tag: cf, bitmask, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/411094/problem/A)

## Solution

How can we check if a hand is winning? If we are adding elements from small to large value, then we can check with a dp. \\(dp[i][j][k][l][0/1] = \\) the number of ways to reach when we have added all elements \\(\\le i\\) and have \\(j\\) tiles so far, \\(k\\) unfinished \\({i - 1, i, i + 1}\\) triples, \\(l\\) unfinished \\({i, i + 1, i + 2}\\) triples, and \\(0\\) or \\(1\\) extra pairs. However, multiple states of \\(k\\), \\(l\\), and \\(0/1\\) pairs may be identical, so we can store all identical states in a bitmask. Now we have a working dp, but it is too slow. However, notice that many of our bitmasks are impossible to reach. First of all, the transitions between bitmasks doesn't change based on \\(i\\), so we can precompute them. If we run a bfs from the base state, we can notice that there are only \\(68\\) possible bitmasks, which will run in time. We can discretize each bitmask and use the precomputed transitions to transition fast.

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

int enc(int a, int b, int c){
    return a*6 + b*2 + c;
}

pair<pii, int> dec(int x){
    return {{x/6, (x%6)/2}, x%2};
}

int id[100], sz = 0;
int nxt[100][5];
int rev[1 << 18];

void bfs(){
    queue<int> q;
    id[sz] = 1;
    rev[1] = 0;
    memset(rev, -1, sizeof(rev));
    q.push(sz++);
    while(!q.empty()){
        int x = q.front();
        q.pop();
        for(int i = 0; i < 5; i++){
            int sum = 0;
            for(int j = 0; j < 18; j++){
                if(id[x] & (1 << j)){
                    pair<pii, int> v = dec(j);
                    if(v.ff.ff + v.ff.ss > i) continue;
                    int rem = i - v.ff.ff - v.ff.ss;
                    sum |= (1 << enc(v.ff.ss, rem%3, v.ss));
                    if(rem >= 2 && !v.ss) sum |= (1 << enc(v.ff.ss, rem - 2, 1));
                }
            }
            if(sum && rev[sum] == -1){
                rev[sum] = sz;
                id[sz] = sum;
                q.push(sz++);
            }
            nxt[x][i] = (sum ? rev[sum] : -1);
        }
    }
}

void print(int x){
    for(int i = 0; i < 18; i++){
        if(x & (1 << i)) cout << (1 << i) << " ";
    }
    cout << endl;
}

int main(){
    setIO();
    int t;
    cin >> t;
    bfs();
    for(int tt = 1; tt <= t; tt++){
        int k, m;
        cin >> k >> m;
        int dp[k + 1][m + 1][sz];
        memset(dp, 0, sizeof(dp));
        dp[0][0][0] = 1;
        for(int i = 0; i < k; i++){
            for(int j = 0; j <= m; j++){
                for(int y = 0; y < sz; y++){
                    for(int x = 0; x < 5 && j + x <= m; x++){
                        if(nxt[y][x] != -1) (dp[i + 1][j + x][nxt[y][x]] += dp[i][j][y]) %= MOD;
                    }
                }
            }
        }
        int ans = 0;
        for(int i = 0; i < sz; i++) if(id[i] & 2) (ans += dp[k][m][i]) %= MOD;
        cout << "Case #" << tt << ": " << ans << endl;
    }
}
```