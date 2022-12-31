title: Tree (Tutorial)
date: 12-18-2022
tag: cf, math, dp, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/gym/412114/problem/B)

## Solution

In this problem, we are only given the degrees of the possible tree. This seems very similar to a problem that prufer sequences solves, where the number of trees with a given degree sequence of \\(deg_i\\) is \\(\\frac{(n - 2)!}{\\prod (deg_i - 1)!}\\). Now that we can count the number of trees, lets try to find how to calculate the total distance travelled on a given tree. We will always want to move to the centroid, since it splits the tree the most evenly. Obviously, we cannot construct a tree every time and check. It would instead be easier to count the contribution of every possible edge to the answer. Given an edge we know that its contribution will be the amount of people moving across the edge and towards the centroid. Due to the properties of centroids, this means that if an edge splits the tree into two subtrees of size \\(a\\) and \\(b\\), its contribution to the answer will be \\(min(a, b)\\). This actually makes it much easier to find the answer. Now, we just have to fix an edge and the size of its two subtrees. Now the only question is how to assign the degrees to each subtree. We can do this with a knapsack to decide which of the two subtrees we will assign each degree. Now, we can fix an edge, then run a knapsack for a \\(N^5\\) solution. Fixing the edge is the seemingly most inefficient part of the algorithm right now, so we should try to optimize. We can actually fix the edge on the fly while computing the knapsack by adding two \\(0/1\\) states to our dp, denoting whether we have chosen an endpoint of the edge in the first subtree and whether we have chosen an endpoint of the edge in the second subtree. Then our answer will just be when both of these states are \\(1\\). Note that our formula for counting trees from degrees is just wrong for a single node, so we should handle the edges being attached to the leaf node seperately.

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

int main(){
    setIO();
    int n;
    cin >> n;
    int deg[n + 1];
    int leaf = 0;
    mint tree = 1;
    for(int i = 1; i <= n; i++){
        cin >> deg[i];
        leaf += deg[i] == 1;
    }
    sort(deg + 1, deg + n + 1);
    mint fact[2*n], ifact[2*n];
    fact[0] = 1;
    for(int i = 1; i < 2*n; i++) fact[i] = fact[i - 1]*i;
    for(int i = 0; i < 2*n; i++) ifact[i] = 1/fact[i];
    for(int i = 1; i <= n; i++) tree *= fact[deg[i] - 1];
    tree = fact[n - 2]/tree;
    //index
    //deg
    //size
    //left
    //right
    mint dp[2][n + 1][2*n][2][2];
    dp[0][0][0][0][0] = 1;
    int sum = 0;
    for(int i = 1; i <= n; i++){
        sum += deg[i];
        for(int j = 0; j <= i; j++){
            for(int k = 0; k <= sum; k++){
                for(int a = 0; a <= 1; a++){
                    for(int b = 0; b <= 1; b++){
                        dp[1][j][k][a][b] += dp[0][j][k][a][b]*ifact[deg[i] - 1];
                        if(j && k >= deg[i]) dp[1][j][k][a][b] += dp[0][j - 1][k - deg[i]][a][b]*ifact[deg[i] - 1];
                    }
                    if(deg[i] > 1){
                        if(j && k >= deg[i] - 1) dp[1][j][k][1][a] += dp[0][j - 1][k - deg[i] + 1][0][a]*ifact[deg[i] - 2];
                        dp[1][j][k][a][1] += dp[0][j][k][a][0]*ifact[deg[i] - 2];
                    }
                }
            }
        }
        for(int j = 0; j <= i; j++){
            for(int k = 0; k <= sum; k++){
                for(int a = 0; a <= 1; a++){
                    for(int b = 0; b <= 1; b++){
                        dp[0][j][k][a][b] = dp[1][j][k][a][b];
                        dp[1][j][k][a][b] = 0;
                    }
                }
            }
        }
    }
    mint ans = 2*tree*leaf;
    for(int i = 2; i <= n - 2; i++) ans += min(i, n - i)*fact[i - 2]*fact[n - i - 2]*dp[0][i][2*i - 2][1][1];
    ans /= 2*tree;
    cout << ans << endl;
}
```