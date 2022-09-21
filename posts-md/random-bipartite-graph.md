title: Random Bipartite Graph (Tutorial)
date: 9-19-2022
tag: loj, bitmask, dp, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/2290)

## Solution

Lets consider a solution to the problem when there are only type \\(1\\) edges. Let \\(dp[i][j] = \\) the answer when the mask of \\(i\\) is visited and the mask of \\(j\\) is filled. If we do a bottom up, then this is clearly too slow. However, each transition will fill at least two nodes of \\(i\\) and \\(j\\), which means the total complexity is \\(2 \cdot n \choose n\\), which is fine. For the other two groups of edges, lets try to convert it to the first type. Lets add both edges as the first type, and also a third edge that represents the probability of both edges appearing. For the case where they are exclusive, its not possible, so you must subtract that probability instead, giving it a probabiltiy of \\(-1/4\\) to appear. The same goes for the second type, which has a \\(1/4\\) chance to appear.

## Code

```c++
//https://loj.ac/p/2290
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
    ios_base::sync_with_stdio(0);
    cin.tie(0);
}

template<class mod>
struct Modular {

    using T = typename mod::type;
    using C = typename mod::cast;

    template<class U>
    static T fpow(T a, U b) {
        T ret = 1;

        while (b) {
            if (b % 2 == 1)
                ret = (C)ret * a % mod::mod;

            a = (C)a * a % mod::mod;
            b /= 2;
        }

        return ret;
    }

    T val;

    Modular() {
        val = 0;
    }

    template<class U> Modular(const U &x) {
        val = x % mod::mod;

        if (val < 0)
            val += mod::mod;
    }

    const T Mod() const {
        return mod::mod;
    }

    const T &operator()() const {
        return val;
    }

    template<class U>
    explicit operator U() const {
        return static_cast<U>(val);
    }

    Modular operator-() {
        return Modular<mod>(-val);
    }

    Modular &operator+=(const Modular &x) {
        val = (val + x.val) % mod::mod;
        return *this;
    }

    Modular &operator-=(const Modular &x) {
        val = (val - x.val + mod::mod) % mod::mod;
        return *this;
    }

    Modular &operator*=(const Modular &x) {
        val = (C)val * x.val % mod::mod;
        return *this;
    }

    Modular &operator/=(const Modular &x) {
        val = (C)val * fpow(x.val, mod::mod - 2) % mod::mod;
        return *this;
    }

    Modular &operator%=(const Modular &x) {
        return *this;
    }

    template<class U>
    Modular &operator^=(const U &x) {
        assert(("be careful when raising to a modded power", typeid(x) != typeid(*this)));
        val = fpow(val, x);
        return *this;
    }

    Modular &operator++() {
        return *this += 1;
    }

    Modular &operator--() {
        return *this -= 1;
    }

    Modular operator++(int) {
        Modular ret = *this;
        ++*this;
        return ret;
    }

    Modular operator--(int) {
        Modular ret = *this;
        --*this;
        return ret;
    }

    friend Modular operator+(const Modular &a, const Modular &b) {
        return Modular(a.val) += b;
    }

    friend Modular operator-(const Modular &a, const Modular &b) {
        return Modular(a.val) -= b;
    }

    friend Modular operator*(const Modular &a, const Modular &b) {
        return Modular(a.val) *= b;
    }

    friend Modular operator/(const Modular &a, const Modular &b) {
        return Modular(a.val) /= b;
    }

    friend Modular operator%(const Modular &a, const Modular &b) {
        return Modular(a.val) %= b;
    }

    template<class U>
    friend Modular operator^(const Modular &a, const U &b) {
        return Modular(a.val) ^= b;
    }

    bool hasSqrt() {
        return val == 0 || fpow(val, (mod::mod - 1) / 2) == 1;
    }

    Modular sqrt() {
        if (val == 0)
            return 0;

        if (val == 1)
            return 1;

        assert(hasSqrt());
        Modular r = 1, c = 1, a = 1, b = 1, aa, bb;

        while (((r * r - val) ^ ((mod::mod - 1) / 2)) == 1)
            r++;

        Modular mult = r * r - val;
        T x = (mod::mod + 1) / 2;

        while (x) {
            if (x % 2 == 1) {
                aa = c * b * mult + a * r;
                bb = c * a + r * b;
                a = aa, b = bb;
            }

            aa = c * c * mult + r * r;
            bb = 2 * c * r;
            r = aa, c = bb;
            x /= 2;
        }

        if (a >= (mod::mod + 1) / 2)
            a *= -1;

        return a;
    }

    friend bool operator<(const Modular &a, const Modular &b) {
        return a.val < b.val;
    }

    friend bool operator<=(const Modular &a, const Modular &b) {
        return a.val <= b.val;
    }

    friend bool operator>(const Modular &a, const Modular &b) {
        return a.val > b.val;
    }

    friend bool operator>=(const Modular &a, const Modular &b) {
        return a.val >= b.val;
    }

    friend bool operator==(const Modular &a, const Modular &b) {
        return a.val == b.val;
    }

    friend bool operator!=(const Modular &a, const Modular &b) {
        return a.val != b.val;
    }

    friend ostream &operator<<(ostream &out, Modular x) {
        return out << x.val;
    }

    friend istream &operator>>(istream &in, Modular &x) {
        in >> x.val;
        x.val = x.val % mod::mod;

        if (x.val < 0)
            x.val += mod::mod;

        return in;
    }

    string to_string(const Modular &x) {
        return to_string(x.val);
    }
};

struct Mod {
    using type = int;
    using cast = long long;
    const static type mod = MOD;
};

using mint = Modular<Mod>;

vector<pair<int, mint>> g[30];

mint d2 = (mint)1 / 2;
mint d4 = (mint)1 / 4;

void add(int a, int b) {
    g[a].pb({(1 << a) | (1 << b), d2});
}

map<int, mint> dp;
int n, m;

mint dfs(int x) {
    if (x == (1 << (2 * n)) - 1)
        return 1;

    if (dp.find(x) != dp.end())
        return dp[x];

    mint sum = 0;

    for (int i = 0; i < 2 * n; i++) {
        if (!(x & (1 << i))) {
            for (auto i : g[i])
                if (!(x & i.ff))
                    sum += dfs(x | i.ff) * i.ss;

            break;
        }
    }

    return dp[x] = sum;
}

int main() {
    setIO();
    cin >> n >> m;

    for (int i = 0; i < m; i++) {
        int t;
        cin >> t;

        if (t == 0) {
            int a, b;
            cin >> a >> b;
            a--, b += n - 1;
            add(a, b);
        } else {
            int a, b, c, d;
            cin >> a >> b >> c >> d;
            a--, b += n - 1, c--, d += n - 1;
            add(a, b), add(c, d);

            if (a != c && b != d)
                g[min(a, c)].pb({(1 << a) | (1 << b) | (1 << c) | (1 << d), (t == 1 ? d4 : -d4)});
        }
    }

    cout << dfs(0)*(1 << n) << endl;
}
```