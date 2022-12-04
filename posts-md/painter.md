title: Painter (Tutorial)
date: 12-3-2022
tag: dmoj, segtree, tutorial

---

## Problem Statement

[Problem Link](https://dmoj.ca/problem/bpc1s6)

## Solution

To find the total area covered by the rectangles is just doing a sweep over x while maintaining a lazy segtree on y. We can find the amount covered per position by counting the number of minimums and, if it is zero, subtracting the amount from the size of our y axis. To find the full solution, lets try removing each rectangle. If we let each cell be the number of rectangles that cover it, the maximum contribution of removing a rectangle is the number of \\(1\\) cells inside it. Notice that \\(1\\) is either minimum or second minimum value that a cell can have. Therefore, if we store the two smallest values and their count in a segtree, we can count the number of \\(1\\) cells per x. However, we cannot do this for every rectangle. Instead, we should somehow find the historic sum of the number of \\(1\\) cells in the range. To do this, we need to somehow count the number of times \\(1\\) is reached in the range in the difference of time between the current time and the time of the value being propagated. We can actually do this with a similar idea as before. We only care about the amount of time that the tag spends at its minimum or second minimum values. This is much easier to maintain. 

## Code

```c++
//https://dmoj.ca/problem/bpc1s6
#pragma GCC optimize("Ofast")
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

const int MX = 1e6;

pair<pii, pii> seg[1 << 21 | 1];
pair<pii, pii> htag[1 << 21 | 1];
ll hist[1 << 21 | 1];
int tag[1 << 21 | 1], prv[1 << 21 | 1], tim = 0;

pair<pii, pii> pull(pair<pii, pii> a, pair<pii, pii> b){
    if(a.ff.ff == b.ff.ff) a.ff.ss += b.ff.ss;
    else if(a.ff.ff == b.ss.ff) a.ff.ss += b.ss.ss;
    if(a.ss.ff == b.ff.ff) a.ss.ss += b.ff.ss;
    else if(a.ss.ff == b.ss.ff) a.ss.ss += b.ss.ss;
    if(b.ff.ff < a.ff.ff) swap(a.ff, a.ss), a.ff = b.ff;
    else if(b.ff.ff != a.ff.ff && b.ff.ff < a.ss.ff) a.ss = b.ff;
    if(b.ss.ff != a.ff.ff && b.ss.ff < a.ss.ff) a.ss = b.ss;
    return a;
}

pair<pii, pii> merge(pair<pii, pii> a, pair<pii, pii> b, int cur){
    if(a.ff.ff == cur + b.ff.ff) a.ff.ss += b.ff.ss;
    else if(a.ff.ff == cur + b.ss.ff) a.ff.ss += b.ss.ss;
    if(a.ss.ff == cur + b.ff.ff) a.ss.ss += b.ff.ss;
    else if(a.ss.ff == cur + b.ss.ff) a.ss.ss += b.ss.ss;
    if(cur + b.ff.ff < a.ff.ff) swap(a.ff, a.ss), a.ff = b.ff, a.ff.ff += cur;
    else if(cur + b.ff.ff != a.ff.ff && cur + b.ff.ff < a.ss.ff) a.ss = b.ff, a.ss.ff += cur;
    if(cur + b.ss.ff != a.ff.ff && cur + b.ss.ff < a.ss.ff) a.ss = b.ss, a.ss.ff += cur;
    return a;
}

void push_down(int x){
    if(htag[x] == pair<pii, pii>{{0, 0}, {INF, 0}}) return;
    for(int i = x*2 + 1; i <= x*2 + 2; i++){
        if(seg[i].ff.ff + htag[x].ff.ff == 1) hist[i] += (ll)htag[x].ff.ss*seg[i].ff.ss;
        else if(seg[i].ff.ff + htag[x].ss.ff == 1) hist[i] += (ll)htag[x].ss.ss*seg[i].ff.ss;
        if(seg[i].ss.ff + htag[x].ff.ff == 1) hist[i] += (ll)htag[x].ff.ss*seg[i].ss.ss;
        else if(seg[i].ss.ff + htag[x].ss.ff == 1) hist[i] += (ll)htag[x].ss.ss*seg[i].ss.ss;
        htag[i] = merge(htag[i], htag[x], tag[i]);
        seg[i].ff.ff += tag[x];
        seg[i].ss.ff += tag[x];
        tag[i] += tag[x];
        prv[i] = prv[x];
    }
    htag[x] = {{0, 0}, {INF, 0}};
    tag[x] = 0;
}

void update(int l, int r, int v, int t, int ul = 1, int ur = MX, int cur = 0){
    if(l <= ul && ur <= r){
        if(seg[cur].ff.ff + v == 1) hist[cur] += (ll)(t - prv[cur])*seg[cur].ff.ss;
        if(seg[cur].ss.ff + v == 1) hist[cur] += (ll)(t - prv[cur])*seg[cur].ss.ss;
        htag[cur] = merge(htag[cur], {{v, t - prv[cur]}, {INF, 0}}, tag[cur]);
        seg[cur].ff.ff += v;
        seg[cur].ss.ff += v;
        prv[cur] = t;
        tag[cur] += v;
        return;
    }
    push_down(cur);
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, t, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, t, mid + 1, ur, cur*2 + 2);
    seg[cur] = pull(seg[cur*2 + 1], seg[cur*2 + 2]);
    hist[cur] = hist[cur*2 + 1] + hist[cur*2 + 2];
}

void build(int l = 1, int r = MX, int cur = 0){
    htag[cur] = {{0, 0}, {INF, 0}};
    if(l == r){
        seg[cur] = {{0, 1}, {INF, 0}};
        return;
    }
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    build(mid + 1, r, cur*2 + 2);
    seg[cur] = pull(seg[cur*2 + 1], seg[cur*2 + 2]);
}
    
vector<pair<pii, int>> in[1000005], out[1000005];
ll tot[300005];

ll query(int l, int r, int ul = 1, int ur = MX, int cur = 0){
    if(l <= ul && ur <= r) return hist[cur];
    if(ur < l || ul > r) return 0;
    push_down(cur);
    int mid = (ul + ur)/2;
    return query(l, r, ul, mid, cur*2 + 1) + query(l, r, mid + 1, ur, cur*2 + 2);
}

const int BUFSIZE = 20 << 20;
char Buf[BUFSIZE + 1], *buf = Buf;

template<class T>
void scan(T &x){
    int neg = 1;
    for(x = 0; *buf < '0' || *buf > '9'; buf++) if(*buf == '-') neg = -1;
    while(*buf >= '0' && *buf <= '9') x = x*10 + (*buf - '0'), buf++;
    x *= neg;
}

void setIO(){
    fread(Buf, 1, BUFSIZE, stdin);
}

int main(){
    setIO();
    int n, m;
    scan(n), scan(m);
    for(int i = 0; i < n; i++){
        int a, b, c, d;
        scan(a), scan(b), scan(c), scan(d);
        in[a].pb({{b, d - 1}, i});
        out[c].pb({{b, d - 1}, i});
    }
    build();
    ll sum = 0;
    for(int i = 1; i <= MX; i++){
        if(in[i].size() || out[i].size()) update(1, MX, 0, tim);
        for(auto j : in[i]) tot[j.ss] -= query(j.ff.ff, j.ff.ss);
        for(auto j : out[i]) tot[j.ss] += query(j.ff.ff, j.ff.ss);
        for(auto j : in[i]) update(j.ff.ff, j.ff.ss, 1, tim);
        for(auto j : out[i]) update(j.ff.ff, j.ff.ss, -1, tim);
        tim++;
        sum += MX - (seg[0].ff.ff == 0 ? seg[0].ff.ss : 0) - (seg[0].ss.ff == 0 ? seg[0].ff.ss : 0);
    }
    if(m == 0) cout << sum << endl;
    else {
        ll mx = 0;
        for(int i = 0; i < n; i++) mx = max(mx, tot[i]);
        cout << sum - mx << endl;
    }
}
```