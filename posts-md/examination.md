title: Examination (Tutorial)
date: 11-1-2022
tag: atcoder, ad hoc, greedy, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/arc147/tasks/arc147_e)

## Solution

Lets first try to reduce the problem. If we do a sort of prefix sum, with \\(A_i\\) being a \\(-1\\) and \\(B_i\\) being a \\(+1\\), then in order for everyone to pass, every point in the prefix sum must be \\(\\ge 0\\). Lets say every element in this prefix sum is part of the set of scores that will be swapped around. If a student is not in the set, his scores will not be swapped around and he is already passing. If a student is failing, he automatically must be in the set. Now, we just have to minimize the amount of passing people we have to add to the set to make everyone pass. Lets iterate through the prefix sum of the set. If it is negative at position \\(x\\), then we must add a student with \\(B_i \\le x\\). If there are multiple students we should add the one with \\(A_i\\), since it is always more optimal to delay the \\(-1\\)s. This can be maintained by iterating the prefix sum and maintaining a set of values with \\(B_i \\le x \\) sorted by \\(A_i\\).

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

int main(){
    setIO();
    int n;
    cin >> n;
    vector<int> v1, v2;
    int arr[n][2];
    map<int, int> m;
    int ans = 0;
    multiset<pii> s1, s2;
    for(int i = 0; i < n; i++){
        int a, b;
        cin >> a >> b;
        arr[i][0] = a, arr[i][1] = b;
        if(a < b){
            ans++;
            m[a]--, m[b]++;
        } else {
            s1.insert({b, a});
        }
        v1.pb(a), v2.pb(b);
    }
    sort(v1.begin(), v1.end());
    sort(v2.begin(), v2.end());
    for(int i = 0; i < n; i++){
        if(v1[i] < v2[i]){
            cout << -1 << endl;
            return 0;
        }
    }
    int sum = 0;
    for(auto i : m){
        sum += i.ss;
        while(s1.size() && (*s1.begin()).ff <= i.ff){
            pii x = *s1.begin();
            s2.insert({x.ss, x.ff});
            s1.erase(s1.find(x));
        }
        while(sum < 0){
            ans++;
            sum++;
            pii x = *s2.rbegin();
            m[x.ff]--;
            s2.erase(s2.find(x));
        }
    }
    cout << n - ans << endl;
}
```