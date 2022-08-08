title: Minimax (Tutorial)
date: 8-8-2022
tag: loj, segtree, segtree merge, tree, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/2537)

## Solution

This problem can be solved in \\(O(N^2)\\) using dp. \\(dp[i][j]\\) = probability of \\(i\\) being \\(j\\). the transitions for a node \\(i\\) with children \\(a\\) and \\(b\\) is \\[dp[i][j] = (1 - p_i) \\cdot (dp[a][j] \\cdot \\sum_{k = j + 1}^{MX} dp[b][j] + dp[b][j] \\cdot \\sum_{k = j + 1}^{MX} dp[a][j]) + p_i \\cdot (dp[a][j] \\cdot \\sum_{k = 1}^{j - 1} dp[b][j] + \\ dp[b][j] \\cdot \\sum_{k = 1}^{j - 1} dp[a][j])  \\]. This can be solved using segtree merge by using a multiply tag and storing the sum of everything to left and right of a node when walking down.

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
const int MOD = 998244353;

template<class K> using sset =  tree<K, null_type, less<K>, rb_tree_tag, tree_order_statistics_node_update>;

inline ll ceil0(ll a, ll b) {
    return a / b + ((a ^ b) > 0 && a % b);
}

void setIO() {
    ios_base::sync_with_stdio(0); cin.tie(0);
}

template<class mod>
struct Modular {

    using T = typename mod::type;
    using C = typename mod::cast;

    template<class U>
    static T fpow(T a, U b){
        T ret = 1;
        while(b){
            if(b%2 == 1) ret = (C)ret*a%mod::mod;
            a = (C)a*a%mod::mod;
            b /= 2;
        }
        return ret;
    }

    T val;

    Modular(){
        val = 0;
    }

    template<class U>
    Modular(const U &x){
        val = x%mod::mod;
        if(val < 0) val += mod::mod;
    }

    const T Mod() const { return mod::mod; }

    const T &operator()() const { return val; }

    template<class U>
    explicit operator U() const { return static_cast<U>(val); } 

    Modular operator-(){ return Modular<mod>(-val); }

    Modular &operator+=(const Modular &x){
        val = (val + x.val)%mod::mod;
        return *this;
    }

    Modular &operator-=(const Modular &x){
        val = (val - x.val + mod::mod)%mod::mod;
        return *this;
    }

    Modular &operator*=(const Modular &x){
        val = (C)val*x.val%mod::mod;
        return *this;
    }

    Modular &operator/=(const Modular &x){
        val = (C)val*fpow(x.val, mod::mod - 2)%mod::mod;
        return *this;
    }

    Modular &operator%=(const Modular &x){
        return *this;
    }

    template<class U>
    Modular &operator^=(const U &x){
        assert(("be careful when raising to a modded power", typeid(x) != typeid(*this)));
        val = fpow(val, x);
        return *this;
    }

    Modular &operator++(){ return *this += 1; }

    Modular &operator--(){ return *this -= 1; }

    Modular operator++(int){
        Modular ret = *this;
        ++*this;
        return ret;
    }

    Modular operator--(int){
        Modular ret = *this;
        --*this;
        return ret;
    }

    friend Modular operator+(const Modular &a, const Modular &b){ return Modular(a.val) += b; }

    friend Modular operator-(const Modular &a, const Modular &b){ return Modular(a.val) -= b; }

    friend Modular operator*(const Modular &a, const Modular &b){ return Modular(a.val) *= b; }

    friend Modular operator/(const Modular &a, const Modular &b){ return Modular(a.val) /= b; }

    friend Modular operator%(const Modular &a, const Modular &b){ return Modular(a.val) %= b; }

    template<class U>
    friend Modular operator^(const Modular &a, const U &b){ return Modular(a.val) ^= b; }

    bool hasSqrt(){
        return val == 0 || fpow(val, (mod::mod - 1)/2) == 1;
    }

    Modular sqrt(){
        if(val == 0) return 0;
        if(val == 1) return 1;
        assert(hasSqrt());
        Modular r = 1, c = 1, a = 1, b = 1, aa, bb;
        while(((r*r - val) ^ ((mod::mod - 1)/2)) == 1) r++;
        Modular mult = r*r - val;
        T x = (mod::mod + 1)/2;
        while(x){
            if(x%2 == 1){
                aa = c*b*mult + a*r;
                bb = c*a + r*b;
                a = aa, b = bb;
            }
            aa = c*c*mult + r*r;
            bb = 2*c*r;
            r = aa, c = bb;
            x /= 2;
        }
        if(a >= (mod::mod + 1)/2) a *= -1;
        return a;
    }

    friend bool operator<(const Modular &a, const Modular &b){ return a.val < b.val; }

    friend bool operator<=(const Modular &a, const Modular &b){ return a.val <= b.val; }

    friend bool operator>(const Modular &a, const Modular &b){ return a.val > b.val; }

    friend bool operator>=(const Modular &a, const Modular &b){ return a.val >= b.val; }

    friend bool operator==(const Modular &a, const Modular &b){ return a.val == b.val; }

    friend bool operator!=(const Modular &a, const Modular &b){ return a.val != b.val; }

    friend ostream &operator<<(ostream &out, Modular x){ return out << x.val; }

    friend istream &operator>>(istream &in, Modular &x){ 
        in >> x.val;
        x.val = x.val%mod::mod;
        if(x.val < 0) x.val += mod::mod;
        return in;
    }

    string to_string(const Modular&x) { return to_string(x.val); }
};

struct Mod { 
    using type = int;
    using cast = long long;
    const static type mod = 998244353;
};

using mint = Modular<Mod>;
//using mint = double;

mint seg[10000000], sub[10000000], tag[10000000];
int left0[10000000], right0[10000000], sz = 1;

void push_down(int x){
    if(tag[x] == 1) return;
    if(left0[x]){
        seg[left0[x]] = tag[x]*seg[left0[x]];
        tag[left0[x]] *= tag[x];
    }
    if(right0[x]){
        seg[right0[x]] = tag[x]*seg[right0[x]];
        tag[right0[x]] *= tag[x];
    }
    tag[x] = 1;
}

int merge(int a, int b, mint p, mint al = 0, mint ar = 0, mint bl = 0, mint br = 0){
    if(!a && !b) return 0;
    if(a && !b){
        seg[a] = (p*bl + (1 - p)*br)*seg[a];
        tag[a] *= (p*bl + (1 - p)*br);
        return a;
    }
    if(!a && b){
        seg[b] = (p*al + (1 - p)*ar)*seg[b];
        tag[b] *= (p*al + (1 - p)*ar);
        return b;
    }
    push_down(a);
    push_down(b);
    mint aal = seg[left0[a]], bbl = seg[left0[b]];
    left0[a] = merge(left0[a], left0[b], p, al, ar + seg[right0[a]], bl, br + seg[right0[b]]);
    right0[a] = merge(right0[a], right0[b], p, al + aal, ar, bl + bbl, br);
    seg[a] = seg[left0[a]] + seg[right0[a]];
    sub[a] = sub[left0[a]] + sub[right0[a]];
    return a;
}

vector<int> dict;

int ind(int x){
    return lower_bound(dict.begin(), dict.end(), x) - dict.begin();
}

void update(int x, int cur, int l = 0, int r = dict.size() - 1){
    tag[cur] = 1;
    if(l == r){
        seg[cur]++;
        sub[cur]++;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, left0[cur] = sz++, l, mid);
    else update(x, right0[cur] = sz++, mid + 1, r);
    seg[cur] = seg[left0[cur]] + seg[right0[cur]];
    sub[cur] = sub[left0[cur]] + sub[right0[cur]];
}

vector<int> g[300005];
int arr[300005];
int rt[300005];

void dfs(int x){
    for(int i : g[x]) dfs(i);
    if(g[x].size() == 0){
        rt[x] = sz++;
        update(ind(arr[x]), rt[x]);
    } else if(g[x].size() == 1){
        rt[x] = rt[g[x][0]];
    } else {
        rt[x] = merge(rt[g[x][0]], rt[g[x][1]], arr[x]);
    }
}

mint ans = 0;

void query(int cur, int l = 0, int r = dict.size() - 1){
    if(l == r){
        ans += seg[cur]*seg[cur]*(l + 1)*dict[l];
        return;
    }
    push_down(cur);
    int mid = (l + r)/2;
    query(left0[cur], l, mid);
    query(right0[cur], mid + 1, r);
}

int main(){
    setIO();
    int n;
    cin >> n;
    for(int i = 1; i <= n; i++){
        int x;
        cin >> x;
        g[x].pb(i);
    }
    for(int i = 1; i <= n; i++){
        cin >> arr[i];
        if(!g[i].size()) dict.pb(arr[i]);
        else arr[i] = (ll)arr[i]*796898467%MOD;
    }
    sort(dict.begin(), dict.end());
    dfs(1);
    query(rt[1]);
    cout << ans << endl;
}
```