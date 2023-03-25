title: Range Subsequence Unique Sum (Tutorial)
date: 3-16-2023
tag: xyd, math, mo's, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/70/problem/305)

## Solution

Lets first find the solution for the problem given a single interval. This is actually just \\(\\sum (2^L - 2^{L - occ}) \\cdot x\\), where \\(x\\) is the distinct value, \\(L\\) is the length of the interval, and \\(occ\\) is the amount of times it \\(x\\) occurs. This is done by complementary counting and subtracting all subsequences without \\(x\\). Now to deal with the changing mod, we have to somehow manually evaluate this equation for every query. Actually, for a given interval, the amount of distinct occurences is bounded by \\(\\sqrt{N}\\). Thus, if we just maintain the sum of \\(x\\) for each distinct occurence, we can go through and compute each value indepedently in time. To maintain the sum, we can use mo's algorithm since we are adding and removing elements from a set. Now, we have a \\(N \\cdot \\sqrt{N} \\cdot log N\\) solution, by applying mo's and using a set to maintain all unique occurences, and using binary exponentiation to compute the powers of \\(2\\). We can optimize out the binary exponentiation by manually creating buckets of \\(2^{c_1 \\cdot \\sqrt{N}}\\) and \\(2^c_2\\). Thus we can make any combination of \\(2^x\\) with at most \\(\\sqrt{N}\\) uses of \\(c_1\\) and \\(c_2\\). Now, we only have to optimize out the log from using a set to maintain distinct occurences. Lets say we have a vector of the values instead. Now, insertion, is just adding to the back of the vector. Removal is swapping the vector element to the end, then popping it out. Thus, we can maintain this structure by storing the position of each element in the vector as well.

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
using namespacee std;

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

const int MX = 500;
ll sum[100005];
ll cum = 0;
int occ[100005];

bool comp(pair<pii, pii> a, pair<pii, pii> b){
    if(a.ff.ff/MX == b.ff.ff/MX) return a.ff.ss < b.ff.ss;
    return a.ff.ff/MX < b.ff.ff/MX;
}

set<int, greater<int>> s;

int sz = 0;
int val[100005], pos[100005];

void add(int x){
    sz++;
    swap(val[sz], val[pos[x]]);
    swap(pos[val[sz]], pos[val[pos[x]]]);
}

void und(int x){
    swap(val[sz], val[pos[x]]);
    swap(pos[val[sz]], pos[val[pos[x]]]);
    sz--;
}

void ins(int x){
    sum[occ[x]] -= x;
    if(!sum[occ[x]]) und(occ[x]);
    occ[x]++;
    if(!sum[occ[x]]) add(occ[x]);
    sum[occ[x]] += x;
}

void rem(int x){
    sum[occ[x]] -= x;
    if(!sum[occ[x]]) und(occ[x]);
    occ[x]--;
    if(!sum[occ[x]]) add(occ[x]);
    sum[occ[x]] += x;
}

int bpow2[MX + 1];
int pow2[MX + 1];

int fpow(int x, int p){
    return (ll)bpow2[x/MX]*pow2[x%MX]%p;
}

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    int arr[n + 1];
    for(int i = 1; i <= n; i++) val[i] = pos[i] = i;
    for(int i = 1; i <= n; i++) cin >> arr[i], sum[0] += arr[i];
    int ans[q];
    vector<pair<pii, pii>> que;
    for(int i = 0; i < q; i++){
        int l, r, p;
        cin >> l >> r >> p;
        que.pb({{l, r}, {p, i}});
    }
    //[l, r]
    int l = 1, r = 0;
    sort(que.begin(), que.end(), comp);
    for(auto i : que){
        while(r < i.ff.ss){
            ins(arr[r + 1]);
            r++;
        }
        while(l > i.ff.ff){
            ins(arr[l - 1]);
            l--;
        }
        while(r > i.ff.ss){
            rem(arr[r]);
            r--;
        }
        while(l < i.ff.ff){
            rem(arr[l]);
            l++;
        }
        int tot = 0;
        pow2[0] = 1;
        for(int j = 1; j <= MX; j++) pow2[j] = (ll)pow2[j - 1]*2%i.ss.ff;
        bpow2[0] = 1;
        for(int j = 1; j <= MX; j++){
            bpow2[j] = (ll)bpow2[j - 1]*pow2[MX]%i.ss.ff;
        }
        int mult = fpow(i.ff.ss - i.ff.ff + 1, i.ss.ff);
        for(int k = 1; k <= sz; k++){
            int j = val[k];
            (tot += (ll)mult*sum[j]%i.ss.ff) %= i.ss.ff;
            (tot += i.ss.ff - (ll)fpow(i.ff.ss - i.ff.ff + 1 - j, i.ss.ff)*sum[j]%i.ss.ff) %= i.ss.ff;
        }
        ans[i.ss.ss] = tot;
    }
    for(int i = 0; i < q; i++) cout << ans[i] << "\n";
}
```