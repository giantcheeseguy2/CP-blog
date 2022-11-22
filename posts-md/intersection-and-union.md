title: Intersection And Union (Tutorial)
date: 11-21-2022
tag: cf, segtree, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/problemset/problem/1743/F)

## Solution

Notice that each bit can be counted seperately over all \\(3^{N - 1}\\) ways to choose. If we are considering a single bit, let \\(dp[i][0/1] = \\) the number of ways to get the bit to a \\(0\\) or a \\(1\\), after doing the first \\(i\\) operations. The contribution of that bit is then \\(dp[n][1]\\). These transitions can actually be described as a matrix multiplication, with two matrices based on whether \\(i\\) covers the bit or not. If \\(i\\) covers the bit then the matrix is \\(\\begin{bmatrix} 2 & 2 \\\ 1 & 1 \\end{bmatrix}\\). Otherwise, the matrix is \\(\\begin{bmatrix} 2 & 0 \\\ 1 & 3 \\end{bmatrix}\\). If \\(A_i\\) is the matrix of \\(i\\) at the given bit, then the final is \\(A_{n}A_{n - 1}\\dots A_{2}\\) multiplied by either \\(\\begin{bmatrix} 1 \\\ 0 \\end{bmatrix}\\) or \\(\\begin{bmatrix} 0 \\\ 1 \\end{bmatrix}\\), depending on whether the first range covers the bit or not. Then the answer is just the value in the top right corner. We can do a sweep over each bit, and toggle the ranges accordingly while maintaining a sum of all the contribution.

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

template<class T, int n>
struct Matrix { 

    array<array<T, n>, n> mat;

    Matrix(){
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                mat[i][j] = (i == j);
            }
        }
    }

    Matrix(T v){
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                mat[i][j] = v; 
            }
        } 
    }

    array<T, n> &operator[](int x){
        assert(x < n);
        assert(x >= 0);
        return mat[x];
    }

    const array<T, n> &operator[](int x) const {
        assert(x < n);
        assert(x >= 0);
        return mat[x];
    }

    Matrix operator*(const Matrix<T, n> &x){
        Matrix<T, n> ret(0);
        for(int i = 0; i < n; i++){
            for(int k = 0; k < n; k++){
                for(int j = 0; j < n; j++){
                    ret[i][j] += mat[i][k]*x[k][j];
                }
            }
        }
        return ret;
    }

    Matrix &operator*=(const Matrix<T, n> &x){
        (*this) = (*this) * x;
        return *this;
    }

    Matrix operator+(const Matrix<T, n> &x){
        Matrix<T, n> ret(0);
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                ret[i][j] = mat[i][j] + x[i][j];
            }
        }
        return ret;
    }

    Matrix &operator+=(const Matrix<T, n> &x){
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                mat[i][j] += x[i][j];
            }
        }
        return *this;
    }

    Matrix operator-(const Matrix<T, n> &x){
        Matrix<T, n> ret(0);
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                ret[i][j] = mat[i][j] - x[i][j];
            }
        }
        return ret;
    }

    Matrix &operator-=(const Matrix<T, n> &x){
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                mat[i][j] -= x[i][j];
            }
        }
        return *this;
    }

    template<class U>
    Matrix operator^(U x){
        Matrix<T, n> ret;
        Matrix<T, n> prod = *this;
        while(x){
            if(x%2 == 1) ret *= prod;
            prod *= prod;
            x /= 2;
        }
        return ret;
    }

    template<class U>
    Matrix &operator^=(U x){
        Matrix<T, n> ret;
        while(x){
            if(x%2 == 1) ret *= (*this);
            (*this) *= (*this);
            x /= 2;
        }
        mat = ret.mat;
        return *this;
    }

    friend bool operator==(const Matrix<T, n> &a, const Matrix<T, n> &b){
        if(a.n != b.n) return false;
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                if(a[i][j] != b[i][j]) return false;
            }
        }
        return true;
    }

    friend bool operator!=(const Matrix<T, n> &a, const Matrix<T, n> &b){
        return !(a == b);
    }

};

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
using mat = Matrix<mint, 2>;

struct Segtree {

    using T = mat;
    using L = mat;

    static T merge(T a, T b){
        return b*a;
    }

    static void apply(T &a, L v, int x){
        a = v;
    }

    int n;
    vector<T> seg;

    void build(const vector<T> &v, int l, int r, int cur){
        if(l == r){
            seg[cur] = v[l];
            return;
        }
        int mid = (l + r)/2;
        build(v, l, mid, cur*2 + 1);
        build(v, mid + 1, r, cur*2 + 2);
        seg[cur] = merge(seg[cur*2 + 1], seg[cur*2 + 2]);
    }

    void update(int x, L v, int l, int r, int cur){
        if(l == x && x == r){
            apply(seg[cur], v, x);
            return;
        }
        int mid = (l + r)/2;
        if(x <= mid) update(x, v, l, mid, cur*2 + 1);
        else update(x, v, mid + 1, r, cur*2 + 2);
        seg[cur] = merge(seg[cur*2 + 1], seg[cur*2 + 2]);
    }

    T query(int l, int r, int ul, int ur, int cur){
        if(l <= ul && ur <= r) return seg[cur];
        int mid = (ul + ur)/2;
        if(r <= mid) return query(l, r, ul, mid, cur*2 + 1);
        if(l > mid) return query(l, r, mid + 1, ur, cur*2 + 2);
        return merge(query(l, r, ul, mid, cur*2 + 1), query(l, r, mid + 1, ur, cur*2 + 2));
    }

    Segtree(){

    }

    Segtree(const vector<T> &v){
        n = v.size();
        int sz = 1;
        while(sz < n) sz *= 2;
        seg.resize(2*sz);
        build(v, 0, n - 1, 0);
    } 

    Segtree(int _n, T v){
        n = _n;
        int sz = 1;
        while(sz < n) sz *= 2;
        seg.resize(2*sz);
        vector<T> tmp(n, v);
        build(tmp, 0, n - 1, 0);
    }

    T query(int l, int r){
        return query(l, r, 0, n - 1, 0);
    }

    void update(int x, L v){
        update(x, v, 0, n - 1, 0);
    }

};

const int MX = 300000;

int main(){
    setIO();
    mat one, zero;
    one[0][0] = 2, one[0][1] = 2;
    one[1][0] = 1, one[1][1] = 1;
    zero[0][0] = 2, zero[0][1] = 0;
    zero[1][0] = 1, zero[1][1] = 3;
    int n;
    cin >> n;
    Segtree seg(n - 1, zero);
    vector<int> in[MX + 1], out[MX + 1];
    int l, r;
    for(int i = 0; i < n; i++){
        int a, b;
        cin >> a >> b;
        if(i == 0) l = a, r = b;
        if(i){
            in[a].pb(i - 1);
            out[b].pb(i - 1);
        }
    }
    mat x = seg.query(0, n - 2);
    mint ans = 0;
    for(int i = 0; i <= MX; i++){
        for(int j : in[i]) seg.update(j, one);        
        mat add = seg.query(0, n - 1);
        if(l <= i && i <= r) ans += add[0][0];
        else ans += add[0][1];
        for(int j : out[i]) seg.update(j, zero);
    }
    cout << ans << endl;
}
```