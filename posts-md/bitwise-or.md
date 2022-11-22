title: Bitwise OR (Tutorial)
date: 11-22-2022
tag: cf, pie, dp, bitmask, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/397793/problem/A)

## Solution

We have a dp solution where \\(dp[i] = \\) the expected time it takes to reach a bitmask of \\(i\\), which can be computed in \\(N^2\\) time, but that is too slow and hard to optimize. Notice that the bits are actually indepedent. If \\(e_j\\) is the expected time that bit \\(j\\) is turned on, then the answer is just \\(max(e_j)\\) over all \\(j\\). Finding the max is still hard, but we can actually reduce it to finding the min with the pie formula, \\(max(S) = \\sum_{T \\subseteq S} (-1)^{|T|} min(T)\\). Finding the minimum of a subset is much easier, since it is the first time that any bit in the subset is turned on. Its actually easier to do a complementary counting for each \\(T\\). If for every \\(i\\), we know \\(p_i\\), the sum of probabilities over all subsets of \\(i\\), we can find the expected minimum time for a bit outside of \\(i\\) to be flipped on, which is just \\(\\frac{1}{1 - p}\\), since it is the infinite geometric sum of \\( + p^2 + p^3 \\dots\\).
In other words, we just need to find sum of probabilties over all subsets of \\(j\\), \\(p_j\\). The expected minimum time of the subset that is the inverse of \\(j\\), \\(2^{N - 1} - j\\), is then just \\(1/(1 - p)\\) since that is \\(\\sum_{i = 1}^{\\infty} i \\cdot p^{i - 1} \\cdot (1 - p)\\), since \\(p\\) is the probability that the bit does not appear in \\(2^{N - 1} - j\\) after a single operation.

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
    scanf("%lld", &n);
    int lg = n;
    n = 1 << n;
    ld arr[n];
    int tot = 0;
    for(int i = 0; i < n; i++){
        scanf("%llf", &arr[i]);
        if(arr[i] > 1e-7) tot |= i;
    }
    if(tot != n - 1){
        cout << "INF" << endl;
        return 0;
    }
    for(int j = 0; j < lg; j++){
        for(int i = 0; i < n; i++){
            if(i & (1 << j)) arr[i] += arr[i ^ (1 << j)];
        }
    }
    ld ans = 0;
    for(int i = 0; i < n; i++){
        int mult = (__builtin_popcount(n - 1 - i)%2 == 1 ? 1 : -1);
        if(1.0 - arr[i] <= 1e-7) continue;
        ans += mult/(1.0 - arr[i]);
    }
    cout << fixed << setprecision(7) << ans << endl;
}
```