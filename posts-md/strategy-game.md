title: Strategy Game (Tutorial)
date: 11-14-2022
tag: loj, greedy, segtree, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/3890)

## Solution

If the second player has both negative and positive values, then the answer is always either negative or zero. The second player will obviously want to choose a value with the highest absolute value, while the first player wants to choose a value with the lowest absolute value. There are two cases depending on what sign value the first player chooses, so take the maximum. Similar casework can be applied to the other four cases.

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

struct Segtree {

    using T = pii;
    using L = pii;

    static T merge(T a, T b){
        return {min(a.ff, b.ff), max(a.ss, b.ss)};
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

int main(){
    setIO();
    freopen("game.in", "r", stdin);
    freopen("game.out", "w", stdout);
    int n, m, q;
    cin >> n >> m >> q;
    int arr1[n], arr2[m];
    for(int i = 0; i < n; i++) cin >> arr1[i];
    for(int i = 0; i < m; i++) cin >> arr2[i];
    int zer1[n + 1], zer2[m + 1];
    zer1[0] = zer2[0] = 0;
    for(int i = 1; i <= n; i++) zer1[i] = zer1[i - 1] + (arr1[i - 1] == 0);
    for(int i = 1; i <= m; i++) zer2[i] = zer2[i - 1] + (arr2[i - 1] == 0);
    vector<pii> p1, n1, p2, n2;
    for(int i = 0; i < n; i++){
        if(arr1[i] > 0) p1.pb({arr1[i], arr1[i]});
        else p1.pb({INF, -INF});
        if(arr1[i] < 0) n1.pb({arr1[i], arr1[i]});
        else n1.pb({INF, -INF});
    }
    for(int i = 0; i < m; i++){
        if(arr2[i] > 0) p2.pb({arr2[i], arr2[i]});
        else p2.pb({INF, -INF});
        if(arr2[i] < 0) n2.pb({arr2[i], arr2[i]});
        else n2.pb({INF, -INF});
    }
    Segtree pos1(p1), pos2(p2), neg1(n1), neg2(n2);
    while(q--){
        int l1, r1, l2, r2;
        cin >> l1 >> r1 >> l2 >> r2;
        l1--, r1--, l2--, r2--;
        bool a = zer1[r1 + 1] - zer1[l1] > 0, b = zer2[r2 + 1] - zer2[l2] > 0;
        pii p1 = pos1.query(l1, r1), n1 = neg1.query(l1, r1), p2 = pos2.query(l2, r2), n2 = neg2.query(l2, r2);
        if(n2.ff < 0 && p2.ss > 0){
            if(a) cout << 0 << endl;
            else {
                ll ans = -LLINF;
                if(p1.ss > 0) ans = max(ans, (ll)p1.ff*n2.ff);
                if(n1.ff < 0) ans = max(ans, (ll)n1.ss*p2.ss);
                cout << ans << endl;
            }
        } else {
            if(n1.ff < 0 && p1.ss > 0){
                if(b) cout << 0 << endl;
                else {
                    ll ans = LLINF;
                    if(p2.ss > 0) ans = min(ans, (ll)p1.ss*p2.ff);
                    if(n2.ff < 0 ) ans = min(ans, (ll)n1.ff*n2.ss);
                    cout << ans << endl;
                }
            } else {
                if(p1.ss > 0 && p2.ss > 0){
                    if(b) cout << 0 << endl;
                    else cout << (ll)p1.ss*p2.ff << endl;
                } else if(p1.ss > 0 && n2.ff < 0){
                    if(a) cout << 0 << endl;
                    else cout << (ll)p1.ff*n2.ff << endl;
                } else if(n1.ff < 0 && p2.ss > 0){
                    if(a) cout << 0 << endl;
                    else cout << (ll)n1.ss*p2.ss << endl;
                } else {
                    if(b) cout << 0 << endl;
                    else cout << (ll)n1.ff*n2.ss << endl;
                }
            }
        }
    }
}
```