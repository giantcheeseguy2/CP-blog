title: Data Transfer (Tutorial)
date: 11-15-2022
tag: loj, tree, dp, binary lifting, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/3892)

## Solution

Lets consider this problem on a line. Then we could use a dp to solve the single query case where \\(dp[i][j] = \\) the minimum cost to get to location \\(i\\) with a power of \\(j\\), meaning that you have already used \\(j - 1\\) edges so far. The transitions are \\(dp[i][0] = min(dp[i][j]) + v_i\\) and \\(dp[i][j] = dp[i - 1][j - 1]\\) for \\(j > 0\\). So now what about the tree case where we can choose to skip \\(i\\) and go into \\(i\\)'s subtree instead? Let \\(trans[i][a][b] = \\) the minimum cost to enter \\(i\\) with \\(a\\) power and leave \\(b\\) by going through some nodes in \\(i\\)'s subtree, this can be computed using a seperate tree dp. Now \\(trans[i]\\) becomes a transition matrix, and the answer is now the product of \\(trans[i]\\) using min and addition operators for all the nodes \\(i\\) from \\(s\\) to \\(t\\), with a bit of casework at the lca. This can be maintained with binary lifting.

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

struct node {
    
    array<array<ll, 3>, 3> dp;

    array<ll, 3> &operator[](int x){
        return dp[x];
    }

    const array<ll, 3> &operator[](int x) const {
        return dp[x];
    }

    node(){
        for(int i = 0; i < 3; i++) for(int j = 0; j < 3; j++) dp[i][j] = LLINF;
    }
};

vector<int> g[200005];
int par[200005][18], depth[200005];
int arr[200005];
node up[200005][18];
node down[200005][18];
int n, q, k;

void dfs(int x, int p){
    node cur;
    for(int i = 0; i < k - 1; i++) cur[i][i + 1] = 0;
    for(int i = 0; i < k; i++) cur[i][0] = arr[x];
    par[x][0] = p;
    depth[x] = depth[p] + 1;
    for(int i : g[x]){
        if(i == p) continue;
        dfs(i, x);
        for(int a = 0; a < k - 1; a++){
            for(int b = 1; b < k; b++){
                cur[a][b] = min(cur[a][b], up[i][0][a + 1][b - 1]);
            }
        }
    }
    up[x][0] = down[x][0] = cur;
}

node merge(const node &a, const node &b){
    node ret;
    for(int i = 0; i < k; i++){
        for(int j = 0; j < k; j++){
            for(int x = 0; x < k; x++){
                ret[i][j] = min(ret[i][j], a[i][x] + b[x][j]);
            }
        }
    }
    return ret;
}

int lca(int a, int b){
    if(depth[a] > depth[b]) swap(a, b);
    for(int i = 17; i >= 0; i--) if(depth[par[b][i]] >= depth[a]) b = par[b][i];
    if(a == b) return a;
    for(int i = 17; i >= 0; i--) if(par[a][i] != par[b][i]) a = par[a][i], b = par[b][i];
    return par[a][0];
}

node queryup(int a, int b){
    node ret;
    for(int i = 0; i < k; i++) ret[i][i] = 0;
    for(int i = 17; i >= 0; i--){
        if(depth[par[a][i]] > depth[b]){
            ret = merge(ret, up[a][i]);
            a = par[a][i];
        }
    }
    if(a != b) ret = merge(ret, up[a][0]);
    return ret;
}

node querydown(int a, int b){
    node ret;
    for(int i = 0; i < k; i++) ret[i][i] = 0;
    for(int i = 17; i >= 0; i--){
        if(depth[par[a][i]] > depth[b]){
            ret = merge(down[a][i], ret);
            a = par[a][i];
        }
    }
    if(a != b) ret = merge(down[a][0], ret);
    return ret;
}

void print(node x){
    for(int i = 0; i < k; i++){
        for(int j = 0; j < k; j++){
            cout << (x[i][j] == LLINF ? -1 : x[i][j]) << " ";
        }
        cout << endl;
    }
}

int main(){
    setIO();
    freopen("transmit.in", "r", stdin);
    freopen("transmit.out", "w", stdout);
    cin >> n >> q >> k;
    for(int i = 1; i <= n; i++) cin >> arr[i];
    for(int i = 0; i < n - 1; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    dfs(1, 1);
    for(int i = 1; i < 18; i++){
        for(int j = 1; j <= n; j++){
            par[j][i] = par[par[j][i - 1]][i - 1];
            up[j][i] = merge(up[j][i - 1], up[par[j][i - 1]][i - 1]);
            down[j][i] = merge(down[par[j][i - 1]][i - 1], down[j][i - 1]);
        }
    }
    while(q--){
        int a, b;
        cin >> a >> b;
        int c = lca(a, b);
        node x = querydown(b, c);
        if(a == c){
            if(k == 1) cout << arr[a] + x[0][0] << endl;
            else cout << arr[a] + min(x[0][0], x[1][0]) << endl;
            continue;
        }
        vector<node> v;
        v.pb(queryup(par[a][0], c));
        for(int i = 0; i < k; i++){
            v.pb(merge(v.back(), up[c][0]));
            c = par[c][0];
        }
        ll dp[k];
        for(int i = 0; i < k; i++) dp[i] = LLINF;
        for(int i = 0; i < k; i++){
            for(int j = 0; j + i < k; j++){
                dp[j + i] = min(dp[j + i], arr[a] + v[i + 1][0][j]);
            }
        }
        ll ans = LLINF;
        for(int i = 0; i < k; i++) ans = min(ans, dp[i] + x[i][0]);
        cout << ans << endl;
    }
}
```