title: Lucky Numbers (Tutorial)
date: 11-20-2022
tag: cf, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1428/G2)

## Solution

Lets try to solve the easy version of this problem first. The condition that there must be exactly \\(k\\) numbers actually means that there is at most \\(k\\) numbers, since \\(0\\) counts as a number. The scores being proportional to the multiple of three means that it would always be optimal to have lucky digits than to not. Therefore, our optimal strategy will involve choosing some set of numbers that only consist of lucky digits, then completing the sum with the final number. We want to choose \\(k - 1\\) numbers such that their sum is fixed, and for the easy version, we can just iterate over the final number. To solve this, it seems intuitive that we would somehow want to process the digits individually. Actually, we can always break down every lucky number into some amounts of \\(3 \\cdot 10^x\\). So if we have \\(3(k - 1)\\) amounts of each \\(3 \\cdot 10^x\\) with their respective value and weight, we can do a 0/1 knapsack to figure out the maximum score with a given sum. However, this is too slow, so we can apply a trick used to optimize knapsack with many identical values. Let \\(2^x\\) be the largest power of \\(2\\) that shares a bit with the amount. Make a value for every power of \\(2\\) less than \\(2^x\\). This will allow us to reach every value in the range \\([0, 2^x - 1]\\). Finally, we just need an extra value for the remainder after subtracting \\(2^x - 1\\) from the weight. This way, every value in the range can be reached. Now how can we extend this to the hard version? Actually, we can use a similar technique. We can do an 0/1 knapsack for each digit, with each digit having options from \\(0\\) to \\(9\\). Note that the ordering of for loops matters.

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

const int MX = 1e6;

int arr[6];

ll find(int x){
    ll ret = 0;
    for(int i = 0; i < 6; i++){
        if((x%10)%3 == 0) ret += (ll)arr[i]*(x%10)/3;
        x /= 10;
    }
    return ret;
}

int main(){
    setIO();
    int k;
    cin >> k;
    for(int i = 0; i < 6; i++) cin >> arr[i];
    if(k == 1){
        int q;
        cin >> q;
        while(q--){
            int x;
            cin >> x;
            cout << find(x) << endl;
        }
        return 0;
    }
    k--;
    k *= 3;
    int mask = 1, sz = 0;
    while(2*mask <= k) mask *= 2, sz++;
    vector<pll> v;
    int p10 = 1;
    for(int i = 0; i < 6; i++){
        for(int j = 0; j < sz; j++){
            v.pb({(ll)arr[i]*(1 << j), (ll)3*p10*(1 << j)});
        }
        v.pb({(ll)arr[i]*(k - mask + 1), (ll)3*p10*(k - mask + 1)});
        p10 *= 10;
    } 
    ll dp[MX];
    for(int i = 0; i < MX; i++) dp[i] = -LLINF;
    dp[0] = 0;
    for(pll j : v){
        for(int i = MX - 1; i >= 1; i--){
            if(i >= j.ss) dp[i] = max(dp[i], dp[i - j.ss] + j.ff);
        }
    }
    p10 = 1;
    for(int i = 0; i < 6; i++){
        for(int k = MX - 1; k >= 1; k--){
            for(int j = 0; j <= 9; j++){
                if(j*p10 > k) continue;
                if(j%3 == 0) dp[k] = max(dp[k], dp[k - p10*j] + (ll)arr[i]*j/3);
                else dp[k] = max(dp[k], dp[k - p10*j]);
            }
        }
        p10 *= 10;
    }
    int q;
    cin >> q;
    while(q--){
        int x;
        cin >> x;
        cout << dp[x] << endl;
    }
}
```