title: Star Wars (Tutorial)
date: 11-15-2022
tag: loj, hashing, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/3891)

## Solution

The conditions imply that the graph must be a function graph. In other words, each node must have exactly one outgoing edge. Intuitively, for each node we should maintain the number of edges going out of it there are. However, it is impossible to update the indegree of every node, and much easier to output the outdegree. So if we reverse every edge we can know the set of all nodes that go into another node. We just have to make sure that every node apperas exactly one. This can be done by assigned each node a unique hash value and checking if the sum of all degrees is equal to the target sum.

## Code

```c++
#   include <bits/stdc++.h>
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

int p1 = 501511;
int p2 = 502321;
int id1[500005], id2[500005];
int in1[500005], in2[500005];
int st1[500005], st2[500005];

int main(){
    setIO();
    freopen("galaxy.in", "r", stdin);
    freopen("galaxy.out", "w", stdout);
    int n, m;
    cin >> n >> m;
    id1[0] = id2[0] = 1;
    int s1 = 0, s2 = 0;
    for(int i = 1; i <= n; i++){
        id1[i] = (ll)id1[i - 1]*p1%MOD;
        id2[i] = (ll)id2[i - 1]*p2%MOD;
        s1 = (s1 + id1[i])%MOD;
        s2 = (s2 + id2[i])%MOD;
    }
    for(int i = 0; i < m; i++){
        int a, b;
        cin >> a >> b;
        in1[b] = (in1[b] + id1[a])%MOD;
        in2[b] = (in2[b] + id2[a])%MOD;
    }
    int cur1 = 0, cur2 = 0;
    for(int i = 1; i <= n; i++){
        st1[i] = in1[i], st2[i] = in2[i];
        cur1 = (cur1 + in1[i])%MOD;
        cur2 = (cur2 + in2[i])%MOD;
    }
    int q;
    cin >> q;
    while(q--){
        int t;
        cin >> t;
        if(t == 1){
            int a, b;
            cin >> a >> b;
            in1[b] = (in1[b] + MOD - id1[a])%MOD;
            cur1 = (cur1 + MOD - id1[a])%MOD;
            in2[b] = (in2[b] + MOD - id2[a])%MOD;
            cur2 = (cur2 + MOD - id2[a])%MOD;
        } else if(t == 2){
            int x;
            cin >> x;
            cur1 = (cur1 + MOD - in1[x])%MOD;
            in1[x] = 0;
            cur2 = (cur2 + MOD - in2[x])%MOD;
            in2[x] = 0;
        } else if(t == 3){
            int a, b;
            cin >> a >> b;
            in1[b] = (in1[b] + id1[a])%MOD;
            cur1 = (cur1 + id1[a])%MOD;
            in2[b] = (in2[b] + id2[a])%MOD;
            cur2 = (cur2 + id2[a])%MOD;
        } else if(t == 4){
            int x;
            cin >> x;
            cur1 = (cur1 + MOD - in1[x])%MOD;
            in1[x] = st1[x];
            cur1 = (cur1 + in1[x])%MOD;
            cur2 = (cur2 + MOD - in2[x])%MOD;
            in2[x] = st2[x];
            cur2 = (cur2 + in2[x])%MOD;
        }
        cout << (cur1 == s1 && cur2 == s2 ? "YES" : "NO") << endl;
    }
}
```