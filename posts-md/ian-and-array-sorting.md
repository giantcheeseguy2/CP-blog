title: Ian And Array Sorting (Tutorial)
date: 4-22-2023
tag: cf, ad hoc, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1815/problem/A)

## Solution

With these operation problems, it is usually helpful to find some sort of invariant. There is no clear invariant in the array itself, so lets look at the difference array. We want the difference array to be all non-negative for the array to be sorted. Notice that our operations are equivalent to adding one and subtracting one from elements that are one apart. Thus, the even and odd indices are indepedent, and values can be distributed in any way across indeces with the same parity, as long as the total sum is the same, so we will compress all even and odd indeces into their own sums. Next, lets look at what happens when we apply the operation at the very front or back of the array. This will just increase the value of the even or odd sums in the case that the array length is odd, and only the odd sums in the case the array length is even. Thus, if the array length is odd it is always possible and if it is even then we have to check the even sums to see if the total sum is non-negative, meaning it can be completely distributed so that each index is non-negative.

## Code

```c++
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse4,popcnt,abm,mmx,tune=native")
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
        ll arr[n + 1];
        arr[0] = 0;
        for(int i = 1; i <= n; i++){
            cin >> arr[i];
        }
        for(int i = n; i >= 1; i--){
            arr[i] -= arr[i - 1];
        }
        if(n%2 == 1){
            cout << "YES" << endl;
            continue;
        }
        ll sum = 0;
        for(int i = 2; i <= n; i += 2){
            sum += arr[i];
        }
        if(sum >= 0) cout << "YES" << endl;
        else cout << "NO" << endl;
    }
}
```