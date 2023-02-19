title: Random Pawn (Tutorial)
date: 1-29-2023
tag: atcoder, probabilities, convex hull, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/agc044/tasks/agc044_e)

## Solution

Let \\(dp[i] = \\) the maximum expected value that you can get from being at \\(i\\). We get a recurrence \\(dp[i] = max(A_i, \\frac{dp[i + 1] + dp[i - 1]}{2} - B_i)\\), where \\(i + 1\\) and \\(i - 1\\) are circular. Imagine if \\(B_i\\) was \\(0\\) for all \\(i\\). Then, \\(dp[i]\\) would be the y value at x position \\(i\\) on the upper convex hull of the set of points \\((i, A_i)\\). For the maximum \\(A_i\\) in the set, it is obviously optimal to stop there and collect it. Going from there, it is easy to see that since the answer for a given \\(i\\) is either \\(A_i\\) or the slope between \\(i - 1\\) and \\(i + 1\\), it will eventually form a convex hull after being run an infinite amount of times. To deal with the circular nature, we can set the first point to be the index with maximal \\(A_i\\), and add an extra point with height \\(A_i\\) at the end, since we know that the answer for those positions are constant. It seems hard to solve for non-zero \\(B_i\\) directly, so we should try to reduce the problem. Lets see if we can reduce it to the \\(B_i = 0\\) case. Lets add another array \\(C_i\\) to \\(dp[i]\\). Now, the equation becomes \\(dp[i] + C_i = max(A_i + C_i, \\frac{dp[i + 1] + dp[i - 1]}{2} - B_i + C_i)\\). If we set \\(C_i\\) to \\(B_i\\), then we can now solve for the zero case, but now are transitions are invalid. So we should update those accordingly, resulting in the equation \\(dp[i] + C_i = max(A_i + C_i, \\frac{dp[i + 1] + C_{i + 1} + dp[i - 1] + C_{i - 1}}{2} - \\frac{C_{i + 1} + C_{i - 1}}{2} - B_i + C_i)\\). This is now equivalent to our original equation, and we just have to somehow find an array \\(C\\) that satisfies \\(\\frac{C_{i + 1} + C_{i - 1}}{2} - B_i + C_i = 0\\). Turns out, this is actually a linear system of equations that can be solved manually. Knowing \\(C\\), we can now solve the easier version of the problem and just add \\(C_i\\) back to the found value for each \\(i\\) to get the answer. The expected optimal gain is just the average of the expected value per index, or \\(\\frac{\\sum dp[i]}{n}\\).

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
typedef pair<ld, ld> pld;
typedef pair<int, int> pii;
typedef pair<ll, ll>   pll;

const int inf = 1e9;
const ll llinf = 1e18;
const int mod = 1e9 + 7;
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

bool left(pld a, pld b, pld c) {
    b.ff -= a.ff, b.ss -= a.ss;
    c.ff -= a.ff, c.ss -= a.ss;
    return b.ff*c.ss - b.ss*c.ff >= 0;
}

int main(){
    setIO();
    int n;
    cin >> n;
    pld arr[n + 1];
    for(int i = 0; i < n; i++) cin >> arr[i].ff;
    for(int i = 0; i < n; i++) cin >> arr[i].ss;
    vector<pld> v;
    pld mx = {-llinf, -llinf};
    for(int i = 0; i < n; i++) mx = max(mx, {arr[i].ff, i});
    for(int i = mx.ss; i < n; i++) v.pb(arr[i]);
    for(int i = 0; i <= mx.ss; i++) v.pb(arr[i]);
    pld eq[n + 1];
    eq[0] = {0, 0};
    eq[1] = {0, 1};
    for(int i = 2; i <= n; i++){
        eq[i].ff = 2*v[i - 1].ss + 2*eq[i - 1].ff - eq[i - 2].ff;
        eq[i].ss = 2*eq[i - 1].ss - eq[i - 2].ss;
    }
    ld x = -eq[n].ff/eq[n].ss;
    ld add[n + 1];
    for(int i = 0; i <= n; i++) add[i] = eq[i].ff + eq[i].ss*x;
    for(int i = 0; i <= n; i++) v[i].ff -= add[i];

    vector<pld> hull = {{0, v[0].ff}};
    for (int i = 1; i <= n; i++) {
        pld P = {i, v[i].ff};
        while (hull.size() >= 2 && left(hull[hull.size()-2], hull.back(), P)) hull.pop_back();
        hull.push_back(P);
    }
    
    int ind = 0;
    ld ans = 0;
    //for(auto i : hull) cout << i.x << " " << i.y << endl;
    for (int i = 1; i < hull.size(); i++) {
        ld dx = hull[i].ff - hull[i-1].ff;
        ld dy = hull[i].ss - hull[i - 1].ss;
        ld slope = dy/dx;
        while(ind < n && ind <= hull[i].ff){
            ans += hull[i - 1].ss + slope*(ind - hull[i - 1].ff) + add[ind];
            ind++;
        }
    }
    ans /= n;
    cout << fixed << setprecision(12) << ans << endl;
}
```