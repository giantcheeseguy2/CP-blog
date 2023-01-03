title: Useful Algorithm (Tutorial)
date: 12-31-2022
tag: cf, segtree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/415667/problem/B)

## Solution

Since the answer is multipled by a different constant for every bit, it is intuitive that we should fix a bit and find the maximum pair that carries over that bit. Now how can we maintain this? For the subtasks it is possible to use some sum over subsets and recompute every update, but this clearly cannot be scaled to larger \\(N\\). Instead, lets think about when two pairs of numbers carry over bit \\(x\\). Turns out that this is when \\(c_i\\%2^x + c_j\\%2^x \\ge 2^x\\). Moving this around a bit, we get that \\(c_i\\%2^x \\ge 2^x - c_j\\%2^x\\). Finding the maximum over all pairs in this manner can be done with a segtree. Thus, we only need to maintain a segtree for each bit. 

## Code

```c++
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx2,bmi,bmi2,lzcnt,popcnt")
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

vector<ll> seg[16], mx[16][2];
priority_queue<ll> leaf[16][2][(1 << 17) + 1];
priority_queue<ll> tag[16][2][(1 << 17) + 1];

void ins(int x, int v, int t, int k, int l, int r, int cur = 0){
    if(l == r){
        leaf[k][t][l].push(v);
        while(tag[k][t][l].size() && tag[k][t][l].top() == leaf[k][t][l].top()){
            leaf[k][t][l].pop();
            tag[k][t][l].pop();
        }
        mx[k][t][cur] = leaf[k][t][l].top();
        seg[k][cur] = mx[k][0][cur] + mx[k][1][cur];
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) ins(x, v, t, k, l, mid, cur*2 + 1);
    else ins(x, v, t, k, mid + 1, r, cur*2 + 2);
    seg[k][cur] = max(seg[k][cur*2 + 1], seg[k][cur*2 + 2]);
    seg[k][cur] = max(seg[k][cur], mx[k][1][cur*2 + 1] + mx[k][0][cur*2 + 2]);
    mx[k][t][cur] = max(mx[k][t][cur*2 + 1], mx[k][t][cur*2 + 2]);
}

void rem(int x, int v, int t, int k, int l, int r, int cur = 0){
    if(l == r){
        tag[k][t][l].push(v);
        while(tag[k][t][l].size() && tag[k][t][l].top() == leaf[k][t][l].top()){
            leaf[k][t][l].pop();
            tag[k][t][l].pop();
        }
        mx[k][t][cur] = (leaf[k][t][l].size() ? leaf[k][t][l].top() : -INF);
        seg[k][cur] = mx[k][0][cur] + mx[k][1][cur];
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) rem(x, v, t, k, l, mid, cur*2 + 1);
    else rem(x, v, t, k, mid + 1, r, cur*2 + 2);
    seg[k][cur] = max(seg[k][cur*2 + 1], seg[k][cur*2 + 2]);
    seg[k][cur] = max(seg[k][cur], mx[k][1][cur*2 + 1] + mx[k][0][cur*2 + 2]);
    mx[k][t][cur] = max(mx[k][t][cur*2 + 1], mx[k][t][cur*2 + 2]);
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
    int n, m, q;
    scan(n), scan(m), scan(q);
    ll mult[m];
    pll arr[n];
    for(int i = 0; i < m; i++){
        mx[i][0].resize(1 << (i + 2) + 1, -INF);
        mx[i][1].resize(1 << (i + 2) + 1, -INF);
        seg[i].resize(1 << (i + 2) + 1, 0);
    }
    for(int i = 0; i < m; i++) scan(mult[i]);
    for(int i = 0; i < n; i++) scan(arr[i].ff);
    for(int i = 0; i < n; i++) scan(arr[i].ss);
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            int mod = 1 << (j + 1);
            ins(arr[i].ff%mod, arr[i].ss, 0, j, 0, mod);
            ins(mod - arr[i].ff%mod, arr[i].ss, 1, j, 0, mod);
        }
    }
    ll prv = 0;
    for(int i = 0; i < m; i++) prv = max(prv, seg[i][0]*mult[i]);
    cout << prv << "\n";
    while(q--){
        ll x, u, v;
        scan(x), scan(u), scan(v);
        x ^= prv, u ^= prv, v ^= prv;
        x--;
        for(int j = 0; j < m; j++){
            int mod = 1 << (j + 1);
            rem(arr[x].ff%mod, arr[x].ss, 0, j, 0, mod);
            rem(mod - arr[x].ff%mod, arr[x].ss, 1, j, 0, mod);
        }
        arr[x] = {u, v};
        for(int j = 0; j < m; j++){
            int mod = 1 << (j + 1);
            ins(arr[x].ff%mod, arr[x].ss, 0, j, 0, mod);
            ins(mod - arr[x].ff%mod, arr[x].ss, 1, j, 0, mod);
        }
        prv = 0;
        for(int i = 0; i < m; i++) prv = max(prv, seg[i][0]*mult[i]);
        cout << prv << "\n";
    }
}
```