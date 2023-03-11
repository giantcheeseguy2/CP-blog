title: Halve Or Subtract (Tutorial)
date: 2-28-2023
tag: cf, aliens trick, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1799/problem/F)

## Solution

Consider a naive dp solution where \\(dp[i][j][k] = \\) the answer at index \\(i\\) while using \\(j\\) op \\(1\\) and \\(k\\) op \\(2\\). Actually, as we use more operations, the answer always decreases, so this is a convex function. We can apply aliens trick twice to remove both of the extra dimensions. Note that since we are applying aliens trick twice, we have to consider how many op \\(1\\) and op \\(2\\) we are using specially, since sometimes an op \\(1\\) could be used to replace an op \\(2\\). Thus, we can use an extra variable to store the amount of ties, and always distribute these ties as optimally as we can for each binary search.

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

int arr[5005];
int cost[5005][3];
int n, a, b, sub;
int aa, bb, cc;
int x, y;
ll cur;

void check2(){
    aa = 0, bb = 0, cc = 0;
    cur = 0;
    for(int i = 1; i <= n; i++){
        ll prv = cur;
        cur += arr[i - 1];
        cur = min(cur, prv + cost[i - 1][0] + x);
        cur = min(cur, prv + cost[i - 1][1] + y);
        cur = min(cur, prv + cost[i - 1][2] + x + y);
        if(prv + arr[i - 1] == cur) continue;
        if(prv + cost[i - 1][0] + x == cur){
            aa++;
            if(prv + cost[i - 1][1] + y == cur){
                aa--;
                cc++;
            }
        } else if(prv + cost[i - 1][1] + y == cur){
            bb++;
        } else if(prv + cost[i - 1][2] + x + y == cur){
            aa++;
            bb++;
        }
    }
}

void check1(){
    int l = 0, r = INF; 
    while(l < r){
        int mid = (l + r)/2;
        y = mid;
        check2();
        if(bb <= b) r = mid;
        else l = mid + 1;
    }
    y = l;
    check2();
}

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        int sub;
        cin >> n >> sub >> a >> b;
        for(int i = 0; i < n; i++){
            cin >> arr[i];
            cost[i][0] = ceil0(arr[i], 2);
            cost[i][1] = max(arr[i] - sub, 0);
            cost[i][2] = min(max(ceil0(arr[i], 2) - sub, (ll)0), ceil0(max(arr[i] - sub, 0), 2));
        }
        int l = 0, r = INF;
        while(l < r){
            int mid = (l + r)/2;
            x = mid;
            check1();
            if(aa <= a && cc <= b + a - aa - bb) r = mid;
            else l = mid + 1;
        }
        x = l;
        check1();
        cout << cur - (ll)x*a - (ll)y*b << endl;
    }
}
```