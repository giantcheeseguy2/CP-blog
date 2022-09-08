title: Tree Partition (Tutorial)
date: 9-7-2022
tag: cf, dp, tree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/103860/problem/D)

## Solution

When is it possible for the interval \\([l, r]\\) to be in a component? Lets store the maximum and minimum on the path from \\(i\\) to \\(i + 1\\) at \\(i\\). Now, if we take the range max and min in the range \\([l, r - 1]\\), and they are all within the range \\([l, r]\\), then it must always be possible. Now we can construct an \\(N^2 \\cdot K\\) solution, where \\(dp[i][j] = \\) the number of ways to partition the array up to \\(i\\) while using \\(j\\) components. Now to transition to \\(i\\), we must find an index \\(k\\) such that min of \\([k, i]\\) is \\(k\\) and max of \\([k, i]\\) is \\(i\\). Notice that the minimum and maximum going to the left are all monotonic. So lets store the dp value at \\(k\\) if min of \\([k, i]\\) is \\(k\\), otherwise \\(0\\). Now we just have to query the range sum of the interval such that the maximum is \\(i\\). Every minimum update will only update one index to its dp value, and set every other index to \\(0\\), so we need a lazy tag as well. This problem requires heavy memory optimizations.

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
const int MOD = 998244353;

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;

inline ll ceil0(ll a, ll b) {
    return a / b + ((a ^ b) > 0 && a % b);
}

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

vector<int> g[200005];
int par[200005][18];
int depth[200005];
pii sum[200005][18];

void dfs(int x, int p){
    depth[x] = depth[p] + 1;
    par[x][0] = p;
    sum[x][0] = {x, x};
    for(int i : g[x]){
        if(i == p) continue;
        dfs(i, x);
    }
}

pii comp(pii a, pii b){
    return {min(a.ff, b.ff), max(a.ss, b.ss)};
}

pii lca(int a, int b){
    if(depth[a] > depth[b]) swap(a, b);
    pii ret = {min(a, b), max(a, b)};
    for(int i = 17; i >= 0; i--) if(depth[par[b][i]] >= depth[a]) ret = comp(ret, sum[b][i]), b = par[b][i];
    if(a == b) return ret;
    for(int i = 17; i >= 0; i--){
        if(par[a][i] != par[b][i]){
            ret = comp(ret, comp(sum[a][i], sum[b][i]));
            a = par[a][i];
            b = par[b][i];
        }
    }
    ret = comp(ret, {par[a][0], par[a][0]});
    ret = comp(ret, sum[a][0]);
    ret = comp(ret, sum[b][0]);
    return ret;
}

struct node {
    array<int, 401> val;

    node(){
        fill(val.begin(), val.end(), 0);
    }

};

const int MX = (1 << 19);

node seg[MX + 50];
bitset<MX + 50> tag;
bitset<MX + 50> leaf;

void push_down(int x, int l, int r){
    if(!tag[x]) return;
    int mid = (l + r)/2;
    if(l == mid) leaf[x*2 + 1] = true;
    else fill(seg[x*2 + 1].val.begin(), seg[x*2 + 1].val.end(), 0);
    if(mid + 1 == r) leaf[x*2 + 2] = true;
    else fill(seg[x*2 + 2].val.begin(), seg[x*2 + 2].val.end(), 0);
    tag[x*2 + 1] = tag[x*2 + 2] = true;
    tag[x] = false;
}
    
int n, k;

void update(int x, node &v, int l = 1, int r = n, int cur = 0){
    if(l == r){
        seg[cur] = v;
        return;
    }
    push_down(cur, l, r);
    int mid = (l + r)/2;
    if(x <= mid) update(x, v, l, mid, cur*2 + 1);
    else update(x, v, mid + 1, r, cur*2 + 2);
    for(int i = 0; i <= 400; i++) seg[cur].val[i] = ((!leaf[cur*2 + 1] ? seg[cur*2 + 1].val[i] : 0) + (!leaf[cur*2 + 2] ? seg[cur*2 + 2].val[i] : 0))%MOD;
}

void toggle(int x, int l = 1, int r = n, int cur = 0){
    if(l == r){
        leaf[cur] = false;
        return;
    }
    push_down(cur, l, r);
    int mid = (l + r)/2;   
    if(x <= mid) toggle(x, l, mid, cur*2 + 1);
    else toggle(x, mid + 1, r, cur*2 + 2);
    for(int i = 0; i <= 400; i++) seg[cur].val[i] = ((!leaf[cur*2 + 1] ? seg[cur*2 + 1].val[i] : 0) + (!leaf[cur*2 + 2] ? seg[cur*2 + 2].val[i] : 0))%MOD;
}

void rem(int l, int r, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r){
        if(ul == ur) leaf[cur] = true;
        else {
            tag[cur] = true;
            fill(seg[cur].val.begin(), seg[cur].val.end(), 0);
        }
        return;
    }
    push_down(cur, ul, ur);
    int mid = (ul + ur)/2;
    if(l <= mid) rem(l, r, ul, mid, cur*2 + 1);
    if(r > mid) rem(l, r, mid + 1, ur, cur*2 + 2);
    for(int i = 0; i <= 400; i++) seg[cur].val[i] = ((!leaf[cur*2 + 1] ? seg[cur*2 + 1].val[i] : 0) + (!leaf[cur*2 + 2] ? seg[cur*2 + 2].val[i] : 0))%MOD;
}

int ind;

int query(int l, int r, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r){
        seg[ind] = seg[cur];
        if(leaf[cur]) fill(seg[ind].val.begin(), seg[ind].val.end(), 0);
        return ind++;
    }
    push_down(cur, ul, ur);
    int mid = (ul + ur)/2;
    if(r <= mid) return query(l, r, ul, mid, cur*2 + 1);
    if(l > mid) return query(l, r, mid + 1, ur, cur*2 + 2);
    int a = query(l, r, ul, mid, cur*2 + 1);
    int b = query(l, r, mid + 1, ur, cur*2 + 2);
    for(int i = 0; i <= 400; i++) seg[ind].val[i] = (seg[a].val[i] + seg[b].val[i])%MOD;
    return ind++;
}

int main(){
    setIO();
    cin >> n >> k;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs(1, 1);
    for(int i = 1; i < 18; i++){
        for(int j = 1; j <= n; j++){
            par[j][i] = par[par[j][i - 1]][i - 1];
            sum[j][i] = comp(sum[par[j][i - 1]][i - 1], sum[j][i - 1]);
        }
    }
    pii arr[n];
    for(int i = 1; i < n; i++) arr[i] = lca(i, i + 1);
    map<int, pii> m;
    //mn, mx
    stack<pii> s1, s2;
    node dp[2];
    dp[0].val[0] = 1;
    for(int i = 1; i <= n; i++){ 
        update(i, dp[0]);
        if(m.find(i) != m.end()){
            pii tar = m[i];
            ind = MX + 1;
            dp[1] = seg[query(tar.ff, tar.ss)];
            for(int j = k; j >= 1; j--) dp[1].val[j] = dp[1].val[j - 1]; 
            dp[1].val[0] = 0;
        }
        for(int j = 1; j <= k; j++) dp[1].val[j] = (dp[1].val[j] + dp[0].val[j - 1])%MOD; 
        if(i < n){
            {
                int prv = i;
                while(!s1.empty() && s1.top().ff >= arr[i].ff){
                    prv = s1.top().ss;
                    s1.pop();
                }
                s1.push({arr[i].ff, prv});
                rem(prv, i);
                if(prv <= arr[i].ff && arr[i].ff <= i){
                    toggle(arr[i].ff);
                }
            }
            {
                int prv = i;
                while(!s2.empty() && s2.top().ff <= arr[i].ss){
                    m.erase(s2.top().ff);
                    prv = s2.top().ss;
                    s2.pop();
                }
                s2.push({arr[i].ss, prv});
                m[arr[i].ss] = {prv, i};
            }
        }
        for(int j = 0; j <= k; j++) dp[0].val[j] = dp[1].val[j], dp[1].val[j] = 0;
    }
    /*for(int i = 0; i <= k; i++){
        for(int j = 0; j <= n; j++) cout << dp[j].val[i] << " ";
        cout << endl;
    }*/
    for(int i = 1; i <= k; i++) cout << dp[0].val[i] << endl;
}
```