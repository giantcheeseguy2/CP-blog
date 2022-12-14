title: Knapsack (Tutorial)
date: 12-7-2022
tag: cf, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/412114/problem/C)

## Solution

Lets consider a naive solution. We would have a state for the \\(N \\cdot M\\) possible weights, and another state for the current index. This is obviously too slow, so we should try to optimize. Our bottleneck exists because we have to store every possible weight, but what if we didn't? If we just greedily take values, then we would have to try to satisfy a remainder weight \\(\\le M\\), while supporting the knapsack for both negative and positive values. If we always choose these values in a smart way, it is easy to see that total sum at any point will never exceed the range \\([-M, M]\\). This leaves us with a \\(dp[i][j][k] = \\) if it is possible to reach a weight of \\(k\\) while considering the first \\(i\\) positive and first \\(j\\) negative. Since this dp doesn't actually store any data, and having a smaller index of \\(j\\) would always be "more optimal" than having a larger index, we can move one of the states inside. So \\(dp[i][k] = \\) the minimum \\(j\\) needed to have a sum of \\(k\\). However, this still didn't change the complexity. Actually, notice that \\(dp[i][k]\\) is monotonically decreasing as \\(i\\) increases. This means that instead of trying to transition for every \\(j\\) at a given point, we only have to transition between the range of \\(dp[i][k]\\) and \\(dp[i - 1][k]\\), since if we transition with a \\(j > dp[i - 1][k]\\), it will have already been considered in the \\(dp[i - 1][k]\\) transition. If we process these transitions in the right order, we can see that for every \\(k\\), a given \\(j\\) is only considered once, giving us an \\(N \\cdot M\\) solution.

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
    int n, m, k;
    cin >> n >> m >> k;
    vector<int> pos;
    vector<int> neg;
    for(int i = 0; i < n; i++){
        int x;
        cin >> x;
        if(k >= x){
            neg.pb(x);
            k -= x;
        } else {
            pos.pb(x);
        }
    }
    if(k == 0){
        cout << neg.size() << endl;
        for(int i : neg) cout << i << " ";
        cout << endl;
        return 0;
    }
    if(k > m){
        cout << -1 << endl;
        return 0;
    }
    int dp[pos.size() + 1][2*m + 1];
    pii prv[pos.size() + 1][2*m + 1];
    for(int i = 0; i <= pos.size(); i++) for(int j = 0; j <= 2*m; j++) dp[i][j] = INF;
    dp[0][m] = -1;
    for(int i = 0; i < pos.size(); i++){
        for(int j = 0; j <= 2*m; j++){
            if(dp[i][j] < dp[i + 1][j]){
                prv[i + 1][j] = {i, j};
                dp[i + 1][j] = dp[i][j];
            }
            if(j + pos[i] <= 2*m){
                if(dp[i][j] < dp[i + 1][j + pos[i]]){
                    prv[i + 1][j + pos[i]] = {i, j};
                    dp[i + 1][j + pos[i]] = dp[i][j];
                } 
            }
        }
        for(int j = 2*m; j >= 0; j--){
            for(int cur = dp[i + 1][j] + 1; cur <= dp[i][j]; cur++){
                if(cur >= neg.size() || j - neg[cur] < 0) break;
                if(cur < dp[i + 1][j - neg[cur]]){
                    prv[i + 1][j - neg[cur]] = {i + 1, j};
                    dp[i + 1][j - neg[cur]] = cur;
                }
            }
        }
    }
    if(dp[pos.size()][m + k] == INF){
        cout << -1 << endl;
        return 0;
    }
    vector<int> add;
    vector<int> rem;
    pii cur = {pos.size(), m + k};
    while(cur.ff != 0){
        pii nxt = prv[cur.ff][cur.ss];
        if(nxt.ff == cur.ff) rem.pb(neg[dp[cur.ff][cur.ss]]);
        else if(nxt.ss != cur.ss) add.pb(pos[nxt.ff]);
        cur = nxt;
    }
    multiset<int> s;
    for(int i : neg) s.insert(i);
    for(int i : add) s.insert(i);
    for(int i : rem) s.erase(s.find(i));
    cout << s.size() << endl;
    for(int i : s) cout << i << " ";
    cout << endl;
}
```