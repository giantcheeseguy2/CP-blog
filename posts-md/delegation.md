title: Delegation (Tutorial)
date: 10-17-2022
tag: usaco, binary search, tree, greedy, dp, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=1044)

## Solution

This problem asks for the largest \\(K\\) such that the tree can be partitioned into paths of at least \\(K\\). This immediately suggests binary searching on \\(K\\). If a tree can be decomposed into lengths of at least \\(K\\), then the same decomposition works for \\(K - 1\\), so it is monotonic. Now, what is the optimal way to decompose the tree. At a given node, you can either end a path, merge it with another path, or let it continue. Obviously, if you want to continue a path, it should be as large as possible while allowing every other path to satisfy the condition. This can be done with another binary search and some case work. Note that for merging all nodes, it is always optimal to pair the largest path with the smallest path. It is also optimal to end at most one path per node.

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

int dp[100005], n, tar;
vector<int> g[100005];
bool ans;

int find(vector<int> &v){
    int l = 0, r = v.size() - 1;
    while(l < r){
        int mid = (l + r + 1)/2;
        bool val = true;
        vector<int> v1;
        for(int i = 0; i < v.size(); i++) if(i != mid) v1.pb(v[i]);
        for(int i = 0; i < v1.size()/2; i++) val &= v1[i] + v1[v1.size() - 1 - i] >= tar;
        if(!val) r = mid - 1;
        else l = mid;
    }
    bool val = true;
    vector<int> v1;
    for(int i = 0; i < v.size(); i++) if(i != l) v1.pb(v[i]);
    for(int i = 0; i < v1.size()/2; i++) val &= v1[i] + v1[v1.size() - 1 - i] >= tar;
    if(!val) return -1;
    else return v[l];
}

void dfs(int x, int p = 0){
    dp[x] = 0;
    vector<int> v;
    for(int i : g[x]){
        if(i == p) continue;
        dfs(i, x);
        v.pb(dp[i] + 1);
    }
    if(!v.size()) return;
    sort(v.begin(), v.end());
    bool skip = false;
    if(v.size()%2 == 0){
        for(int i = 0; i < v.size()/2; i++) if(v[i] + v[v.size() - 1 - i] < tar) ans = false;
        if(v.back() >= tar){
            int pos = 0;
            for(int i = 0; i < v.size(); i++){
                if(v[i] >= tar){
                    pos = i;
                    break;
                }
            }
            v.erase(v.begin() + pos);
            dp[x] = max(dp[x], find(v));
        }
    } else {
        dp[x] = find(v);
        if(dp[x] == -1) ans = false;
    }
}

bool check(int x){
    ans = true;
    tar = x;
    dfs(1);
    if(g[1].size()%2 == 1) ans &= dp[1] >= tar;
    return ans;
}

int main(){
    setIO();
    freopen("deleg.in", "r", stdin);
    freopen("deleg.out", "w", stdout);
    cin >> n;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    int l = 1, r = n;
    while(l < r){
        int mid = (l + r + 1)/2;
        if(check(mid)) l = mid;
        else r = mid - 1;
    }
    cout << l << endl;
}
```