title: Master Of Both (Tutorial)
date: 1-3-2023
tag: cf, trie, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/104090/problem/K)

## Solution

To count inversions on a normal alphabet, we would just maintain a trie of all the string occurences, add strings one by one, and count the number of lexicographically greater strings as we process the string. To extend this to an arbitrary alphabet, notice that the only comparisons that matter is between two pairs of characters as we walk down the trie. In other words, if we maintain a \\(cnt[i][j]\\) which is the number of pairs of strings that share a prefix and the first character that differs are \\(i\\) and \\(j\\) respectively. This allows us to count the number of inversions for any given alphabet as long as we loop over the ordered pairs of characters. Note the case where a string is a prefix of another.

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

int g[1000005][26], sz = 1;
int sub[1000005];
ll cnt[26][26];

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    ll add = 0;
    for(int i = 0; i < n; i++){
        string s;
        cin >> s;
        int cur = 0;
        for(int j = 0; j < s.length(); j++){
            for(int k = 0; k < 26; k++){
                if(k != s[j] - 'a'){
                    cnt[k][s[j] - 'a'] += sub[g[cur][k]];
                }
            }
            cur = (g[cur][s[j] - 'a'] ? g[cur][s[j] - 'a'] : g[cur][s[j] - 'a'] = sz++);
            sub[cur]++;
        }
        for(int j = 0; j < 26; j++) add += sub[g[cur][j]];
    }
    while(q--){
        string s;
        cin >> s;
        ll ans = add;
        for(int j = 0; j < 26; j++){
            for(int k = j + 1; k < 26; k++){
                ans += cnt[s[k] - 'a'][s[j] - 'a'];
            }
        }
        cout << ans << endl;
    }
}
```