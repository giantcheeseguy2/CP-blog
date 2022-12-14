title: Seqeunce (Tutorial)
date: 12-4-2022
tag: loj, segtree, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/504)

## Solution

Notice that we have enough time to just manually check the \\(x\\) smallest values in a range. If there were no updates, this could be done with priority queue, where each element will store a range and its minimum. This way, whenever we choose the smallest value, we can split its range into two, effectively removing it. It also gurantees us to always be able to choose the smallest value. Now, we just have to be able to maintain range min and range chmax. This can be done just using lazy tags and there is no need for segtree beats.

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

int n;
pii seg[2000005];
int tag[2000005];

void push_down(int x){
    for(int i = x*2 + 1; i <= x*2 + 2; i++){
        seg[i].ff = max(seg[i].ff, tag[x]);
        tag[i] = max(tag[i], tag[x]);
    }
}

void update(int l, int r, int v, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r){
        seg[cur].ff = max(seg[cur].ff, v);
        tag[cur] = max(tag[cur], v);
        return;
    }
    push_down(cur);
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
    seg[cur] = min(seg[cur*2 + 1], seg[cur*2 + 2]);
}

pii query(int l, int r, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r) return seg[cur];
    if(ul > r || ur < l) return {INF, INF};
    push_down(cur);
    int mid = (ul + ur)/2;
    return min(query(l, r, ul, mid, cur*2 + 1), query(l, r, mid + 1, ur, cur*2 + 2));
}

void build(int l = 1, int r = n, int cur = 0){
    if(l == r){
        seg[cur] = {0, l};
        return;
    }
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    build(mid + 1, r, cur*2 + 2);
}

int main(){
    setIO();
    cin >> n;
    build();
    for(int i = 1; i <= n; i++){
        int x;
        cin >> x;
        update(i, i, x);
    }
    int q;
    cin >> q;
    while(q--){
        int t;
        cin >> t;
        if(t == 1){
            int l, r, v;
            cin >> l >> r >> v;
            update(l, r, v);
        } else {
            int l, r, k, x;
            cin >> l >> r >> k >> x;
            priority_queue<pair<pii, pii>, vector<pair<pii, pii>>, greater<pair<pii, pii>>> que;
            que.push({query(l, r), {l, r}});
            vector<int> v;
            while(!que.empty()){
                auto st = que.top();
                que.pop();
                if(st.ff.ff >= k) break; 
                v.pb(st.ff.ff);
                if(v.size() == x) break;
                int mid = st.ff.ss;
                if(st.ss.ff < mid) que.push({query(st.ss.ff, mid - 1), {st.ss.ff, mid - 1}});
                if(st.ss.ss > mid) que.push({query(mid + 1, st.ss.ss), {mid + 1, st.ss.ss}});
            }
            if(v.size() < x) cout << -1;
            else for(int i : v) cout << i << " ";
            cout << endl;
        }
    }
}
```