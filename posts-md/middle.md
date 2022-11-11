title: Middle (Tutorial)
date: 7-26-2022
tag: luogu, persistent segtree, segtree, binary search, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/7AnJwV5ocB/contest/390595/problem/B)

## Solution

Lets try to find a binary solution. So now, we have to figure out how to check if a median that is \\(\\ge x\\) is possible or not. Lets change all the \\(a_i \\ge x\\) to \\(1\\), and all the \\(a_i \\le x\\) to \\(-1\\). If the sum of a subarray is greater than or equal to \\(0\\), then it is possible to have a median \\(\\ge x\\) in that subarray. Now, all we have to do is find the maximum right subarray from \\([a, b - 1]\\), sum of \\([b, c]\\), and maximum left subarray from \\([c + 1, d]\\) and check if their sum is \\(\\ge 0\\). To maintain this, we can use a persistent segtree with a different root for each value \\(x\\) with the corresponding \\(-1\\) and \\(1\\) values. Since each position is only changed at most once, we get \\(O(N log N)\\) build. The queries will take \\(O(N log^2 N)\\).

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

vector<int> dict;

int ind(int x){
    return lower_bound(dict.begin(), dict.end(), x) - dict.begin();
}

struct node {
    int sum;
    int lsum;
    int rsum;

    node(){
        sum = lsum = rsum = -INF;
    }

    node(int a, int b, int c){
        sum = a;
        lsum = b;
        rsum = c;
    }

};

node merge(node a, node b){
    if(a.sum == -INF) return b;
    if(b.sum == -INF) return a;
    return node(a.sum + b.sum, max({0, a.lsum, a.sum + b.lsum}), max({0, b.rsum, b.sum + a.rsum}));
}

node seg[10000000];
int left0[10000000], right0[10000000];
int n, sz = 1;

int copy(int x){
    seg[sz] = seg[x];
    left0[sz] = left0[x];
    right0[sz] = right0[x];
    return sz++;
}

void build(int cur, int l = 0, int r = n - 1){
    if(l == r){
        seg[cur].sum = seg[cur].rsum = seg[cur].lsum = 1;
        return;
    }
    int mid = (l + r)/2;
    build(left0[cur] = copy(left0[cur]), l, mid);
    build(right0[cur] = copy(right0[cur]), mid + 1, r);
    seg[cur] = merge(seg[left0[cur]], seg[right0[cur]]);
}

void update(int x, int cur, int l = 0, int r = n - 1){
    if(l == r){
        seg[cur].sum = -1;
        seg[cur].lsum = seg[cur].rsum = 0;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, left0[cur] = copy(left0[cur]), l, mid);
    else update(x, right0[cur] = copy(right0[cur]), mid + 1, r);
    seg[cur] = merge(seg[left0[cur]], seg[right0[cur]]);
}

node query(int l, int r, int cur, int ul = 0, int ur = n - 1){
    if(l <= ul && ur <= r) return seg[cur];
    if(ur < l || ul > r) return node();
    int mid = (ul + ur)/2;
    return merge(query(l, r, left0[cur], ul, mid), query(l, r, right0[cur], mid + 1, ur));
}

int main(){
    setIO();
    cin >> n;
    int arr[n];
    for(int i = 0; i < n; i++) cin >> arr[i], dict.pb(arr[i]);
    sort(dict.begin(), dict.end());
    dict.resize(unique(dict.begin(), dict.end()) - dict.begin());
    int rt[dict.size()];
    rt[0] = sz++;
    build(rt[0]);
    vector<int> occ[dict.size()];
    for(int i = 0; i < n; i++) occ[ind(arr[i])].pb(i);
    for(int i = 1; i < dict.size(); i++){
        rt[i] = copy(rt[i - 1]);
        for(int j : occ[i - 1]) update(j, rt[i]);
    }
    int q;
    cin >> q;
    int prv = 0;
    while(q--){
        int que[4];
        for(int i = 0; i < 4; i++) cin >> que[i], (que[i] += prv) %= n;
        sort(que, que + 4);
        int l = 0, r = dict.size() - 1;
        while(l < r){
            int mid = (l + r + 1)/2;
            node a = query(que[0], que[1] - 1, rt[mid]), b = query(que[1], que[2], rt[mid]), c = query(que[2] + 1, que[3], rt[mid]);
            if(a.rsum + b.sum + c.lsum >= 0) l = mid;
            else r = mid - 1;
        }
        node a = query(que[0], que[1] - 1, rt[l]), b = query(que[1], que[2], rt[l]), c = query(que[2] + 1, que[3], rt[l]);
        cout << (prv = dict[l]) << "\n";
    }
    }
```