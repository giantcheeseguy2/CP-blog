title: Sprinklers (Tutorial)
date: 9-20-2022
tag: usaco, segtree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=578)

## Solution

First of all, we can get rid of all the points that dont contribute anything. Now, we can notice that the final total covered area is just multiple components of staircase patterns. We can decompose this pattern into rectangles with a width of \\(1\\). Lets say \\(s_i\\) is the distance from the \\(i\\)th cell to the bottom most position in the rectnagle. Then, whenever adding a new rectangle to the structure, the answer increases from the sum of all \\(s_i\\) that are within the y range of the new rectangle. We can maintain this using polynomial updates on a segtree.

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

int mn[100005], mx[100005];
pii tag[400005];
int seg[400005];
int n;
int inv = 500000004;

void push_down(int x, int l, int r){
    int mid = (l + r)/2;
    (seg[x*2 + 1] += (ll)(mid - l + 1)*((tag[x].ff + tag[x].ff)%MOD + (ll)tag[x].ss*(mid - l)%MOD)%MOD*inv%MOD) %= MOD;
    (seg[x*2 + 2] += (ll)(r - mid)*((tag[x].ff + (ll)tag[x].ss*(mid - l + 1)%MOD)%MOD + (tag[x].ff + (ll)tag[x].ss*(r - l)%MOD)%MOD)%MOD*inv%MOD) %= MOD;
    (tag[x*2 + 1].ff += tag[x].ff) %= MOD;
    (tag[x*2 + 1].ss += tag[x].ss) %= MOD;
    (tag[x*2 + 2].ff += (tag[x].ff + (ll)tag[x].ss*(mid - l + 1)%MOD)%MOD) %= MOD;
    (tag[x*2 + 2].ss += tag[x].ss) %= MOD;
    tag[x] = {0, 0};
}

void update(int l, int r, pii v, int ul = 0, int ur = n - 1, int cur = 0){
    if(l <= ul && ur <= r){
        int a = ((ll)(ul - l)*v.ss%MOD + v.ff)%MOD;
        int b = ((ll)(ur - l)*v.ss%MOD + v.ff)%MOD;
        (seg[cur] += (ll)(ur - ul + 1)*(a + b)%MOD*inv%MOD) %= MOD;
        (tag[cur].ff += a) %= MOD;
        (tag[cur].ss += v.ss) %= MOD;
        return;
    }
    push_down(cur, ul, ur);
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
    seg[cur] = (seg[cur*2 + 1] + seg[cur*2 + 2])%MOD;
}

int query(int l, int r, int ul = 0, int ur = n - 1, int cur = 0){
    if(l <= ul && ur <= r) return seg[cur];
    if(ur < l || ul > r) return 0;
    push_down(cur, ul, ur);
    int mid = (ul + ur)/2;
    return (query(l, r, ul, mid, cur*2 + 1) + query(l, r, mid + 1, ur, cur*2 + 2))%MOD;
}

int main(){
    setIO();
    //freopen("sprinklers.in", "r", stdin);
    //freopen("sprinklers.out", "w", stdout);
    cin >> n;
    vector<pii> v;
    for(int i = 0; i < n; i++){
        int x, y;
        cin >> x >> y;
        v.pb({x, y});
    }
    sort(v.begin(), v.end());
    vector<pii> low, upp;
    set<int> s1, s2;
    for(pii i : v) s2.insert(i.ss);
    int ans = 0;
    for(pii i : v){
        s2.erase(i.ss);
        if(s2.upper_bound(i.ss) == s2.end() && s1.upper_bound(i.ss) != s1.begin()) upp.pb(i);
        if(s1.upper_bound(i.ss) == s1.begin() && s2.upper_bound(i.ss) != s2.end()) low.pb(i);
        s1.insert(i.ss);
    }
    if(!low.size() && !upp.size()){
        cout << 0 << endl;
        return 0;
    }
    int l = min(low.front().ff, upp.front().ff), r = max(low.back().ff, upp.back().ff);
    for(int i = l; i < upp[0].ff; i++) mx[i] = upp[0].ss;
    for(int i = l; i < low[0].ff; i++) mn[i] = low[0].ss;
    for(int i = 1; i < upp.size(); i++) for(int j = upp[i - 1].ff; j < upp[i].ff; j++) mx[j] = upp[i].ss;
    for(int i = 1; i < low.size(); i++) for(int j = low[i - 1].ff; j < low[i].ff; j++) mn[j] = low[i - 1].ss;
    for(int i = upp.back().ff; i < r; i++) mx[i] = upp.back().ss;
    for(int i = low.back().ff; i < r; i++) mn[i] = low.back().ss;
    for(int i = l; i < r; i++){
        //cout << mn[i] << " " << mx[i] << " " << query(mn[i], mx[i] - 1) << endl;
        if(mn[i] >= mx[i]) continue;
        (ans += query(mn[i], mx[i] - 1)) %= MOD;
        assert(mn[i] < mx[i]);
        (ans += (ll)(mx[i] - mn[i])*(1 + mx[i] - mn[i])%MOD*inv%MOD) %= MOD;
        update(mn[i], mx[i] - 1, {1, 1});
        //for(int j = 0; j < n; j++) cout << query(j, j) << " ";
        //cout << endl;
    }
    cout << ans << endl;
}
```