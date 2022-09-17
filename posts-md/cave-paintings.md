title: Cave Paintings (Tutorial)
date: 9-16-2022
tag: usaco, dp, dsu, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=996)

## Solution

Lets first compress all adjacent cells on the same row into one node for convenience. The obvious requirement is that if a node is filled with water, then every node that it is directly under it will also need to be filled with water. This gives us a dag. However, the property also gurantees that any two nodes that point to the same node also point to each other. After compressing the cycles, we end up with a tree. Computing the tree can be done with a dsu, and computing the answer is just some simple math.

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
typedef pair<int, int> pii;
typedef pair<ll, ll>   pll;

const int inf = 1000000000;
const int mod = 1000000007;
const double PI = acos(-1);

struct chash {
    const uint64_t C = ll(2e18*PI)+71;
    const int RANDOM = rand();
    ll operator()(ll x) const {
        return __builtin_bswap64((x^RANDOM)*C);
    }
};

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;
template<class K, class V> using gphash = gp_hash_table<K, V, chash, equal_to<K>, direct_mask_range_hashing<>, linear_probe_fn<>, hash_standard_resize_policy< hash_exponential_size_policy<>, hash_load_check_resize_trigger<>, true> >;

inline ll ceil0(ll a, ll b) {
    return a / b + ((a ^ b) > 0 && a % b);
}

inline ll floor0(ll a, ll b) {
    return a / b - ((a ^ b) < 0 && a % b);
}

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

set<int> g[2000000];
ll dp[2000000];
int par[2000000];
bool root[2000000];

int find(int x){
    if(par[x] == x) return x;
    return par[x] = find(par[x]);
}

void merge(int x, int y){
    par[find(x)] = find(y);
}

void dfs(int x){
    dp[x] = 1;
    for(int i : g[x]){
        dfs(i);
        dp[x] *= dp[i];
        dp[x] %= mod;
    }
    dp[x]++;
}

int main(){
    setIO();
    freopen("cave.in", "r", stdin);
    freopen("cave.out", "w", stdout);
    int n, m;
    cin >> n >> m;
    char arr[n][m];
    int comp[n][m], sz = 0;
    memset(comp, -1, sizeof(comp));
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            cin >> arr[i][j];
        }
    }
    for(int i = 0; i < 2*n*m; i++) par[i] = i;
    for(int i = n - 1; i >= 1; i--){
        for(int j = 1; j < m; j++){
            if(arr[i][j] == '.' && arr[i][j] == arr[i][j - 1]){
                merge(i*m + j, i*m + j - 1);
            }
        }
    }
    for(int i = n - 1; i >= 1; i--){
        int nxt[m];
        memset(nxt, -1, sizeof(nxt));
        for(int j = 0; j < m; j++){
            if(arr[i - 1][j] == '.' && arr[i][j] == '.'){
                nxt[j] = find(i*m + j);
            }
        }
        map<int, int> ma;
        for(int j = 0; j < m; j++){
            if(nxt[j] == -1) continue;
            if(ma[nxt[j]]) merge(ma[nxt[j]], (i - 1)*m + j);
            ma[nxt[j]] = find((i - 1)*m + j);
        }
    }
    for(int i = n - 1; i >= 1; i--){
        for(int j = 1; j < m; j++){
            if(arr[i][j] == '.') if(find(i*m + j) == i*m + j) comp[i][j] = sz++;
        } 
        for(int j = 1; j < m; j++){ 
            if(arr[i][j] == '.') comp[i][j] = comp[find(i*m + j)/m][find(i*m + j)%m];
        }
    }
    memset(root, true, sizeof(root));
    for(int i = 0; i < n - 1; i++){
        for(int j = 0; j < m; j++){
            if(arr[i][j] == '.' && arr[i][j] == arr[i + 1][j]){
                g[comp[i][j]].insert(comp[i + 1][j]);
                root[comp[i + 1][j]] = false;
            }
        }
    }
    ll ans = 1;
    for(int i = 0; i < sz; i++){
        if(root[i]){
            dfs(i);
            ans *= dp[i];
            ans %= mod;
        }
    }
    cout << ans << endl;
}
```