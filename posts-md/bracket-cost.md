title: Bracket Cost (Tutorial)
date: 2-3-2023
tag: cf, segtree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1750/problem/E)

## Solution

Lets try to solve this for a single string first. We can check if a sequence is valid by converting a `(` to \\(1\\) and `)` to \\(-1\\). Then, to check, we just need to make sure that every prefix sum is \\(\\ge 0\\) and the total sum is \\(0\\). To solve this, lets see if we can get a lower bound on our answer, which is the sum of magnitude of \\(max(0, sum)\\) and the minimum negative prefix. It is easy to see that we cannot do better than this since every operation can only reduce one of these values by at most \\(1\\). Rotating a `(` cannot reduce the sum, and rotating a `)` cannot reduce the minimum prefix. Similarly, adding a `(` cannot reduce the sum, and adding a `)` cannot reduce the minimum prefix. Note that if our sum is negative, we can solve it simultaneosly with the minimum prefix. As in many problems, assuming the lower bound is the answer will result in an ac, but in this case, it is actually easy to create a construction to achieve this lower bound. If our sum is not zero, we can obviously just add in parentheses until it is. Now, to fix the minimum, moving that amount of `(`s to the front of the string is sufficient. Now, we just have to calculate this over all substrings somehow. Lets fix the right endpoint and calculate the answer for all left endpoints. The first issue we run into is that we would somehow have to compute our prefix sum starting from zero for every left endpoint. However, we can fix this by just setting our zero of the range with left endpoint \\(i\\) to be \\(pre[i - 1]\\). Now, we just have to find the sum of sums for each left endpoint and the sum of minimums for each left endpoints. Our equation for an interval \\([l, r]\\) will be \\(pre[l - 1] - min + max(0, pre[r] - pre[l - 1])\\). This turns out to be \\(max(pre[l - 1], pre[r]) - min\\). Minimums can be easily maintained with a monotonic static, since once we add in a prefix sum we never want to change it. Finding the sum can be done by breaking up the max into two cases and using a segtree.

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

ll bit[400005][2];
int n;

void update(int x, int v, int t){
    for(x++; x <= 2*n + 1; x += x & (-x)) bit[x][t] += v;
}

ll query(int x, int t, ll ret = 0){
    for(x++; x; x -= x & (-x)) ret += bit[x][t];
    return ret;
}

int main(){
    setIO();
    int t;
    cin >> t;
    for(int tt = 1; tt <= t; tt++){
        cin >> n;
        string s;
        cin >> s;
        int cur = 0;
        ll sum = 0;
        ll ans = 0;
        stack<pii> smn;
        smn.push({0, 0});
        for(int i = 1; i <= 2*n + 1; i++) bit[i][0] = bit[i][1] = 0;
        update(n, 1, 0);
        for(int i = 1; i <= n; i++){
            if(s[i - 1] == '(') cur++;
            else cur--;
            int prv = i;
            while(!smn.empty() && smn.top().ff > cur){
                sum += (ll)smn.top().ff*(prv - smn.top().ss);
                prv = smn.top().ss;
                smn.pop();
            }
            smn.push({cur, prv});
            sum -= (ll)cur*(i - prv + 1);
            ans += cur*query(cur + n, 0);
            ans += query(2*n, 1) - query(cur + n, 1);
            update(cur + n, 1, 0);
            update(cur + n, cur, 1);
            ans += sum + cur;
        }
        cout << ans << endl;
    }
}
```