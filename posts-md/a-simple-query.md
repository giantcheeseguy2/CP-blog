title: A Simple Query (Tutorial)
date: 9-20-2022
tag: cf, mo's, prefix sums, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/396358/problem/A)

## Solution

There actually exists an \\(N^2/3\\) solution that passes under the generous bounds. However, lets say we wanted a faster solution. First of all, for any value \\(x\\), we can decompose the equation into prefix queries. \\((get(r_1, x) - get(l_1 - 1, x)) \cdot ((get(r_2, x) - get(l_2 - 1, x))\\). This is reduced to \\(get(r_1, x) \cdot get(r_2, x) - get(l_1 - 1, x) \cdot get(r_2, x) - get(r_1, x) \cdot get(l_2 - 1, x) + get(l_1 - 1, x) \cdot get(l2 - 1, x)\\). Now, we can solve it with mo's.

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

const int BUFSIZE = 20 << 20;
char Buf[BUFSIZE + 1], *buf = Buf;

template<class T>
void scan(T &x){
    int neg = 1;
    for(x = 0; *buf < '0' || *buf > '9'; buf++) if(*buf == '-') neg = -1;
    while(*buf >= '0' && *buf <= '9') x = x*10 + (*buf - '0'), buf++;
    x *= neg;
}

void setIO(){
    fread(Buf, 1, BUFSIZE, stdin);
}

const int MX = 333;

bool comp(pair<pii, int> a, pair<pii, int> b){
    if(a.ff.ff/MX == b.ff.ff/MX){
        return a.ff.ss < b.ff.ss;
    }
    return a.ff.ff/MX < b.ff.ff/MX;
}

int main(){
    setIO();
    int n;
    scan(n);
    int arr[n];
    for(int i = 0; i < n; i++) scan(arr[i]);
    int q;
    scan(q);
    vector<pair<pii, int>> que;
    for(int i = 1; i <= q; i++){
        int a, b, c, d;
        scan(a), scan(b), scan(c), scan(d);
        a--, b--, c--, d--;
        a--, c--;
        que.pb({{b, d}, i});
        que.pb({{a, c}, i});
        que.pb({{a, d}, -i});
        que.pb({{b, c}, -i});
    }
    for(auto &i : que) if(i.ff.ff > i.ff.ss) swap(i.ff.ff, i.ff.ss);
    sort(que.begin(), que.end(), comp);
    ll sum = 0;
    ll ans[q + 1];
    int cnt[n + 1][2];
    memset(ans, 0, sizeof(ans));
    memset(cnt, 0, sizeof(cnt));
    int l = -1, r = -1;
	for(auto i : que){
        while(l < i.ff.ff){
            l++;
            cnt[arr[l]][0]++;
            sum += cnt[arr[l]][1];
        }
        while(r < i.ff.ss){
            r++;
            cnt[arr[r]][1]++;
            sum += cnt[arr[r]][0];
        } 
        while(l > i.ff.ff){
            cnt[arr[l]][0]--;
            sum -= cnt[arr[l]][1];
            l--;
        }
        while(r > i.ff.ss){
            cnt[arr[r]][1]--;
            sum -= cnt[arr[r]][0];
            r--;
        }
        ans[abs(i.ss)] += sum*i.ss/abs(i.ss);
	}
    for(int i = 1; i <= q; i++) cout << ans[i] << "\n";
}
```