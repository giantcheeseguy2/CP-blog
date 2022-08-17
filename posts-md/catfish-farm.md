title: Catfish Farm (Tutorial)
date: 8-16-2022
tag: ioi, dmoj, dp, tutorial

---

## Problem Statement

[Problem Link](https://dmoj.ca/problem/ioi22p1)

## Solution

The \\(O(N^4)\\) dp is trivial. \\(dp[i][j][k] = \\) answer at column \\(i\\) with previous piers of \\(j\\) and \\(k\\). This can be optimized down to \\(O(N^3)\\) by using prefix/suffix max for transitions. Now notice that if we need the value of \\(j\\) we don't need the value of \\(k\\), and vice versa. Now, we can compress our states down to \\(dp[i][j][0/1]\\) which gives us a \\(O(N^2)\\) solution. The final optimization is that we only need to consider dp states that correspond to either a catfish in the previous, current, or next column. This finally gives us a \\(O(M)\\) solution. The code below is \\(O(M log M)\\) because of sorting.

## Code

```c++
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;

#define pb push_back
#define ff first
#define ss second

const ll LLINF = 1e18;

vector<int> dict[100005];

int lb(int x, int y){
    return lower_bound(dict[y].begin(), dict[y].end(), x) - dict[y].begin();
}

int ub(int x, int y){
    return upper_bound(dict[y].begin(), dict[y].end(), x) - dict[y].begin() - 1;
}

long long max_weights(int n, int m, vector<int> x, vector<int> y, vector<int> w){
    int xmx = 0, ymx = 0;
    bool all = true;
    for(int i : x){
        all &= i%2 == 0;
        xmx = max(xmx, i);
    }
    xmx = min(xmx, n - 2);
    if(all){
        ll sum = 0;
        for(int i : w) sum += i;
        return sum;
    }
    for(int &i : y){
        i++;
        ymx = max(ymx, i);
    }
    //0 - lesser equal, 1 - greater equal
    vector<pii> pos[n + 1];
    for(int i = 0; i < m; i++){
        pos[x[i]].pb({y[i], w[i]});
        dict[x[i]].pb(y[i]);
        //if(x[i] - 2 >= 0) dict[x[i] - 1].pb(y[i]);
        if(x[i] - 1 >= 0) dict[x[i] - 1].pb(y[i]);
        if(x[i] + 1 <= xmx + 1) dict[x[i] + 1].pb(y[i]);
    }
    vector<vector<ll>> dp[xmx + 2];
    vector<ll> pre[xmx + 2];
    for(int i = 0; i <= xmx + 1; i++){
        //for(int j = 0; j <= ymx; j++) dict[i].pb(j);
        dict[i].pb(0);
        dict[i].pb(n);
        sort(dict[i].begin(), dict[i].end());
        dict[i].resize(unique(dict[i].begin(), dict[i].end()) - dict[i].begin());
        dp[i].resize(dict[i].size());
        for(int j = 0; j < dp[i].size(); j++) dp[i][j].resize(2, -LLINF);
        pre[i].resize(dict[i].size());
        for(pii j : pos[i]) pre[i][lb(j.ff, i)] += j.ss;
        for(int j = 1; j < dict[i].size(); j++) pre[i][j] += pre[i][j - 1];
    }
    for(int i = 0; i < dict[0].size(); i++) dp[0][i][0] = dp[0][i][1] = 0;
    for(int i = 1; i <= xmx + 1; i++){
        vector<pair<int, pll>> v;
        for(int j = 0; j < dp[i - 1].size(); j++) v.pb({dict[i - 1][j], {1, max(dp[i - 1][j][0], dp[i - 1][j][1])}});
        for(int j = 0; j < dp[i].size(); j++) v.pb({dict[i][j], {0, j}});
        sort(v.rbegin(), v.rend());
        ll mx = 0;
        for(auto j : v){
            if(j.ss.ff == 1) mx = max(mx, j.ss.ss + pre[i][ub(j.ff, i)]);
            else dp[i][j.ss.ss][0] = max(dp[i][j.ss.ss][0], mx - pre[i][j.ss.ss]);
        }
        v.clear();
        for(int j = 0; j < dp[i - 1].size(); j++) v.pb({dict[i - 1][j], {0, j}});
        for(int j = 0; j < dp[i].size(); j++) v.pb({dict[i][j], {1, j}});
        sort(v.begin(), v.end());
        mx = 0;
        //cout << i << endl;
        for(auto j : v){
            if(j.ss.ff == 0) mx = max(mx, dp[i - 1][j.ss.ss][1] - pre[i - 1][j.ss.ss]);
            else dp[i][j.ss.ss][1] = max(dp[i][j.ss.ss][1], mx + pre[i - 1][ub(j.ff, i - 1)]);
        }
        if(i - 2 < 0){
            for(int j = 0; j < dp[i].size(); j++){
                dp[i][j][1] = max(dp[i][j][1], pre[i - 1][ub(dict[i][j], i - 1)]);
            }
        } else {
            v.clear();
            for(int j = 0; j < dp[i - 2].size(); j++) v.pb({dict[i - 2][j], {0, max(dp[i - 2][j][0], dp[i - 2][j][1])}});
            for(int j = 0; j < dp[i].size(); j++) v.pb({dict[i][j], {1, j}});
            sort(v.begin(), v.end());
            mx = 0;
            for(auto j : v){
                if(j.ss.ff == 0) mx = max(mx, j.ss.ss);
                else dp[i][j.ss.ss][1] = max(dp[i][j.ss.ss][1], mx + pre[i - 1][ub(j.ff, i - 1)]);
            }
            v.clear();
            for(int j = 0; j < dp[i - 2].size(); j++) v.pb({dict[i - 2][j], {1, max(dp[i - 2][j][0], dp[i - 2][j][1])}});
            for(int j = 0; j < dp[i].size(); j++) v.pb({dict[i][j], {0, j}});
            sort(v.rbegin(), v.rend());
            mx = 0;
            for(auto j : v){
                if(j.ss.ff == 1) mx = max(mx, j.ss.ss + pre[i - 1][ub(j.ff, i - 1)]);
                else dp[i][j.ss.ss][1] = max(dp[i][j.ss.ss][1], mx);
            }
        }
    }
    ll ret = 0;
    for(int j = 0; j < dp[xmx + 1].size(); j++){
        //cout << dict[xmx + 1][j] << " " << dp[xmx + 1][j][0] << " " << dp[xmx + 1][j][1] << endl;
        ret = max({ret, dp[xmx + 1][j][0], dp[xmx + 1][j][1]});
    }
    return ret;
}

int main(){
    int n, m;
    cin >> n >> m;
    vector<int> x(m), y(m), w(m);
    for(int i = 0; i < m; i++) cin >> x[i] >> y[i] >> w[i];
    cout << max_weights(n, m, x, y, w) << endl;
    return 0;
}
```