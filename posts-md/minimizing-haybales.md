title: Minimizing Haybales (Tutorial)
date: 12-13-2022
tag: usaco, segtree, graph, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1188)

## Solution

Lets find a brute force solution first. Essentially, we want to choose the smallest value, \\(arr[i]\\) that no remaining values before \\(i\\) that are outside of the range \\([arr[i] - k, arr[i] + k]\\). Once we choose this value, we can just remove it and continue. This is actually similar to finding a topological ordering of a graph. If we draw an edge between \\(i\\) and all the indeces after \\(i\\) outside of the range \\([arr[i] - k, arr[i] + k]\\), it is just the lexicographically smallest topological order of the graph. This can be found using a priority queue. However, there are too many edges. Since our edges are only to a specific range, if for every \\(i\\), we store its indegree, we can actually update the indegrees fast. We just have to walk on the segtree to remove all \\(0\\)s and add them into the priority queue.

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

const int INF = 1e9;
const ll LLINF = 1e18;
const int MOD = 1e9 + 7;

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

int n, k;
int mn[400005], tag[400005];
vector<pii> dict;

void push_down(int x){
    if(!tag[x]) return;
    mn[x] = INF;
    for(int i = x*2 + 1; i <= x*2 + 2; i++){
        mn[i] += tag[x];
        tag[i] += tag[x];
    }
    tag[x] = 0;
}

void update(int l, int r, int v, int ul = 0, int ur = dict.size() - 1, int cur = 0){
    if(l > r) return;
    if(l <= ul && ur <= r){
        mn[cur] += v;
        tag[cur] += v;
        return;
    }
    push_down(cur);
    int mid = (ul + ur)/2;
    if(l <= mid) update(l, r, v, ul, mid, cur*2 + 1);
    if(r > mid) update(l, r, v, mid + 1, ur, cur*2 + 2);
    mn[cur] = min(mn[cur*2 + 1], mn[cur*2 + 2]);
}

int ind(pii x){
    return lower_bound(dict.begin(), dict.end(), x) - dict.begin();
}

priority_queue<pii, vector<pii>, greater<pii>> q;

int arr[100005];

void prune(int l = 0, int r = dict.size() - 1, int cur = 0){
    if(mn[cur]) return;
    if(l == r){
        q.push(dict[l]);
        mn[cur] = INF;
        return;
    }
    push_down(cur);
    int mid = (l + r)/2;
    prune(l, mid, cur*2 + 1);
    prune(mid + 1, r, cur*2 + 2);
    mn[cur] = min(mn[cur*2 + 1], mn[cur*2 + 2]);
}

int bit[100005];

void upd(int x, int v){
    for(x++; x <= n; x += x & (-x)) bit[x] += v;
}

int que(int x, int ret = 0){
    for(x++; x; x -= x & (-x)) ret += bit[x];
    return ret;
}

int main(){
    setIO();
    cin >> n >> k;
    for(int i = 0; i < n; i++){
        cin >> arr[i];
        dict.pb({arr[i], i});
    }
    sort(dict.begin(), dict.end());
    for(int i = 0; i < n; i++){
        int cur = ind({arr[i], i});
        update(cur, cur, que(ind({arr[i] - k, -1}) - 1) + i - que(ind({arr[i] + k, INF}) - 1));
        upd(cur, 1);
    }
    prune();
    while(!q.empty()){
        pii x = q.top();
        cout << x.ff << endl;
        q.pop();
        update(0, ind({x.ff - k, -1}) - 1, -1);
        update(ind({x.ff + k, INF}), dict.size() - 1, -1);
        prune();
    } 
}
```