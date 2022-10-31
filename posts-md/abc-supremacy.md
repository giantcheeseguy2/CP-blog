title: ABC Supremacy (Tutorial)
date: 10-23-2022
tag: atcoder, greedy, ad hoc, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/agc055/tasks/agc055_b)

## Solution

Our operation is essentially cyclicly rotating the a subarray of `ABC` to the left. Actually, if we shift each of these characters by its index (`A` -> `C`, `B` -> `A`, `C` -> `B`), then every rotatable subarray becomes three of the same character in a row. Lets call rotatable subarrays good. The rotate operation then becomes changing a string consisting of `XXX` to `YYY`. It also means that you can move any good subarray to any place in the array. If you have `XXXY`, you can change `XXX` to `YYY`, making it `YYYY`. Next just change `YYY` to `XXX` to get `YXXX`. Since we can move good subarrays anywhere, its equivalent to simply removing it and reinserting it anywhere. This leads us to a solution that compares the two strings after removing all good subarrays, which can be done by adding characters from right to left and removing all good subarrays from the back .

## Code

```c++
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
    int a[n], b[n];
    for(int i = 0; i < n; i++){
        char c;
        cin >> c;
        a[i] = (c == 'A' ? 0 : (c == 'C' ? 1 : 2));
    }
    for(int i = 0; i < n; i++){
        char c;
        cin >> c;
        b[i] = (c == 'A' ? 0 : (c == 'C' ? 1 : 2));
    }
    vector<int> v1, v2;
    for(int i = 0; i < n; i++){
        (a[i] += i) %= 3, v1.pb(a[i]);
        while(v1.size() >= 3 && v1[v1.size() - 1] == v1[v1.size() - 2] && v1[v1.size() - 2] == v1[v1.size() - 3]){
            v1.pop_back();
            v1.pop_back();
            v1.pop_back();
        }
    }
    for(int i = 0; i < n; i++){
        (b[i] += i) %= 3, v2.pb(b[i]); 
        while(v2.size() >= 3 && v2[v2.size() - 1] == v2[v2.size() - 2] && v2[v2.size() - 2] == v2[v2.size() - 3]){
            v2.pop_back();
            v2.pop_back();
            v2.pop_back();
        }
    }
    cout << (v1 != v2 ? "NO" : "YES") << endl;
}
```