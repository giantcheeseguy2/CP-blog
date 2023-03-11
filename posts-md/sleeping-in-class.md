title: Sleeping In Class (Tutorial)
date: 3-4-2023
tag: usaco, sos, tutorial

---

## Problem Statement

[Problem Link](http://usaco.org/index.php?page=viewproblem2&cpid=1213)

## Solution

First, we should figure out a way to optimally solve the array for a single \\(x\\). We can think about greedily merging from left to right, and always splitting the group once it is \\(\\ge x\\). Actually, this is equivalent to greedily grouping together as many groups as possible such that their sum is a multiple of \\(x\\). In other words, we are counting the number of prefixes that are divisible by \\(x\\), since this will always be the smallest amount of groups that we can create. To avoid wasting queries, we can see that we only have to answer a query if the total sum is divisible by \\(x\\). This restricts our relevant queries to the number of divisors of the sum, which is actually only \\(10^6\\). Now, for each divisor, we have to somehow count how many prefixes are a multiple of it. Maybe we can precompute these values and somehow use reuse old information to save time. Actually, if a prefix is a multiple of a divisor, it will be a multiple of the divisor's divisors as well. Thus, if we know all the original factors which will form all possible divisors, we can count the number of prefixes that work for it using sum over subsets. Note that our base will vary based on the number of times each divisor occurs, since using a bitmask is too slow. To factor the sum, we can naively factor out all factors \\(\\le 10^6\\). This means that there are only at most two factors remaining. We can find these over the course of the queries, checking if each query is one of those factors. If a query consists of one of the factors, we can easily find the other, and if a query consists of both, then we don't need to find the extra factors, since there will be no subset needed for them.

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

const int inf = 1e9;
const ll llinf = 1e18;
const int mod = 1e9 + 7;

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

int main(){
    setIO();
    int n;
    cin >> n;
    ll sum = 0;
    ll arr[n + 1];
    for(int i = 1; i <= n; i++){
        cin >> arr[i];
        sum += arr[i];
    }
    for(int i = 2; i <= n; i++) arr[i] += arr[i - 1];
    ll mx = arr[n];
    map<ll, int> m;
    for(int i = 2; i <= 1000000; i++){
        while(sum%i == 0){
            m[i]++;
            sum /= i;
        }
    }
    int q;
    cin >> q;
    vector<ll> que;
    while(q--){
        ll x;
        cin >> x;
        que.pb(x);
        if(1 < x && x < sum && sum%x == 0){
            m[x]++;
            m[sum/x]++;
            sum = 1;
        }
    }
    if(sum != 1) m[sum]++;
    vector<pll> v;
    for(auto i : m) v.pb(i);
    int ind[v.size()];
    int lim = 1;
    for(int i = 0; i < v.size(); i++){
        ind[i] = lim;
        lim *= v[i].ss + 1;
    }
    int sos[lim];
    memset(sos, 0, sizeof(sos));
    for(int i = 1; i <= n; i++){ 
        int mask = 0;
        for(int j = 0; j < v.size(); j++){
            for(int k = 0; k < v[j].ss; k++){
                if(arr[i]%v[j].ff == 0){
                    arr[i] /= v[j].ff;
                    mask += ind[j];
                } else {
                    break;
                }
            }
        }
        sos[mask]++;
    }
    for(int i = 0; i < v.size(); i++){
        for(int j = lim - 1; j >= 0; j--){
            int cur = (j/ind[i])%(v[i].ss + 1);
            if(cur < v[i].ss){
                sos[j] += sos[j + ind[i]];
            }
        }
    }
    for(ll i : que){
        if(mx%i){
            cout << -1 << endl;
            continue;
        }
        ll ans = n + mx/i;
        int mask = 0;
        for(int j = 0; j < v.size(); j++){
            for(int k = 0; k < v[j].ss; k++){
                if(i%v[j].ff == 0){
                    i /= v[j].ff;
                    mask += ind[j];
                } else {
                    break;
                }
            }
        }
        cout << ans - 2*sos[mask] << endl;
    }
}
```