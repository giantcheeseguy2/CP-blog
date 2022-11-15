title: Vacation Plan (Tutorial)
date: 11-14-2022
tag: loj, brute force, bfs, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/3889)

## Solution

The small bounds on \\(N\\) immediately suggests a solution where we can fix one or two destinations on our path. In fact, if we store the largest two nodes that can serve as a midpoint on the path from a node to the home, we are able to fix \\(B\\) and \\(C\\) and get the answer from there. In order to find the two largest nodes that could be the midpoint, we can try each node as a midpoint, run a bfs and update accordingly.

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

vector<int> g[2505];
int dist[2505][2505];
int arr[2505];
int n, m, k;
set<pii, greater<pii>> mx[2505];

void bfs1(int x){
    for(int i = 1; i <= n; i++) dist[x][i] = -1;
    dist[x][x] = 0;
    queue<int> q;
    q.push(x);
    while(!q.empty()){
        int st = q.front();
        q.pop();
        for(int i : g[st]){
            if(dist[x][i] == -1){
                dist[x][i] = dist[x][st] + 1;
                q.push(i);
            }
        }
    }
    if(dist[x][1] <= k && dist[x][1] >= 0){
        for(int i = 2; i <= n; i++) if(i != x && dist[x][i] <= k && dist[x][i] >= 0){
            mx[i].insert({arr[x], x});
            if(mx[i].size() > 2) mx[i].erase(prev(mx[i].end()));
        }
    }
}

int main(){
    setIO();
    freopen("holiday.in", "r", stdin);
    freopen("holiday.out", "w", stdout);
    cin >> n >> m >> k;
    for(int i = 2; i <= n; i++) cin >> arr[i];
    k++;
    for(int i = 0; i < m; i++){
        int a, b;
        cin >> a >> b;
        g[a].pb(b);
        g[b].pb(a);
    }
    for(int i = 2; i <= n; i++) bfs1(i);
    ll ans = 0;
    for(int b = 2; b <= n; b++){
        for(int c = b + 1; c <= n; c++){
            if(b == c) continue;
            if(dist[b][c] > k) continue;
            set<pii, greater<pii>> bb;
            for(pii i : mx[b]) bb.insert(i);
            set<pii, greater<pii>> cc;
            for(pii i : mx[c]) cc.insert(i);
            cc.erase({arr[b], b});
            bb.erase({arr[c], c});
            if(bb.size() == 0 || cc.size() == 0) continue;
            bb.insert({0, 0});
            cc.insert({0, 0});
            ll sum = arr[b] + arr[c];
            sum += (*bb.begin()).ff;
            if((*bb.begin()).ss == (*cc.begin()).ss){
                if(bb.size() == 2 && cc.size() == 2) continue;
                sum += max((*next(bb.begin())).ff, (*next(cc.begin())).ff);
            } else {
                sum += (*cc.begin()).ff;
            }
            ans = max(ans, sum);
        }
    }
    cout << ans << endl;
}
```