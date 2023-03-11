title: City Union (Tutorial)
date: 2-27-2023
tag: cf, ad hoc, graph, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1799/problem/E)

## Solution

A city can valid for all its points if and only if its a convex structure. This is easy to see. We can write a dp to solve for the minimum convex shape that covers all the points, since the structure is increasing then decreasing by row. However, this is a bit slow. For each `.` cell, it must be filled if it has `#` on opposite sides. To solve this, we can maintain a bitmask for each `.` that stores which of the four cardinal directions has a `#`. Then it becomes easy to check if a cell must be filled. Now, to update all these bitmasks for a `#`, we just have to go in the four cardinal directions until we reach another `#` and update all those masks. By maintaining a queue of the `#` we have yet to add in, we can repeat this process until it is done in \\(O(N \\cdot M)\\) complexity, since each `.` is only visited at most \\(4\\) times. Lets run this on a given grid first. Obviously, if we only have one component afterwards, this is our answer. However, if we have two components, they must be on opposite quadrants of the grid. To merge these, we just have to find any path between the two that minimizes the answer after turning it convex. It obvious that when we connect the two components, it will always be through a manhattan path. We can also see that over all possible paths for all pairs of cells between components, there will always be at least one path per pair that goes through the one of the corner points on the rectangular boundary for each of the components. Thus, by finding any path between these two corner points, we will have one of our optimal paths. Although it doesn't necessarily directly connect the two components, it is easy to see that after filling in the grid again, everything will be connected.

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

int n, m;
char arr[51][51];

int moves[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
int col[51][51];

void dfs(int x, int y, int cur){
    if(x < 0 || y < 0 || x >= n || y >= m) return;
    if(arr[x][y] == '.') return;
    if(col[x][y]) return;
    col[x][y] = cur;
    for(int i = 0; i < 4; i++){
        dfs(x + moves[i][0], y + moves[i][1], cur);
    }
}

int cnt[51][51];
bool tag[51][51];
queue<pii> q;

bool valid(int x){
    bool ret = false;
    for(int k = 0; k < 2; k++){
        if(((x >> k) & 1) && ((x >> (k + 2)) & 1)){
            ret = true;
        }
    }
    return ret;
}

void check(int i, int j){
    if(valid(cnt[i][j]) && !tag[i][j]){
        q.push({i, j});
        tag[i][j] = true;
    }
}
 
void upd(int i, int j){
    for(int k = i + 1; k < n; k++){
        if(arr[k][j] == '#') break;
        cnt[k][j] |= 1 << 0;
        check(k, j);
    }
    for(int k = j + 1; k < m; k++){
        cnt[i][k] |= 1 << 1;
        check(i, k);
    }
    for(int k = i - 1; k >= 0; k--){
        if(arr[k][j] == '#') break;
        cnt[k][j] |= 1 << 2;
        check(k, j);
    }
    for(int k = j - 1; k >= 0; k--){
        if(arr[i][k] == '#') break;
        cnt[i][k] |= 1 << 3;
        check(i, k);
    }
}

void fill(){
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            if(arr[i][j] == '#' && !tag[i][j]){
                q.push({i, j});
                tag[i][j] = true;
            }
        }
    }
    while(!q.empty()){
        pii x = q.front();
        arr[x.ff][x.ss] = '#';
        q.pop();
        upd(x.ff, x.ss);
    }
}

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        cin >> n >> m;
        for(int i = 0; i < n; i++){
            for(int j = 0; j < m; j++){
                cin >> arr[i][j];
                col[i][j] = 0;
                tag[i][j] = false;
                cnt[i][j] = 0;
            }
        } 
        fill();
        int cur = 1;
        for(int i = 0; i < n; i++){
            for(int j = 0; j < m; j++){
                if(arr[i][j] == '#' && !col[i][j]){
                    dfs(i, j, cur++);
                }
            }
        }
        if(cur == 2){
            for(int i = 0; i < n; i++){
                for(int j = 0; j < m; j++){
                    cout << arr[i][j];
                }
                cout << endl;
            }
            cout << endl;
            continue;
        }
        vector<int> x[3], y[3];
        for(int i = 0; i < n; i++){
            for(int j = 0; j < m; j++){
                if(arr[i][j] == '#'){
                    x[col[i][j]].pb(i);
                    y[col[i][j]].pb(j);
                }
            }
        }
        for(int i = 1; i <= 2; i++){
            sort(x[i].begin(), x[i].end());
            sort(y[i].begin(), y[i].end());
        }
        if(x[1].back() > x[2].front()){
            swap(x[1], x[2]);
            swap(y[1], y[2]);
        }
        if(y[1].back() < y[2].front()){
            for(int i = y[1].back(); i <= y[2].front(); i++){
                arr[x[1].back()][i] = '#';
            }
            for(int i = x[1].back(); i <= x[2].front(); i++){
                arr[i][y[2].front()] = '#';
            }
        } else {
            for(int i = y[2].back(); i <= y[1].front(); i++){
                arr[x[1].back()][i] = '#';
            }
            for(int i = x[1].back(); i <= x[2].front(); i++){
                arr[i][y[2].back()] = '#';
            }
        }
        fill();
        for(int i = 0; i < n; i++){
            for(int j = 0; j < m; j++){
                cout << arr[i][j];
            }
            cout << endl;
        }
        cout << endl;
    }
}
```