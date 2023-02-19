title: Hanabi (Tutorial)
date: 2-4-2023
tag: xyd, segtree, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/37/problem/176)

## Solution

If there was no extra swap, then the answer would just be the number of inversions, since we know the minimum number of adjacent swaps to sort an array is just the number of inversions. Thus, we want to find an extra swap that just minimizes the number of inversions after the swap. Lets see what doing a swap actually does. If we swap two elements at indeces \\(l\\) and \\(r\\), we can see that the only inversions that can possibly change are the ones in the interval \\([l, r]\\). Then the change in inversions is going to be the amount of numbers in the range \\([h_l, h_r]\\). This also lets us assume that \\(h_l < h_r\\) and implies that whatever pair we take, \\(h_l\\) should be some prefix maximum and \\(h_r\\) should be some suffix minimum, since extending it would always be better. It seems hard to fix the right endpoint of our swap, since the amount per interval changes based on our left endpoint. Instead, lets see if we can count the contribution of a single index to all the intervals \\([l, r]\\) that cover it. Since we know that we only care about intervals that are a prefix max and suffix min, if we only consider those positions, then we can see a index will contribute to some continous segment of prefixes maxes and suffix mins. This is the same as doing a 2d rectangle add to those points, where a coordinate represents \\((l, r)\\). The x coordinates covered by index \\(i\\) is just the range of \\([prv_i + 1, i - 1]\\), where \\(prv_i\\) is the last position where \\(h_i > pre_{prv_i}\\). Similarly, the y coordinates covered is the range \\([i + 1, nxt_i - 1]\\), where \\(nxt_i\\) is the next position where \\(h_i < suf_{nxt_i}\\). \\(pre\\) and \\(suf\\) are the prefix maxes and suffix mins respectively. 
After this, the maximum number of reduced inversions is just the maximum value over all points. This can be done using a segtree that only considers relevant y coordinates. Then, we just query for each relevant x coordinate to find the number of inversions reduced by the best swap. Note that each \\(i\\) will contribute \\(2\\) reduced inversions to all intervals that cover it, and there is an extra contribution from the original pair \\((l, r)\\).

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

int n;
int bit[300005];

void upd(int x, int v){
    for(; x <= n; x += x & (-x)) bit[x] += v;
}

int que(int x, int ret = 0){
    for(; x; x -= x & (-x)) ret += bit[x];
    return ret;
}

pii seg[2000000];
int tag[2000000];
int pre[300005], suf[300005];
int arr[300005];

void push_down(int cur){
    if(tag[cur] == 0) return;
    for(int i = cur*2 + 1; i <= cur*2 + 2; i++){
        seg[i].ff += tag[cur];
        tag[i] += tag[cur];
    }
    tag[cur] = 0;
}

void update(int l, int r, int v, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r){
        seg[cur].ff += v;
        tag[cur] += v;
        return;
    }
    push_down(cur);
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
    seg[cur] = max(seg[cur*2 + 1], seg[cur*2 + 2]);
}

pii query(int l, int r, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r) return seg[cur];
    push_down(cur);
    int mid = (ul + ur)/2;
    if(r <= mid) return query(l, r, ul, mid, cur*2 + 1);
    if(l > mid) return query(l, r, mid + 1, ur, cur*2 + 2);
    return max(query(l, r, ul, mid, cur*2 + 1), query(l, r, mid + 1, ur, cur*2 + 2));
}

void build(int l = 1, int r = n, int cur = 0){
    if(l == r){
        seg[cur] = {(suf[l] != arr[l])*-INF, l};
        return;
    }
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    build(mid + 1, r, cur*2 + 2);
    seg[cur] = max(seg[cur*2 + 1], seg[cur*2 + 2]);
}

int sta[300005][2];

void insertmx(int x, int v){
    for(; x <= n; x += x & (-x)) sta[x][0] = max(sta[x][0], v);
}

void insertmn(int x, int v){
    for(; x <= n; x += x & (-x)) sta[x][1] = min(sta[x][1], v);
}

int querymx(int x, int ret = 0){
    for(; x; x -= x & (-x)) ret = max(ret, sta[x][0]);
    return ret;
}

int querymn(int x, int ret = n + 1){
    for(; x; x -= x & (-x)) ret = min(ret, sta[x][1]);
    return ret;
}

int main(){
    setIO();
    cin >> n;
    for(int i = 1; i <= n; i++) cin >> arr[i];
    bool all = true;
    for(int i = 2; i <= n; i++) all &= arr[i] > arr[i - 1];
    if(all){
        cout << 0 << endl;
        return 0;
    }
    pii s[n + 1];
    int prv[n + 1], nxt[n + 1];
    pre[0] = 0;
    for(int i = 1; i <= n; i++) sta[i][0] = 0, sta[i][1] = n + 1;
    for(int i = 1; i <= n; i++){
        prv[i] = querymx(arr[i]);
        pre[i] = max(pre[i - 1], arr[i]);
        insertmx(pre[i], i);
    }
    suf[n + 1] = INF;
    for(int i = n; i >= 1; i--){
        nxt[i] = querymn(n - arr[i] + 1);
        suf[i] = min(suf[i + 1], arr[i]);
        insertmn(n - suf[i] + 1, i);
    }
    vector<pii> in[n + 1], out[n + 1];
    for(int i = 1; i <= n; i++){
        if(prv[i] + 1 < i && i < nxt[i] - 1){
            in[prv[i] + 1].pb({i + 1, nxt[i] - 1});
            out[i - 1].pb({i + 1, nxt[i] - 1});
        }
    }
    pair<int, pii> sub = {0, {0, 0}};
    build();
    for(int i = 1; i < n; i++){
        for(auto j : in[i]) update(j.ff, j.ss, 1);
        pii tar = query(i + 1, n);
        if(arr[i] > arr[tar.ss] && arr[i] == pre[i]){
            sub = max(sub, {tar.ff, {i, tar.ss}});
        }
        for(auto j : out[i]) update(j.ff, j.ss, -1);
    }
    ll ans = 0;
    for(int i = n; i >= 1; i--){
        ans += que(arr[i]);
        upd(arr[i], 1);
    }
    cout << ans - 2*sub.ff << endl;
}
```