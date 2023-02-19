title: Tractor Paths (Tutorial)
date: 2-10-2023
tag: usaco, binary lifting, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1284)

## Solution

It is intuitive that for the shortest path, we always want to move to the farthest right index possible. Thus, we can solve for the shortest path using binary lifting, let this be \\(mn\\). If \\(dist(a, b)\\) is the shortest path from \\(a\\) to \\(b\\), then some index \\(c\\) is on the shortest path if \\(dist(a, c) + dist(c, b) + 1 = mn\\). Checking if an index is on the shortest path any other way seems hard, so we should try to optimize our method. If we can fix some distance \\(x\\) from \\(a\\), then we know the distance \\(y\\) that the index is from \\(b\\). The set of indeces that satisfy this condition will always be continous, since if two indeces satisfy it then all indeces in between them will also satisfy it. For a given \\(x\\), we also know the interval that is covered to be the between the farthest index \\(y\\) away from \\(b\\) and the farthest index \\(x\\) away from \\(a\\). These endpoints can be found using the same method as the binary lifting. Now, for each interval, we can count the amount of special nodes using prefix sums. Notice that the prefix sums are actually independent since we only care about the total sum. Thus, we can seperate the problem into distance from \\(a\\) and distance from \\(b\\), then count the total sum of prefix sums using binary lifting. We know that each for each distance \\(x\\) there must exist an interval, so there is no need to worry about prefix sums not overlapping. Also, we should count the \\(a\\) and \\(b\\) seperately.

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

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

int prv[200005][20];
int nxt[200005][20];
int sump[200005][20];
int sumn[200005][20];
int pre[200005];

pii dist(int a, int b){
    if(a == b) return {0, pre[a] - pre[a - 1]};
    int ans = 0;
    int sum = 0;
    int cur = b;
    for(int i = 19; i >= 0; i--){
        if(prv[cur][i] > a){
            ans += 1 << i;
            sum += sump[cur][i];
            cur = prv[cur][i];
        }
    }
    cur = a;
    for(int i = 19; i >= 0; i--){
        if(nxt[cur][i] < b){
            sum += sumn[cur][i];
            cur = nxt[cur][i];
        }
    }
    return {ans + 1, sum + pre[b] - pre[b - 1] + pre[a] - pre[a - 1]};
}

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    int l = 1, r = 1;
    vector<pii> v;
    for(int i = 1; i <= 2*n; i++){
        char c;
        cin >> c;
        if(c == 'L'){
            v.pb({i, -1});
            r++;
        } else {
            v[l - 1].ss = i;
            l++;
        }
    }
    vector<int> pos;
    for(int i = 1; i <= n; i++){
        char c;
        cin >> c;
        pre[i] = pre[i - 1];
        if(c == '1') pre[i]++;
    }
    vector<int> vr;
    for(pii i : v) vr.pb(i.ss); 
    for(int i = 0; i < n; i++){
        prv[i + 1][0] = upper_bound(vr.begin(), vr.end(), v[i].ff) - vr.begin() + 1;
        sump[i + 1][0] = -pre[prv[i + 1][0] - 1];
    } 
    vr.clear();
    for(pii i : v) vr.pb(i.ff);
    for(int i = 0; i < n; i++){
        nxt[i + 1][0] = upper_bound(vr.begin(), vr.end(), v[i].ss) - vr.begin();
        sumn[i + 1][0] = pre[nxt[i + 1][0]];
    }
    for(int i = 1; i < 20; i++){
        for(int j = 1; j <= n; j++){
            prv[j][i] = prv[prv[j][i - 1]][i - 1];
            nxt[j][i] = nxt[nxt[j][i - 1]][i - 1];
            sump[j][i] = sump[prv[j][i - 1]][i - 1] + sump[j][i - 1];
            sumn[j][i] = sumn[nxt[j][i - 1]][i - 1] + sumn[j][i - 1];
        }
    }
    while(q--){
        int a, b;
        cin >> a >> b;
        pii ans = dist(a, b);
        cout << ans.ff << " " << ans.ss << endl;
    }
}
```