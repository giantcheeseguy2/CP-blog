title: Team Building (Tutorial)
date: 9-19-2022
tag: usaco, dp, tutorial

---

## Problem Statement

[Problem Link](http://www.usaco.org/index.php?page=viewproblem2&cpid=673)

## Solution

The hardest part about this problem is realizing that Farmer John only wins if he wins all \\(k\\) rounds. After this, it becomes a trivial dp where \\(dp[i][j][k] = \\) we are comparing Paul's \\(i\\)th and John's \\(j\\)th cow, while having \\(k\\) wins. You can either take the win if cow \\(j\\) is better than cow \\(i\\), or just not take one of the two cows. However, this overcounts. By visualizing this as a 2d plane, we can see that to remove the overcount we just have to subtract \\(dp[i - 1][j - 1][k]\\) whenever transitioning.

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
const int MOD = 1e9 + 9;

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;

inline ll ceil0(ll a, ll b) {
	return a / b + ((a ^ b) > 0 && a % b);
}

void setIO() {
	ios_base::sync_with_stdio(0); cin.tie(0);
}

int main(){
	setIO();
	freopen("team.in", "r", stdin);
	freopen("team.out", "w", stdout);
	int n, m, k;
	cin >> n >> m >> k;
	int a[n], b[m];
	for(int i = 0; i < n; i++) cin >> a[i];
	for(int i = 0; i < m; i++) cin >> b[i];
	sort(a, a + n);
	sort(b, b + m);
	int dp[n + 1][m + 1][k + 1];
	memset(dp, 0, sizeof(dp));
	dp[0][0][0] = 1;
	for(int i = 1; i <= n; i++) dp[i][0][0] = 1;
	for(int i = 1; i <= m; i++) dp[0][i][0] = 1;
	for(int i = 1; i <= n; i++){
		for(int j = 1; j <= m; j++){
			for(int x = 0; x <= k; x++){
				if(x && a[i - 1] > b[j - 1]) dp[i][j][x] = (dp[i][j][x] + dp[i - 1][j - 1][x - 1])%MOD;
				dp[i][j][x] = (dp[i][j][x] + dp[i - 1][j][x])%MOD;
				dp[i][j][x] = (dp[i][j][x] + dp[i][j - 1][x])%MOD;
				dp[i][j][x] = (dp[i][j][x] + MOD - dp[i - 1][j - 1][x])%MOD;
			}
		}
	}
	cout << dp[n][m][k] << endl;
}
```