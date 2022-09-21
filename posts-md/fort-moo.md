title: Fort Moo (Tutorial)
date: 9-19-2022
tag: usaco, binary search, dp, brute force, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=600)

## Solution

Lets try to check every possible fort. What elements can we fix using \\(N^3\\)? Sadly, its just position and width, but we are already close to the answer. To find the final dimension of length, we can do a sort of binary search. Lets say \\(f[i][j] = \\) the furthest that u can go down from \\(f[i][j]\\) without encountering an `X`. Now lets say \\(dp[i][j][k] = \\) the maxmium of all \\(f[a][b]\\) such that \\(j \le a \le b \le k\\). Now, by using \\(dp[i][j][k]\\), binary search will allow us to find the largest length such that all edges are valid.

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

int main(){
    setIO();
    freopen("fortmoo.in", "r", stdin);
    freopen("fortmoo.out", "w", stdout);
    int n, m;
    cin >> n >> m;
    char arr[n][m];
    for(int i = 0; i < n; i++) for(int j = 0; j < m; j++) cin >> arr[i][j];
    int nc[n][m];
    int nr[n][m];
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            nc[i][j] = j;
            while(nc[i][j] < m && arr[i][nc[i][j]] == '.') nc[i][j]++;
            nr[i][j] = i;
            while(nr[i][j] < n && arr[nr[i][j]][j] == '.') nr[i][j]++;
        }
    }
    int mx[n][m][m];
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            mx[i][j][j] = nr[i][j];
            for(int k = j + 1; k < m; k++){
                mx[i][j][k] = max(mx[i][j][k - 1], nr[i][k]);
            }
        }
    }
    int ans = 0;
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            if(arr[i][j] == 'X') continue;
            for(int k = i; k < nr[i][j]; k++){
                int lim = min(nc[i][j], nc[k][j]) - 1;
                int l = j, r = lim;
                while(l < r){
                    int mid = (l + r + 1)/2;
                    if(mx[i][mid][lim] >= k) l = mid; 
                    else r = mid - 1;
                }
                ans = max(ans, (l - j + 1)*(k - i + 1));
            }
        }
    }
    cout << ans << endl;
}
```