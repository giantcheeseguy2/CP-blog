title: Balance (Tutorial)
date: 12-3-2022
tag: cf, brute force, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1732/D2)

## Solution

If there were no deletions, we can just run a brute force with a bit of memorization. If we just store the previous answer for every \\(k\\), then the total amount covered should be at most \\(N log N\\), since the worst case would be a harmonic series. To extend this for the full solution, we have to somehow support deletions. Deletions would break the amortize, so for every \\(k\\) that we have processed before, we should also store a set of all deleted values that are a multiple of it. This way, deletions won't change the amount of times that we iterate per \\(k\\). We know that the amount of nodes that we update per deletion is bounded (it probably will run in time).
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
    int q;
    cin >> q;
    map<ll, ll> nxt;
    map<ll, bool> vis;
    map<ll, vector<ll>> child;
    map<ll, set<ll>> ans;
    vis[0] = true;
    while(q--){
        char t;
        cin >> t;
        ll x;
        cin >> x;
        if(t == '+'){
            vis[x] = true;
            for(ll i : child[x]) ans[i].erase(x);
        } else if(t == '-'){
            vis[x] = false;
            for(ll i : child[x]) ans[i].insert(x);
        } else {
            if(ans[x].size()) cout << *ans[x].begin() << endl;
            else {
                ll cur = nxt[x];
                while(vis[cur]){
                    cur += x;
                    child[cur].pb(x);
                }
                nxt[x] = cur;
                cout << cur << endl;
            }
        }
    }
}
```