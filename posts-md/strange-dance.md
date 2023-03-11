title: Strange Dance (Tutorial)
date: 2-22-2023
tag: atcoder, trie, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/agc044/tasks/agc044_c)

## Solution

The effect of the first operation depends on the base \\(3\\) format of our problem. However, the second operation appears to only depend on the base \\(10\\) format of our problem, since it is a cyclic rotate. This makes it hard to solve, so we either have to change the first operation to base \\(10\\) or the escond operation to base \\(3\\). The former is hard, so lets see if we can try the latter. Moving from \\(i\\) to \\(i + 1\\) means changing a prefix of the string. The prefix will always be of the form of a segment of \\(2\\)s followed by a non \\(2\\). So there are actually only \\(3 \\cdot N\\) unique prefixes to update. Now, we need a way to swap all \\(1\\)s and \\(2\\)s, while also updating some prefixes. In the prefix updates, all values that have a certain prefix will now be swapped for a different prefix. This can actually be done using a trie. Swapping \\(1\\)s and \\(2\\)s is a lazy tag, while updating a prefix is just manually checking all prefixes and swapping their final elements.

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

int tag[1000005];
int nxt[1000005][3];
int ans[1000005];
int sz = 1, n;
int lim = 1;

void build(int x, int cur = 0, int len = 1){
    if(len == lim){
        ans[x] = cur;
        return;
    }
    for(int i = 0; i < 3; i++){
        nxt[x][i] = sz++;
        build(nxt[x][i], cur + i*len, len*3);
    }
}

void apply(int x){
    tag[x] ^= 1;
    swap(nxt[x][1], nxt[x][2]);
}

void push_down(int x){
    if(!tag[x]) return;
    for(int i = 0; i < 3; i++) if(nxt[x][i]) apply(nxt[x][i]);
    tag[x] = 0;
}

int out[1000005];

void get(int x, int cur = 0, int len = 1){
    if(len == lim){
        out[ans[x]] = cur;
        return;
    }
    push_down(x);
    for(int i = 0; i < 3; i++){
        get(nxt[x][i], cur + i*len, len*3);
    }
}

int main(){
    setIO();
    cin >> n;
    for(int i = 0; i < n; i++) lim *= 3;
    build(0);
    string s;
    cin >> s;
    for(int i = 0; i < s.length(); i++){
        if(s[i] == 'S'){
            apply(0);
        } else {
            int cur = 0;
            for(int j = 0; j < n; j++){
                push_down(cur);
                int tmp = nxt[cur][0];
                nxt[cur][0] = nxt[cur][2];
                nxt[cur][2] = nxt[cur][1];
                nxt[cur][1] = tmp;
                cur = nxt[cur][0];
            }
        }
    }
    get(0);
    for(int i = 0; i < lim; i++) cout << out[i] << " ";
    cout << endl;
}
```