title: Labelling The Tree With Distances (Tutorial)
date: 3-9-2023
tag: cf, hashing, tree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1794/problem/E)

## Solution

The problem is equivalent to ensuring that each value given occurs at least once as a depth. Since we don't care which nodes have that depth, we can use hashing to encode this. To account for the extra value, we just have to make sure that our remainder after finding the difference between the hash and the target exists as a hash of a depth from \\(0\\) to \\(N - 1\\). For hashing, we can use \\(\\sum prime^{depth}\\).

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

vector<int> g[200005];
set<int> s1, s2;
int p1 = 224737, p2 = 163841;
int pow1[200005], pow2[200005];
int sub1[200005], sub2[200005];
int tot1 = 0, tot2 = 0;

void dfs1(int x, int p = 0){
    sub1[x] = p1;
    sub2[x] = p2;
    for(int i : g[x]){
        if(i == p) continue;
        dfs1(i, x);
        (sub1[x] += (ll)sub1[i]*p1%MOD) %= MOD;
        (sub2[x] += (ll)sub2[i]*p2%MOD) %= MOD;
    }
}

bool ans[200005];

void dfs2(int x, int p = 0){
    ans[x] &= s1.find((sub1[x] + MOD - tot1)%MOD) != s1.end();
    ans[x] &= s2.find((sub2[x] + MOD - tot2)%MOD) != s2.end();
    for(int i : g[x]){
        if(i == p) continue;
        int xx1 = sub1[x];
        int ii1 = sub1[i];
        (sub1[x] += MOD - (ll)sub1[i]*p1%MOD) %= MOD;
        (sub1[i] += (ll)sub1[x]*p1%MOD) %= MOD;
        int xx2 = sub2[x];
        int ii2 = sub2[i];
        (sub2[x] += MOD - (ll)sub2[i]*p2%MOD) %= MOD;
        (sub2[i] += (ll)sub2[x]*p2%MOD) %= MOD;
        dfs2(i, x);
        sub1[x] = xx1;
        sub1[i] = ii1;
        sub2[x] = xx2;
        sub2[i] = ii2;
    }
}

int main(){
    setIO();
    int n;
    cin >> n;
    pow1[0] = p1, pow2[0] = p2;
    for(int i = 1; i < n; i++){
        pow1[i] = (ll)pow1[i - 1]*p1%MOD;
        pow2[i] = (ll)pow2[i - 1]*p2%MOD;
        s1.insert(pow1[i]);
        s2.insert(pow2[i]);
    }
    s1.insert(p1);
    s2.insert(p2);
    for(int i = 0; i < n - 1; i++){
        int x;
        cin >> x;
        (tot1 += pow1[x]) %= MOD;
        (tot2 += pow2[x]) %= MOD;
    }
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs1(1);
    for(int i = 1; i <= n; i++) ans[i] = true;
    dfs2(1);
    vector<int> v;
    for(int i = 1; i <= n; i++) if(ans[i]) v.pb(i);
    sort(v.begin(), v.end());
    cout << v.size() << endl;
    for(int i : v) cout << i << " ";
    cout << endl;
}
```