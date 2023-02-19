title: Giant Graph (Tutorial)
date: 1-29-2023
tag: atcoder, tree, sprague grundy, game, greedy, tutorial

---

## Problem Statement

[Problem Link](https://atcoder.jp/contests/agc043/tasks/agc043_c)

## Solution

The first thing to note is the difference in weights for choosing a node in the graph. This condition basically forces you to take the nodes in decreasing order of index sum, and add choose it if possible. Note that this works since every edges forces a decrease in index. Thus, it is guranteed, that nodes with the same weight will never be connected to each other, and allow us to ignore breaking ties. Lets call \\(tag[i][j][k] = \\) whether the \\((i, j, k)\\) node is chosen or not. If all of the transitions to higher indeces have a false \\(tag\\), then it is true. Otherwise, it is false. However, optimizing this faster than \\(N^3\\) seems hard, since all the states store important information. Instead, lets try to rephrase the problem. Our \\(tag\\) transitions actually seem similar to a game theory transition, since a true state results from false neighboring states. Thus, we can formulate a game to simulate this problem. Lets say we currently have a piece on \\((i, j, k)\\), and the moves are moving that piece to a higher weighted node through an edge. f we call \\(tag'[i][j][k] = \\) whether the player who just moved a piece to \\((i, j, k)\\) wins or not, we see that the transitions are actually identical to \\(tag\\). This game also happens to satisfy the sprague grundy conditions, where the game is impartial (moves only depend on position, the game is deterministic, and victory is only determined by who goes first). To optimize this, notice that moves in different graphs in this game are actually indepedent. This means that we have overcame the bound of being forced to visit every state, since independent games can be merged with sprague grundy. Thus, calculating whether a node is chosen or not can be done in \\(O(1)\\) time with \\(O(N)\\) precomputation. Let \\(sg[i][j] = \\) the grundy number at node \\(i\\) on the \\(j\\)th graph. Then, we will be able to take node \\((i, j, k)\\) if \\(sg[i][0] \\oplus sg[j][1] \\oplus sg[k][2] = 0\\). N\\(10^{18(i + j + k)}\\) is the same as \\(10^{18i} \\cdot 10^{18j} \\cdot 10^{18k}\\). Thus, if multiple \\(k\\) correspond to the same \\(i\\) and \\(j\\), then we can just do \\(10^{18i} \\cdot 10^{18j} \\ cdot \\sum 10^{18k}\\).
Now, we have an \\(O(M^2)\\) algorithm from iterating over \\(i\\) and \\(j\\), since \\(k\\) is fixed. We can optimize further by iterating over the grundy numbers instead of index. If we know which \\(i\\), \\(j\\), and \\(k\\) correspond to which grundy number, then our answer is \\(\\sum 10^{18i} \\cdot \\sum 10^{18j} \\cdot \\sum 10^{19k}\\), and since grundy numbers are bounded by the square root of number of transitions, we only have \\(\\sqrt{M}\\) grundy numbers to check, resulting in \\(O(M)\\) time to iterate.

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

const int MX = 1000;

mint cnt[MX][3];

int main(){
    setIO();
    int n;
    cin >> n;
    for(int t = 0; t < 3; t++){
        int m;
        cin >> m;
        vector<int> g[n + 1];
        for(int i = 0; i < m; i++){
            int a, b;
            cin >> a >> b;
            if(a > b) swap(a, b);
            g[a].pb(b);
        }
        int sg[n + 1];
        memset(sg, 0, sizeof(sg));
        bool vis[n + 1];
        memset(vis, false, sizeof(vis));
        for(int i = n; i >= 1; i--){
            vector<int> v;
            for(int j : g[i]){
                vis[sg[j]] = true;
                v.pb(sg[j]);
            }
            while(vis[sg[i]]) sg[i]++;
            cnt[sg[i]][t] += (mint)10^(18*i);
            for(int j : v) vis[j] = false;
        }
    }
    mint ans = 0;
    for(int i = 0; i < MX; i++){
        for(int j = 0; j < MX; j++){
            ans += cnt[i][0]*cnt[j][1]*cnt[i ^ j][2];
        }
    }
    cout << ans << endl;
}
```