title: Watching Cowflix (Tutorial)
date: 3-17-2023
tag: usaco, dp, divide and conquer, tree, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1310)

## Solution

How can we solve the problem for a single \\(k\\)? This can be easily done by tree dp, where \\(dp[i][0/1] = \\) the answer or \\(i\\)'s subtree if \\(i\\) is either in or not chosen. We just have to force the node to be chosen if \\(i\\) is marked as a \\(1\\) in the given string. To solve for all \\(k\\), we could greedily merge the closest nodes and use convex hull trick on their lines, but there isn't any real way to deal with ties, which suggests that dp is the way to go. However, how can we run the dp for all \\(k\\)? We can see that the answer is monotonic, so if we can somehow find that the number of relevant intervals of answers is bounded, we can use divide and conquer to find them. Although the answer maybe strictly monotonic, it is also actually a function of the number of components. If the minimum number of components for \\(i\\) and \\(i + 1\\) are the same, then the answer will increase by that amount. The number of distinct minimum components for answers is actually also bounded, since in every increase of \\(k\\), we always want to merge components with a distance \\(\\le k\\). Since there can be at most \\(\\sqrt{N}\\) components that are \\(\\sqrt{N}\\) away from each other, after \\(k \\ge \\sqrt{N}\\), there will be at most \\(\\sqrt{N}\\) components. This bounds the unique amount by \\(2 \\cdot \\sqrt{N}\\). We can use divide and conquer to find these intervals in \\(N \\cdot sqrt{N} \\cdot log N\\) time, which passes if the dp is highly optimized.

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
const int MOD = 1e9 + 7;

vector<int> g[200005];
pii dp[200005][2];
int par[200005];
char arr[200005];

vector<int> v;

void dfs(int x, int p = 0){
    v.pb(x);
    par[x] = p;
    for(int i : g[x]){
        if(i == p) continue;
        dfs(i, x);
    }
}

pii add(pii a, pii b){
    return {a.ff + b.ff, a.ss + b.ss};
}

int n;

pii solve(int k){
    for(int i = 1; i <= n; i++) dp[i][0] = {0, 0}, dp[i][1] = {1, 0};
    for(int i : v){
        if(arr[i] == '1') dp[i][0] = {INF, INF};
        if(par[i]){
            dp[par[i]][0] = add(dp[par[i]][0], min(dp[i][0], add(dp[i][1], {k, 1})));
            dp[par[i]][1] = add(dp[par[i]][1], min(dp[i][0], dp[i][1]));
        }
    }
    return min(add(dp[1][1], {k, 1}), dp[1][0]);
}

int ans[200005];

void dnq(int l, int r, pii vl, pii vr){
    if(l > r) return;
    if(r - l <= 1){
        ans[l] = vl.ff;
        ans[r] = vr.ff;
        return;
    }
    if(vl.ss == vr.ss){
        for(int i = l; i <= r; i++){
            ans[i] = vl.ff + (i - l)*vl.ss;
        }
        return;
    }
    int mid = (l + r)/2;
    pii vmid = (mid == l ? vl : solve(mid));
    dnq(l, mid, vl, vmid);
    dnq(mid, r, vmid, vr);
}

const int BUFSIZE = 20 << 20;
char Buf[BUFSIZE + 1], *buf = Buf;

template<class T>
void scan(T &x){
    int neg = 1;
    for(x = 0; *buf < '0' || *buf > '9'; buf++) if(*buf == '-') neg = -1;
    while(*buf >= '0' && *buf <= '9') x = x*10 + (*buf - '0'), buf++;
    x *= neg;
}

void setIO(){
    fread(Buf, 1, BUFSIZE, stdin);
}

int main(){
    setIO();
    scan(n);
    while(*buf < '0' || *buf > '9') buf++;
    for(int i = 1; i <= n; i++){
        arr[i] = *buf;
        buf++;
    }
    for(int i = 0; i < n - 1; i++){
        int a, b;
        scan(a), scan(b);
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs(1);
    reverse(v.begin(), v.end());
    dnq(1, n, solve(1), solve(n));
    for(int i = 1; i <= n; i++) cout << ans[i] << "\n";
}
```