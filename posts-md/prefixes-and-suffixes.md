title: Prefixes And Suffixes (Tutorial)
date: 10-30-2022
tag: cf, ad hoc, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1730/D)

## Solution

We can first reduce the operations into something simpler. If we reverse one of the two strings, then the operation will become choosing a prefix of both strings, reversing it, then swapping them. The first thing to notice is that each pair of characters between the two strings will always stick together. Furthermore, if we know the final positions of each pair of characters, then we can always achieve that orientation, since we can always reverse a pair into the first position (possibly swap it), then reverse it into some later position. If we construct the orientation from right to left, then it is easy to see that every orientation is possible. Now we just have to see if there is an orientation such that the strings are reverses of each other. This means that you have to be able to construct a palindrome using the pairs of characters. 

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
        map<pair<char, char>, int> m;
        reverse(b.begin(), b.end());
        for(int i = 0; i < n; i++){
            if(a[i] > b[i]) swap(a[i], b[i]);
            m[{a[i], b[i]}]++;
        }
        int cnt = 0;
        for(auto i : m){
            if(i.ss%2 == 1){
                if(i.ff.ff == i.ff.ss) cnt++;
                else cnt += 2;
            }
        }
        cout << (cnt <= 1 && cnt%2 == n%2 ? "YES" : "NO") << endl;
    }
}
```