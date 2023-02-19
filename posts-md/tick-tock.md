title: Tick Tock (Tutorial)
date: 1-31-2023
tag: cf, math, graph, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1758/problem/E)

## Solution

We obviously can't come up with a way to directly count the answer. Instead, lets see if we can find a way to check if a configuration is valid and see if that helps. One thing to note is that the difference array of all rows must be the same. It is easy to see that if they are not, then there is no way to change rows and columns to make them all the same. This reveals that the structure entire grid is entirely dependent on the first row, and any other rows will either be impossible to satisfy (structure is fixed and different), have one possibility to satisfy (structure is fixed), or have \\(h\\) possibilities to satisfy (whole row is empty, thus giving us \\(h\\) possible starting positions). So we just have to find the number of possible structures for any non empty row, then multiply by \\(h^{empty rows}\\). We want to count the number of structures that will satisfy the structure for every row. Thus, we want to somehow combine all the difference arrays for each row. However, we only know there are some holes, and we only know the difference for any cells that are non empty for each row. Thus, to reconstruct such a difference array, we can visualize this as a graph. An edge from \\(i\\) to \\(j\\) with weight \\(w\\) representing that any element in column \\(j\\) is \\(w\\) greater than every any element in column \\(i\\). This graph can be easily used to check if there are any inconsistencies in the difference array. Furthermore, we know that each distinct component of graph have no effect on each other. Thus, for each component, the number of possible ways for them to be relative to another component is \\(h\\). Thus, we get a total of \\(h^{components - 1}\\) ways to create starting positions, since the difference array of the components has a size of \\(components - 1\\), and each difference has \\(h\\) possibilities. Thus, our final answer is \\(h^{components + empty rows - 1}\\).

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

vector<pii> g[200005];
int ans[200005], h;
bool fail;

void dfs(int x, int d){
    ans[x] = d;
    for(pii i : g[x]){
        if(ans[i.ff] == -1){
            dfs(i.ff, (d + i.ss)%h);
        }
        fail |= ans[i.ff] != (d + i.ss)%h;
    }
}

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        int n, m;
        cin >> n >> m >> h;
        for(int i = 0; i < m; i++) g[i].clear(), ans[i] = -1;
        int col = 0;
        for(int i = 0; i < n; i++){
            int prv = -1;
            int prval = -1;
            for(int j = 0; j < m; j++){
                int x;
                cin >> x;
                if(x != -1){
                    if(prv != -1){
                        g[j].pb({prv, (prval + h - x)%h});
                        g[prv].pb({j, (x + h - prval)%h});
                    }
                    prv = j;
                    prval = x;
                }
            }
            col += prv == -1;
        }
        fail = false;
        int cnt = 0;
        for(int i = 0; i < m; i++){
            if(ans[i] == -1){
                dfs(i, 0);
                cnt++;
            }
        }
        if(fail) cout << 0 << endl;
        else {
            int ans = 1;
            for(int i = 0; i < cnt + col - 1; i++) ans = (ll)ans*h%MOD;
            cout << ans << endl;
        }
    }
}
```