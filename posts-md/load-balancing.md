title: Load Balancing (Tutorial)
date: 8-15-2022
tag: usaco, segtree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=624)

## Solution

Finding the minimum maximum immediately suggests a binary search solution, so how can we check the value? Lets say we are checking if \\(m\\) is valid. First of all, lets fix a line. Whenever we move the line, some cows move from one group to another, which amortizes to \\(O(N)\\). Now, we have two sets of points on a number line, and we want to find a way to split both sets into two groups that have at most some \\(m\\) points. First of all, it is always optimal to put the line at the first position where the first half of both groups has at most \\(m\\) points. Now, it just comes down to checking if that position splits it equally enough. This can be maintained with a segtree.

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

vector<int> xdict, ydict;

int xind(int x){
    return lower_bound(xdict.begin(), xdict.end(), x) - xdict.begin();
}

int yind(int x){
    return lower_bound(ydict.begin(), ydict.end(), x) - ydict.begin();
}

int seg[1000000][2];
int val[100005];

void build(int l = 0, int r = ydict.size() - 1, int cur = 0){
    if(l == r){
        seg[cur][0] = 0;
        seg[cur][1] = val[l];
        return;
    }
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    build(mid + 1, r, cur*2 + 2);
    seg[cur][0] = seg[cur*2 + 1][0] + seg[cur*2 + 2][0];
    seg[cur][1] = seg[cur*2 + 1][1] + seg[cur*2 + 2][1];
}

void flip(int x, int l = 0, int r = ydict.size() - 1, int cur = 0){
    if(l == r){
        seg[cur][1]--;
        seg[cur][0]++;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) flip(x, l, mid, cur*2 + 1);
    else flip(x, mid + 1, r, cur*2 + 2);
    seg[cur][0] = seg[cur*2 + 1][0] + seg[cur*2 + 2][0];
    seg[cur][1] = seg[cur*2 + 1][1] + seg[cur*2 + 2][1];
}

int walk(int x, int t, int l = 0, int r = ydict.size() - 1, int cur = 0){
    if(l == r) return l - (seg[cur][t] > x);
    int mid = (l + r)/2;
    if(seg[cur*2 + 1][t] <= x) return walk(x - seg[cur*2 + 1][t], t, mid + 1, r, cur*2 + 2);
    else return walk(x, t, l, mid, cur*2 + 1);
}

int query(int l, int r, int t, int ul = 0, int ur = ydict.size() - 1, int cur = 0){
    if(l <= ul && ur <= r) return seg[cur][t];
    if(ur < l || ul > r) return 0;
    int mid = (ul + ur)/2;
    return query(l, r, t, ul, mid, cur*2 + 1) + query(l, r, t, mid + 1, ur, cur*2 + 2);
}

int main(){
    setIO();
    freopen("balancing.in", "r", stdin);
    freopen("balancing.out", "w", stdout);
    int n;
    cin >> n;
    pii arr[n];
    for(int i = 0; i < n; i++){
        cin >> arr[i].ff >> arr[i].ss;
        xdict.pb(arr[i].ff);
        ydict.pb(arr[i].ss);
    }
    ydict.pb(-INF);
    ydict.pb(INF);
    sort(xdict.begin(), xdict.end());
    sort(ydict.begin(), ydict.end());
    xdict.resize(unique(xdict.begin(), xdict.end()) - xdict.begin());
    ydict.resize(unique(ydict.begin(), ydict.end()) - ydict.begin());
    vector<int> in[xdict.size()];
    for(int i = 0; i < n; i++){
        arr[i].ff = xind(arr[i].ff);
        arr[i].ss = yind(arr[i].ss);
        in[arr[i].ff].pb(arr[i].ss);
        val[arr[i].ss]++;
    }
    int l = n/4, r = n;
    while(l < r){
        int mid = (l + r)/2;
        bool val = false;
        for(int i = 0; i < 4*ydict.size(); i++) seg[i][0] = seg[i][1] = 0;
        build();
        for(int i = 0; i < xdict.size(); i++){
            int tar = min(walk(mid, 0), walk(mid, 1));
            if(query(tar + 1, ydict.size() - 1, 0) <= mid && query(tar + 1, ydict.size() - 1, 1) <= mid){
                val = true;
                break;
            }
            for(int j : in[i]) flip(j);
        }
        int tar = min(walk(mid, 0), walk(mid, 1));
        if(query(tar + 1, ydict.size(), 0) <= mid && query(tar + 1, ydict.size(), 1) <= mid) val = true;
        if(val) r = mid;
        else l = mid + 1;
    }
    cout << l << endl;
}
```