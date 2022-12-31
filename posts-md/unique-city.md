title: Unique City (Tutorial)
date: 12-31-2022
tag: loj, tree, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/3014)

## Solution

The first observation needed is that the set of all unique nodes from a node \\(x\\) must lie on the longest path from \\(x\\) to a leaf. It is easy to see that this is true. To apply this to the problem, we know that the set of all unique nodes must lie on the path from \\(x\\) to one of the two endpoints of a diameter of the tree. Lets try to find a solution involving tree dp rerooting. Assume we currently have the answer at node \\(a\\), and we are trying to reroot to node \\(b\\). Assuming that \\(b\\) is further away from an endpoint than \\(a\\), the set of unique nodes will not decrease in size, and will only increase. This set of nodes is monotonic based on subtree size, meaning that if we process the subtrees in the right order, the total amount of node additions is linear. note that we have to process the largest subtree seperately. After doing this from both endpoints, we just have to take the max for every node.

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

int arr[200005];
vector<pii> g[200005];
int sub[200005];

bool comp(pii a, pii b){
    return sub[a.ff] > sub[b.ff];
}

void dfs1(int x, int p = 0){
    int mx = 0;
    sub[x] = -INF;
    for(pii i : g[x]){
        if(i.ff == p) continue;
        dfs1(i.ff, x);
        mx = max(mx, sub[i.ff] + 1);
    }
    sub[x] = mx;
    sort(g[x].begin(), g[x].end(), comp);
}

int cur = 0;
int cnt[200005], ans[200005];

void add(int x){
    if(!cnt[arr[x]]) cur++;
    cnt[arr[x]]++;
}

void rem(int x){
    cnt[arr[x]]--;
    if(!cnt[arr[x]]) cur--;
}

stack<pii> par;

void dfs2(int x, int p = 0, int d = 1){ 
    if(g[x].size() == 1 && g[x][0].ff == p){
        ans[x] = max(ans[x], cur);
        return;
    }
    int nxt = (g[x].size() == 1 || g[x][1].ff == p ? -INF : sub[g[x][1].ff] + 2);
    while(par.size() && nxt >= d - par.top().ff + 1) {
        rem(par.top().ss);
        par.pop();
    }
    add(x);
    par.push({d, x});
    dfs2(g[x][0].ff, x, d + 1);
    while(par.size() && sub[g[x][0].ff] + 2 >= d - par.top().ff + 1) {
        rem(par.top().ss);
        par.pop();
    }
    ans[x] = max(ans[x], cur);
    for(int i = 1; i < g[x].size() - 1; i++){
        add(x);
        par.push({d, x});
        dfs2(g[x][i].ff, x, d + 1);
        if(par.size() && par.top().ss == x){
            rem(x);
            par.pop();
        }
    } 
}

pii dp[200005];
pair<int, pii> rt;

void dfs3(int x, int p = 0){
    pii a = {0, x}, b = {0, x};
    for(pii i : g[x]){
        if(i.ff == p) continue;
        dfs3(i.ff, x);
        pii nw = {dp[i.ff].ff + 1, dp[i.ff].ss};
        if(nw > a){
            b = a;
            a = nw;
        } else if(nw > b){
            b = nw;
        }
    }
    dp[x] = a;
    rt = max(rt, {a.ff + b.ff, {a.ss, b.ss}});
}

int main(){
    setIO();
    int n, m;
    cin >> n >> m;
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb({b, 2*i});
        g[b].pb({a, 2*i + 1});
    }
    for(int i = 1; i <= n; i++) cin >> arr[i];
    rt = {-INF, {-INF, -INF}};
    dfs3(1); 
    dfs1(rt.ss.ff);
    dfs2(rt.ss.ff);
    dfs1(rt.ss.ss);
    dfs2(rt.ss.ss); 
    for(int i = 1; i <= n; i++) cout << ans[i] << "\n";
}
```