title: Li Hua And Array (Tutorial)
date: 4-11-2023
tag: cf, segtree, tree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1797/problem/E)

## Solution

Looking at the nature of our operation, we see that it will most likely require a brute force to apply. So, lets see if the amount of times each index is changed is small. In fact, after checking with a brute force, we can see that the operation will be applied at most 25 times for each index before it goes to 1 and will no longer be operated on. So we can actually brute force update all the values that are not 1. Now, how do we check how many operations it takes to make all the values the same. Applying the operation on a value always makes it go to a smaller value, so we can actually model a tree on the values. Then, we can see that the answer for a range is always the distance from every value to their lca. Thus, as long as we maintain the lca of a range, merging becomes finding the lca of those two values. We should also maintain the sum of depths of each value, so we can find the total distance.

## Code

```c++
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse4,popcnt,abm,mmx,tune=native")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;
using namespace std;

#define pb push_back
#define ff first
#define ss second

#define int long long

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

const int MX = 5e6;
int phi[MX + 1];
int dist[MX + 1];

int sum[400005];
int seg[400005];
int arr[400005];

int lca(int a, int b){
    while(a != b){
        if(dist[a] > dist[b]) swap(a, b);
        b = phi[b];
    }
    return a;
}

int n, q;

void build(int l = 1, int r = n, int cur = 0){
    if(l == r){
        seg[cur] = arr[l];
        sum[cur] = dist[arr[l]];
        return;
    }
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    build(mid + 1, r, cur*2 + 2);
    seg[cur] = lca(seg[cur*2 + 1], seg[cur*2 + 2]);
    sum[cur] = sum[cur*2 + 1] + sum[cur*2 + 2];
}

void update(int x, int v, int l = 1, int r = n, int cur = 0){
    if(l == r){
        seg[cur] = v;
        sum[cur] = dist[v];
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, v, l, mid, cur*2 + 1);
    else update(x, v, mid + 1, r, cur*2 + 2);
    seg[cur] = lca(seg[cur*2 + 1], seg[cur*2 + 2]);
    sum[cur] = sum[cur*2 + 1] + sum[cur*2 + 2];
}

pii comb(pii a, pii b){
    return {lca(a.ff, b.ff), a.ss + b.ss};
}

pii query(int l, int r, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r) return {seg[cur], sum[cur]};
    int mid = (ul + ur)/2;
    if(r <= mid) return query(l, r, ul, mid, cur*2 + 1);
    if(l > mid) return query(l, r, mid + 1, ur, cur*2 + 2);
    return comb(query(l, r, ul, mid, cur*2 + 1), query(l, r, mid + 1, ur, cur*2 + 2));
}

signed main(){
    setIO();
    cin >> n >> q;
    for(int i = 1; i <= MX; i++) phi[i] = i;
    int mx = 0;
    for(int i = 2; i <= MX; i++){
        if(phi[i] == i){
            for(int j = i; j <= MX; j += i){
                phi[j] -= phi[j]/i;
            }
        }
        dist[i] = dist[phi[i]] + 1;
    }
    set<int> s;
    for(int i = 1; i <= n; i++){
        cin >> arr[i];
        if(arr[i] != 1){
            s.insert(i);
        }
    }
    build();
    while(q--){
        int t, l, r;
        cin >> t >> l >> r;
        if(t == 2){
            pii x = query(l, r);
            cout << x.ss - (r - l + 1)*dist[x.ff] << endl;
        } else {
            set<int>::iterator it = s.lower_bound(l);
            while(it != s.end() && *it <= r){
                arr[*it] = phi[arr[*it]];
                update(*it, arr[*it]);
                if(arr[*it] == 1) it = s.erase(it);
                else it++;
            }    
        }
    }
}
```