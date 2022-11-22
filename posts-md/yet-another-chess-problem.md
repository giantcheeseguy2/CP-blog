title: Yet Another Chess Problem (Tutorial)
date: 11-21-2022
tag: cf, gaussian elimination, math, probabilities, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/group/uodset6U2h/contest/411094/problem/C)

## Solution

The answer for every cell can be represented as a linear combination of other cells reachable by a move plus \\(1\\). However, there are cycles in the combination, so the answers cannot be computed by a conventional dp. Actually, for each cell, we can create a linear equation using its reachable variables, so lets try using gaussian elimination to solve for the answer. The smallest amount of variables we can create is using the first two rows and first column. This way, if we process cells from left to right then top to bottom, at cell \\((i, j)\\), we can use the cell at \\((i - 2, j - 1)\\) to compute the answer. We know the answer at \\((i - 2, j - 1)\\) in terms of our given variables and the answer at \\((i - 2, j - 1)\\) in terms of adjacent cells. The only unkown adjacent cell is \\((i, j)\\). Therefore, if we set them equal to each other, we can solve for \\((i, j)\\) in terms of our given variables. After applying this operation to every cell, we will have the last two columns and last row which have not been used in any equation yet. Therefore, we can use these as our system of equations by setting its answer in terms of our given variables to its answer in terms of adjacent cells. Solving the system can be done with gaussian elimination, and we can just plug in the variables to retrieve the answer.

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
    const static type mod = 998244353;
};

using mint = Modular<Mod>;
//using mint = double;

mint prob[8], iprob[8];
int moves[8][2] = {{-2, -1}, {-1, -2}, {1, -2}, {2, -1}, {2, 1}, {1, 2}, {-1, 2}, {-2, 1}};
int id[205][205], sz = 0;

vector<mint> add(const vector<mint> &a, const vector<mint> &b, mint mult = 1){
    vector<mint> ret(sz + 1);
    for(int i = 0; i <= sz; i++) ret[i] = a[i] + mult*b[i];
    return ret;
}

vector<vector<mint>> mat;

void rref(){
    int m = mat.size();
    for(int i = 0; i < m; i++){
        int ind = i;
        for(int j = i + 1; j < m; j++) if(mat[j][i] != 0) ind = j;
        if(i != ind) for(int j = 0; j <= m; j++) swap(mat[i][j], mat[ind][j]);
        mint inv = 1/mat[i][i];
        for(int j = i + 1; j < m; j++){
            mint x = mat[j][i]*inv;
            for(int k = i + 1; k <= m; k++) mat[j][k] -= mat[i][k]*x;
            mat[j][i] = 0;
        }
    }
}

mint ans[1000];

void solve(){
    int m = mat.size();
    for(int i = m - 1; i >= 0; i--){
        ans[i] = mat[i][m];
        for(int j = i + 1; j <= m; j++) ans[i] -= mat[i][j]*ans[j];
        ans[i] /= mat[i][i];
    }
}

int gauss(){
    rref();
    solve();
    int m = mat.size();
    for(int i = 0; i < m; i++) {
        mint cur = 0;
        for(int j = 0; j < m; j++) cur += ans[j]*mat[i][j];
        //if(cur != mat[i][m]) return 0;
    }
    return 1;
}

vector<mint> st[205][205];
int n, m;

vector<mint> adj(int x, int y){
    vector<mint> ret(sz + 1, 0);
    for(int i = 0; i < 8; i++){
        int nx = x + moves[i][0], ny = y + moves[i][1];
        if(nx >= n || ny >= m || nx < 0 || ny < 0) continue;
        ret = add(ret, st[nx][ny], prob[i]);
    }
    ret[sz]++;
    return ret;
}

int main(){
    setIO();
    cin >> n >> m;
    mint sum = 0;
    for(int i = 0; i < 8; i++) cin >> prob[i], sum += prob[i];
    for(int i = 0; i < 8; i++) prob[i] /= sum, iprob[i] = 1/prob[i];
    for(int i = 0; i < n; i++) for(int j = 0; j < m; j++) st[i][j].resize(n + m + m - 1, 0);
    for(int i = 0; i < 2; i++){
        for(int j = 0; j < m; j++){
            st[i][j][sz] = 1;
            id[i][j] = sz++;
        }
    }
    for(int i = 2; i < n; i++){
        st[i][0][sz] = 1;
        id[i][0] = sz++;
    }
    for(int i = 2; i < n; i++){
        for(int j = 1; j < m; j++){
            vector<mint> tot = adj(i - 2, j - 1);
            st[i][j] = st[i - 2][j - 1];
            st[i][j] = add(st[i][j], tot, -1);
            for(int k = 0; k <= sz; k++) st[i][j][k] *= iprob[4];
        }
    }
    for(int i = n - 2; i < n; i++){
        for(int j = 0; j < m; j++){
            vector<mint> v = adj(i, j);
            v = add(v, st[i][j], -1);
            v.back() *= -1;
            mat.pb(v);
        }
    }
    for(int i = 0; i < n - 2; i++){
        vector<mint> v = adj(i, m - 1);
        v = add(v, st[i][m - 1], -1);
        v.back() *= -1;
        mat.pb(v); 
    }
    assert(gauss());
    int q;
    cin >> q;
    while(q--){
        int x, y;
        cin >> x >> y;
        x--, y--;
        mint sum = st[x][y][sz];
        for(int i = 0; i < sz; i++) sum += st[x][y][i]*ans[i];
        cout << sum << endl;
    }
}
```