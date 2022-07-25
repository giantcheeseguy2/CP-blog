title: Missing Coin Sum Queries (Tutorial)
date: 7-25-2022
tag: cses, persistent segtree, segtree

---

## Problem Statement

[Problem Link](https://cses.fi/problemset/task/2184/)

## Solution

Lets first try to solve a simpler version of this problem, where you are solving this with only one query. In that case you can just go from the smallest value to the largest value while maintaining the answer. If the next value is less than or equal to the answer, then u can increment the answer by that value. This works because \\(1, 2, ..., ans - 1\\) are all achievable, so adding a value \\(a_i\\) would result in \\(1, 2, ..., ans + a_i - 1\\) all being reachable. Now, lets solve for the full solution. Let say \\(ans_i\\) is the answer after the \\(i\\)th transition. Then, \\(ans_i = ans_{i - 1} + \\sum_{j=ans_{i - 1} + 1}^{a_i} cnt_j * j\\). If the sum is zero, then \\(ans_i\\) is the final answer. Additionally, if the sum is non-zero, it is always greater than \\(ans_{i - 1}\\). Therefore, \\(ans_i > 2*ans_{i - 1}\\). So the answer will transition at most \\(log \\sum x_i\\) times. Now all we need is to maintain a range sum for every interval which can be done with persistent segtree. This gives a final complexity of \\(O(log N \cdot log \\sum x_i)\\) per query.

## Code

```c++
//https://cses.fi/problemset/result/4300700/
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

ll seg[10000000];
int left0[10000000], right0[10000000], sz = 1;
vector<int> dict;

int copy(int x){
    seg[sz] = seg[x];
    left0[sz] = left0[x];
    right0[sz] = right0[x];
    return sz++;
}

void update(int x, int v, int cur, int l = 0, int r = dict.size() - 1){
    if(l == r){
        seg[cur] += v;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, v, left0[cur] = copy(left0[cur]), l, mid);
    else update(x, v, right0[cur] = copy(right0[cur]), mid + 1, r);
    seg[cur] = seg[left0[cur]] + seg[right0[cur]];
}

ll query(int l, int r, int a, int b, int ul = 0, int ur = dict.size() - 1){
    if(l <= ul && ur <= r) return seg[b] - seg[a];
    if(ur < l || ul > r) return 0;
    int mid = (ul + ur)/2;
    return query(l, r, left0[a], left0[b], ul, mid) + query(l, r, right0[a], right0[b], mid + 1, ur);
}

int lb(int x){
    return lower_bound(dict.begin(), dict.end(), x) - dict.begin();
}

int ub(int x){
    return upper_bound(dict.begin(), dict.end(), x) - dict.begin();
}

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i], dict.pb(arr[i]);
    sort(dict.begin(), dict.end());
    dict.resize(unique(dict.begin(), dict.end()) - dict.begin());
    int rt[n + 1];
    rt[0] = 0;
    for(int i = 1; i <= n; i++){
        rt[i] = copy(rt[i - 1]);
        update(lb(arr[i]), arr[i], rt[i]);
    }
    while(q--){
        int l, r;
        cin >> l >> r;
        ll prv = 1, cur = 1;
        while(prv <= cur){
            ll nxt = query(lb(prv), ub(cur) - 1, rt[l - 1], rt[r]);
            prv = cur + 1;
            cur += nxt;
        }
        cout << cur << "\n";
    }
}
```