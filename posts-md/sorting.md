title: Sorting (Tutorial)
date: 7-22-2022
tag: luogu, segtree, segtree merge, chtholly tree

---

## Problem Statement

[Problem Link](https://www.luogu.com.cn/problem/P2824)

## Solution

This is a template segtree merge problem. Maintain a set of inc/dec intervals. In each interval maintain a segtree that represents the set of numbers that are contained within that interval, as well as a value indicating if the interval is sorted forwards or backwards. When sorting an interval, we want to split the intervals that intersect it, then merge everything together. Merging is easy, as it is just merging segment trees. Splitting is also easy, there is just some casework on whether the interval being split is sorted or not. Every query will split at most twice, and every interval will only be merged once, making the total complexity \\(O(N log N)\\).

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

int n, q;
int seg[10000000], left0[10000000], right0[10000000], sz = 1;

int newnode(){
    return sz++;
}

void update(int x, int cur, int l = 1, int r = n){
    if(l == r){
        seg[cur]++;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, left0[cur] = sz++, l, mid);
    else update(x, right0[cur] = sz++, mid + 1, r);
    seg[cur] = seg[left0[cur]] + seg[right0[cur]];
}

//merges a and b
int merge(int a, int b){
    if(a == 0 || b == 0) return a ^ b;  
    //merge left and right subtrees
    left0[a] = merge(left0[a], left0[b]);
    right0[a] = merge(right0[a], right0[b]);
    if(!left0[a] == 0 && !right0[a]) seg[a] = seg[a] + seg[b]; //merge if its a leaf
    else seg[a] = seg[left0[a]] + seg[right0[a]]; //pull if its not a leaf
    return a;
}

//after the split, x will contain the first k values
//returns a new segtree containing the rest
int split(int x, int k){
    int ret = newnode();
    if(seg[left0[x]] < k) right0[ret] = split(right0[x], k - seg[left0[x]]); //everything in left child will be kept, split down right
    else right0[ret] = right0[x], right0[x] = 0; //everything in right child will be split
    if(k < seg[left0[x]]) left0[ret] = split(left0[x], k); //everything in the right child will be split, split down left
    //update new values
    seg[ret] = seg[x] - k;
    seg[x] = k;
    return ret;
}

int query(int x, int l = 1, int r = n){
    if(l == r) return l;
    int mid = (l + r)/2;
    if(left0[x]) return query(left0[x], l, mid);
    else return query(right0[x], mid + 1, r);
}
    
set<pair<pii, pii>> s;

void upd(int l, int r){
    pair<pii, pii> a = *prev(s.lower_bound({{l + 1, -1}, {-1, -1}}));
    if(a.ff.ff < l){
        s.erase(a);
        int nw = (a.ss.ss == 0 ? split(a.ss.ff, l - a.ff.ff) : split(a.ss.ff, seg[a.ss.ff] - (l - a.ff.ff)));
        if(!a.ss.ss) swap(nw, a.ss.ff);
        s.insert({{a.ff.ff, l - 1}, {nw, a.ss.ss}});
        s.insert({{l, a.ff.ss}, {a.ss.ff, a.ss.ss}});
    }
    pair<pii, pii> b = *prev(s.lower_bound({{r + 1, -1}, {-1, -1}}));
    if(b.ff.ss > r){
        s.erase(b);
        int nw = (b.ss.ss == 0 ? split(b.ss.ff, seg[b.ss.ff] - (b.ff.ss - r)) : split(b.ss.ff, b.ff.ss - r));
        if(b.ss.ss) swap(nw, b.ss.ff);
        s.insert({{r + 1, b.ff.ss}, {nw, b.ss.ss}});
        s.insert({{b.ff.ff, r}, {b.ss.ff, b.ss.ss}});
    }
}

int main(){
    setIO();
    cin >> n >> q;
    for(int i = 1; i <= n; i++){
        int x;
        cin >> x;
        int rt = sz++;
        update(x, rt);
        s.insert({{i, i}, {rt, 0}});
    }
    while(q--){
        int t, l, r;
        cin >> t >> l >> r;
        upd(l, r);
        int rt = 0;
        set<pair<pii, pii>>::iterator it = s.lower_bound({{l, -1}, {-1, -1}});
        while(it != s.end() && (*it).ff.ss <= r){
            rt = merge(rt, (*it).ss.ff);
            it = s.erase(it);
        }
        s.insert({{l, r}, {rt, t}});
    } 
    int pos;
    cin >> pos;
    upd(pos, pos) ;
    auto ans = *s.lower_bound({{pos, -1}, {-1, -1}});
    cout << query(ans.ss.ff) << endl;
}
```