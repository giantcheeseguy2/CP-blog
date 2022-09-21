title: Promotion Counting (Tutorial)
date: 9-19-2022
tag: usaco, segtree merge, tree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=696)

## Solution

This is a template problem that can be solved with segtree merging or small to large.

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

template<class K> using sset = tree<K, null_type, less_equal<K>, rb_tree_tag, tree_order_statistics_node_update>;

inline ll ceil0(ll a, ll b) {
    return a / b + ((a ^ b) > 0 && a % b);
}

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

int arr[100005];
int ans[100005];
sset<int> s[100005];
vector<int> g[100005];

void dfs(int x){
    for(int i : g[x]) dfs(i);
    for(int i : g[x]){
        if(s[i].size() > s[x].size()) s[i].swap(s[x]);
        for(int j : s[i]) s[x].insert(j);
    }
    s[x].insert(arr[x]);
    ans[x] = s[x].size() - s[x].order_of_key(*s[x].upper_bound(arr[x])) - 1;
}

int main(){
    setIO();
    freopen("promote.in", "r", stdin);
    freopen("promote.out", "w", stdout);
    int n;
    cin >> n;
    for(int i = 1; i <= n; i++) cin >> arr[i];
    for(int i = 2; i <= n; i++){
        int x;
        cin >> x;
        g[x].pb(i);
    }
    dfs(1);
    for(int i = 1; i <= n; i++) cout << ans[i] << "\n";
}
```