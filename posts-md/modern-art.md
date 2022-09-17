title: Modert Art (Tutorial)
date: 9-16-2022
tag: usaco, brute force, prefix sums, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=744)

## Solution

It is always optimal to make the rectangle of a single color the extremes of that color. Now, for every rectangle, we have to remove all the colors inside that are not the same from being possible starting colors. This can be done by range updating \\(1\\) to every element within the rectangle, then going through every point afterwards, or throug ha brute force (although not supposed to pass).

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

int main(){
    setIO();
    freopen("art.in", "r", stdin);
    freopen("art.out", "w", stdout);
    int n;
    cin >> n;
    int mx = n*n;
    pair<pii, pii> rect[mx + 1];
    for(int i = 1; i <= mx; i++) rect[i] = {{INF, INF}, {-INF, -INF}};
    int arr[n][n];
    bool found = false;
    set<int> s;
    for(int i = 0; i < n; i++){
        for(int j = 0; j < n; j++){
            int x;
            cin >> x;
            arr[i][j] = x;
            found |= x > 0;
            if(x == 0) continue;
            s.insert(x);
            rect[x].ff.ff = min(rect[x].ff.ff, i);
            rect[x].ff.ss = min(rect[x].ff.ss, j);
            rect[x].ss.ff = max(rect[x].ss.ff, i);
            rect[x].ss.ss = max(rect[x].ss.ss, j);
        }
    }
    if(!found){
        cout << 0 << endl;
        return 0;
    }
    if(s.size() == 1){
        cout << n*n - 1 << endl;
        return 0;
    }
    bool vis[mx + 1];
    memset(vis, false, sizeof(vis));
    for(int i = 1; i <= mx; i++){
        for(int j = rect[i].ff.ff; j <= rect[i].ss.ff; j++){
            for(int k = rect[i].ff.ss; k <= rect[i].ss.ss; k++){
                if(arr[j][k] != i) vis[arr[j][k]] = true;
            }
        }
    }
    int ans = n*n;
    for(int i = 1; i <= mx; i++) ans -= vis[i];
    cout << ans << endl;
}
```