title: Lots Of Triangles (Tutorial)
date: 9-16-2022
tag: usaco, brute force, prefix sums, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=672)

## Solution

First of all, we are able to iterate over every possible triangle, so the problem comes down to querying the number of points inside a triangle. This can be done by storing the number of poitns under any pair of points then doing casework. Be sure to remove the overcounted points.

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

int pre[305][305], cnt[305];
bool vis[305][305][305];
pii arr[305];

bool under(int a, int b, int c){
    if(arr[c].ff < arr[a].ff || arr[c].ff > arr[b].ff) return false;
    ld slope = (ld)(arr[b].ss - arr[a].ss)/(arr[b].ff - arr[a].ff);
    return (ld)arr[c].ss <= slope*(arr[c].ff - arr[a].ff) + arr[a].ss;
}
 
int main(){
    setIO();   
    freopen("triangles.in", "r", stdin);
    freopen("triangles.out", "w", stdout);
    int n;
    cin >> n;
    for(int i = 0; i < n; i++) cin >> arr[i].ff >> arr[i].ss;
    for(int i = 0; i < n; i++){
        for(int j = 0; j < n; j++){
            if(i == j) continue;
            if(arr[j].ff == arr[i].ff && arr[j].ss < arr[i].ss){
                cnt[i]++;
                continue;
            }
            for(int k = 0; k < n; k++){
                if(k == i || k == j) continue;
                if(under(i, j, k)) pre[i][j]++;
            }
        }
    }
    int ans[n];
    memset(ans, 0, sizeof(ans));
    for(int i = 0; i < n; i++){
        for(int j = 0; j < n; j++){
            if(i == j) continue;
            for(int k = 0; k < n; k++){
                if(k == i || k == j) continue;
                if(vis[i][j][k]) continue;
                if(!(arr[i].ff <= arr[j].ff && arr[j].ff <= arr[k].ff)) continue;
                int val;
                if(under(i, k, j)) val = pre[i][k] - pre[i][j] - pre[j][k] + cnt[j] - 1;
                else val = pre[i][j] + pre[j][k] - cnt[j] - pre[i][k];
                ans[val]++;
                vis[i][j][k] = vis[i][k][j] = vis[j][i][k] = vis[j][k][i] = vis[k][i][j] = vis[k][j][i] = true;
            }
        }
    }
    for(int i = 0; i <= n - 3; i++) cout << ans[i] << endl;
}
```