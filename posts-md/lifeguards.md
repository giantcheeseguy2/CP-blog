title: Lifeguards (Tutorial)
date: 8-15-2022
tag: usaco, dp, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=792)

## Solution

The first thing to note is that we can immediately sell off nested intervals. Now, we have a series of intervals that form a staircase like structure. This suggests a dp solution, where \\(dp[i][j] = \\) maximum are covered at position \\(i\\) and removed \\(j\\) lifeguards. We will either transition to a interval that doesn't intersect \\(i\\), or the first interval that intersects \\(i\\). If the interval doesn't intersect, then we can use a prefix sum to calculate the maximum area covered using only cows \\(\le i\\) while deleting \\(j\\) intervals. Note that \\(i\\) isn't neccesarily used.

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

int main(){
    setIO();
    freopen("lifeguards.in", "r", stdin);
    freopen("lifeguards.out", "w", stdout);
    int n, k;
    cin >> n >> k;
    pii arr[n];
    for(int i = 0; i < n; i++){
        cin >> arr[i].ff >> arr[i].ss;
    }
    set<pii> in;
    set<pii> s;
    for(int i = 0; i < n; i++) in.insert({arr[i].ss, arr[i].ff});
    for(pii i : in){
        set<pii>::iterator it = s.lower_bound({i.ss, -1});
        while(it != s.end()) it = s.erase(it), k--;
        s.insert({i.ss, i.ff});
    }
    k = max(0, k);
    vector<pii> v;
    for(pii i : s) v.pb({i.ss, i.ff});
    sort(v.begin(), v.end());
    int dp[v.size() + 1][k + 1];
    int pre[v.size() + 1][k + 1];
    for(int i = 0; i <= v.size(); i++) for(int j = 0; j <= k; j++) dp[i][j] = pre[i][j] = -INF;
    dp[0][0] = pre[0][0] = 0;
    int ans = 0;
    s.clear();
    for(int i = 1; i <= v.size(); i++){
        set<pii>::iterator it = s.lower_bound({v[i - 1].ss, -1});
        int prv = (it == s.end() ? i : (*it).ss);
        int dist = i - prv;
        s.insert({v[i - 1].ff, i});
        dp[i][min(i, k)] = 0;
        if(prv < i){
            for(int j = 0; j <= k; j++){
                dp[i][j] = max(dp[i][j], dp[prv][max(0, j - dist + 1)] + v[i - 1].ff - v[prv - 1].ff);
            }
        }
        for(int j = 0; j <= k; j++){
            dp[i][j] = max(dp[i][j], pre[prv - 1][max(0, j - dist)] + v[i - 1].ff - v[i - 1].ss);
        }
        for(int j = 0; j <= k; j++) pre[i][j] = max((j ? pre[i - 1][j - 1] : -INF), dp[i][j]);
        ans = max(ans, dp[i][max(0, (int)(k - (v.size() - i)))]);
    }
    cout << ans << endl;
}
```