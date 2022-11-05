title: Gosha Is Hunting (Tutorial)
date: 11-4-2022
tag: cf, aliens trick, flows, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/739/E)

## Solution

This probability problem can be reduced to an optimization problem. The value for throwing an \\(a\\) ball is \\(p_i\\), the value for throwing a \\(b\\) ball is \\(u_i\\), and the value for throwing both balls is \\(1 - (1 - p_i) \\cdot (1 - u_i)\\). We can solve this problem either using flows or aliens trick. 

Flows:

The bounds seem a bit high for a flows solution, but it seems like a min cost max flow problem. Lets try to construct a flows graph. If we throw a \\(a\\) ball at \\(i\\), we will get some points. If we throw a \\(b\\) ball at \\(i\\), we will get some points. So we can immediately make two nodes for \\(a\\) and \\(b\\) with an edge to source with cost \\(0\\) and a capacity representing how many of those balls we can throw. Each index should have two edges to the sink. The first edge should have weight \\(0\\) and capacity \\(1\\), and the second edge should have weight \\(1 - (1 - p_i) \\cdot (1 - u_i) - p_i - u_i\\) and capacity \\(1\\). This will account for the two ball case. Since the second edge is always negative, if we only throw one ball, the flow will take the edge with \\(0\\) weight first. If we throw two balls, the flow will be forced to take the second edge, which accounts for the cost of throwing both balls. The time complexity is incorrect (\\(O(N \\cdot M^2)\\), since we use spfa for the negative edge weights), but flows is fast so it passes.

Aliens Trick:

Lets write out a dp. \\(dp[i][j][k] = \\) the answer at \\(i\\) while having already thrown \\(j\\) balls of type \\(a\\) and \\(k\\) balls of type \\(b\\). Using aliens trick, we can get rid of the \\(k\\) state, and solve for \\(dp[i][j] = \\) the answer at \\(i\\) while having already throwin \\(j\\) balls of type \\(a\\), with no restriction on balls of type \\(b\\). We can use aliens trick again to similarly get rid of the \\(j\\) state when finding \\(dp[i][j]\\). This gives us a \\(O(N log^2 N)\\) solution. 

## Code

### Flows Solution

```c++
#pragma GCC optimize("Ofast")
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
 
vector<pii> g[10000];
pii edge[1000000];
int flow[1000000];
int s, t, sz = 0;
 
void add(int a, int b, int v, double c){
    c *= 100000;
    g[a].pb({b, sz});
    g[b].pb({a, sz + 1});
    edge[sz] = {v, c};
    edge[sz + 1] = {0, -c};
    sz += 2;
}
 
int dist[10000];
pii par[10000];
bool in[10000];
 
bool spfa(){
    for(int i = s; i <= t; i++) dist[i] = -INF, in[i] = false;
	queue<int> q;
	q.push(s);
    dist[s] = 0;
    in[s] = true;
	while(!q.empty()){
		int st = q.front();
		q.pop();
        in[st] = false;
        for(auto i : g[st]){
			if(flow[i.ss] < edge[i.ss].ff && dist[st] + edge[i.ss].ss > dist[i.ff]){
                dist[i.ff] = dist[st] + edge[i.ss].ss;
                par[i.ff] = {st, i.ss};
                if(!in[i.ff]){
                    in[i.ff] = true;
                    q.push(i.ff);
                }
            }
		}
	}
	return dist[t] > -INF;
}
 
int main(){
    setIO();
    int n, a, b;
    cin >> n >> a >> b;
    double arr[n + 1][2];
    for(int i = 1; i <= n; i++) cin >> arr[i][0];
    for(int i = 1; i <= n; i++) cin >> arr[i][1];
    s = 0, t = n + 3;
    add(0, 1, a, 0);
    add(0, 2, b, 0);
    for(int i = 1; i <= n; i++){
        add(1, i + 2, 1, arr[i][0]);
        add(2, i + 2, 1, arr[i][1]);
        add(i + 2, t, 1, 0);
        add(i + 2, t, 1, (1 - (1 - arr[i][0])*(1 - arr[i][1])) - arr[i][0] - arr[i][1]);
    }
    int ans = 0;
    while(spfa()){
        int cur = t;
        ans += dist[t];
        while(cur != s){
            flow[par[cur].ss]++;
            flow[par[cur].ss ^ 1]--;
            cur = par[cur].ff;
        }
    }
    cout << fixed << setprecision(4) << (double)ans/100000 << "\n";
}
```

### Aliens Trick Solution

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

double arr[100005][2];
int cost[100005][3];
int n, a, b;
pair<int, pii> dp[100005];
int x, y;

int check2(){
    dp[0] = {0, {0, 0}};
    for(int i = 1; i <= n; i++){
        dp[i] = dp[i - 1]; //dont take
        dp[i] = max(dp[i], {dp[i - 1].ff + cost[i - 1][0] - x, {dp[i - 1].ss.ff + 1, dp[i - 1].ss.ss}}); //take a
        dp[i] = max(dp[i], {dp[i - 1].ff + cost[i - 1][1] - y, {dp[i - 1].ss.ff, dp[i - 1].ss.ss + 1}}); //take b
        dp[i] = max(dp[i], {dp[i - 1].ff + cost[i - 1][2] - x - y, {dp[i - 1].ss.ff + 1, dp[i - 1].ss.ss + 1}}); //take both
    }
    return dp[n].ss.ss;
}

int check1(){
    int l = 0, r = 1e6;
    while(l < r){
        int mid = (l + r + 1)/2;
        y = mid;
        if(check2() >= b) l = mid;
        else r = mid - 1;
    }
    y = l;
    check2();
    return dp[n].ss.ff;
}

int main(){
    setIO();
    cin >> n >> a >> b;
    for(int i = 0; i < n; i++) cin >> arr[i][0];
    for(int i = 0; i < n; i++) cin >> arr[i][1];
    for(int i = 0; i < n; i++){
        cost[i][0] = arr[i][0]*1e6;
        cost[i][1] = arr[i][1]*1e6;
        cost[i][2] = (1 - (1 - arr[i][0])*(1 - arr[i][1]))*1e6;
    }
    int l = 0, r = 1e6;
    while(l < r){
        ll mid = (l + r + 1)/2;
        x = mid;
        if(check1() >= a) l = mid;
        else r = mid - 1;
    }
    x = l;
    check1();
    cout << fixed << setprecision(5) << (dp[n].ff + x*a + y*b)/1e6 << endl;
}
```