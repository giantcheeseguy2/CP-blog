title: Painting (Tutorial)
date: 1-3-2023
tag: cf, geometry, tree, binary lifting, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/104090/problem/J)

## Solution

Given a line segment, we want to find the first segment other segment that it intersects with. As such, it may be helpful to first reduce the set of segments that we have to check by ignoring segments that cannot be intersected with. If we add some horizontal segments as the minimum and maximum segments, then the set of segments that we have to consider is the set that directly covers the starting point of our added segment. It is easy to see that the set of segments that are directly reachable from the starting point is a convex hull. Finding the intersection of a line with convex hull is actually doable without knowing the exact segments of the convex hull initially. Therefore, if we can somehow figure out the set of segments that directly cover the starting point in clockwise order, we can find the answer without actually checking all of them. We can see that the first segment to the left and right of the starting point are obviously included. Going from there, it is also easy to see that the segments that those segments intersect is also included. Thus, if we build a tree where each segment has a parent of the segment that it intersects, then the set of all nodes is just the path between the first segment to the left and right. Since we are only adding leaves, we can use binary lifting to find the lca, since it can be maintained with leaf additions. Now, to find the segment which the added segment intersects, we should do a binary search on the convex hull. Lets seperate the hull into 3 pieces: the upper hull (part before the lca), the lca, and the lower hull (part after the lca). If our segment intersects with the upper hull, then it will not intersect with the lower hull. Looking at the set of segments we are searching, we can see that if our segment does intersect with the upper hull, it will be with some suffix of the upper hull. If it intersects with the lower hull, it will be with some prefix of the lower hull. If it intersects neither, then it will intersect the lca. Since we want to find the smallest coordinate of intersection, we can do a binary search to either find the first or last segments that our new segment intersects with.

## Code

```c++
#pragma GCC optimize("O3")
#pragma GCC optimization ("unroll-loops")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse,sse2,sse3,ssse3,sse4,popcnt,abm,mmx,tune=native")
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

pll reduce(pll x){
    ll div = __gcd(x.ff, x.ss);
    x.ff /= div;
    x.ss /= div;
    return x;
}

pll mult(pll a, pll b){
    a.ff *= b.ff;
    a.ss *= b.ss;
    return reduce(a);
}

pll div(pll a, pll b){
    a.ff *= b.ss;
    a.ss *= b.ff;
    return reduce(a);
}

//return a < b
bool comp(pll a, pll b){
    return a.ff*b.ss < b.ff*a.ss;
}

int n, m;
int par[300005][20];
int depth[300005];
pll arr[300005];
pll pos[300005];

int lca(int a, int b){
    if(depth[a] > depth[b]) swap(a, b);
    for(int i = 19; i >= 0; i--) if(depth[par[b][i]] >= depth[a]) b = par[b][i];
    if(a == b) return a;
    for(int i = 19; i >= 0; i--) if(par[a][i] != par[b][i]) a = par[a][i], b = par[b][i];
    return par[a][0];
}

int path(int a, int b, int c, int k){
    if(k > depth[a] - depth[c]){
        k -= depth[a] - depth[c];
        k = depth[b] - depth[c] - k;
        if(k < 0) return -1;
        for(int i = 0; i <= 19; i++) if(k & (1 << i)) b = par[b][i];
        return b;
    }
    for(int i = 0; i <= 19; i++) if(k & (1 << i)) a = par[a][i];
    return a;
}

pll eval(pll a, pll b){
    return reduce({a.ff*m*b.ss + (a.ss - a.ff)*b.ff, m*b.ss});
}

pll isect(int a, int b){
    if(a == -1 || b == -1) return {m + 2, 1};
    if(a == 0 || b == 0) return {m, 1};
    if(arr[a].ff > arr[b].ff) swap(a, b);
    if(arr[a].ss < arr[b].ss) return {m + 1, 1};
    return reduce({(arr[a].ff - arr[b].ff)*m, arr[b].ss - arr[b].ff - arr[a].ss + arr[a].ff});
}

bool check(int a, int b){
    if(a == 0 || b == 0) return true;
    if(comp(pos[b], pos[a])) swap(a, b);
    pll x = eval(arr[a], pos[a]), y = eval(arr[b], pos[a]);
    if(x == y) return true;
    if(comp(x, y)){
        return arr[a].ff > arr[b].ff;
    }
    return arr[a].ff < arr[b].ff;
}

pair<ll, pll> find(int a, int b, int x){
    int c = lca(a, b);
    if(a != c && check(path(a, b, c, depth[a] - depth[c] - 1), x)){
        int l = 0, r = depth[a] - depth[c] - 1;
        while(l < r){
            int mid = (l + r)/2;
            if(check(path(a, b, c, mid), x)) r = mid;
            else l = mid + 1;
        }
        int ret = path(a, b, c, l);
        pll ans1 = isect(x, ret);
        pll ans2 = eval(arr[x], ans1);
        cout << "(" << ans1.ff << "/" << ans1.ss << "," << ans2.ff << "/" << ans2.ss << ")";
        cout << endl;
        return {ret, ans1};
    }
    if(b != c && check(path(a, b, c, depth[a] - depth[c] + 1), x)){
        int l = depth[a] - depth[c] + 1, r = depth[a] + depth[b] - 2*depth[c];
        while(l < r){
            int mid = (l + r + 1)/2;
            if(check(path(a, b, c, mid), x)) l = mid;
            else r = mid - 1;
        }
        int ret = path(a, b, c, l);
        pll ans1 = isect(x, ret);
        pll ans2 = eval(arr[x], ans1);
        cout << "(" << ans1.ff << "/" << ans1.ss << "," << ans2.ff << "/" << ans2.ss << ")";
        cout << endl;
        return {ret, ans1};
    }
    pll ans1 = isect(x, c);
    pll ans2 = eval(arr[x], ans1);
    cout << "(" << ans1.ff << "/" << ans1.ss << "," << ans2.ff << "/" << ans2.ss << ")";
    cout << endl;
    return {c, ans1};
}

int main(){
    setIO();
    cin >> n >> m;
    set<pii> s;
    s.insert({0, 1});
    s.insert({1000001, 2});
    arr[1] = {0, 0};
    arr[2] = {1000001, 1000001};
    pos[1] = pos[2] = {m, 1};
    depth[1] = depth[2] = 1; 
    for(int i = 3; i <= n + 2; i++){
        int a, b, c;
        cin >> a >> b >> c;
        arr[i] = {a, b};
        pos[i] = {m, 1};
        set<pii>::iterator it = s.lower_bound({a, -1});
        int l = (*prev(it)).ss, r = (*it).ss;
        pair<ll, pll> p = find(l, r, i);
        if(c){
            s.insert({a, i});
            par[i][0] = p.ff;
            depth[i] = depth[p.ff] + 1;
            pos[i] = p.ss;
            for(int j = 1; j < 20; j++) par[i][j] = par[par[i][j - 1]][j - 1];
        }
    }
}
```