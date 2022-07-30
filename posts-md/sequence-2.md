title: Sequence 2 (Tutorial)
date: 7-23-2022
tag: hdu, persistent segtree, segtree, tutorial

---

## Problem Statement

[Problem Link](https://acm.hdu.edu.cn/showproblem.php?pid=5919)

## Solution

First lets come up with a \\(O(N log^2 N)\\) solution. This can be done with range distinct value query and binary search. If we can maintain a segtree of the first position of each distinct value, then walking on segtree yields a \\(O(N log N)\\) solution. Lets make try to do this backwards. The segtree at position \\(L\\) will store the first position of every distinct value coming after \\(L\\). Since at most two values will change when going to \\(L\\) to \\(L - 1\\), we can use a persistent segtree to maintain this. 

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

int seg[10000000], left0[10000000], right0[10000000];
int n, q, sz;

int copy(int x){
    seg[sz] = seg[x];
    left0[sz] = left0[x];
    right0[sz] = right0[x];
    return sz++;
}

void update(int x, int v, int cur, int l = 1, int r = n){
    if(l == r){
        seg[cur] += v;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, v, left0[cur] = copy(left0[cur]), l, mid);
    else update(x, v, right0[cur] = copy(right0[cur]), mid + 1, r);
    seg[cur] = seg[left0[cur]] + seg[right0[cur]];
}

int query(int l, int r, int cur, int ul = 1, int ur = n){
    if(l <= ul && ur <= r) return seg[cur];
    if(ul > r || ur < l) return 0;
    int mid = (ul + ur)/2;
    return query(l, r, left0[cur], ul, mid) + query(l, r, right0[cur], mid + 1, ur);
}

int find(int x, int cur, int l = 1, int r = n){
    if(l == r) return l;
    int mid = (l + r)/2;
    if(x <= seg[left0[cur]]) return find(x, left0[cur], l, mid);
    return find(x - seg[left0[cur]], right0[cur], mid + 1, r);
}

int prv[200005], arr[200005], rt[200005];

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        cin >> n >> q;
        for(int i = 1; i <= n; i++) cin >> arr[i], prv[arr[i]] = 0;
        rt[n + 1] = 0;
        sz = 1;
        for(int i = n; i >= 1; i--){
            rt[i] = copy(rt[i + 1]);
            if(prv[arr[i]]) update(prv[arr[i]], -1, rt[i]);
            update(i, 1, rt[i]);
            prv[arr[i]] = i;
        }
        cout << "Case #" << tt << ": ";
        int ans = 0;
        while(q--){
            int l, r;
            cin >> l >> r;
            l = (l + ans)%n + 1;
            r = (r + ans)%n + 1;
            if(l > r) swap(l, r);
            int tar = ceil0(query(l, r, rt[l]), 2);
            cout << (ans = find(tar, rt[l]));
            if(q) cout << " ";
        }
        cout << "\n";
    }
}
```