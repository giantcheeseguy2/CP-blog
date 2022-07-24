title: Rain (Tutorial)
date: 7-24-2022
tag: codeforces, segtree, sweep

---

## Problem

[Problem Link](https://codeforces.com/contest/1711/problem/D)

## Solution

First make the observation that the largest value will always lie on a peak of an update. This is intuitive. After this, we have reduced the number of potential points from \\(10^9\\) to just \\(2\\cdot10^5\\). Now, lets break up each update into two parts:
- \\(x_i \\ge j\\)
- \\(x_i < j\\)

If \\(x_i \\ge j\\), then the accumulation will be \\(p_i - x_i + j\\), otherwise the accumulation will be \\(p_i + j - x_i\\). To make sure that negative accumulation isn't added, for the \\(x_i \\ge j\\) case, only consider values with \\(p_i - x_i \\ge -j\\), and for the other case, only consider values with \\(p_i - x_i \\ge j\\). Therefore, the final values can be found using a two sweeps. Now, to find the answer, maintain a segtree of the maximum value of a range. Now for each update peak, find all the peaks it affects that are to its left and right. For the left case, all values  in the updated range must satisfy \\(val_j - j \\le m + p_i - x_i\\). For the right case, all values must satisfy \\(val_j + j \\le m + p_i - x_i\\). All values outside of the range also have to be \\(\\le M\\).

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

struct Segtree {

    using T = long long;
    using L = long long;

    static T merge(T a, T b){
        return max(a, b);
    }

    static void apply(T &a, L v, int x){
        a = v;
    }

    int n;
    vector<T> seg;

    void build(const vector<T> &v, int l, int r, int cur){
        if(l == r){
            seg[cur] = v[l];
            return;
        }
        int mid = (l + r)/2;
        build(v, l, mid, cur*2 + 1);
        build(v, mid + 1, r, cur*2 + 2);
        seg[cur] = merge(seg[cur*2 + 1], seg[cur*2 + 2]);
    }

    void update(int x, L v, int l, int r, int cur){
        if(l == x && x == r){
            apply(seg[cur], v, x);
            return;
        }
        int mid = (l + r)/2;
        if(x <= mid) update(x, v, l, mid, cur*2 + 1);
        else update(x, v, mid + 1, r, cur*2 + 2);
        seg[cur] = merge(seg[cur*2 + 1], seg[cur*2 + 2]);
    }

    T query(int l, int r, int ul, int ur, int cur){
        if(l <= ul && ur <= r) return seg[cur];
        int mid = (ul + ur)/2;
        if(r <= mid) return query(l, r, ul, mid, cur*2 + 1);
        if(l > mid) return query(l, r, mid + 1, ur, cur*2 + 2);
        return merge(query(l, r, ul, mid, cur*2 + 1), query(l, r, mid + 1, ur, cur*2 + 2));
    }

    Segtree(){

    }

    Segtree(const vector<T> &v){
        n = v.size();
        int sz = 1;
        while(sz < n) sz *= 2;
        seg.resize(2*sz);
        build(v, 0, n - 1, 0);
    } 

    Segtree(int _n, T v){
        n = _n;
        int sz = 1;
        while(sz < n) sz *= 2;
        seg.resize(2*sz);
        vector<T> tmp(n, v);
        build(tmp, 0, n - 1, 0);
    }

    T query(int l, int r){
        return query(l, r, 0, n - 1, 0);
    }

    void update(int x, L v){
        update(x, v, 0, n - 1, 0);
    }

};

int n, m;
ll bit[1000005][2];
ll cnt[1000005][2];
vector<ll> dict;

void update(int x, ll v, int ind){
    for(; x <= dict.size(); x += x & (-x)) bit[x][ind] += v;
}

ll query(int x, int ind, ll ret = 0){
    for(; x; x -= x & (-x)) ret += bit[x][ind];
    return ret;
}

void upd(int x, int ind){
    for(; x <= dict.size(); x += x & (-x)) cnt[x][ind]++;
}

ll que(int x, int ind, ll ret = 0){
    for(; x; x -= x & (-x)) ret += cnt[x][ind];
    return ret;
}

int ind(ll x){
    return lower_bound(dict.begin(), dict.end(), x) - dict.begin();
}

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        cin >> n >> m;
        pll arr[n];
        dict.clear();
        for(int i = 0; i < n; i++){
            cin >> arr[i].ff >> arr[i].ss;
            dict.pb(arr[i].ff);
            dict.pb(arr[i].ss + arr[i].ff);
            dict.pb(arr[i].ss - arr[i].ff);
            dict.pb(-arr[i].ff);
        }
        sort(dict.begin(), dict.end());
        dict.resize(unique(dict.begin(), dict.end()) - dict.begin());
        for(int i = 1; i <= dict.size(); i++) cnt[i][0] = cnt[i][1] = bit[i][0] = bit[i][1] = 0;
        vector<pll> in[dict.size()];
        for(int i = 0; i < n; i++) in[ind(arr[i].ff)].pb(arr[i]);
        vector<ll> v1(dict.size(), 0), v2(dict.size(), 0);
        for(int i = 0; i < dict.size(); i++){
            for(pll j : in[i]){
                update(ind(j.ss + j.ff) + 1, j.ss + j.ff, 0);
                upd(ind(j.ss + j.ff) + 1, 0);
            }
            v1[i] += query(dict.size(), 0) - query(ind(dict[i]), 0) - dict[i]*(que(dict.size(), 0) - que(ind(dict[i]), 0));
        }
        for(int i = dict.size() - 1; i >= 0; i--){
            v1[i] += query(dict.size(), 1) - query(ind(-dict[i]), 1) + dict[i]*(que(dict.size(), 1) - que(ind(-dict[i]), 1));
            for(pll j : in[i]){
                update(ind(j.ss - j.ff) + 1, j.ss - j.ff, 1);
                upd(ind(j.ss - j.ff) + 1, 1);
            }
        }
        int pre[dict.size() + 1];
        pre[0] = 0;
        for(int i = 0; i < dict.size(); i++){
            pre[i + 1] = pre[i] + (v1[i] > m);
            v2[i] = v1[i] + dict[i];
            v1[i] = v1[i] - dict[i];
        }
        Segtree s1(v1), s2(v2);
        for(int i = 0; i < n; i++){
            int l = ind(arr[i].ff - arr[i].ss);
            int r = ind(arr[i].ff + arr[i].ss);
            int cur = ind(arr[i].ff);
            bool ans = s1.query(l, cur) > m + arr[i].ss - arr[i].ff || s2.query(cur, r) > m + arr[i].ss + arr[i].ff;
            ans |= pre[l] > 0 || pre[dict.size()] - pre[r] > 0;
            cout << (ans ? 0 : 1);
        }
        cout << endl;
    }
}
```