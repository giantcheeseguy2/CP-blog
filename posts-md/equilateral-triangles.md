title: Equilateral Triangles (Tutorial)
date: 9-16-2022
tag: usaco, brute force, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=1021)

## Solution

\\(N\\) is small, and it seems like the intended complexity is somewhere around \\(O(N^3)\\). This suggests fixing the length of the triangle, then trying every possible point and some distance \\(d\\) away is in a diamond. And thus, all possible triangles are the intersections of the diamonds. After working out some cases, we notice that an odd length is always impossible. Furthermore, when the length is even, we only care about 4 points in the positions on the midpoint on the segments of the diamond, which intersect multiple points. The only value overcounted will be a single case of triangle, so we can just not count them and add them back later. This can all be maintained by a segment tre or bit.

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

int pre[1005][1005][2];
char arr[1005][1005];
int n;

int query(int x, int y, int t){
    return pre[x][y][t];
}

int main(){
    setIO();
    freopen("triangles.in", "r", stdin);
    freopen("triangles.out", "w", stdout);
    cin >> n;
    for(int i = 0; i <= 1000; i++) for(int j = 0; j <= 1000; j++) arr[i][j] = '.';
    for(int i = 1; i <= n; i++) for(int j = 1; j <= n; j++) cin >> arr[i + n][j + n];
    for(int i = 1; i <= 1000; i++) for(int j = 1; j <= 1000; j++) pre[i][j][0] = pre[i - 1][j - 1][0] + (arr[i][j] == '*');
    for(int i = 1; i <= 1000; i++) for(int j = 1000; j >= 1; j--) pre[i][j][1] = pre[i - 1][j + 1][1] + (arr[i][j] == '*');
    ll ans = 0;
    int add = 0;
    for(int l = 1; l <= n; l++){
        for(int x = n + 1; x <= n + n; x++){
            for(int y = n + 1; y <= n + n; y++){
                if(arr[x][y - l] == '*' && arr[x][y + l] == '*' && arr[x + l][y] == '*') add++;
                if(arr[x][y - l] == '*' && arr[x][y + l] == '*' && arr[x - l][y] == '*') add++;
                if(arr[x - l][y] == '*' && arr[x + l][y] == '*' && arr[x][y + l] == '*') add++;
                if(arr[x - l][y] == '*' && arr[x + l][y] == '*' && arr[x][y - l] == '*') add++;
                if(arr[x][y] != '*') continue;
                if(arr[x - l][y - l] == '*'){
                    ans += query(x - l, y + l, 0) - (arr[x - l][y + l] == '*');
                    ans -= query(x - 2*l, y, 0);
                    ans += query(x + l, y - l, 0) - (arr[x + l][y - l] == '*');
                    ans -= query(x, y - 2*l, 0);
                }
                if(arr[x - l][y + l] == '*'){
                    ans += query(x - l, y - l, 1) - (arr[x - l][y - l] == '*');
                    ans -= query(x - 2*l, y, 1);
                    ans += query(x + l, y + l, 1) - (arr[x + l][y + l] == '*');
                    ans -= query(x, y + 2*l, 1);
                }
                if(arr[x + l][y - l] == '*'){
                    ans += query(x, y - 2*l, 1) - (arr[x][y - 2*l] == '*');
                    ans -= query(x - l, y - l, 1);
                    ans += query(x + 2*l, y, 1) - (arr[x + 2*l][y] == '*');
                    ans -= query(x + l, y + l, 1);
                }
                if(arr[x + l][y + l] == '*'){
                    ans += query(x, y + 2*l, 0) - (arr[x][y + 2*l] == '*');
                    ans -= query(x - l, y + l, 0);
                    ans += query(x + 2*l, y, 0) - (arr[x + 2*l][y] == '*');
                    ans -= query(x + l, y - l, 0);
                }
            }
        }
    }
    cout << ans/2 + add << endl;
}
```