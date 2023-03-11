title: Hungry cow (Tutorial)
date: 3-10-2023
tag: usaco, segtree, persistent segtree, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1308)

## Solution

If the updates were all increasing, we can easily do this using a chtholly tree maintaining all intervals of set days. However, this doesn't support decreasing updates. We could make all updates increasing by applying dynacon trick, but then the chtholly tree amortization breaks. Instead, lets try to solve the increasing case without amortization. We can actually easily do this with a sparse segtree by walking while right while the amount filled is equal to the interval size. Now, we can do the dynacon, however our log is of \\(10^14\\) instead of \\(10^5\\), which could be too slow. We can actually compress all the intervals in between query nodes into one, and do the same operation. The only thing we have to change is that we can only rollback the operations instead of range subtract. Thus, we can solve it with dynacon and persistent segtree.

## Code

```c++
#pragma GCC optimize("O3")
#pragma GCC optimization ("unroll-loops")
#pragma GCC target("sse,sse2,sse3,ssse3,sse4,popcnt,abm,mmx,tune=native")
#include <bits/stdc++.h>
using namespace std;

#define pb push_back
#define ff first
#define ss second

typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;

const int INF = 1e9;
const ll LLINF = 1e18;
const int MOD = 1e9 + 7;

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

int div2 = (MOD + 1)/2;

int sum(ll a, ll b){
    if(b == 0) return 0;
    a %= MOD;
    b %= MOD;
    return ((ll)b*(b + 1)%MOD*div2%MOD + MOD - (ll)(a - 1)*a%MOD*div2%MOD)%MOD;
}

vector<ll> dict;

int ans[10000005];
int full[10000005];
ll rem[10000005];
int left0[10000005];
int right0[10000005];
bool tag[10000005];
int sz = 1;

int copy(int x){
    ans[sz] = ans[x];
    rem[sz] = rem[x];
    left0[sz] = left0[x];
    right0[sz] = right0[x];
    tag[sz] = tag[x];
    full[sz] = full[x];
    return sz++;
}

void push_down(int cur){
    if(!tag[cur]) return;
    left0[cur] = copy(left0[cur]);
    right0[cur] = copy(right0[cur]);
    ans[left0[cur]] = full[left0[cur]];
    ans[right0[cur]] = full[right0[cur]];
    rem[left0[cur]] = rem[right0[cur]] = 0;
    tag[left0[cur]] = tag[right0[cur]] = true;
    tag[cur] = false;
}

void build(int cur, int l = 0, int r = dict.size() - 2){
    if(l == r){
        rem[cur] = dict[l + 1] - dict[l];
        full[cur] = sum(dict[l], dict[l + 1] - 1);
        return;
    }
    int mid = (l + r)/2;
    build(left0[cur] = copy(left0[cur]), l, mid);
    build(right0[cur] = copy(right0[cur]), mid + 1, r);
    rem[cur] = rem[left0[cur]] + rem[right0[cur]];
    full[cur] = (full[left0[cur]] + full[right0[cur]])%MOD;
}

ll update(int x, int v, int cur, int l = 0, int r = dict.size() - 2){
    if(l >= x && v >= rem[cur]){
        ans[cur] = full[cur];
        tag[cur] = true;
        ll ret = rem[cur];
        rem[cur] = 0;
        return ret;
    }
    if(l == r){
        (ans[cur] += sum(dict[l + 1] - rem[cur], dict[l + 1] - rem[cur] + v - 1)) %= MOD;
        rem[cur] -= v;
        return v;
    }
    push_down(cur);
    int mid = (l + r)/2;
    if(x > mid){
        ll ret = update(x, v, right0[cur] = copy(right0[cur]), mid + 1, r);
        ans[cur] = (ans[left0[cur]] + ans[right0[cur]])%MOD;
        rem[cur] = rem[left0[cur]] + rem[right0[cur]];
        return ret;
    } 
    ll ret = update(x, v, left0[cur] = copy(left0[cur]), l, mid);
    if(v > ret) ret += update(x, v - ret, right0[cur] = copy(right0[cur]), mid + 1, r);
    ans[cur] = (ans[left0[cur]] + ans[right0[cur]])%MOD;
    rem[cur] = rem[left0[cur]] + rem[right0[cur]];
    return ret;
}

int ind(ll x){
    return lower_bound(dict.begin(), dict.end(), x) - dict.begin();
}

vector<pll> seg[400005];
int n;

void touch(int l, int r, pll v, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r){
        seg[cur].pb(v);
        return;
    }
    int mid = (ul + ur)/2;
    if(l <= mid) touch(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) touch(l, r, v, mid + 1, ur, cur*2 + 2);
}

int rt;

void dfs(int l = 1, int r = n, int cur = 0){
    int prv = rt;
    int prvsz = sz;
    rt = copy(rt);
    for(pll i : seg[cur]){
        update(ind(i.ff), i.ss, rt);
    }
    if(l == r){
        cout << ans[rt] << endl;
        rt = prv;
        sz = prvsz;
        return;
    }
    int mid = (l + r)/2;
    dfs(l, mid, cur*2 + 1);
    dfs(mid + 1, r, cur*2 + 2);
    rt = prv;
    sz = prvsz;
}

int main(){
    setIO();
    cin >> n;
    pll arr[n + 1];
    for(int i = 1; i <= n; i++){
        cin >> arr[i].ff >> arr[i].ss;
        dict.pb(arr[i].ff);
    }
    dict.pb(LLINF);
    sort(dict.begin(), dict.end());
    dict.resize(unique(dict.begin(), dict.end()) - dict.begin());
    rt = sz++;
    build(rt);
    map<ll, ll> m;
    for(int i = 1; i <= n; i++){
        ll prv = m[arr[i].ff];
        if(prv) touch(prv, i - 1, arr[prv]);
        m[arr[i].ff] = i;
    }
    for(auto i : m) touch(i.ss, n, arr[i.ss]);
    dfs();
}
```