title: Why did the cow cross the road 3 (Tutorial)
date: 10-23-2022
tag: usaco, segtree, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=722)

## Solution

Lets try to count the number of friendly pairs, then subtract it from the number of unfriendly. Checking the pairs can be reduced to counting inversions, so we want to count inversions of all cows with an id within \\(K\\). Its the same problem as checking the number of inversions of an array while supporting toggling some values on and some values off. Doing this with as well as a PIE lets you check how many inversions cow \\(i\\) will create if added to a group containing \\([i - k, i - 1]\\).

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

int bit[100005];
int n, k;

void update(int x, int v){
    for(; x <= n; x += x & (-x)) bit[x] += v;
}

int query(int x, int ret = 0){
    for(; x; x -= x & (-x)) ret += bit[x];
    return ret;
}

vector<pair<int, pii>> que;
ll ans = 0;

void dnq(int l = 0, int r = que.size() - 1){
    if(l == r) return;
    int mid = (l + r)/2;
    dnq(l, mid);
    dnq(mid + 1, r);
    int a = l, b = mid + 1;
    vector<pii> v1;
    vector<pair<int, pii>> v2;
    int sum = 0;
    while(a <= mid && b <= r){
        if(que[a].ss.ff <= que[b].ss.ff){
            if(que[a].ff != 0){
                update(que[a].ss.ss, que[a].ff);
                sum += que[a].ff;
                v1.pb({que[a].ss.ss, -que[a].ff});
            }
            v2.pb(que[a++]);
        } else {
            if(que[b].ff == 0) ans -= sum - query(que[b].ss.ss);
            v2.pb(que[b++]);
        }
    }
    while(a <= mid) v2.pb(que[a++]);
    while(b <= r){
        if(que[b].ff == 0) ans -= sum - query(que[b].ss.ss);
        v2.pb(que[b++]);
    }
    for(pii i : v1) update(i.ff, i.ss);
    v1.clear();
    a = mid, b = r;
    while(a >= l && b > mid){
        if(que[a].ss.ff >= que[b].ss.ff){
            if(que[a].ff != 0){
                update(que[a].ss.ss, que[a].ff);
                v1.pb({que[a].ss.ss, -que[a].ff});
            }
            a--;
        } else {
            if(que[b].ff == 0) ans -= query(que[b].ss.ss - 1);
            b--;
        }
    }
    while(b > mid){
        if(que[b].ff == 0) ans -= query(que[b].ss.ss - 1);
        b--;
    }
    for(pii i : v1) update(i.ff, i.ss);
    for(int i = l; i <= r; i++) que[i] = v2[i - l];
}

int main(){
    setIO();
    freopen("friendcross.in", "r", stdin);
    freopen("friendcross.out", "w", stdout);
    cin >> n >> k;
    int arr[n + 1][2];
    int pos[n + 1][2];
    for(int i = 1; i <= n; i++) cin >> arr[i][0], pos[arr[i][0]][0] = i;
    for(int i = 1; i <= n; i++) cin >> arr[i][1], pos[arr[i][1]][1] = i;
    k++;
    for(int i = 1; i <= k; i++){
        que.pb({1, {pos[i][0], pos[i][1]}});
        que.pb({0, {pos[i][0], pos[i][1]}});
    }
    for(int i = k + 1; i <= n; i++){
        que.pb({-1, {pos[i - k][0], pos[i - k][1]}});
        que.pb({1, {pos[i][0], pos[i][1]}});
        que.pb({0, {pos[i][0], pos[i][1]}});
    }
    dnq();
    int val[n + 1];
    for(int i = 1; i <= n; i++) val[pos[i][0]] = pos[i][1];
    for(int i = 1; i <= n; i++) bit[i] = 0;
    for(int i = n; i >= 1; i--){
        for(int j = val[i]; j; j -= j & (-j)) ans += bit[j];
        for(int j = val[i]; j <= n; j += j & (-j)) bit[j]++;
    }
    cout << ans << endl;
}
```