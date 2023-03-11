title: Gasoline (Tutorial)
date: 3-9-2023
tag: cf, binary lifting, dsu, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1801/problem/E)

## Solution

The operation of enforcing two nodes to be the same value is similar to a dsu. If we can somehow brute force the operation by only merging two nodes when they are in seperate components, the solution will run in time. The only issue is skipping all the merges that are already in the same component. Doing operations on a path are hard, but we can actually reduce the operation to only be on chains by breaking up the two paths into chains based on distance to lca. Now we have two types of chains, some going upwards and some going downwards. We want to enforce chains of same length to be the same based on their directions. This can be done using a trick using binary lifting. If we enforce two chains of size \\(2^x\\) to be the same, we can propagate down and enforce the chains inside of size \\(2^{x - 1}\\) to be the same. If we quit the propagation if the two chains are in the same component, and mege the dsu and continue propagating otherwise, then only results in \\(N log N\\) merges. By having two seperate binary lifting components for downwards and upwards chains, we can solve the problem with just some casework on the paths. Note that some optimizations such as rank based dsu must be used to not tle.

## Code

Note: using vectors for \\(g\\) instead of arrays causes tle.

```c++
#pragma GCC optimize("Ofast")
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
    const static type mod = MOD;
};

using mint = Modular<Mod>;

int par[200005][18];
int depth[200005];
int dsu[10000005];
int rk[10000005];

int g[10000005][2];
pii range[200005];

int enc(int a, int b, int rev = 0){
    return a*18*2 + rev*18 + b;
}

int find(int x){
    if(dsu[x] == x) return x;
    return dsu[x] = find(dsu[x]);
}

mint ans = 1;

void merge(int a, int b){
    a = find(a), b = find(b);
    if(rk[a] < rk[b]) swap(a, b);
    dsu[b] = a;
    if(rk[a] == rk[b]) rk[a]++;
}

void prop(int a, int b){
    if(find(a) == find(b)) return;
    if(a%18 == 0){
        a = find(a), b = find(b);
        pii x = range[a/36], y = range[b/36];
        ans /= x.ss - x.ff + 1, ans /= y.ss - y.ff + 1;
        dsu[a] = b;
        if(max(x.ff, y.ff) > min(x.ss, y.ss)){
            ans = 0;
        } else {
            range[b/36] = {max(x.ff, y.ff), min(x.ss, y.ss)};
            ans *= range[b/36].ss - range[b/36].ff + 1;
        }
        return;
    }
    merge(a, b);
    for(int i = 0; i < 2; i++){
        prop(g[a][i], g[b][i]);
    }
}

int lca(int a, int b){
    if(depth[a] > depth[b]) swap(a, b);
    for(int i = 17; i >= 0; i--) if(depth[par[b][i]] >= depth[a]) b = par[b][i];
    if(a == b) return a;
    for(int i = 17; i >= 0; i--){
        if(par[b][i] != par[a][i]){
            a = par[a][i];
            b = par[b][i];
        }
    }
    return par[a][0];
}

vector<int> chain(int a, int b){
    if(a == b){
        return {enc(a, 0)};
    }
    vector<int> ret;
    if(depth[a] > depth[b]){
        int cur = a;
        int tar = depth[a] - depth[b] + 1;
        for(int k = 0; k <= 17; k++){
            if(!tar) break;
            if(tar & (1 << k)){
                ret.pb(enc(cur, k, 0));
                tar ^= (1 << k);
                cur = par[cur][k];
            }
        }
    } else {
        int cur = b;
        int tar = depth[b] - depth[a] + 1;
        for(int k = 17; k >= 0; k--){
            if(!tar) break;
            if(tar & (1 << k)){
                ret.pb(enc(cur, k, 1));
                tar ^= (1 << k);
                cur = par[cur][k];
            }
        }
        reverse(ret.begin(), ret.end());
    }
    return move(ret);
}

int up(int x, int k){
    for(int i = 0; i <= 17; i++){
        if(!k) break;
        if(k & (1 << i)){
            x = par[x][i];
            k ^= (1 << i);
        }
    }
    return x;
}

void link(int x1, int y1, int x2, int y2){
    int z1 = lca(x1, y1), z2 = lca(x2, y2);
    int st1 = x1, st2 = x2;
    vector<int> dist;
    dist.pb(depth[x1] - depth[z1]);
    int dist1 = depth[x1] + depth[y1] - 2*depth[z1];
    dist.pb(dist1);
    if(depth[x2] - depth[z2] != depth[x1] - depth[z1]) dist.pb(depth[x2] - depth[z2]);
    int dist2 = depth[x2] + depth[y2] - 2*depth[z2];
    sort(dist.begin(), dist.end());
    int d1 = 0, d2 = 0;
    int prv = 0;
    for(int i : dist){
        int add = i - prv;
        prv = i;
        int t1, t2;
        if(d1){
            t1 = up(y1, dist1 - prv);
        } else {
            t1 = up(st1, prv);
        }
        if(d2){
            t2 = up(y2, dist2 - prv);
        } else {
            t2 = up(st2, prv);
        }
        vector<int> a = chain(x1, t1);
        vector<int> b = chain(x2, t2);
        for(int i = 0; i < a.size(); i++){
            prop(a[i], b[i]);
        }
        x1 = t1;
        x2 = t2;
        if(x1 == z1) d1 = 1;
        if(x2 == z2) d2 = 1;
    }
}

vector<int> nxt[200005];

void dfs(int x){
    for(int i : nxt[x]){
        depth[i] = depth[x] + 1;
        dfs(i);
    }
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

int main(){
    setIO();
    int n;
    scan(n);
    depth[1] = 1;
    for(int i = 2; i <= n; i++) scan(par[i][0]), nxt[par[i][0]].pb(i);
    dfs(1);
    for(int i = 1; i <= n; i++){
        scan(range[i].ff);
        scan(range[i].ss);
        ans *= range[i].ss - range[i].ff + 1;
    }
    for(int i = 1; i <= n; i++){
        dsu[enc(i, 0)] = enc(i, 0);
        dsu[enc(i, 0, 1)] = enc(i, 0);
    }
    for(int i = 1; i <= 17; i++){
        for(int j = 0; j <= n; j++){
            dsu[enc(j, i)] = enc(j, i);
            dsu[enc(j, i, 1)] = enc(j, i, 1);

            g[enc(j, i)][0] = enc(j, i - 1);
            g[enc(j, i)][1] = enc(par[j][i - 1], i - 1);

            g[enc(j, i, 1)][0] = enc(par[j][i - 1], i - 1, 1);
            g[enc(j, i, 1)][1] = enc(j, i - 1, 1);

            par[j][i] = par[par[j][i - 1]][i - 1];
        }
    }
    int m;
    scan(m);
    for(int i = 1; i <= m; i++){
        int x1, y1, x2, y2;
        scan(x1), scan(y1), scan(x2), scan(y2);
        link(x1, y1, x2, y2);
        cout << ans << "\n";
    }
}
```