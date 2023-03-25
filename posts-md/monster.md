title: Monster (Tutorial)
date: 3-25-2023
tag: atcoder, dp, tree, slope trick, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/abc275/tasks/abc275_h)

## Solution

Since the price of shooting an interval is given by the maximum in that interval, it is choose intervals by max, since for each maximum, it is optimal to create an interval until it reaches the next greater. Thus, we only actually have \\(N\\) intervals to consider. We could perhaps greedily choose intervals, but it is hard to decide which intervals are best. So, our solution most likely needs dynamic programming. Actually, lets look at our intervals. If all values are distinct, none of our intervals actually intersect each other, so we can build a cartesian tree like structure on the intervals. In one operation, a node will subtract from itself and all nodes in the subtree. Thus, for each node, we really only care about the maximum hp in the subtree. This motivates a dp solution with \\(dp[i][j] = \\) the minimium cost to have a maximum of \\(j\\) at node \\(i\\). Transitions are just taking the sum of all the children, and forcing the max to be at least the health at node \\(i\\). Then for each node, try decreasing the maximum with the cost at that node. Actually, since the decrements are all done using the same slope, we can try to apply slope trick to this problem, storing intervals of slopes instead of all the values. This can be done using a map of the difference array. Notice that when adding a slope, it will always be for some prefix, since the slopes will be stored in decreasing order, so we just remove while it is optimal. The implementation for this may be a bit tricky.

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

pii seg[400005];
pii arr[100005];
int n;

void build(int l = 1, int r = n, int cur = 0){
    if(l == r){
        seg[cur] = {arr[l].ss, l};
        return;
    }
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    build(mid + 1, r, cur*2 + 2);
    seg[cur] = max(seg[cur*2 + 1], seg[cur*2 + 2]);
}

pii query(int l, int r, int ul = 1, int ur = n, int cur = 0){
    if(l <= ul && ur <= r) return seg[cur];
    int mid = (ul + ur)/2;
    if(r <= mid) return query(l, r, ul, mid, cur*2 + 1);
    if(l > mid) return query(l, r, mid + 1, ur, cur*2 + 2);
    return max(query(l, r, ul, mid, cur*2 + 1), query(l, r, mid + 1, ur, cur*2 + 2));
}

vector<int> g[100005];

int dnq(int l = 1, int r = n){
    if(l >= r) return l;
    int mid = query(l, r).ss;
    if(l <= mid - 1) g[mid].pb(dnq(l, mid - 1));
    if(mid + 1 <= r) g[mid].pb(dnq(mid + 1, r));
    return mid;
}

map<int, ll> dp[100005];
ll st[100005];

void dfs(int x){
    if(g[x].size() == 0){
        st[x] = (ll)arr[x].ff*arr[x].ss;
        dp[x][1] -= arr[x].ss;
        dp[x][arr[x].ff + 1] += arr[x].ss;
        return;
    }
    for(int i : g[x]){
        dfs(i);
        if(dp[i].size() > dp[x].size()){
            swap(dp[i], dp[x]);
            swap(st[i], st[x]);
        }
        st[x] += st[i];
        for(pll j : dp[i]){
            dp[x][j.ff] += j.ss;
        }
    }
    ll cur = st[x];
    ll step = 0;
    //[0, prv)
    int prv = 0;
    dp[x][arr[x].ff + 1] += 0;
    map<int, ll>::iterator it = dp[x].begin();
    while(it != dp[x].end() && (*it).ff <= arr[x].ff){
        cur += step*((*it).ff - prv);
        prv = (*it).ff;
        step += (*it).ss;
        it = dp[x].erase(it);
    }
    cur += step*(arr[x].ff - prv + 1);
    prv = arr[x].ff + 1;
    while(it != dp[x].end() && step + (*it).ss <= -arr[x].ss){
        cur += step*((*it).ff - prv);
        prv = (*it).ff;
        step += (*it).ss;
        it = dp[x].erase(it);
    }
    assert(it != dp[x].end());
    cur += (ll)step*((*it).ff - prv);
    prv = (*it).ff - 1;
    dp[x][1] -= arr[x].ss;
    dp[x][prv + 1] += arr[x].ss + step;
    st[x] = cur + (ll)prv*arr[x].ss;
}

int main(){
    setIO();
    cin >> n;
    for(int i = 1; i <= n; i++) cin >> arr[i].ff;
    for(int i = 1; i <= n; i++) cin >> arr[i].ss;
    build();
    int rt = dnq();
    dfs(rt);
    cout << st[rt] << endl;
}
```