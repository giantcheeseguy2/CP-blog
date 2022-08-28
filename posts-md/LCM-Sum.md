title: LCM Sum (Tutorial)
date: 8-27-2022
tag: codeforces, math, segtree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1712/problem/E2)

## Solution

The first observation is that the lcm of \\(i\\), \\(j\\), and \\(k\\) must be a multiple of \\(k\\). This leads us to a complementary counting solution where we want to count the number of invalid triples. Thanks to the property above, an invalid triple is either when \\(lcm(i, j, k) = k\\) or \\(lcm(i, j, k) = 2 \\cdot k\\) and \\(i + j \\ge k\\). The second case is easier, so lets solve it first. First of all, for \\(i + j \\ge k\\) to be true, \\(j > k/2\\) must also be true. To satisfy the other condition, \\(j\\) must divide \\(2k\\). Therefore, \\(j\\) can only be \\(2k/3\\) (\\(2k/2\\) is too big, \\(2k/4\\) is too small). Since \\(j\\) is determined, it means that \\(k/3 < i < 2k/3\\). Now, using the same logic as before, \\(i\\) is either \\(2k/5\\) or \\(k/2\\). So for the second case, the triples are either \\((k/2, 2k/3, k)\\) or \\((2k/5, 2k/3, k)\\). For the first case, the only condition is that \\(i\\) and \\(j\\) must divide \\(k\\). Since the entire triple must be nested in an interval to be valid, lets count the number of \\(j\\) for any pair \\(i\\) and \\(k\\). Now we can process the queries offline iterate over \\(k\\) and use a range sum data structure to store the number of triples with a given \\(i\\).

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

const int MX = 2e5;

vector<pii> que[MX + 1];
vector<int> fact[MX + 1];
ll bit[MX + 1];

void update(int x, int v){
    for(; x <= MX; x += x & (-x)) bit[x] += v;
}

ll query(int x, ll ret = 0){
    for(; x; x -= x & (-x))  ret += bit[x];
    return ret;
}

int main(){
    setIO();
    int q;
    cin >> q;
    ll ans[q];
    for(int i = 0; i < q; i++){
        int l, r;
        cin >> l >> r;
        que[r].pb({l, i});
    }
    for(int i = 1; i <= MX; i++){
        for(int j = 2*i; j <= MX; j += i){
            fact[j].pb(i);
        }
    }
    ll sum = 0;
    for(int i = 1; i <= MX; i++){
        for(int j = 0; j < fact[i].size(); j++){
            update(fact[i][j], fact[i].size() - j - 1);
            sum += fact[i].size() - j - 1;
        }
        if(i%6 == 0) update(i/2, 1), sum++;
        if(i%15 == 0) update(2*i/5, 1), sum++;
        for(pii j : que[i]){
            ll l = j.ff, r = i;
            ll len = r - l + 1;
            ans[j.ss] = len*(len - 1)*(len - 2)/6 - (sum - query(j.ff - 1));
        }
    }
    for(int i = 0; i < q; i++) cout << ans[i] << endl;
}
```