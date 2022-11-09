title: Simultaneous Sugoroku (Tutorial)
date: 11-8-2022
tag: atcoder, ad hoc, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/arc149/tasks/arc149_d)

## Solution

We can either try to solve each query individually by somehow simulating the operations fast, or solve them all simultaneously. There doesn't seem to be a observable pattern that can help us simulate the operations or translate from one index to another, so lets try to solve them all simultaneously. The first observation is that if we have two elements that are symmetrical across the origin, then their final positions will also be negatives of each other, so we can just discard one of the elements and find its answer later. So lets maintain an interval of our current values, originally from \\(1\\) to \\(10^6\\). Everytime we shift it by an operation, the whole interval shifts. If the interval shifts across the origin, we know that every element on the smaller side will mirror the elements on the larger side, so we can just eliminate the smaller side. This way, we always maintain a singular interval, and all the elements will have the same sign, making operations doable in constant time. Finally, we will go through all the elements afterword and update all the answers.

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

int ans[1000005];
vector<int> g[1000005];
bool win[1000005];

void dfs(int x){
    for(int i : g[x]){
        ans[i] = ans[x]*(win[x] ? 1 : -1);
        win[i] = win[x];
        dfs(i);
    }
}

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    int arr[n];
    for(int i = 0; i < n; i++) cin >> arr[i];
    int l = 1, r = 1e6;
    int l1 = 1, r1 = 1e6;
    vector<int> v;
    for(int i = 1; i <= m; i++){
        int x;
        cin >> x;
        if(l > 0) l -= x, r -= x;
        else l += x, r += x;
        if(r < 0 || l > 0) continue;
        int a = -l, b = r;
        v.pb(l1 + a);
        ans[l1 + a] = i;
        win[l1 + a] = true;
        if(a < b){
            for(int j = l1 + a + 1; j <= l1 + a + a; j++) g[j].pb(l1 + a - (j - l1 - a));
            l += a + 1;
            l1 += a + 1;
        } else {
            for(int j = l1 + a + 1; j <= l1 + a + b; j++) g[l1 + a - (j - l1 - a)].pb(j);
            r -= b + 1;
            r1 -= b + 1;
        }
    }
    for(int i = l1; i <= r1; i++){
        ans[i] = l + i - l1;
        v.pb(i);
    }
    for(int i : v) dfs(i);
    for(int i = 0; i < n; i++) cout << (win[arr[i]] ? "Yes " : "No ") << ans[arr[i]] << endl;
}
```