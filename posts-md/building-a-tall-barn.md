title: Building A Tall Barn (Tutorial)
date: 10-23-2022
tag: usaco, binary search, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=697)

## Solution

By plotting \\(y = \\lfloor \\frac{a_i}{x} \\rfloor - \lfloor \\frac{a_i}{x + 1} \\rfloor \\), we can see how much adding a cow to \\(a_i\\) changes the total time. It is obviously optimal to always greedily add the next cow to the position where it will reduce the time most. Looking at the graphs of each \\(a_i\\) with the equation above, we can see that we want to choose some a line and take add the number of cows that each floor needs to get to that amount of time saved. Also add in some leftover cows. The line can be found using a binary search, and checking the total number of cows needed can be done with the quadratic formula for each floor. After that, you can simply greedily choose the last \\(N\\) cows to add.

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

int n;
ll arr[100005], k;

bool check(ld x){
    ll sum = 0;
    for(int i = 0; i < n; i++){
        ld c = arr[i]/x;
        sum += (ll)floor((sqrtl(1 + 4*c) - 1)/2) + 1;
    }
    return sum <= k;
}

ld eps = 1e-12;

int main(){
    setIO();
    freopen("tallbarn.in", "r", stdin);
    freopen("tallbarn.out", "w", stdout);
    cin >> n >> k;
    for(int i = 0; i < n; i++) cin >> arr[i];
    ld l = 0, r = 1e12;
    for(int i = 0; i < 200; i++){
        ld mid = (l + r)/2;
        if(check(mid)) r = mid;
        else l = mid + eps;
    }
    ll cnt[n];
    for(int i = 0; i < n; i++){
        ld c = arr[i]/l;
        cnt[i] = (ll)floor((sqrtl(1 + 4*c) - 1)/2) + 1;
        k -= cnt[i];
    }
    vector<pair<ld, int>> v;
    for(int i = 0; i < n; i++) v.pb({(ld)arr[i]/cnt[i] - (ld)arr[i]/(cnt[i] + 1), i});
    sort(v.rbegin(), v.rend());
    ld sum = 0;
    for(int i = 0; i < min((int)v.size(), (int)k); i++) cnt[v[i].ss]++, sum += v[i].ff;
    ld ans = 0;
    for(int i = 0; i < n; i++) ans += (ld)arr[i]/cnt[i];
    cout << (ll)round(ans) << endl;
}
```