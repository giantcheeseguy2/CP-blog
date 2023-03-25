title: Binary Tree (Tutorial)
date: 3-18-2023
tag: xyd, greedy, tree, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/76/problem/320)

## Solution

Since we are dealign with lexicographical order, we will always want to move the smallest possible value to the front no matter what. Immediately, this gives us a \\(O(N^2)\\) solution where we fix the root node, then greedily assign children from there. However, improving this to support rerooting seems hard. Using this method, we are also potentially changing the smallest prefix, which is alot of wasted time. Instead, lets try to construct the answer rather than root the tree. Looking at the structure of the inorder traversal, the first node visited will be the leftmost node in the binary tree. Thus, we want to fix the smallest node with at most two children as that leftmost node. Going from there, we can proceed with rooting the tree. If that smallest node is a leaf node, then we will either move on in our tree by assigning its neighbor as a parent or right child. When comparing which one to use, notice that the parent will always immediately follow our smallest node, while as a right child, we will be visiting the smallest node in that subtree with a degree of at most two. If we just precompute these values per subtree with respect to our origin node as the root, then we will be able to decide which case to assign it. We can use a similar method if our starting node has two neighbors. Once we assign the right child, that subtree will be fixed, so we can just add it to the answer. Then, we will just recurse up the parent and do the same operation again.

## Code

```c++
#pragma GCC optimize("O3")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse,sse2,sse3,ssse3,sse4,popcnt,abm,mmx,tune=native")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;
using namespaceace std;

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

vector<int> g[1000005];
vector<int> ans;
int dp[1000005];

void build(int x, int p){
    vector<pii> nxt;
    nxt.pb({x, -1});
    for(int i : g[x]){
        if(i == p) continue;
        nxt.pb({dp[i], i});
    }
    sort(nxt.begin(), nxt.end());
    if(nxt.size() == 3 && nxt[0].ss == -1){
        swap(nxt[0], nxt[1]);
    }
    if(nxt.size() == 3 && nxt[2].ss == -1){
        swap(nxt[1], nxt[2]);
    }
    if(nxt.front().ff > nxt.back().ff) swap(nxt.front(), nxt.back());
    for(pii i : nxt){
        if(i.ss == -1){
            ans.pb(x);
        } else {
            build(i.ss, x);
        }
    }
}


void solve(int x, int p = 0){
    if(p) g[x].erase(find(g[x].begin(), g[x].end(), p));
    ans.pb(x);
    if(g[x].size() == 1){
        int tar = g[x][0];
        if(dp[tar] > tar){
            solve(tar, x);
        } else {
            build(tar, x);
        }
    } else if(g[x].size() == 2){
        int a = g[x][0], b = g[x][1];
        if(dp[a] < dp[b]){
            build(a, x);
            solve(b, x);
        } else {
            build(b, x);
            solve(a, x);
        }
    }
}

void dfs2(int x, int p = 0){
    if(g[x].size() <= 2){
        dp[x] = x;
    } else {
        dp[x] = INF;
    }
    for(int i : g[x]){
        if(i == p) continue; 
        dfs2(i, x);
        dp[x] = min(dp[x], dp[i]);
    }
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
    int n;
    scan(n);
    int mn = INF;
    for(int i = 1; i <= n; i++){
        int t;
        scan(t);
        if(t <= 2) mn = min(mn, i);
        for(int j = 0; j < t; j++){
            int x;
            scan(x);
            g[i].pb(x);
        }
    }
    dfs2(mn);
    solve(mn);
    for(int i : ans) cout << i << " ";
    cout << endl;
}
```