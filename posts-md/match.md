title: Match (Tutorial)
date: 12-3-2022
tag: noip, segtree, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/6/problem/43)

## Solution

Seeing the sum over all subintervals and the fact it can be done offline immediately suggests a solution involving historic segtree. If we sweep on the right endpoint of the query and maintain a segtree storing the historic sum of all the answers for every left endpoint, that is sufficient for finding the answer. We need to somehow maintain adding to two different arrays, as well as maintaining the historic sum of their products. We can represent the base values as a vector, storing \\(\\sum m_1 \\cdot m_2\\), \\(\\sum m_1\\), \\(\\sum m_2\\), the historic of \\(\\sum m_1 \\cdot m_2\\), and the size of the range, where \\(m_1\\) is the value in the first array and \\(m_2\\) is the value in the second array. Our updates will be in the form a matrix. However, simply applying this matrix is too slow, so we can see that there are only 9 relevant values, and only consider those when transitioning. Now, to update the answer accordingly, we can use a monotonic stack for each array to only have to update a linear amount of intervals. Note that with the matrix method, we can't store the timestamp, so we have to update carefeully in a way such that each index is only considered once by the matrix operation. Also, note the specific order that the matrices much be applied in.

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

typedef unsigned long long ll;
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

struct mat {
    ll x1, x2, x3, x4, x5, x6, x7, x8, x9;
    
    mat(){
        x1 = x2 = x3 = x4 = x5 = x6 = x7 = x8 = x9 = 0;
    }

};

struct node {

    ll m1m2, m1, m2, hist, sz;
    
    node(){
        m1m2 = m1 = m2 = hist = 0;
        sz = 1;
    }

};

//a *= b;
//please send help
mat merge(mat a, mat &b){
    a.x9 += a.x6*b.x3 + b.x9 + a.x7*b.x4 + a.x8*b.x5;
    a.x8 += b.x8 + a.x6*b.x2;
    a.x7 += b.x1*a.x6 + b.x7;
    a.x6 += b.x6;
    a.x5 += b.x5;
    a.x4 += b.x4;
    a.x3 += b.x3 + a.x1*b.x4 + a.x2*b.x5;
    a.x2 += b.x2;
    a.x1 += b.x1;
    return a;
}

//{1, 2}
mat add(pll x){
    mat ret;
    ret.x1 = x.ss;
    ret.x2 = x.ff;
    ret.x3 = x.ff*x.ss;
    ret.x4 = x.ff;
    ret.x5 = x.ss;
    ret.x6 = 1;
    ret.x7 = x.ss;
    ret.x8 = x.ff;
    ret.x9 = x.ff*x.ss;
    return ret;
}

mat tag[1000005];
node seg[1000005];
bool active[1000005];
int n;

node pull(node &a, node &b){
    node ret;
    ret.m1m2 = a.m1m2 + b.m1m2;
    ret.m1 = a.m1 + b.m1;
    ret.m2 = a.m2 + b.m2;
    ret.hist = a.hist + b.hist;
    ret.sz = a.sz + b.sz;
    return ret;
}

void push(node &a, mat &b){
    a.hist += b.x6*a.m1m2 + b.x7*a.m1 + b.x8*a.m2 + b.x9*a.sz;
    a.m1m2 += b.x1*a.m1 + b.x2*a.m2 + b.x3*a.sz;
    a.m1 += b.x4*a.sz;
    a.m2 += b.x5*a.sz;
}

void push_down(int x){
    if(!active[x]) return;
    for(int i = x*2 + 1; i <= x*2 + 2; i++){
        tag[i] = merge(tag[x], tag[i]);
        push(seg[i], tag[x]);
        active[i] = true;
    }
    tag[x] = mat();
    active[x] = false;
}

int arr1[250005], arr2[250005];

void build(int l = 1, int r = n, int cur = 0){
    if(l == r){
        seg[cur].m1 = arr1[l];
        seg[cur].m2 = arr2[l];
        seg[cur].m1m2 = (ll)arr1[l]*arr2[l];
        seg[cur].hist = (ll)arr1[l]*arr2[l];
        return;
    }
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    build(mid + 1, r, cur*2 + 2);
    seg[cur] = pull(seg[cur*2 + 1], seg[cur*2 + 2]);
}

void update(int l, int r, mat v, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r){
        push(seg[cur], v);
        tag[cur] = merge(v, tag[cur]);
        active[cur] = true;
        return;
    }
    push_down(cur);
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
    seg[cur] = pull(seg[cur*2 + 1], seg[cur*2 + 2]);
}

ll query(int l, int r, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r) return seg[cur].hist;
    if(ur < l || ul > r) return 0;
    push_down(cur);
    int mid = (ul + ur)/2;
    return query(l, r, ul, mid, cur*2 + 1) + query(l, r, mid + 1, ur, cur*2 + 2);
}

int main(){
    setIO();
    freopen("match.in", "r", stdin);
    freopen("match.out", "w", stdout);
    int t;
    cin >> t >> n;
    for(int i = 1; i <= n; i++) cin >> arr1[i];
    for(int i = 1; i <= n; i++) cin >> arr2[i];
    int q;
    cin >> q;
    vector<pii> que[n + 1];
    for(int i = 0; i < q; i++){
        int l, r;
        cin >> l >> r;
        que[r].pb({l, i});
    }
    build();
    ll ans[q];
    stack<pair<pii, int>> s1, s2;
    for(int i = 1; i <= n; i++){
        vector<pii> v1;
        {
            int cur = i;
            while(!s1.empty() && s1.top().ss < arr1[i]){
                if(v1.size()) v1.back().ss += s1.top().ss - arr1[i];
                else v1.pb({s1.top().ff.ss + 1, s1.top().ss - arr1[i]});
                v1.pb({s1.top().ff.ff, arr1[i] - s1.top().ss});
                cur = s1.top().ff.ff;
                s1.pop();
            }
            if(v1.empty()) v1.pb({i, 0});
            s1.push({{cur, i}, arr1[i]});
            reverse(v1.begin(), v1.end());
        }
        vector<pii> v2;
        {
            int cur = i;
            while(!s2.empty() && s2.top().ss < arr2[i]){
                if(v2.size()) v2.back().ss += s2.top().ss - arr2[i];
                else v2.pb({s2.top().ff.ss + 1, s2.top().ss - arr2[i]});
                v2.pb({s2.top().ff.ff, arr2[i] - s2.top().ss});
                cur = s2.top().ff.ff;
                s2.pop();
            }
            if(v2.empty()) v2.pb({i, 0});
            s2.push({{cur, i}, arr2[i]});
            reverse(v2.begin(), v2.end());
        }
        vector<pair<int, pll>> v;
        int a = 0, b = 0;
        while(a < v1.size() && b < v2.size()){
            if(v1[a].ff == v2[b].ff){
                v.pb({v1[a].ff, {v1[a].ss, v2[b].ss}});
                a++, b++;
            } else if(v1[a].ff < v2[b].ff){
                v.pb({v1[a].ff, {v1[a].ss, 0}});
                a++;
            } else {
                v.pb({v2[b].ff, {0, v2[b].ss}});
                b++;
            }
        }
        while(a < v1.size()) v.pb({v1[a].ff, {v1[a].ss, 0}}), a++;
        while(b < v2.size()) v.pb({v2[b].ff, {0, v2[b].ss}}), b++;
        pll cur = {0, 0};
        int prv = 1;
        for(auto j : v){
            if(j.ff > prv){
                //cout << "e " << prv << " " << j.ff - 1 << " " << cur.ff << " " << cur.ss << endl;
                update(prv, j.ff - 1, add(cur));
            }
            cur.ff += j.ss.ff;
            cur.ss += j.ss.ss;
            prv = j.ff;
        }
        //for(int j = 1; j <= i; j++) cout << query(j, j) << " ";
        //cout << endl;
        for(pii j : que[i]) ans[j.ss] = query(j.ff, i); 
    }
    for(int i = 0; i < q; i++) cout << ans[i] << "\n";
}
```