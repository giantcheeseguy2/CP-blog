title: Chain Chips (Tutorial)
date: 4-11-2023
tag: cf, dp, segtree, tutorial

---

## Problem Statement

[Problem Link](https://codeforces.com/contest/1814/problem/E)

## Solution

First, lets solve without any updates. Our problem is equivalent to making a functional graph such that it is completely composed of cycles. For any cycle, the cost will be the sum of the subarray from the min index node to the max index node multiplied by 2, since everything should be cyclically moving to the right. Thus, it is always optimal for a cycle to be a continous subarray as to not use any extra values. Now, notice that every continous subarray larger than three can be decomposed into subarrays of sizes two or three, so it is always optimal to only use those sizes. Thus, we can use a dp to solve it, where \\(dp[i] = \\) answer to completely fill the prefix up to \\(i\\). Now, we can accelerate this with a matrix on segtree by maintaining the previous 3 dp values. Note that we have to use matrix multiplication with max and + instead of + and * as our operations.

## Code

```c++
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx,avx2,fma")
#pragma GCC target("sse4,popcnt,abm,mmx,tune=native")
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
                mat[i][j] = LLINF;
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
        Matrix<T, n> ret;
        for(int i = 0; i < n; i++){
            for(int k = 0; k < n; k++){
                for(int j = 0; j < n; j++){
                    ret[i][j] = min(ret[i][j], mat[i][k] + x[k][j]);
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

using mat = Matrix<ll, 3>;

mat seg[800005];
int n;
ll arr[200005];

void build(int l = 2, int r = n, int cur = 0){
    if(l == r){
        seg[cur][0][1] = 2*arr[l - 1];
        seg[cur][0][2] = 2*(arr[l - 2] + arr[l - 1]);
        seg[cur][1][0] = 0;
        seg[cur][2][1] = 0;
        return;
    }
    int mid = (l + r)/2;
    build(l, mid, cur*2 + 1);
    build(mid + 1, r, cur*2 + 2);
    seg[cur] = seg[cur*2 + 2]*seg[cur*2 + 1];
}

void update(int x, int l = 2, int r = n, int cur = 0){
    if(l == r){
        seg[cur][0][1] = 2*arr[l - 1];
        seg[cur][0][2] = 2*(arr[l - 2] + arr[l - 1]);
        seg[cur][1][0] = 0;
        seg[cur][2][1] = 0;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, l, mid, cur*2 + 1);
    else update(x, mid + 1, r, cur*2 + 2);
    seg[cur] = seg[cur*2 + 2]*seg[cur*2 + 1];
}

int main(){
    setIO();
    cin >> n;
    for(int i = 1; i < n; i++) cin >> arr[i];
    arr[0] = LLINF;
    build(); 
    int q;
    cin >> q;
    while(q--){
        int a, b;
        cin >> a >> b;
        arr[a] = b;
        update(a + 1);
        update(a + 2);
        cout << seg[0][0][1] << endl;
    }
}
```