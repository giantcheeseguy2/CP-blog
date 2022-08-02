title: Fibonacci Additions (Tutorial)
date: 7-30-2022
tag: codeforces, ad hoc, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1634/F)

## Solution

First of all, lets make an array \\(C\\), where \\(C_i = A_i - B_i\\). The two arrays are equal when all the elements in \\(C\\) are equal to \\(0\\). Now to support updates, lets try to represent \\(C\\) as some sort of difference array, \\(dif\\), where \\(arr[i] = arr[i - 2] + arr[i - 1] + dif[i]\\). Now if we only do suffix updates on \\(A\\), we just add \\(1\\) to the index of the update. To make this into range updates, we just subtract \\(F_{r - l + 2}\\) from \\(r + 1\\) and subtract \\(F_{r - l + 1}\\) from \\(r + 2\\). This will cancel out all the update after the \\(r\\). For updates on \\(B\\), simply do the same addition with opposite sign. All the elements in \\(C\\) are equal to \\(0\\) when all the elements in \\(dif\\) are equal to \\(0\\). The time complexity is \\(O(N + Q)\\).

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
    int n, q, mod;
    cin >> n >> q >> mod;
    int arr[n + 2];
    arr[0] = arr[1] = 0;
    int fib[n + 1];
    fib[0] = 0;
    fib[1] = 1;
    for(int i = 2; i <= n; i++) fib[i] = (fib[i - 2] + fib[i - 1])%mod;
    for(int i = 2; i <= n + 1; i++) cin >> arr[i];
    for(int i = 2; i <= n + 1; i++){
        int x;
        cin >> x;
        arr[i] = (arr[i] + mod - x)%mod;
    }
    int m[n + 2];
    memset(m, 0, sizeof(m));
    int cnt = 0;
    for(int i = 2; i <= n + 1; i++){
        int dif = (arr[i] + mod - (arr[i - 2] + arr[i - 1])%mod)%mod;
        if(dif) cnt++, m[i] = dif;
    }
    while(q--){
        char t;
        int a, b;
        cin >> t >> a >> b;
        a++, b++;
        int mult = (t == 'A' ? 1 : -1);
        int tot = 0, sum = 0;
        if(m[a]) tot++;
        m[a] += mult;
        m[a] %= mod;
        if(m[a]) sum++;
        if(b + 1 <= n + 1){
            if(m[b + 1]) tot++;
            m[b + 1] -= mult*fib[b - a + 2];
            m[b + 1] %= mod;
            if(m[b + 1]) sum++;
        }
        if(b + 2 <= n + 1){
            if(m[b + 2]) tot++;
            m[b + 2] -= mult*fib[b - a + 1];
            m[b + 2] %= mod;
            if(m[b + 2]) sum++;
        }
        cnt += sum - tot;
        cout << (!cnt ? "YES" : "NO") << "\n";
    }
}
```