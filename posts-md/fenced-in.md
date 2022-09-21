title: Fenced In (Tutorial)
date: 9-19-2022
tag: usaco, mst, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=625)

## Solution

Lets visualize the barn as a graph where the fences are edges. Obviously, the answer is the mst of this graph. But how can we find the mst of a graph with \\(N^2\\) nodes? Consider kruskal's algorithm. You always want to take the smallest edge that connects two components. Luckily or us, there are not many distinct values, so we can take an entire row or column at a time and subtract out the number of already connected components. We can represent the edges we have already taken as entire rows and columns, so we are just counting the number of intersections with some casework. Thus, we can simulate kruskal's in a reasonable time complexity.

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
    freopen("fencedin.in", "r", stdin);
    freopen("fencedin.out", "w", stdout);
    int a, b, n, m;
    cin >> a >> b >> n >> m;
    vector<int> vx, vy;
    vx.pb(0), vx.pb(a);
    vy.pb(0), vy.pb(b);
    for(int i = 0; i < n; i++){
        int x;
        cin >> x;
        vx.pb(x);
    }
    for(int i = 0; i < m; i++){
        int x;
        cin >> x;
        vy.pb(x);
    }
    sort(vx.begin(), vx.end());
    sort(vy.begin(), vy.end());
    priority_queue<pii, vector<pii>, greater<pii>> q;
    for(int i = 1; i < vx.size(); i++) q.push({vx[i] - vx[i - 1], 0});
    for(int i = 1; i < vy.size(); i++) q.push({vy[i] - vy[i - 1], 1});
    ll ans = 0;
    int cx = 0, cy = 0;
    while(!q.empty()){
        pii x = q.top();
        q.pop();
        if(x.ss == 0){
            ans += (ll)x.ff*m;
            if(cx) ans -= (ll)x.ff*max(0, cy - 1);
            cx++;
        } else {
            ans += (ll)x.ff*n;
            if(cy) ans -= (ll)x.ff*max(0, cx - 1);
            cy++;
        }
        //cout << ans << endl;
    }
    cout << ans << endl;
}
```