title: Tree Rotation (Tutorial)
date: 7-22-2022
tag: loj, segtree, segtree merge, tree

---

## Problem Statement

[Problem Link](https://loj.ac/p/2163)

## Solution

Since swapping two children of a node will never change the number of inversions outside of that node's subtree, it is always optimal to greedily swap whenever optimal. The \\(O(N log^2 N)\\) solution for this is trivial. Simply merge ordered sets small to large, then check how many inversions each element in the smaller set will cause if it is in front or behind the larger set. Then swap accordingly. The \\(O(N log N)\\) can be done using a similar idea using segtree merge. Every time you reach a leaf of the first set in the segtree, add the number of inversions if it would be in front or behind the second set.

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
    ios_base::sync_with_stdio(0);
    cin.tie(0);
}

int seg[10000005], left0[10000005], right0[10000005];
int n, sz = 1;
ll s1, s2, ans = 0;

void update(int x, int cur, int l = 1, int r = n) {
    if (l == r) {
        seg[cur] = 1;
        return;
    }

    int mid = (l + r) / 2;

    if (x <= mid)
        update(x, left0[cur] = sz++, l, mid);
    else
        update(x, right0[cur] = sz++, mid + 1, r);

    seg[cur] = seg[left0[cur]] + seg[right0[cur]];
}

int merge(int a, int b, int aa = 0, int bb = 0) {
    if (a == 0 || b == 0) {
        if (b == 0) {
            s1 += (ll)seg[a] * bb;
            s2 += (ll)seg[a] * aa;
        }

        return a ^ b;
    }

    right0[a] = merge(right0[a], right0[b], aa + seg[left0[b]], bb);
    left0[a] = merge(left0[a], left0[b], aa, bb + seg[right0[b]]);

    if (!left0[a] && !right0[a])
        seg[a] = seg[a] + seg[b];
    else
        seg[a] = seg[left0[a]] + seg[right0[a]];

    return a;
}

int dfs() {
    int t;
    cin >> t;

    if (t == 0) {
        int l = dfs(), r = dfs();
        s1 = s2 = 0;
        int ret = merge(l, r);
        ans += min(s1, s2);
        return ret;
    } else {
        int ret = sz++;
        update(t, ret);
        return ret;
    }
}

int main() {
    setIO();
    cin >> n;
    dfs();
    cout << ans << "\n";
}
```