title: Taking The Middle (Tutorial)
date: 10-23-2022
tag: atcoder, greedy, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/agc053/tasks/agc053_b)

## Solution

First of all, maximizing Takashi's score is the same as minimizing Aoki's score. On the \\(i\\)th turn, Aoki can choose from the range of unchosen values from \\(N - i + 1\\) to \\(N + i\\). It is kind of intuitive that it is always some path to get all of these nodes, since it is possible to get to \\(N - i + 1\\) and \\(N + i\\) seperately, and by choosing the right values, we can shift the choices to make him choose whatever we want. We can use a set to maintain this and greedily choose the smallest.

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
    n *= 2;
    int arr[n + 1];
    ll ans = 0;
    for(int i = 1; i <= n; i++) cin >> arr[i], ans += arr[i];
    multiset<int> s;
    for(int i = 1; i <= n/2; i++){
        s.insert(arr[n/2 - i + 1]);
        s.insert(arr[n/2 + i]);
        ans -= *s.begin();
        s.erase(s.begin());
    }
    cout << ans << endl;
}
```