title: Velepin And Marketing (Tutorial)
date: 2-12-2023
tag: cf, segtree, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1793/problem/E)

## Solution

We know that when satisfying people, it is always optimal to satisfy people with lower requirements. Thus, if we sort are given array, then we want to find the largest prefix that can be satisfied, making our problem much simpler. How can we check if a prefix of length \\(x\\) can be satisfied with \\(y\\) books. Lets say we want to partition our prefix into book groups. If some pereson at index \\(i\\) is in a group, and a person at index \\(i - 1\\) is in the same group, then \\(i - 1\\) will be satisfied if \\(i\\) is satisfied. Thus, we only have to consider the largest indexed person in each group and try to satisfy them. This also tells us that it is optimal to partition groups into subarrays, since for a fixed largest element, every other person seems identical, so might as well take the largest ones. So lets get rid of as many extra books as possible, \\(n - x\\) of them, and see if we can partition the prefix of \\(x\\) into \\(y - (n - x)\\) groups. In fact we can, with a dp, since we are trying to maximize partitioning subarrays with each subarray having a minimum length based on right endpoint. However, this doesn't work when \\(a_i > i\\). In this case, to satisfy the prefix, we need to give it an extra \\(a_i - i\\) people from outside the prefix. So if \\(a_i \\le i\\) and \\(x\\) is the maximum number of groups we can form using the prefix of \\(i\\), then we can use the prefix to satisfy a query \\(y\\) if \\(y \\le x + n - i\\). If \\(a_i > i\\), then we need \\(y \\le n - a_i + 1\\), since we have the extended prefix of \\(a_i\\) as a group and \\(n - a_i\\) leftovers. To find the maximum prefix for each query, we can precompute the values for each index then walk on segtree.

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

int n;
int arr[300005];
int dp[300005]; //max number of steps to get to 0

int seg[1200005];

void update(int x, int v, int l = 0, int r = n, int cur = 0){
    if(l == r){
        seg[cur] = v;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, v, l, mid, cur*2 + 1);
    else update(x, v, mid + 1, r, cur*2 + 2);
    seg[cur] = max(seg[cur*2 + 1], seg[cur*2 + 2]);
}

int query(int v, int l = 0, int r = n, int cur = 0){
    if(l == r) return l;
    int mid = (l + r)/2;
    if(v <= seg[cur*2 + 2]) return query(v, mid + 1, r, cur*2 + 2);
    else return query(v, l, mid, cur*2 + 1);
}

int main(){
    setIO();
    cin >> n;
    for(int i = 1; i <= n; i++) cin >> arr[i];
    sort(arr + 1, arr + n + 1);
    for(int i = 1; i <= n; i++){
        dp[i] = dp[i - 1];
        if(arr[i] <= i){
            dp[i] = max(dp[i], dp[i - arr[i]] + 1);
            update(i, dp[i - arr[i]] + 1 + n - i);
        } else {
            update(i, n - arr[i] + 1);
        }
    }
    int q;
    cin >> q;
    while(q--){
        int x;
        cin >> x;
        cout << query(x) << endl;
    }
}
```