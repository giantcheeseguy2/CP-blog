title: CDQ Blog (Template)
date: 10-31-2022
tag: usaco, divide and conquer, template

---

## Goal

We want to compute the contribution of some elements to some other elements satisfying some conditions without. An example of this would be 2d point add prefix sum. In this case, we would be counting the contribution of each point update per query, with the condition being that it must lie within the rectangle. In other words, in each query \\(x, y\\) we want to find the contribution (sum) of all the points with \\(x_i \\le x\\) and \\(y_i \\le y\\).

## Solution

For the case of 2d point add rectangle sum, lets write out all the conditions strictly first. For an update \\(i\\) and a query, \\(i\\) will contribute to the query if \\(x_i \\le x\\), \\(y_i \\le y\\), and \\(t_i \\le t\\), where \\(t\\) is the time of the update/query. If we process the queries in order of \\(t\\), then we only have to count the \\(x\\) and \\(y\\) restrictions, which can be done using a sparse 2d segtree. However, this takes \\(N log N\\) memory and is quite slow. Instead, lets do a divide and conquer on \\(t\\). When we are on segment \\([l, r]\\), lets assume that all the contribution of points in this segment to other points in this segment are counted. Now, when we are merging two segments \\([l_1, r_1]\\) and \\([l_2, r_2]\\), we just have to count the contribution of all points in \\([l_1, r_1]\\) to all points in \\([l_2, r_2]\\). We can sort the interval \\([l_1, r_2]\\) by \\(x\\), then use a 1d data structure to maintain the sum for a range of \\(y\\). For the base case of segment length \\(1\\) it is easy to see that it already counts all the contribution to itself. Then, the overall complexity is stil \\(N log^2 N\\) since processing a layer of length \\(L\\) takes \\(L log L\\), but takes linear memory. 

## Code

```c++

typedef long long ll;
typedef pair<int, int> pii;

struct query {
    bool upd;
    int v, x, y, ind; //v - value, x - x coord, y - y coord, ind - index of query
};

int bit[MAXN];

void update(int x, int v){
    for(; x <= n; x += x & (-x)) bit[x] += v;
}

int query(int x, int ret = 0){
    for(; x; x -= x & (-x)) ret += bit[x];
    return ret;
}

ll ans[MAXQ];

vector<query> que;

void dnq(int l = 0, int r = que.size() - 1){
    if(l == r) return;
    int mid = (l + r)/2;
    dnq(l, mid);
    dnq(mid + 1, r);
    int a = l, b = mid + 1;
    vector<pii> v1; //list of operations to undo
    vector<query> v2; //sorted queries
    int sum = 0;
    //sort using 2 pointer, and also process contributions
    while(a <= mid && b <= r){
        if(que[a].x <= que[b].x){
            //if its an update, add to contribution
            if(que[a].upd){
                update(que[a].y, que[a].v);
                v1.pb({que[a].y, -que[a].v});
            }
            v2.pb(que[a++]);
        } else {
            //if its a query, count the contribution
            if(!que[b].upd) ans[que[b].ind] += query(que[b].y);
            v2.pb(que[b++]);
        }
    }
    //finish processing contributions
    while(a <= mid) v2.pb(que[a++]);
    while(b <= r){
        if(!que[b].upd) ans[que[b].ind] query(que[b].ss.ss);
        v2.pb(que[b++]);
    }
    for(pii i : v1) update(i.ff, i.ss);
    v1.clear();
    for(int i = l; i <= r; i++) que[i] = v2[i - l];
}
```