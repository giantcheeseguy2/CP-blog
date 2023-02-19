title: Maximums And Minimums (Tutorial)
date: 2-1-2023
tag: cf, math, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1730/E)

## Solution

Dealing with maximums and minimums is hard, so lets see if we can fix them to make the problem easier. Our input value are bounded to have at most \\(100\\) divisors, but there is no bound on the number of values that it divides, so we should intuitively want to fix the max rather than the min. Now, for each max, we can iterate over its divisors to get all max min pairs. The only thing left is to count the number of intervals that contains this pair. This is a bit tricky, since not all values are guranteed to be distinct, and we don't want to overcount max min pairs. To get around this for maxes, we can just choose to always fix the rightmost max in the interval, and never extend the interval past the previous value greater than or equal to it. It is easy to see that this counts correctly. For each max min pair, we first have to make sure that at least one interval of them is possible, so we should maintain the closest min to the left and right of any index. If this is possible, we can try extending the intervals as far as possible, dealing with the three cases for when only one of the two mins is used or both of them are used. Note that there is some casework in case there only exists one minimum to the right or left of a max. Divisors can be precomputed using brute force, and our final complexity is \\O(N \\cdot divisors)\\).

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

const int MX = 1000000;
vector<int> fact[1000005];
vector<int> pos[1000005];
int ind[1000005];

int main(){
    setIO();
    int t;
    cin >> t;
    for(int i = 1; i <= MX; i++){
        for(int j = i; j <= MX; j += i){
            fact[j].pb(i);
        }
    }
    memset(ind, -1, sizeof(ind));
    for(int tt = 1; tt <= t; tt++){
        int n;
        cin >> n;
        int arr[n + 1];
        for(int i = 1; i <= n; i++){
            cin >> arr[i];
            pos[arr[i]].pb(i);
        }
        int nxtg[n + 1], prvge[n + 1], nxtl[n + 1], prvl[n + 1];
        {
            stack<pii> s;
            s.push({INF, 0});
            for(int i = 1; i <= n; i++){
                while(arr[i] > s.top().ff) s.pop();
                prvge[i] = s.top().ss;
                s.push({arr[i], i});
            }
        }
        {
            stack<pii> s;
            s.push({INF, n + 1});
            for(int i = n; i >= 1; i--){
                while(arr[i] >= s.top().ff) s.pop();
                nxtg[i] = s.top().ss;
                s.push({arr[i], i});
            }
        }
        {
            stack<pii> s;
            s.push({0, 0});
            for(int i = 1; i <= n; i++){
                while(arr[i] <= s.top().ff) s.pop();
                prvl[i] = s.top().ss;
                s.push({arr[i], i});
            }
        }
        {
            stack<pii> s;
            s.push({0, n + 1});
            for(int i = n; i >= 1; i--){
                while(arr[i] <= s.top().ff) s.pop();
                nxtl[i] = s.top().ss;
                s.push({arr[i], i});
            }
        }
        ll ans = 0;
        for(int i = 1; i <= n; i++){
            ind[arr[i]]++;
            int l1 = prvge[i] + 1, r1 = nxtg[i] - 1;
            ll tot = 0;
            for(int j : fact[arr[i]]){
                if(!pos[j].size()) continue;
                int l2, r2;
                if(ind[j] != -1) l2 = pos[j][ind[j]];
                else l2 = 0;
                if(ind[j] + 1 < pos[j].size()) r2 = pos[j][ind[j] + 1];
                else r2 = n + 1;
                if(j == arr[i]) l2 = r2 = i;
                int l = l1, r = r1;
                if(l2 && nxtl[l2] < i) l2 = 0;
                if(r2 <= n && prvl[r2] > i) r2 = n + 1;
                if(l2) l = max(l, prvl[l2] + 1);
                if(r2 <= n) r = min(r, nxtl[r2] - 1);
                //cout << i << " " << j << " " << l2 << " " << r2 << endl;
                if(l > i || r < i) continue;
                if(l2 < l && r2 > r) continue;
                ll add = 0;
                if(l2 < l && r2 <= r){
                    l = max(l, prvl[r2] + 1);
                    if(i >= l) add += (ll)(r - r2 + 1)*(i - l + 1);
                }
                if(l2 >= l && r2 > r){
                    r = min(r, nxtl[l2] - 1);
                    if(r >= i) add += (ll)(l2 - l + 1)*(r - i + 1);
                }
                if(l2 >= l && r2 <= r){
                    int nl = l, nr = r;
                    if(r2 <= n) nl = max(nl, prvl[r2] + 1);
                    if(l2) nr = min(nr, nxtl[l2] - 1);
                    if(nl <= l2 && nr >= r2) add += (ll)(l2 - nl + 1)*(nr - r2 + 1);
                    add += (ll)(r - r2 + 1)*(i - l2);
                    add += (ll)(l2 - l + 1)*(r2 - i);
                }
                tot += add;
            }
            ans += tot;
        }
        cout << ans << endl;
        for(int i = 1; i <= n; i++) pos[arr[i]].clear(), ind[arr[i]] = -1;
    }
}
```