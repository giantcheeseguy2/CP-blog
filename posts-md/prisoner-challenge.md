title: Prisoner Challenge (Tutorial)
date: 8-16-2022
tag: ioi, dmoj, divide and conquer, tutorial

---

## Problem Statement

[Problem Link](https://dmoj.ca/problem/ioi22p2)

## Solution

This problem has a nice leadup to \\(80\\) points, but if you wan't the full score, throw all those hours of opitmizations out the window. Instead, lets do a sort of ternary divide and conquer to find the optimal solution. Every layer, lets have \\(3\\) values denoting which section the parent belonged to. For example, lets say prisoner \\(1\\) walks in to the room. He sees the value \\(0\\) on the board and chooses from bag A. Now, based on his choice, he will either write down a \\(1\\), \\(2\\), or \\(3\\). Prisoner \\(2\\) now walks into the room. Seeing the \\(1\\), \\(2\\), or \\(3\\) written on the board, he knows a possible range of bag A. Now he will right down a \\(4\\), \\(5\\), or \\(6\\) based on bag B's section in the possible range of bag A. Notice that we can terminate early the value is an endpoint or outside the range. One more optimization we need is to manually split into two sections instead of three when the interval is smaller than size \\(6\\).

## Code

```c++
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;

#define pb push_back
#define ff first
#define ss second

vector<vector<int>> ans;
int mx = 0;
int sz = 0;

//range of outer
//type of outer
//range of inner
//type of inner
//current index
void dnq(int l1, int r1, int t1, int l2, int r2, int t2, int cur, int par = -1){
    if(l2 > r2) return;
    mx = max(mx, cur);
    ans[cur][0] = (t1 == -1 ? 0 : 1);
    if(par != -1) for(int i = l2; i <= r2; i++) ans[par][i] = cur;
    for(int i = l1; i <= l2; i++) ans[cur][i] = t1;
    for(int i = r2; i <= r1; i++) ans[cur][i] = t2;
    if(r2 - l2 + 1 <= 2) return; 
    if(r2 - l2 + 1 <= 6){
        l2++, r2--;
        dnq(l2 - 1, r2 + 1, t2, l2, (l2 + r2)/2, t1, 19, cur);
        dnq(l2 - 1, r2 + 1, t2, (l2 + r2)/2 + 1, r2, t1, 20, cur);
        return;
    }
    l2++, r2--;
    int depth = (cur + 2)/3;
    int len = (r2 - l2 + 1)/3;
    int rem = (r2 - l2 + 1)%3;
    int a = len, b = len;
    if(rem) a++, rem--;
    if(rem) b++;
    dnq(l2 - 1, r2 + 1, t2, l2, l2 + a - 1, t1, depth*3 + 1, cur);
    dnq(l2 - 1, r2 + 1, t2, l2 + a, l2 + a + b - 1, t1, depth*3 + 2, cur);
    dnq(l2 - 1, r2 + 1, t2, l2 + a + b, r2, t1, depth*3 + 3, cur);
}

std::vector<std::vector<int>> devise_strategy(int n){
    ans.resize(21);
    for(int i = 0; i <= 20; i++) ans[i].resize(n + 1, 0);
    dnq(1, n, -1, 1, n, -2, 0);
    return ans;
}

int main(){
    int n;
    cin >> n;
    vector<vector<int>> ans = devise_strategy(n);
    for(auto i : ans){
        for(auto j : i) cout << j << " ";
        cout << endl;
    }
}
```