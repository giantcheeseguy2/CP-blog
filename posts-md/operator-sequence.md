title: Operator Sequence (Tutorial)
date: 2-21-2023
tag: xyd, greedy, tutorial

---

## Problem Statement

[Problem Link](https://contest.xinyoudui.com/contest/58/problem/248)

## Solution

Instead of tracking the answer as a whole, we will instead look at each bit individually. Assuming we take everything, each `+` will become \\(2^x\\) where \\(x\\) is the number of `*` after it. Then taking a subsequence turns into the operations of dividing every value \\(\\ge x\\) by \\(2\\) for an abitrary \\(x\\) or removing some of them. We want to always set the highest bit if possible. Also, to deal with our first operation of division, we will group all elements with the same value together, then just insure that if we shift some bit down we are also shifting everything larger than it down. Lets start from the highest bit then go down while maintaining the set of groups that are \\(\\ge\\) than that bit. Assuming the groups are sorted in increasing order of original bit, we want to leave some suffix of groups at each bit and move the rest down. We can do this greedily, but we have to somehow consider carries from lower bits after we shift things down. For example, shifting down a group of \\(3\\) is better than leaving a group of \\(3\\). The hard part is because you can have a large size for every group. So lets see how we can reduce this complexity. In our chosen subsequence, in every subsegment of `+` we can actually see that if there is a `*` before that subsegment, then \\(2\\) `+`s is equivalent to one `+` before the `*`. It is easy to see that this means that we can do this operation in our original string as well, since only the parity for each subsegment is what really matters. Repeatedly doing this gives us a prefix of `+`, then every other subsegment is at most size \\(2\\). For the prefix, we can manually add `*` in a similar way to make every subsegment at most size \\(2\\). Now, our group sizes are at most \\(2\\). Now, our final structure is just some groups in the highest bit, then at most one group in every other bit. Since we are only moving down groups of sizes \\(1\\) or \\(2\\), there is no need to worry about the carries and we can always set the highest group down for each bit and move the other groups down, since the \\(3\\) case will never happen.

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
    int n, k;
    cin >> n >> k;
    k = min(k, n);
    int lim = 1 << k;
    string s;
    cin >> s; 
    vector<int> v;
    for(int i = 0; i < n; i++){
        if(s[0] == '*'){
            v.pb(-1);
            v.pb(0);
        } else {
            v.pb(0);
            v.pb(-1);
        }
    }
    for(int i = 0; i < n; i++){
        int j = i;
        while(j < n && s[j] == '+') j++;
        if(j > i) v.pb(j - i);
        else {
            j = i;
            while(j < n && s[j] == '*') j++;
            for(int k = 0; k < j - i; k++){
                v.pb(-1);
                if(k < j - i - 1) v.pb(0);
            }
        }
        i = j - 1;
    }
    for(int i = v.size() - 1; i >= 0; i--){
        if(v[i] > 1){
            if(i - 2 >= 0 && v[i] > 2){
                v[i - 2] += (v[i] - 1)/2;
                v[i] = 1 + (v[i] - 1)%2;
            }
        }
    }
    vector<pii> add[k];
    int m[n + 1];
    memset(m, 0, sizeof(m));
    int sum = 0;
    while(v.size()){
        if(v.back() <= 0) sum -= v.back();
        else m[sum] += v.back();
        v.pop_back();
    }   
    for(int i = 0; i <= n; i++){
        if(m[i]) add[min(k - 1, i)].pb({i, m[i]});
    }
    int ans[k];
    memset(ans, 0, sizeof(ans));
    int rem[k];
    memset(rem, 0, sizeof(rem));
    for(int i = k - 1; i >= 0; i--){
        if(add[i].size()){
            rem[i] += add[i].back().ss;
            add[i].pop_back();
            if(i){
                for(pii j : add[i]){
                    add[i - 1].pb(j);
                }
            } else {
                for(pii j : add[i]){
                    rem[i] += j.ss;
                }
            }
        }
    }
    for(int i = k - 1; i >= 0; i--){
        for(int j = 0; j < rem[i]; j++){
            int cur = i;
            while(cur < k && ans[cur] == 1) cur++;
            if(cur == k) break;
            cur = i;
            while(ans[cur] == 1){
                ans[cur] = 0;
                cur++;
            }
            ans[cur] = 1;
        }
    }
    bool front = false;
    for(int i = k - 1; i >= 0; i--){
        if(ans[i]){
            front = true;
            cout << 1;
        } else if(front) cout << 0;
    }
    if(!front) cout << 0;
    cout << endl;
}
```