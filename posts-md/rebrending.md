title: Rebrending (Tutorial)
date: 2-21-2023
tag: cf, segtree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1793/problem/F)

## Solution

Lets iterate over the right endpoint of each query and store for every index the minimum difference between the index and all indeces from there to the right endpoint. Queries become a range min query of this range. It is easy to see that the value at each index decreases as the right endpoint increases. It seems impossible to update all of them, so lets see if the amount of left indeces updated is limited per change in right endpoint. To make things simpler, we will only solve for the case where \\(a_j > a_i\\) and \\(j < i\\). Obviously, we will only change \\(val_j\\) if \\(a_j > a_i\\). Also, for each unique \\(a_j\\), we only care about the one that appeared the latest, since all others will be updated by proxy when we do a query. Lets say we updated the largest \\(j\\) such that \\(a_j > a_i\\). Using the idea of updating by proxy, we now only have to consider \\(a_k\\) such that \\(a_i < a_k < a_j\\). The upper bound on \\(a_k\\) is actually further decreased because \\(a_j - a_k > a_k - a_i\\). So, \\(a_k < \\frac{a_j + a_i}{2}\\). Now, our upper bound decreasese by at least half every iteration, meaning we only have to update \\(log N\\) positions at most every time. This gives us a \\(O(N log^2 N)\\) complexity for maintainings this.

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

int seg[1200005][2];
int n, q;

void update(int x, int t, int v, int l = 1, int r = n, int cur = 0){
    if(l == r){
        if(t) seg[cur][t] = min(seg[cur][t], v);
        else seg[cur][t] = v;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, t, v, l, mid, cur*2 + 1);
    else update(x, t, v, mid + 1, r, cur*2 + 2);
    seg[cur][1] = min(seg[cur*2 + 1][1], seg[cur*2 + 2][1]);
    seg[cur][0] = max(seg[cur*2 + 1][0], seg[cur*2 + 2][0]);
}

int query(int l, int r, int t, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r) return seg[cur][t];
    if(ur < l || ul > r) return t*INF;
    int mid = (ul + ur)/2;
    if(t) return min(query(l, r, t, ul, mid, cur*2 + 1), query(l, r, t, mid + 1, ur, cur*2 + 2));
    else return max(query(l, r, t, ul, mid, cur*2 + 1), query(l, r, t, mid + 1, ur, cur*2 + 2));
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
    scan(n), scan(q);
    int arr[n + 1];
    for(int i = 1; i <= n; i++) scan(arr[i]);
    vector<pii> qq;
    for(int i = 0; i < q; i++){
        int l, r;
        scan(l), scan(r);
        qq.pb({l, r});
    }
    int ans[q];
    for(int i = 0; i < q; i++) ans[i] = INF;
    for(int t = 0; t < 2; t++){
        for(int i = 0; i <= 4*n; i++) seg[i][1] = INF, seg[i][0] = 0;
        vector<pii> que[n + 1];
        for(int i = 0; i < q; i++){
            if(t) que[n - qq[i].ff + 1].pb({n - qq[i].ss + 1, i}); 
            else que[qq[i].ss].pb({qq[i].ff, i});
        }
        for(int i = 1; i <= n; i++){
            int r = n;
            while(r > arr[i]){
                int ind = query(arr[i] + 1, r, 0);
                if(!ind) break;
                update(ind, 1, arr[ind] - arr[i]);
                r = (arr[ind] + arr[i] + 1)/2 - 1;
            }
            update(arr[i], 0, i);
            for(pii j : que[i]){
                ans[j.ss] = min(ans[j.ss], query(j.ff, i, 1));
            }
        }
        reverse(arr + 1, arr + n + 1);
    }
    for(int i = 0; i < q; i++) cout << ans[i] << "\n";
}
```