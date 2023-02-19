title: Carry Bit (Tutorial)
date: 2-5-2023
tag: cf, math, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1761/problem/D)

## Solution

You can create a \\(O(N \\cdot K)\\) dp solution for this problem, but due to the extra states denoting the carry, it seems hard to optimize. Instead, lets see if we can simplify the problem by fixing something. Note that carries happen in intervals. A carry interval starts with a \\((1, 1)\\) state, then continues as long as there is at least one \\(1\\) in the state. Thus, lets iterate over the number of carry intervals. Then we can distribute the number of carries over the carry intervals using stars and bars. Now, how can we count the number of ways to put down these intervals. We know the number of non carry intervals, so we just have to distribute those using stars and bars as well. There are four cases that we can do this, depending on whether we extend the right or left or not. Now, for the remaining carry interval values that aren't a starting position, they each have \\(3\\) possibilities. For the remaining non carry intervals that aren't a starting position, they also have \\(3\\) possibilities. Notice that in some of the cases, the first carry interval will contribute an extra \\(3\\) since it does not have to start with a \\((0, 0)\\) state.

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
    const static type mod = 1000000007;
};

using mint = Modular<Mod>;

mint fact[1000005];

mint choose(int a, int b){
    return fact[a]/(fact[b]*fact[a - b]);
}

int main(){
    setIO();
    int n, k;
    cin >> n >> k;
    if(k == 0){
        cout << ((mint)3^n) << endl;
        return 0;
    }
    mint ans = 0;
    fact[0] = 1;
    for(int i = 1; i <= n; i++) fact[i] = fact[i - 1]*i;
    for(int i = 1; i <= k; i++){
        int one = k - i;
        mint comb = choose(k - 1, i - 1);
        //c.c
        if(i - 1 <= n - k){
            int zero = n - k - i + 1;
            ans += comb*choose(n - k - 1, i - 2)*((mint)3^(one + zero));
        }
        //c.c.
        //.c.c
        if(i <= n - k){
            int zero = n - k - i;
            ans += comb*choose(n - k - 1, i - 1)*((mint)3^(one + zero));
            ans += comb*choose(n - k - 1, i - 1)*((mint)3^(one + zero + 1));
        }
        //.c.c.
        if(i + 1 <= n - k){
            int zero = n - k - i - 1;
            ans += comb*choose(n - k - 1, i)*((mint)3^(one + zero + 1));
        }
    }
    cout << ans << endl;
}
```