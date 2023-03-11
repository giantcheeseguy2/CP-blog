title: Conductor (Tutorial)
date: 3-4-2023
tag: xyd, cht, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/62/problem/276)

## Solution

For each building, we want to find the maximum distance from every other building, which is hard. Instead, lets see how a given building contributes to the max of other buildings. It will only contribute to \\(\\sqrt{N}\\) distinct values and intervals, since thats how many possible square roots there are. Thus, if we just update all these intervals naively, we have a \\(O(N \\cdot \\sqrt{N})\\) solution, which is still a bit too slow. Actually, for a given position, we only have to update until it is no longer optimal to update, since looking at the graph of the sqrt function, each pair will only intersect at most once. Thus, once we reach an intersection, our sqrt will no longer be the maximum. We can maintain these functions using a stack similar to convex hull trick for a linear solution.

## Code

Doesn't use convex hull trick. \\(O(N \\cdot \\sqrt{N})\\) solution.

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

int main(){
    setIO();
    int n;
    cin >> n;
    if(n == 1){
        cout << 0 << endl;
        return 0;
    }
    int arr[n + 1];
    for(int i = 1; i <= n; i++) cin >> arr[i];
    int sqr[n + 1];
    vector<int> v;
    sqr[0] = 0;
    for(int i = 1; i <= n; i++){
        sqr[i] = ceil(sqrt(i));
        if(sqr[i] != sqr[i - 1]) v.pb(i);
    }
    v.pb(n + 1);
    int in[n + 1][2];
    for(int i = 1; i <= n; i++) in[i][0] = in[i][1] = -INF;
    int pre[n + 1];
    int suf[n + 1];
    pre[1] = arr[1];
    suf[n] = arr[n];
    for(int i = 2; i <= n; i++) pre[i] = max(arr[i], pre[i - 1]);
    for(int i = n - 1; i >= 1; i--) suf[i] = max(arr[i], suf[i + 1]);
    for(int i = n; i >= 1; i--){
        if(arr[i] == pre[i]){
            for(int j = 0; j < v.size() - 1; j++){
                int nxt = i + v[j];
                if(nxt <= n && in[nxt][0] < arr[i] + sqr[v[j]]){
                    in[nxt][0] = arr[i] + sqr[v[j]];
                } else {
                    break;
                }
            }
        }
    }
    for(int i = 1; i <= n; i++){
        if(arr[i] == suf[i]){
            for(int j = 0; j < v.size() - 1; j++){
                int nxt = i - v[j];
                if(nxt > 0 && in[nxt][1] < arr[i] + sqr[v[j]]){
                    in[nxt][1] = arr[i] + sqr[v[j]];
                } else {
                    break;
                }
            }
        }
    }
    int ans[n + 1];
    memset(ans, 0, sizeof(ans));
    int mx = 0;
    for(int i = 1; i <= n; i++){
        mx = max(mx, in[i][0]);
        ans[i] = max(ans[i], mx);
    }
    mx = 0;
    for(int i = n; i >= 1; i--){
        mx = max(mx, in[i][1]);
        ans[i] = max(ans[i], mx);
    }
    for(int i = 1; i <= n; i++){
        cout << max(0, ans[i] - arr[i]) << "\n";
    }
}
```