title: Prefix Functions (Tutorial)
date: 12-2-2022
tag: cf, string, ac automaton, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1721/E)

## Solution

We can't run kmp on the new string since adding and removing parts would break the amortization. However, ac automaton on a singular string is identical to evaluating the longest suffix that is also a prefix for a given index. It also supports appending in linear time. Thus, we can just maintain an ac automaton for a single string and it just works.

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

int g[1000015][26];
int fail[1000015];

int main(){
    setIO();
    string s;
    cin >> s;
    int n = s.length();
    for(int i = 0; i < n; i++) g[i][s[i] - 'a'] = i + 1;
    fail[1] = 0;
    for(int i = 1; i < n; i++){
		for(int j = 0; j < 26; j++){
			if(g[i][j]){
				fail[g[i][j]] = g[fail[i]][j];				
			} else {
				g[i][j] = g[fail[i]][j];
			}
		}
	}
    int q;
    cin >> q;
    while(q--){
        string t;
        cin >> t;
        int m = t.length();
        for(int i = n; i < n + m; i++) g[i][t[i - n] - 'a'] = i + 1;
        for(int i = n; i < n + m; i++){
            for(int j = 0; j < 26; j++){
                if(g[i][j]){
                    fail[g[i][j]] = g[fail[i]][j];				
                } else {
                    g[i][j] = g[fail[i]][j];
                }
            }
            cout << fail[i + 1] << " ";
        }
        cout << endl;
        for(int i = n; i < n + m; i++) for(int j = 0; j < 26; j++) g[i][j] = 0;
    }
}
```