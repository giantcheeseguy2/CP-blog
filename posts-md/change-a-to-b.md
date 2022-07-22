title: Change A to B (Tutorial)
date: 7-21-2022
tag: codeforces, bitmask, dp

---
## Problem Statement
You are given two arrays $A$ and $B$ of length $N$. In one operation, you can choose two indices $i$, $j$ and an integer $x$, and do the following:
-   $A_i:=A_i+x$
-   $A_j:=A_j−x$
What is the minimum number of operations to make $A=B$. Output $-1$ if impossible.
	($-10^6 \le A_i \le 10^6$, $N \le 22$)

## Solution
The low bound on $N$ suggests a $N\*2^N$ solution. Lets consider a bitmask solution where $dp[i]$ represents the minimum steps to make the mask of $i$ equal. Notice that instead of always choosing two indices $i$ and $j$, you can instead store a running sum. Whenever you pick an index $i$, make it equal, then add the difference to the running sum. If the running sum is equal to $A_i$, it means that all of the previous indeces you have chosen beforehand now have a corresponding $j$ to move value from. Final complexity is $O(N\*2^N)$

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
    int arr[n][2], s1 = 0, s2 = 0;
    for(int i = 0; i < n; i++) cin >> arr[i][0], s1 += arr[i][0];
    for(int i = 0; i < n; i++) cin >> arr[i][1], s2 += arr[i][1];
    if(s1 != s2){
        cout << -1 << endl;
        return 0;
    }
    int dp[1 << n];
    for(int i = 0; i < (1 << n); i++) dp[i] = INF;
    dp[0] = 0;
    for(int i = 0; i < (1 << n) - 1; i++){
        int extra = 0;
        for(int j = 0; j < n; j++) if(i & (1 << j)) extra += arr[j][1] - arr[j][0];
        for(int j = 0; j < n; j++){
            if(i & (1 << j)) continue;
            int dif = arr[j][1] - arr[j][0];
            if((ll)dif*extra <= 0 && abs(dif) == abs(extra)) dp[i ^ (1 << j)] = min(dp[i ^ (1 << j)], dp[i]);
            else dp[i ^ (1 << j)] = min(dp[i ^ (1 << j)], dp[i] + 1);
        }
    }
    cout << dp[(1 << n) - 1] << endl;
}
```