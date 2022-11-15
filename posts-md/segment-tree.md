title: Segment Tree (Tutorial)
date: 11-14-2022
tag: zjoi, loj, probabilities, segtree, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/3043)

## Solution

The operation \\(1\\) is equivalent to duplicating each segment tree and then doing the update on half of them. Obviously, we can not maintain every segtree, so instead it would make sense to maintain for each node, the number of times tha t node is a \\(1\\). Lets call this value \\(cur[x]\\). If an operation \\(1\\) creates \\(v\\) new segtrees, then lets see its effect on \\(cur[x]\\) for all relevant nodes. All nodes whose tags are directly set to \\(1\\) by the operation will be called key nodes. If \\(x\\) is a key node, then \\(cur[x] = cur[x] + v\\). If \\(x\\) is an ancesetor of a key node, \\(cur[x]\\) does not change. Finally, if \\(x\\) is affected by the pushdown and not a key node or ancestor of a key node, then \\(cur[x]\\) increases by the number of nodes \\(x\\) that have at least one active tag at itself or its ancestors. So lets actually store another value \\(par[x]\\) which will count the number of nodes \\(x\\) with at least one active tag at itself or its ancestors. Then for the last case, \\(cur[x] = cur[x] + par[x]\\). All other \\(cur[x]\\) are unaffected by the update, so they should be doubled. Now how do we maintain the \\(par[x]\\)? If \\(x\\) is a key node or in the subtree of the key node, \\(par[x]\\) is increased by \\(v\\), since its own tag is set to \\(1\\). If \\(x\\) is an ancestor of a key node, \\(par[x]\\) is unchanged, since all new \\(x\\) have their tags pushed down. Otherwise, \\(par[x]\\) is doubled, since the operation won't change the if there is an active tag as an ancestor or not. This can all be maintained with a segtree, but propagating all the values would be challenging, so instead of multiplying all unaffected nodes by \\(2\\), we can global multiply by \\(2\\) and then divide all affected nodes by \\(2\\). This lets the problem be much easier to maintain and propagate. 

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

mint sum = 0;
mint cur[400005], par[400005];
int tag[400005];

void push_down(int x){
    if(!tag[x]) return;
    tag[x*2 + 1] += tag[x];
    tag[x*2 + 2] += tag[x];
    par[x*2 + 1] = (par[x*2 + 1] + ((mint)2^tag[x]) - 1)/((mint)2^tag[x]);
    par[x*2 + 2] = (par[x*2 + 2] + ((mint)2^tag[x]) - 1)/((mint)2^tag[x]);
    tag[x] = 0;
}

void upd(int x, int l, int r, int ul, int ur){
    if(l <= ul && ur <= r){
        sum -= cur[x];
        cur[x] = (cur[x] + 1)/2;
        par[x] = (par[x] + 1)/2;
        sum += cur[x];
        tag[x]++;
        if(ul != ur) push_down(x);
        return;
    }
    if(r < ul || l > ur){
        sum -= cur[x];
        cur[x] = (cur[x] + par[x])/2;
        sum += cur[x];
        return;
    }
    push_down(x);
    int mid = (ul + ur)/2;
    sum -= cur[x];
    cur[x] /= 2;
    par[x] /= 2;
    sum += cur[x];
    upd(x*2 + 1, l, r, ul, mid);
    upd(x*2 + 2, l, r, mid + 1, ur);
}

int main(){
    setIO();
    int n, q;
    cin >> n >> q;
    mint tot = 1;
    while(q--){
        int t;
        cin >> t;
        if(t == 1){
            tot *= 2;
            int l, r;
            cin >> l >> r;
            upd(0, l, r, 1, n);
        } else {
            cout << tot*sum << endl;
        }
    }
}
```