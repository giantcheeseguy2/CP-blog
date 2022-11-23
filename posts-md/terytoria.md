title: Terytoria (Tutorial)
date: 11-23-2022
tag: loj, hashing, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/3220)

## Solution

Notice that the intersection of all \\(N\\) rectangles must result in some rectangles that can be combined into a bigger rectangle. Therefore, we only have to know the total \\(x\\) spanned by the final rectangles and the total \\(y\\) spanned by the final rectangles and multiply them for the answer. Looking at the four cases of the possible ways to create the rectangle, we can see that we will either cover \\([x_1, x_2]\\) or \\([0, x_1]\\) and \\([x_2, X]\\). This is also true for \\(y_1\\) and \\(y_2\\) as well. Over all four cases, all of the combinations of these cases are satisfied. Therefore, we can evaluate \\(x\\) and \\(y\\) independently. Our problem then becomes: given some intervals where you can either choose the interval or its complement, find the maximum size of the intersection of all the intervals. The two dfiferent states cannot cover the same cell. Thus, for each cell, in order fo it to be covered by all intervals, there is only one possible combination. We can encode this combination with xor hashing. Lets assign a random value to each interval. Every time we enter an interval, we can xor our hash with its random value. Therefore, for each cell, our hash will encode whether each interval covers it or not and we can add the cell to the unique hash that encodes its state. Discretize the cells to optimize the solution.

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

mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());

int main(){
    setIO();
    int n, x, y;
    cin >> n >> x >> y;
    ll id[n];
    for(int i = 0; i < n; i++) id[i] = rng()%LLINF;
    vector<pll> vx, vy;
    vx.pb({0, 0});
    vy.pb({0, 0});
    vx.pb({x, 0});
    vy.pb({y, 0});
    for(int i = 0; i < n; i++){
        int x1, x2, y1, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        vx.pb({x1, id[i]});
        vx.pb({x2, id[i]});
        vy.pb({y1, id[i]});
        vy.pb({y2, id[i]});
    }
    ll sumx = 0, sumy = 0;
    sort(vx.begin(), vx.end()); 
    sort(vy.begin(), vy.end());
    map<ll, int> mx, my;
    for(int i = 1; i < 2*(n + 1); i++){
        int dx = vx[i].ff - vx[i - 1].ff, dy = vy[i].ff - vy[i - 1].ff;
        mx[sumx] += dx, my[sumy] += dy;
        sumx ^= vx[i].ss, sumy ^= vy[i].ss;
    }
    int mxx = 0, mxy = 0;
    for(auto i : mx) mxx = max(mxx, i.ss);
    for(auto i : my) mxy = max(mxy, i.ss);
    cout << (ll)mxx*mxy << endl;
}
```