title: Why Did The Cow Cross The Road (Tutorial)
date: 9-1-2022
tag: usaco, segtree, inversions, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=720)

## Solution

First, notice that when rotating moving the last value to the front, only the number of intersections of the last value will change, so we only have to recompute that value. Thus, rotating can be done in constant time. Now, we just have to figure out the number of intersections in the beginning. Notice two breeds \\(a_i\\) and \\(a_j\\) intersect when \\(s_{a_i} < s_{a_j}\\) and \\(t_{a_i} > t_{a_j}\\), where \\(s_i\\) is the position of \\(i\\) in the first group and \\(t_i\\) is the position of the \\(i\\) in the second group. Now, the problem has been reduced to counting inversions with \\(s\\) and \\(t\\) as dimensions.

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

int bit[100005];
int n;

void update(int x, int v){
    for(; x <= n; x += x & (-x)) bit[x] += v;
}

int query(int x, int ret = 0){
    for(; x; x -= x & (-x)) ret += bit[x];
    return ret;
}

int main(){
    setIO();
    freopen("mincross.in", "r", stdin);
    freopen("mincross.out", "w", stdout);
    cin >> n;
    int arr[2][n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[0][i];
    for(int i = 1; i <= n; i++) cin >> arr[1][i];
    ll ans = LLINF;
    for(int j = 0; j < 2; j++){
        int pos[n + 1];
        for(int i = 1; i <= n; i++) pos[arr[0][i]] = i, bit[i] = 0;
        int rev[n + 1];
        for(int i = 1; i <= n; i++) rev[pos[arr[1][i]]] = i;
        ll cur = 0;
        for(int i = n; i >= 1; i--){
            cur += query(rev[i]);
            update(rev[i], 1);
        }
        ans = min(ans, cur);
        for(int i = n; i >= 1; i--){
            cur -= n - pos[arr[1][i]];
            cur += pos[arr[1][i]] - 1;
            ans = min(ans, cur);
        }
        for(int i = 1; i <= n; i++) swap(arr[0][i], arr[1][i]);
    }
    cout << ans << endl;
}
```