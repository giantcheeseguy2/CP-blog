title: School Limits (Tutorial)
date: 1-1-2023
tag: cf, ad hoc, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/412294/problem/A)

## Solution

Looking at the subtasks, they can all be solved just by maintaining a set and doing some casework. In fact the entire problem can be solved by using many sets and doing casework.

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
    int n, k;
    cin >> n >> k;
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i];
    set<pii, greater<pii>> cur, nxt;
    set<int, greater<int>> in[n + 1], out[n + 1];
    int q;
    cin >> q;
    while(q--){
        int t, a, b;
        cin >> t >> a >> b;
        if(t == 1){
            if(cur.size() < k){
                if(in[a].size() < arr[a]){
                    cout << a << " " << b << endl;
                    cur.insert({b, a});
                    in[a].insert(b);
                } else {
                    if(b > *in[a].rbegin()){
                        out[a].insert(*in[a].rbegin());
                        cur.erase({*in[a].rbegin(), a});
                        in[a].erase(*in[a].rbegin());
                        in[a].insert(b);
                        cout << a << " " << b << endl;
                        cur.insert({b, a});
                    } else {
                        out[a].insert(b);
                    }
                }
            } else {
                if(b > (*cur.rbegin()).ff){
                    pii x = *cur.rbegin();
                    if(in[a].size() < arr[a]){
                        in[x.ss].erase(x.ff);
                        cur.erase(x);
                        nxt.insert(x);
                        while(out[x.ss].size()){
                            nxt.insert({*out[x.ss].begin(), x.ss});
                            out[x.ss].erase(out[x.ss].begin());
                        }
                        cout << a << " " << b << endl;
                        cur.insert({b, a});
                        in[a].insert(b);
                    } else {
                        if(b > *in[a].rbegin()){
                            out[a].insert(*in[a].rbegin());
                            cur.erase({*in[a].rbegin(), a});
                            in[a].erase(*in[a].rbegin());
                            cout << a << " " << b << endl;
                            cur.insert({b, a});
                            in[a].insert(b);
                        } else {
                            out[a].insert(b);
                        }
                    }
                } else {
                    if(in[a].size() < arr[a]) nxt.insert({b, a});
                    else out[a].insert(b);
                }
            }
        } else {
            if(cur.find({b, a}) != cur.end()){
                in[a].erase(b);
                cur.erase({b, a});
                while(out[a].size()){
                    nxt.insert({*out[a].begin(), a});
                    out[a].erase(out[a].begin());
                }
                while(nxt.size()){
                    pii x = *nxt.begin();
                    if(in[x.ss].size() < arr[x.ss]){
                        cout << x.ss << " " << x.ff << endl;
                        cur.insert(x);
                        in[x.ss].insert(x.ff);
                        nxt.erase(x);
                        break;
                    }
                    out[x.ss].insert(x.ff);
                    nxt.erase(x);
                }
            } else if(nxt.find({b, a}) != nxt.end()){
                nxt.erase({b, a});
            } else {
                out[a].erase(b);
            }
        }
    }
}
```