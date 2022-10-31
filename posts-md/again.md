title: >< again (Tutorial)
date: 10-23-2022
tag: atcoder, greedy, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/agc053/tasks/agc053_a)

## Solution

First of all, it is always optimal to distribute the array as evenly as possible, while leaving  If we know the answer, then we can just try evenly distributing as much as possible and check if it works afterward. Since the bounds are small, we can just iterate over the answer. However, we also know that the answer is simply the smallest absolute value of the difference between adjacent elements, since that is the smallest amount we can add onto the elements to make it greater or less (adding/subtracting 1 per group).

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
    string s;
    cin >> s;
    int prv;
    int orig[n + 1];
    cin >> prv;
    orig[0] = prv;
    int arr[n];
    for(int i = 0; i < n; i++){
        int x;
        cin >> x;
        orig[i + 1] = x;
        arr[i] = x - prv;
        prv = x;
    }
    bool fail = false;
    for(int i = 0; i < n; i++){
        if(s[i] == '>'){
            fail |= arr[i] >= 0;
        } else {
            fail |= arr[i] <= 0;
        }
    }
    if(fail){
        cout << 0 << endl;
        return 0;
    }
    int ans = INF;
    for(int i = 0; i < n; i++) ans = min(ans, abs(arr[i]));
    cout << ans << endl;
    vector<vector<int>> v;
    for(int i = 0; i <= n; i++){
        vector<int> tmp;
        for(int j = 0; j < ans; j++){
            tmp.pb(orig[i]/ans + (orig[i]%ans > j));
        }
        v.pb(tmp);
    }
    for(int j = 0; j < ans; j++){
        for(int i = 0; i <= n; i++){
            cout << v[i][j] << " "; 
        }
        cout << endl;
    }
}
```