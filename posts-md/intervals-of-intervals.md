title: Intervals Of Intervals (Tutorial)
date: 12-20-2022
tag: cf, chtholly tree, binary search, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1034/D)

## Solution

Lets first see if we can find the length of the \\(k\\)th largest interval of intervals. This already seems hard. However, we can reduce the problem by binary searching on this largest interval length, then checking the amount of intervals that are smaller than or equal to that amount. Then, for each right endpoint, we want to be able to check the length of all the left endpoints. These lenghts are obviously monotonically increasing, so we can maintain a two pointer to always count the number of leftbounds that have the correct length. The length of a current interval while moving it to the right can be maintained by a segtree or other data structure. Now, how can we dount the sum of interval lengths smaller than a given length? For a given right endpoint, we should somehow be able to count the interval length for every left endpoint. Actually, if we mark every cell covered by by the prefix leading up to the right endpoint with the most recent interval index that covers it, then the answer for a left endpoint is just the number of cells that have a mark greater than or equal to that left endpoint. Now, we can use a chtholly tree to mark the cells, and a segtree to maintain the answer for every left endpoint, since covering new cells is a range add for some segment of left endpoints. Chtholly tree can also be used to count the number length of the interval of intervals of an interval. The range add can be done in constant time since the left endpoint is always increasing, and we only want to do point queries. Now, we have a \\(O(N log^2 N)\\) solution. However, this is still too slow. Notice that the log from the chtholly tree comes from the lower bound that we call every time we want to remove an interval, and the chtholly tree we use for each iteration of the binary search is the same. Thus, we can precompute the chtholly tree for a \\(O(N log N)\\) solution. After binary searching on the longest length, there are still some leftover values. These are guranteed to be one greater than the found length.


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

vector<pair<pii, int>> upd[300005];
set<pair<pii, int>> s;

void split(int ind){
    auto x = *prev(s.lower_bound({{ind + 1, -1}, -1}));
    if(x.ff.ff < ind && x.ff.ss >= ind){
        s.erase(x);
        s.insert({{x.ff.ff, ind - 1}, x.ss});
        s.insert({{ind, x.ff.ss}, x.ss});
    }
}

int n, k;

ll check(int x){
    int pre[n + 2];
    memset(pre, 0, sizeof(pre));
    int sum = 0;
    ll cur = 0;
    int l = 1, r = 1;
    while(r <= n){
        for(auto i : upd[r]){
            if(i.ff.ff <= l) sum += i.ss;
            else pre[i.ff.ff] += i.ss;
            pre[i.ff.ss + 1] -= i.ss;
        }
        r++;
        while(sum > x) sum += pre[++l];
        cur += r - l;
    }
    return cur;
}

int main(){
    setIO();
    cin >> n >> k;
    pii arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i].ff >> arr[i].ss, arr[i].ss--;
    s.insert({{1, INF}, 0});
    vector<pair<pii, int>> que[n + 1];
    for(int i = 1; i <= n; i++){
        split(arr[i].ff);
        split(arr[i].ss + 1);
        set<pair<pii, int>>::iterator it = s.lower_bound({{arr[i].ff, -1}, -1});
        while(it != s.end() && (*it).ff.ss <= arr[i].ss){
            auto x = *it;
            upd[i].pb({{x.ss + 1, i}, (x.ff.ss - x.ff.ff + 1)});
            it = s.erase(it);
        }
        s.insert({arr[i], i});
    }
    int tar;
    {
        int l = 0, r = INF;
        while(l < r){
            int mid = (l + r + 1)/2;
            if(check(mid) <= (ll)n*(n + 1)/2 - k) l = mid;
            else r = mid - 1;
        }
        tar = l;
    }
    ll cumsum = 0;
    {
        ll tot = (ll)n*(n + 1)/2 - k;
        int pre[n + 2];
        memset(pre, 0, sizeof(pre));
        int sum = 0;
        ll ssum = 0;
        int l = 1, r = 1;
        while(r <= n){
            for(auto i : upd[r]){
                if(i.ff.ff <= l) sum += i.ss;
                ssum += (ll)(i.ff.ss + 1 - max(l, i.ff.ff))*i.ss;
                pre[i.ff.ff] += i.ss;
                pre[i.ff.ss + 1] -= i.ss;
            }
            r++;
            while(sum > tar){
                ssum -= sum;
                sum += pre[++l];
            }
            tot -= r - l;
            cumsum -= ssum;
        }
        cumsum -= tot*(tar + 1);
    }
    ll sum = 0;
    for(int i = 1; i <= n; i++){
        for(auto j : upd[i]) sum += (ll)(j.ff.ss - j.ff.ff + 1)*j.ss;
        cumsum += sum;
    }
    cout << cumsum << endl;
}
```