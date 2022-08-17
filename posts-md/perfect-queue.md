title: Perfect Queue (Tutorial)
date: 8-16-2022
tag: loj, persistent segtree, sqrt decomposition, two pointer, tutorial

---

## Problem Statement

[Problem Link](https://loj.ac/p/2461)

## Solution

Lets assume that all queries have distinct colors. Now, for every query we want to find the next time that the queried color will leave the queue. In other words, we want to find the maximum time that any of the queues in the range recieve enough updates to cycle. We can easily maintain this for a singular queue. Build a pst on time for every index and process intervals in the form of a prefix add and subtract. For a range query, we can split the queues into \\(\\sqrt{N}\\) buckets. For each bucket, maintain a pointer representing the next time that bucket will be completely cycled. Now that we have the next time that any query will contribute to the answer, we just have to compute the intervals each color covers seperately. Final complexity is \\(O((N + Q) \\sqrt{N} log N)\\).

## Code

```c++
//https://loj.ac/p/2461
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

//const int MX = 2;
const int MX = 20;
//const int MX = INF;
const int N = 100005;

int n, m;

int sz = 1;
int seg[20000000], left0[20000000], right0[20000000];

int copy(int x){
    seg[sz] = seg[x];
    left0[sz] = left0[x];
    right0[sz] = right0[x];
    return sz++;
}

void update(int x, int v, int cur, int l = 0, int r = m){
    if(l == r){
        seg[cur] += v;
        return;
    }
    int mid = (l + r)/2;
    if(x <= mid) update(x, v, left0[cur] = copy(left0[cur]), l, mid);
    else update(x, v, right0[cur] = copy(right0[cur]), mid + 1, r);
    seg[cur] = seg[left0[cur]] + seg[right0[cur]];
}

int query(int l, int r, int cur, int ul = 0, int ur = m){
    if(l <= ul && ur <= r) return seg[cur];
    if(ur < l || ul > r) return 0;
    int mid = (ul + ur)/2;
    return query(l, r, left0[cur], ul, mid) + query(l, r, right0[cur], mid + 1, ur);
}

int walk(int v, int cur, int l = 0, int r = m){
    if(l == r) return l;
    int mid = (l + r)/2;
    if(seg[left0[cur]] >= v) return walk(v, left0[cur], l, mid);
    else return walk(v - seg[left0[cur]], right0[cur], mid + 1, r);
}

int cnt[N];
vector<pii> que[N];
int ptr[N/MX + 1];
multiset<int> s[N/MX + 1];
int tag[N/MX + 1];
int tmp[N];

void dec(int x, int y, int v = -1){
    s[x].erase(s[x].find(tmp[y]));
    tmp[y] += v;
    s[x].insert(tmp[y]);
}

int main(){
    setIO();
    cin >> n >> m;
    int arr[n];
    for(int i = 0; i < n; i++) cin >> arr[i], tmp[i] = arr[i];
    for(int i = 0; i < n; i++){
        s[i/MX].insert(arr[i]);
    }
    pii upd[m];
    int col[m];
    for(int i = 0; i < m; i++){
        cin >> upd[i].ff >> upd[i].ss >> col[i];
        upd[i].ff--, upd[i].ss--;
        que[upd[i].ff].pb({i, 1});
        que[upd[i].ss + 1].pb({i, -1});
    }
    int rt[n];
    rt[0] = sz++;
    update(m, INF, rt[0]);
    for(int i = 0; i < n; i++){
        if(i) rt[i] = copy(rt[i - 1]);
        for(pii k : que[i]){
            update(k.ff, k.ss, rt[i]);
        }
    }
    int nxt[m];
    vector<pii> ans[m + 1];
    for(int i = 0; i <= (n - 1)/MX; i++){
        while(ptr[i] < m && *s[i].rbegin() + tag[i] >= 0){
            int l = upd[ptr[i]].ff, r = upd[ptr[i]].ss;
            if(l <= i*MX && (i + 1)*MX - 1 <= r) tag[i]--;
            else if(i*MX <= l && r < (i + 1)*MX) for(int j = l; j <= r; j++) dec(i, j);
            else {
                if(r >= (i + 1)*MX - 1) for(int j = l; j < (i + 1)*MX; j++) dec(i, j);
                if(l <= i*MX) for(int j = i*MX; j <= r; j++) dec(i, j);
            }
            ptr[i]++;
        }
        if(*s[i].rbegin() + tag[i] < 0){
            ptr[i]--;
            int l = upd[ptr[i]].ff, r = upd[ptr[i]].ss;
            if(l <= i*MX && (i + 1)*MX - 1 <= r) tag[i]++;
            else if(i*MX <= l && r < (i + 1)*MX) for(int j = l; j <= r; j++) dec(i, j, 1);
            else {
                if(r >= (i + 1)*MX - 1) for(int j = l; j < (i + 1)*MX; j++) dec(i, j, 1);
                if(l <= i*MX) for(int j = i*MX; j <= r; j++) dec(i, j, 1);
            }
        }
        //cout << i << " " << *s[i].rbegin() << " " << tag[i] << " " << ptr[i] << endl;
    }
    for(int i = 0; i < m; i++){
        nxt[i] = 0;
        int a = upd[i].ff/MX + 1, b = upd[i].ss/MX - 1;
        //cout << ptr[1] << " ";
        for(int j = a; j <= b; j++){
            nxt[i] = max(nxt[i], ptr[j]);
            tag[j]++;
            while(ptr[j] < m && *s[j].rbegin() + tag[j] >= 0){
                int l = upd[ptr[j]].ff, r = upd[ptr[j]].ss;
                if(l <= j*MX && (j + 1)*MX - 1 <= r) tag[j]--;
                else if(j*MX <= l && r < (j + 1)*MX) for(int k = l; k <= r; k++) dec(j, k);
                else {
                    if(r >= (j + 1)*MX - 1) for(int k = l; k < (j + 1)*MX; k++) dec(j, k);
                    if(l <= j*MX) for(int k = j*MX; k <= r; k++) dec(j, k);
                }
                ptr[j]++;
            }
            if(*s[j].rbegin() + tag[j] < 0){
                ptr[j]--;
                int l = upd[ptr[j]].ff, r = upd[ptr[j]].ss;
                if(l <= j*MX && (j + 1)*MX - 1 <= r) tag[j]++;
                else if(j*MX <= l && r < (j + 1)*MX) for(int k = l; k <= r; k++) dec(j, k, 1);
                else {
                    if(r >= (j + 1)*MX - 1) for(int k = l; k < (j + 1)*MX; k++) dec(j, k, 1);
                    if(l <= j*MX) for(int k = j*MX; k <= r; k++) dec(j, k, 1);
                }
            }
        }
        //cout << nxt[i] << " ";
        if(a - 1 != b + 1){
            for(int j = upd[i].ff; j < a*MX; j++){
                nxt[i] = max(nxt[i], walk(arr[j] + query(0, i, rt[j]), rt[j]));
                dec(a - 1, j, 1); 
            }
            while(ptr[a - 1] < m && *s[a - 1].rbegin() + tag[a - 1] >= 0){
                int l = upd[ptr[a - 1]].ff, r = upd[ptr[a - 1]].ss;
                if(l <= (a - 1)*MX && (a - 1 + 1)*MX - 1 <= r) tag[a - 1]--;
                else if((a - 1)*MX <= l && r < ((a - 1) + 1)*MX) for(int k = l; k <= r; k++) dec(a - 1, k);
                else {
                    if(r >= (a - 1 + 1)*MX - 1) for(int k = l; k < ((a - 1) + 1)*MX; k++) dec(a - 1, k);
                    if(l <= (a - 1)*MX) for(int k = (a - 1)*MX; k <= r; k++) dec(a - 1, k);
                }
                ptr[a - 1]++;
            }
            if(*s[a - 1].rbegin() + tag[a - 1] < 0){
                ptr[a - 1]--;
                int l = upd[ptr[a - 1]].ff, r = upd[ptr[a - 1]].ss;
                if(l <= (a - 1)*MX && (a - 1 + 1)*MX - 1 <= r) tag[a - 1]++;
                else if((a - 1)*MX <= l && r < ((a - 1) + 1)*MX) for(int k = l; k <= r; k++) dec(a - 1, k ,1);
                else {
                    if(r >= (a - 1 + 1)*MX - 1) for(int k = l; k < ((a - 1) + 1)*MX; k++) dec(a - 1, k, 1);
                    if(l <= (a - 1)*MX) for(int k = (a - 1)*MX; k <= r; k++) dec(a - 1, k, 1);
                }
            }
            for(int j = (b + 1)*MX; j <= upd[i].ss; j++){
                nxt[i] = max(nxt[i], walk(arr[j] + query(0, i, rt[j]), rt[j]));
                dec(b + 1, j, 1); 
            }
            while(ptr[b + 1] < m && *s[b + 1].rbegin() + tag[b + 1] >= 0){
                int l = upd[ptr[b + 1]].ff, r = upd[ptr[b + 1]].ss;
                if(l <= (b + 1)*MX && (b + 1 + 1)*MX - 1 <= r) tag[b + 1]--;
                else if((b + 1)*MX <= l && r < ((b + 1) + 1)*MX) for(int k = l; k <= r; k++) dec((b + 1), k);
                else {
                    if(r >= (b + 1 + 1)*MX - 1) for(int k = l; k < (b + 1 + 1)*MX; k++) dec((b + 1), k);
                    if(l <= (b + 1)*MX) for(int k = (b + 1)*MX; k <= r; k++) dec((b + 1), k);
                }
                ptr[b + 1]++;
            }
            if(*s[b + 1].rbegin() + tag[b + 1] < 0){
                ptr[b + 1]--;
                int l = upd[ptr[b + 1]].ff, r = upd[ptr[b + 1]].ss;
                if(l <= (b + 1)*MX && (b + 1 + 1)*MX - 1 <= r) tag[b + 1]++;
                else if((b + 1)*MX <= l && r < ((b + 1) + 1)*MX) for(int k = l; k <= r; k++) dec((b + 1), k, 1);
                else {
                    if(r >= (b + 1 + 1)*MX - 1) for(int k = l; k < (b + 1 + 1)*MX; k++) dec((b + 1), k, 1);
                    if(l <= (b + 1)*MX) for(int k = (b + 1)*MX; k <= r; k++) dec((b + 1), k, 1);
                }
            }
        } else {
            for(int j = upd[i].ff; j <= upd[i].ss; j++){
                nxt[i] = max(nxt[i], walk(arr[j] + query(0, i, rt[j]), rt[j]));
                dec(b + 1, j, 1);
            }
            while(ptr[b + 1] < m && *s[b + 1].rbegin() + tag[b + 1] >= 0){
                int l = upd[ptr[b + 1]].ff, r = upd[ptr[b + 1]].ss;
                if(l <= (b + 1)*MX && (b + 1 + 1)*MX - 1 <= r) tag[b + 1]--;
                else if((b + 1)*MX <= l && r < ((b + 1) + 1)*MX) for(int k = l; k <= r; k++) dec((b + 1), k);
                else {
                    if(r >= (b + 1 + 1)*MX - 1) for(int k = l; k < (b + 1 + 1)*MX; k++) dec((b + 1), k);
                    if(l <= (b + 1)*MX) for(int k = (b + 1)*MX; k <= r; k++) dec((b + 1), k);
                }
                ptr[b + 1]++;
            }
            if(*s[b + 1].rbegin() + tag[b + 1] < 0){
                ptr[b + 1]--;
                int l = upd[ptr[b + 1]].ff, r = upd[ptr[b + 1]].ss;
                if(l <= (b + 1)*MX && (b + 1 + 1)*MX - 1 <= r) tag[b + 1]++;
                else if((b + 1)*MX <= l && r < ((b + 1) + 1)*MX) for(int k = l; k <= r; k++) dec((b + 1), k, 1);
                else {
                    if(r >= (b + 1 + 1)*MX - 1) for(int k = l; k < (b + 1 + 1)*MX; k++) dec((b + 1), k, 1);
                    if(l <= (b + 1)*MX) for(int k = (b + 1)*MX; k <= r; k++) dec((b + 1), k, 1);
                }
            }
        }
        ans[i].pb({col[i], 1});
        ans[nxt[i]].pb({col[i], -1});
        //cout << i << " " << nxt[i] << endl;
    }
    int sum = 0;
    for(int i = 0; i < m; i++){
        for(pii j : ans[i]){
            int prv = (cnt[j.ff] ? 1 : 0);
            cnt[j.ff] += j.ss;
            sum += (cnt[j.ff] ? 1 : 0) - prv;
        }
        cout << sum << "\n";
    }
}
```