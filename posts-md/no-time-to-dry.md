title: No Time To Dry (Tutorial)
date: 9-16-2022
tag: usaco, segtree, pst, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1116)

## Solution

A subsegment of a color contributes \\(1\\) to the answer if between itself and the next subsegment of that same color, there is a smaller color. This makes queries a bit tricky, since we would have to remove all subsegments after \\(r\\), so lets process the queries offline. Next, lets store if a subsegment contributes to the answer at the index of the last element in the subsegment to accurately count the contribution of each subsegment. Whenever we add a new color, we will remove \\(1\\) from its previous occurence if there are no elements smaller than itself, otherwise we do nothing. This can be maintained with a pst or monotonic stack.

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

int seg[10000000], left0[10000000], right0[10000000], sz = 1;
int n, q;

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

int bit[200005];

void upd(int x, int v){
    for(; x <= n; x += x & (-x)) bit[x] += v;
}

int que(int x, int ret = 0){
    for(; x; x -= x & (-x)) ret += bit[x];
    return ret;
}

int query(int rt1, int rt2, int l, int r, int ul = 1, int ur = n){
    if(l > r) return 0;
    if(l <= ul && ur <= r) return seg[rt2] - seg[rt1];
    int mid = (ul + ur)/2;
    if(r <= mid) return query(left0[rt1], left0[rt2], l, r, ul, mid);
    if(l > mid) return query(right0[rt1], right0[rt2], l, r, mid + 1, ur);
    return query(left0[rt1], left0[rt2], l, r, ul, mid) + query(right0[rt1], right0[rt2], l, r, mid + 1, ur);
}

int main(){
    setIO();
    cin >> n >> q;
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i];
    vector<pii> in[n + 1];
    for(int i = 0; i < q; i++){
        int a, b;
        cin >> a >> b;
        in[b].pb({a, i});
    }
    int rt[n + 1];
    rt[0] = 0;
    int prv[n + 1];
    memset(prv, -1, sizeof(prv));
    int ans[q];
    for(int i = 1; i <= n; i++){
        rt[i] = copy(rt[i - 1]);
        update(arr[i], 1, rt[i]);
        if(prv[arr[i]] != -1 && !query(rt[prv[arr[i]] - 1], rt[i], 1, arr[i] - 1)) upd(prv[arr[i]], -1);
        prv[arr[i]] = i;
        upd(i, 1);
        for(pii j : in[i]) ans[j.ss] = que(i) - que(j.ff - 1);
        //for(int j = 1; j <= n; j++) cout << que(j) - que(j - 1) << " ";
        //cout << endl;
    }
    for(int i = 0; i < q; i++) cout << ans[i] << "\n";
}
```