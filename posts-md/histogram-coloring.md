title: Histogram Coloring (Tutorial)
date: 12-8-2022
tag: atcoder, dp, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/agc026/tasks/agc026_d)

## Solution

This immediately seems like some sort of dp problem. Lets solve for the case where the histogram is just a rectangle. Here, the condition actually means that for each column or row, we have to take the inverse of it for the next column or row. The only exception to this is if that column or row is entirely alternating. In that case, we have two choices in how to make the next row or column completely alternating. Since the answer is always fixed as soon as we make row non alternating, our dp states should have an extra dimension saying whether the current state is alternating or not. Now how do we solve for the non rectangular case? If we consider the histograms from left to right, then in order to transition correctly, we would have to know exactly which sections of the histograms are alternating or not. This seems difficult, so what if we instead consider the histograms from bottom to top? This way, if we do a top down dp, we only have to know whether the entire bottom row of each section is alternating or not. We can just remove the largest rectangle possible from the bottom of our current state, and reduce the dp to some multiple disjoint components. To merge the dp together, we can initially compute the number of ways to make it alternating, as well as the total number of ways to make it. Then, the number of non alternating ways is just the difference. 

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

int fpow(int a, ll b){
    int ret = 1;
    while(b){
        if(b%2 == 1) ret = (ll)ret*a%MOD;
        a = (ll)a*a%MOD;
        b /= 2;
    }
    return ret;
}

//first - non alternating
//second - alternating
pii dfs(vector<int> v){
    int mn = INF;
    for(int i : v) mn = min(mn, i);
    for(int &i : v) i -= mn;
    int cnt = 0;
    for(int i = 0; i < v.size(); i++){
        int j = i;
        while(j < v.size() && v[j]) j++;
        cnt += (j - i >= 2);
        if(j > i) i = j - 1;
    } 
    if(!cnt){
        ll sum = 0;
        for(int i : v) sum += i + 1;
        return {(fpow(2, sum) + MOD - fpow(2, sum - v.size() + 1))%MOD, fpow(2, sum - v.size() + mn)};
    }
    pii ret = {1, 1};
    for(int i = 0; i < v.size(); i++){
        int j = i;
        vector<int> v2;
        while(j < v.size() && v[j]) v2.pb(v[j]), j++;
        if(j > i){
            pii x = dfs(v2);
            ret.ff = (ll)ret.ff*(x.ff + (ll)2*x.ss%MOD)%MOD;
            ret.ss = (ll)ret.ss*x.ss%MOD;
            i = j - 1;
        } else {
            ret.ff = (ll)2*ret.ff%MOD;
        }
    }
    ret.ff = (ret.ff + MOD - (ll)2*ret.ss%MOD)%MOD;
    ret.ss = (ll)ret.ss*fpow(2, mn)%MOD;
    return ret;
}

int main(){
    setIO();
    int n;
    cin >> n;
    vector<int> v(n);
    for(int i = 0; i < n; i++) cin >> v[i];
    pii ans = dfs(v);
    cout << (ans.ff + ans.ss)%MOD << endl;
}
```