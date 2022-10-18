title: Card Collecting Game (Tutorial)
date: 10-16-2022
tag: csacademy, greedy, dp, tutorial

---

## Problem Statement

[Problem Link](https://csacademy.com/contest/round-49/task/card-collecting-game/statement/)

## Solution

Lets try to find the optimal strategy for both players while only considering \\(1\\) deck. We will assume that card \\(i\\) appears \\(x_i\\) times. For a card \\(i\\), every time it occurs \\(2a_i\\) times, we are guranteed to be able to get it \\(a_i\\) times and thus get \\(v_i\\) score. So, lets only consider the remainder of the of \\(x_i\\) after dividing by \\(2a_i\\). If this remainder is smaller than \\(2a_i - 1\\), we will never be able to get another \\(a_i\\) copies of this card. However, if the remainder is \\(2a_i - 1\\), depending on whether we go first or not, we could get another \\(a_i\\) copies. So, if we go first, we can win the greatest card, third greatest card, and so on. If we go second, we can win the second greatest card, fourth greatest card, and so on. Now, we have to determine a way to distribute cards into the piles optimally. The first thing to know is that \\(a_1 + a_1 \\cdot a_2 + (a_1 + a_2) \\cdot a_3 + \\ldots + (a_1 + a_2 + \\ldots + a_{n - 1}) \\cdot a_n\\) is bounded by \\((\\sum a_i)^2\\). Next, we only have to consider distributing at most \\(4a_i - 1\\) cards between the two decks, since other than those cards, card \\(i\\) will always contribute a fixed amount to the answer. This leads us to a dp where \\(dp[i][j] = \\) the answer when considering the first \\(i\\) cards with \\(j\\) cards in the first deck. Note that because of the upper bound stated previously, this is \\(O(a_i^2)\\). The next part of the problem is to determine whether \\(dp[i][j]\\) is possible to reach while distributing an even amount of cards to both decks. We can do this with another dp. If we bundle each type of card into groups of \\(2a_i\\), the groups can be indistinguishable, since we don't care about their value. Notice that there are only \\(O(\sqrt{\\sum a_i})\\) distinct values. This leads us to a new dp where \\(dp2[i][j] = \\) if it is possible to reach \\(j\\) using the first \\(i\\) distinct values. However, transitioning is still to slow for this. To optimize, we can do another dp for each \\(i\\). Let \\(dp3[j] = \\) the maximum number of uses of the \\(i\\)th value we have left if we got to position \\(j\\). If \\(x_i\\) is the number of occurences of the \\(i\\)th distince value and \\(v_i\\) is its value, then \\(dp3[j] = x_i\\) if \\(dp2[i - 1][j]\\) is true, and \\(dp3[j]\\) can transition from \\(dp3[j - v_i]\\). Now transitions only take \\(O(\\sum q_i)\\) time. Our final complexity is \\(O((\\sum a_i)^2 + \\sqrt{\\sum a_i} \\cdot \\sum q_i)\\).

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

int main(){
    setIO();
    int n;
    cin >> n;
    int req[n], cnt[n], val[n];
    int sum = 0;
    int tot = 0;
    int cap[n];
    int ans = 0;
    vector<pii> v;
    for(int i = 0; i < n; i++){
        cin >> req[i] >> cnt[i] >> val[i]; 
        v.pb({val[i], i});
        req[i] *= 2;
        int x = max(0, cnt[i] - (req[i] - 1))/req[i]*req[i];
        cap[i] = cnt[i] - x;
        ans += x/req[i]*val[i];
        sum += cap[i];
        tot += cnt[i];
    }
    int dp[2][sum + 1][2][2];
    for(int i = 0; i <= sum; i++) for(int j = 0; j < 2; j++) dp[j][i][0][0] = dp[j][i][0][1] = dp[j][i][1][0] = dp[j][i][1][1] = -INF;
    dp[0][0][1][0] = 0;
    int cur = 0;
    sort(v.rbegin(), v.rend());
    for(pii ind : v){
        int i = ind.ss;
        cur += cap[i];
        for(int j = 0; j <= cur; j++){
            for(int k = 0; k <= min({j, cap[i]}); k++){
                int a = k%req[i] == req[i] - 1;
                int b = (cap[i] - k)%req[i] == req[i] - 1;
                int c = k >= req[i];
                int d = cap[i] - k >= req[i];
                for(int x = 0; x <= 1; x++){
                    for(int y = 0; y <= 1; y++){
                        dp[1][j][x][y] = max(dp[1][j][x][y], dp[0][j - k][x ^ a][y ^ b] + (c || (!x && a) ? val[i] : 0) + (d || (!y && b) ? val[i] : 0));
                    }
                }
            }
        }
        for(int i = 0; i <= cur; i++){
            for(int a = 0; a <= 1; a++){
                for(int b = 0; b <= 1; b++){
                    dp[0][i][a][b] = dp[1][i][a][b];
                    dp[1][i][a][b] = -INF;
                }
            }
        }
    }
    int vis[tot + 1];
    memset(vis, -1, sizeof(vis));
    vis[0] = 0;
    map<int, int> m;
    for(int i = 0; i < n; i++) m[req[i]] += (cnt[i] - cap[i])/req[i];
    cur = 0;
    for(pii i : m){
        for(int j = 0; j <= tot; j++) if(vis[j] >= 0) vis[j] = 0;
        for(int j = i.ff; j <= tot; j++){
            if(vis[j - i.ff] != -1 && vis[j - i.ff] < i.ss){
                vis[j] = (vis[j] == -1 ? vis[j - i.ff] + 1 : min(vis[j], vis[j - i.ff]) + 1);
            }
        }
    }
    int add = 0;
    for(int i = 0; i <= min(sum, tot/2); i++){
        if(vis[tot/2 - i] >= 0){
            for(int a = 0; a <= 1; a++){
                for(int b = 0; b <= 1; b++){
                    add = max(add, dp[0][i][a][b]);
                }
            }
        }
    }
    cout << ans + add << endl;
}
```