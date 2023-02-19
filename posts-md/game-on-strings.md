title: Game On Strings (Tutorial)
date: 1-30-2023
tag: cf, sprague grundy, game, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1037/problem/G)

## Solution

Consider a \\(O(N^2)\\) solution to solve the problem. This game is impartial, so we can apply sprague grundy here. Let \\(dp[i][j] = \\) the grundy number for the game on the interval \\([i, j]\\). Seperate intervals are independent games, so the grundy number for after choosing a character is just the xor of all the intervals after removing all occurences that character. To find the grundy number of \\(dp[i][j]\\) is just the mex of the set of grundy numbers after choosing any character, since those are the possible moves from \\(dp[i][j]\\). We can't optimize the states directly, so lets see if there is some sort of monotonicity or if the number of relevant states are limited. Turns out, number of states is actually limited. We only care about ranges of the form \\((c \\dots]\\), \\([\\dots c)\\), or \\((c \\dots c)\\), where \\(c\\) is a character. It is easy to see that this is true, since these intervals are all that we need to calculate the grundy number of a range after removing a character. This amount is also bounded by \\(26 \\cdot 3 \\cdot N\\), since for each character, there are \\(N\\) intervals of each type. Knowing these intervals, we can answer the queries, but how can we calculate them? We can go from left to right, and at position \\(i\\), we will know all relevant intervals with a rightbound smaller than \\(i\\). Then, if we process the new relevant intervals in the right order, we will be able to construct them correctly. We can use prefix sums to maintain the xor of a range of intervals of the third type, which can be updated correctly since we are only adding to the end.

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

int pre[26][100005], suf[26][100005];
vector<int> pos[26];
int nxt[26][100005], prv[26][100005];

int ind(int c, int x){
    return lower_bound(pos[c].begin(), pos[c].end(), x) - pos[c].begin();
}

int query(int l, int r){
    bool vis[27];
    memset(vis, false, sizeof(vis));
    for(int i = 0; i < 26; i++){
        int a = nxt[i][l], b = prv[i][r];
        if(b < l || a > r) continue;
        int sg = pre[i][b] ^ pre[i][a];
        if(b < r) sg ^= pre[i][r];
        if(a > l) sg ^= suf[i][l];
        sg = min(sg, 26);
        vis[sg] = true;
    }
    for(int i = 0; i <= 26; i++) if(!vis[i]) return i;
    return -1;
}

int main(){
    setIO();
    string s;
    cin >> s;
    int n = s.length();
    int last[26];
    memset(last, -1, sizeof(last));
    for(int i = 0; i < n; i++){
        for(int j = 0; j < 26; j++){
            prv[j][i] = (i ? prv[j][i - 1] : -1);
        }
        prv[s[i] - 'a'][i] = i;
    }
    for(int i = n - 1; i >= 0; i--){
        for(int j = 0; j < 26; j++){
            nxt[j][i] = (i < n - 1 ? nxt[j][i + 1] : -1);
        }
        nxt[s[i] - 'a'][i] = i;
    }
    for(int i = 0; i < n; i++){
        int j = i;
        //[...i]
        while(j - 1 >= 0 && s[j - 1] != s[i]){
            j--;
            suf[s[i] - 'a'][j] = query(j, i - 1);
        }
        vector<pii> v;
        for(int j = 0; j < 26; j++){
            if(last[j] == -1) continue;
            if(s[i] - 'a' == j){
                //[i...i]
                pre[j][i] = query(last[j] + 1, i - 1) ^ pre[j][last[j]];
            } else {
                //[i...]
                v.pb({last[j] + 1, j});
            }
        }
        sort(v.rbegin(), v.rend());
        for(pii j : v) pre[j.ss][i] = query(j.ff, i);
        last[s[i] - 'a'] = i;
    }
    int q;
    cin >> q;
    while(q--){
        int l, r;
        cin >> l >> r;
        l--, r--;
        if(query(l, r)) cout << "Alice" << "\n";
        else cout << "Bob" << "\n";
    }
}
```