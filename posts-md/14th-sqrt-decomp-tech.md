title: 14th Sqrt Decomp Tech (Tutorial)
date: 1-30-2023
tag: xyd, mo's, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/28/problem/141)

## Solution

This seems hard to maintain, but we can notice that there are only \\(14 \\choose k\\) numbers with \\(k\\) bits, which is around \\(3500\\) in the worst case. Knowing this, we can now maintain the count of pairs of numbers in a set while supporting removals and deletions. This is actually the structure of Mo's algorithm, however, it is still too slow, with a complexity of \\(O(N \\sqrt{N} \\cdot 3500)\\). Optimizing these queries any other way seems hard, so lets see if we can optimize the Mo's. Our Mo's transition requires checking the number of pairs between one interval and another, with the property that the total length of transition intervals is bounded. So if we can check the number of pairs between an index and an interval fast, we can optimize our solution down to \\(O(N \\sqrt{N})\\). We can actually process this offline by splitting each query into the pairs with a prefix instead of an interval, but now we will have \\(O(N \\sqrt{N})\\) memory. To cut this down, notice that our transition intervals are always an interval. Thus, we dont have to store each point seperately, and we can just store the \\(O(Q)\\) intervals. However, this only lets us query one of the two needed prefix sums. To fix this, notice that the in every case, the prefix sum query we need is always between \\(i\\) and \\([1, i]\\). Thus, we can precompute this to get the transitions for the Mo's.

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

const int MX = 300;

bool comp(pair<pii, int> a, pair<pii, int> b){
    if(a.ff.ff/MX == b.ff.ff/MX) return a.ff.ss < b.ff.ss;
    return a.ff.ff/MX < b.ff.ff/MX;
}

int cnt[1 << 14 | 1];
ll cur = 0;
vector<int> v;

int main(){
    setIO();
    int n, q, k;
    cin >> n >> q >> k;
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i];
    arr[0] = 1 << 14;
    vector<pair<pii, int>> que;
    for(int i = 0; i < q; i++){
        int l, r;
        cin >> l >> r;
        que.pb({{l, r}, i});
    }
    sort(que.begin(), que.end(), comp);
    //[l, r]
    int l = 1, r = 0;
    //[min, max)
    vector<pair<int, pii>> prop[n + 1];
    for(int j = 0; j < q; j++){
        auto i = que[j];
        if(r < i.ff.ss){
            prop[l - 1].pb({j, {r, i.ff.ss}});
            r = i.ff.ss;
        }
        if(l < i.ff.ff){
            prop[r].pb({j, {i.ff.ff, l}});
            l = i.ff.ff;
        }
        if(l > i.ff.ff){
            prop[r].pb({j, {i.ff.ff, l}});
            l = i.ff.ff;
        }
        if(r > i.ff.ss){
            prop[l - 1].pb({j, {r, i.ff.ss}});
            r = i.ff.ss;
        }
    }
    vector<int> v;
    for(int i = 0; i < (1 << 14); i++) if(__builtin_popcount(i) == k) v.pb(i);
    ll add[q];
    int same[n + 1];
    int nxt[n + 1];
    memset(same, 0, sizeof(same));
    memset(nxt, 0, sizeof(nxt));
    memset(add, 0, sizeof(add));
    for(int i = 1; i <= n; i++){
        for(int j : v) cnt[j ^ arr[i]]++;
        same[i] = cnt[arr[i]];
        if(i + 1 <= n) nxt[i] = cnt[arr[i + 1]];
    }
    memset(cnt, 0, sizeof(cnt));
    for(int i = 0; i <= n; i++){
        if(i){
            for(int j : v) cnt[j ^ arr[i]]++;
        }
        for(auto j : prop[i]){
            if(j.ss.ff > j.ss.ss){
                for(int k = j.ss.ss; k < j.ss.ff; k++){
                    if(k > i){
                        add[j.ff] -= nxt[k] - cnt[arr[k + 1]];
                    } else {
                        add[j.ff] -= cnt[arr[k]] - same[k];
                    }
                }
            } else {
                for(int k = j.ss.ff; k < j.ss.ss; k++){
                    if(k > i){
                        add[j.ff] += nxt[k] - cnt[arr[k + 1]];
                    } else {
                        add[j.ff] += cnt[arr[k]] - same[k];
                    }
                } 
            }
        }
    }
    ll ans[q], cur = 0;
    for(int i = 0; i < q; i++){
        cur += add[i];
        ans[que[i].ss] = cur;
    }
    for(int i = 0; i < q; i++) cout << ans[i] << "\n";
}
```