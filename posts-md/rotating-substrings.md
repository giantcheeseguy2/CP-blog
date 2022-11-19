title: Rotating Substrings (Tutorial)
date: 11-18-2022
tag: cf, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1363/F)

## Solution

Our rotation operation is equivalent to taking out a character and putting it back somewhere in front of where it was. So our sequence of operations is equivalent to moving from right to left, and either matching a character directly, taking out a character, or putting a character back and matching it. This suggests a dp solution where \\(dp[i][j] = \\) the minimum number of operations done to have processed \\([i + 1, n]\\) in \\(s\\) and \\([j + 1, n]\\) in \\(t\\). if \\(s[i] == t[j]\\) then we can match the character directly with no cost, so \\(dp[i][j] = min(dp[i][j], dp[i - 1][j - 1])\\). We can also pick up a character from \\(s\\) with a cost of one, so \\(dp[i][j] = min(dp[i][j], dp[i - 1][j] + 1)\\). Finally, if we have an extra character that we've picked up equal to \\(t[j]\\), then we can put it down for no cost. We will have picked up a character if the amount of times \\(t[j]\\) occurs after \\(i\\) is more than the amount of times \\(t[j]\\) occurs after \\(j\\). For this case, \\(dp[i][j] = min(dp[i][j], dp[i][j - 1])\\).

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
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        int n;
        cin >> n;
        string a, b;
        cin >> a >> b;
        map<char, int> m;
        for(int i = 0; i < n; i++) m[a[i]]++, m[b[i]]--;
        bool val = true;
        for(auto i : m) val &= i.ss == 0;
        if(!val){
            cout << -1 << endl;
            continue;
        }
        int suf[n + 2][26][2];
        for(int i = 0; i < 26; i++) suf[n + 1][i][0] = suf[n + 1][i][1] = 0;
        for(int i = n; i >= 1; i--){
            for(int j = 0; j < 26; j++){
                suf[i][j][0] = suf[i + 1][j][0] + (a[i - 1] - 'a' == j);
                suf[i][j][1] = suf[i + 1][j][1] + (b[i - 1] - 'a' == j);
            }
        }
        int dp[n + 1][n + 1];
        for(int i = 0; i <= n; i++) for(int j = 0; j <= n; j++) dp[i][j] = INF;
        for(int i = 0; i <= n; i++) dp[0][i] = 0;
        for(int i = 1; i <= n; i++){
            for(int j = i; j <= n; j++){
                if(a[i - 1] == b[j - 1]) dp[i][j] = min(dp[i][j], dp[i - 1][j - 1]);
                if(suf[i + 1][b[j - 1] - 'a'][0] > suf[j + 1][b[j - 1] - 'a'][1]) dp[i][j] = min(dp[i][j], dp[i][j - 1]);
                dp[i][j] = min(dp[i][j], dp[i - 1][j] + 1);

            }
        }
        cout << dp[n][n] << endl;
    }
}
```