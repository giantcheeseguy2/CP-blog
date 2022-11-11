title: Multiple Choice Test (Tutorial)
date: 8-16-2022
tag: usaco, convex hull, minkowski sums, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1190)

## Solution

When considering a group, it is intuitive that any point you choose must lie on the convex hull of that group. Thus, if we can just add the pairwise convex hulls of each group together somehow, we can just iterate over the final hull and find the maximum magnitude. This can be done using minkowski sums.

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
typedef pair<int, int> pii;
typedef pair<ll, ll>   pll;

const int inf = 1e9;
const ll llinf = 1e18;
const int mod = 1e9 + 7;
const double PI = acos(-1);

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

ll cross(pll a, pll b){
    return a.ff*b.ss - a.ss*b.ff;
}

//is C on the left of AB
int left(pll a, pll b, pll c) {
    b.ff -= a.ff, b.ss -= a.ss;
    c.ff -= a.ff, c.ss -= a.ss;
    ll ret = cross(b, c);
    if(ret > 0) return 1;
    if(ret < 0) return -1;
    return ret;
}

vector<pll> hull(vector<pll> v){
    sort(v.begin(), v.end());
    vector<pll> ret;
    ret.pb(v[0]);
    for (int i = 1; i < v.size(); i++) {
        pll p = v[i];
        while (ret.size() >= 2 && left(ret[ret.size()-2], ret.back(), p) < 0) ret.pop_back();
        ret.pb(p);
    }
    int ind = ret.size();
    ret.pb(v[0]);
    for (int i = 1; i < v.size(); i++) {
        pll p = v[i];
        while (ret.size() - ind >= 2 && left(ret[ret.size()-2], ret.back(), p) > 0) ret.pop_back();
        ret.pb(p);
    } 
    ret.pop_back();
    reverse(ret.begin() + ind, ret.end());
    ret.pop_back();
    return ret;
}

vector<pll> g[200000];

void order(vector<pll> &v){
    int ind = 0;
    for(int i = 1; i < v.size(); i++){
        if(v[i].ss < v[ind].ss || (v[i].ss == v[ind].ss && v[i].ff < v[ind].ff))
            ind = i;
    }
    rotate(v.begin(), v.begin() + ind, v.end());
}

vector<pll> merge(vector<pll> a, vector<pll> b){
    order(a), order(b);
    a.pb(a[0]), a.pb(a[1]);
    b.pb(b[0]), b.pb(b[1]);
    vector<pll> ret;
    int l = 0, r = 0;
    while(l < a.size() - 2 || r < b.size() - 2){
        ret.pb({a[l].ff + b[r].ff, a[l].ss + b[r].ss});
        ll dif = cross({a[l + 1].ff - a[l].ff, a[l + 1].ss - a[l].ss}, {b[r + 1].ff - b[r].ff, b[r + 1].ss - b[r].ss});
        if(dif >= 0) l++;
        if(dif <= 0) r++;
    }
    return ret;
}

int main(){
    setIO();
    int n;
    cin >> n;
    priority_queue<pii, vector<pii>, greater<pii>> q;
    for(int i = 0; i < n; i++){
        int t;
        cin >> t;
        g[i].reserve(t);
        for(int j = 0; j < t; j++){
            ll x, y;
            cin >> x >> y;
            g[i].pb({x, y});
        }
        g[i] = hull(g[i]);
        q.push({g[i].size(), i});
    }
    while(q.size() > 1){
        pii a = q.top();
        q.pop();
        pii b = q.top();
        q.pop();
        g[a.ss] = merge(g[a.ss], g[b.ss]);
        q.push({g[a.ss].size(), a.ss});
    }
    pii ans = q.top();
    ll mx = 0;
    for(auto i : g[ans.ss]){
        mx = max(mx, i.ff*i.ff + i.ss*i.ss);
    }
    cout << mx << endl;
}
```