title: Barrack (Tutorial)
date: 12-3-2022
tag: cf, dp, scc, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/104071/problem/C)

## Solution

Since the opponent can only remove one edge, it is easy to see that they would only ever want to remove a bridge to disconnect the nodes. Thus, for a given set of nodes, the only edges that are forced to be chosen are the bridges in between them. Every other edge can be either protected or not, so we can multiply the answer by that amount. Since we only consider bridges, we should build a bridge tree using tarjans. We obviously can't try every subset of nodes, but notice that when counting, we only care if there are any chosen nodes in a node's subtree. since that will decide whether an edge is forced to be chosen or not. This gives us \\(dp[x][0/1] = \\) the number of ways such to choose things in \\(x\\)'s subtree where if the second state is \\(0\\), there are no chosen nodes in the subtree, or if its \\(1\\), there is at least one chosen node. To retrieve the answer, we need to somehow be able to choose multiple subtrees and not overcount. For each node \\(x\\), we can try setting it as the lca of all the chosen subtrees, and then the amount it contributes to the answer will be either the number of ways to have at least two chosen subtrees as children, or to choose \\(x\\) to be the highest in the subset. We should also multiply by the number of ways to choose the edges that are either non bridges or outside of \\(x\\)'s subtree.

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

int low[500005], dfn[500005], tim = 0;
int comp[500005], sz[500005];
vector<pii> g1[500005];
stack<int> s;

void dfs1(int x, int p = -1){
    low[x] = dfn[x] = ++tim;
    s.push(x);
    for(pii i : g1[x]){
        if(i.ss == p) continue;
        if(!dfn[i.ff]){
            dfs1(i.ff, i.ss);
            low[x] = min(low[x], low[i.ff]);
        } else low[x] = min(low[x], dfn[i.ff]);
    }
    if(low[x] == dfn[x]){
        while(s.top() != x){
            sz[x]++;
            comp[s.top()] = x;
            s.pop();
        }
        sz[x]++;
        comp[s.top()] = x;
        s.pop();
    }
}

vector<int> g2[500005];
int dp[500005][2];
int fin[500005][2];
int sub[500005];
int pow2[1000005];
int ans = 0;
int n, m;

void dfs2(int x, int p = 0){
    sub[x] = 0;
    for(int i : g2[x]){
        if(i == p) continue;
        dfs2(i, x);
        sub[x] += sub[i] + 1;
    }
    dp[x][0] = 1;
    dp[x][1] = (pow2[sz[x]] + MOD - 1)%MOD;
    int cnt[3] = {1, 0, 0}, rt = dp[x][1];
    for(int i : g2[x]){
        if(i == p) continue;
        dp[x][1] = ((ll)dp[x][1]*(dp[i][0] + dp[i][1])%MOD + (ll)dp[x][0]*dp[i][1]%MOD)%MOD;
        dp[x][0] = (ll)dp[x][0]*dp[i][0]%MOD;
        rt = (ll)rt*(dp[i][0] + dp[i][1])%MOD;
        cnt[2] = ((ll)cnt[2]*(dp[i][1] + dp[i][0])%MOD + (ll)cnt[1]*dp[i][1]%MOD)%MOD;
        cnt[1] = ((ll)cnt[1]*dp[i][0]%MOD + (ll)cnt[0]*dp[i][1]%MOD)%MOD;
        cnt[0] = (ll)cnt[0]*dp[i][0]%MOD;
    }
    ans = (ans + (ll)pow2[m - sub[x]]*(cnt[2] + rt)%MOD)%MOD;
    dp[x][0] = (ll)2*dp[x][0]%MOD;
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
    freopen("barrack.in", "r", stdin);
    freopen("barrack.out", "w", stdout);
    setIO();
    pow2[0] = 1;
    for(int i = 1; i <= 1e6; i++) pow2[i] = (ll)2*pow2[i - 1]%MOD;
    scan(n), scan(m);
    for(int i = 0; i < m; i++){
        int a, b;
        scan(a), scan(b);
        g1[a].pb({b, i});
        g1[b].pb({a, i});
    }
    dfs1(1);
    for(int i = 1; i <= n; i++) for(pii j : g1[i]) if(comp[i] != comp[j.ff]) g2[comp[i]].pb(comp[j.ff]);
    dfs2(comp[1]);
    cout << ans << "\n";
}
```