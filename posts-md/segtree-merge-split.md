title: Segtree Merge/Split (Template)
date: 7-21-2022
tag: template, segtree, segtree merge

---

## Goal

Our goal is to be able to merge two segtree's together, as well as split a segtree into two.

## Solution

### Merge

Lets say that we have \\(N\\) sparse segtrees with a total of \\(M\\) leaf nodes. When merging two segtrees \\(A\\) and \\(B\\), we can recurse down the tree and and combine a node only if it exists in both \\(A\\) and \\(B\\). Otherwise, there is no need to recurse down that node's subtree, and we can return early. With this algorithm, every initial node will be merged at most once, and since we had \\(M log M\\) initial nodes, the complexity for merge is \\(O(M log M)\\).

### Split

Whenever we visit a node, we want to move the left child, right child, or neither into a new node, and recurse down accordingly. Each split will create \\(log M\\) new nodes, which will only be merged at most once. Therefore, the complexity for split is \\(O(M log M)\\).

## Code

Implemented for range sum query

### Merge

```c++
//merges a and b
//merges a and b
int merge(int a, int b){
    if(a == 0 || b == 0) return a ^ b;  
    //merge left and right subtrees
    left0[a] = merge(left0[a], left0[b]);
    right0[a] = merge(right0[a], right0[b]);
    if(!left0[a] && !right0[a]) seg[a] = seg[a] + seg[b]; //merge if its a leaf
    else seg[a] = seg[left0[a]] + seg[right0[a]]; //pull if its not a leaf
}
```

### Split

Can be modified to split across midpoint instead.

```c++
//after the split, x will contain the first k values
//returns a new segtree containing the rest
int split(int x, int k){
    int ret = newnode();
    if(seg[left0[x]] < k) right0[ret] = split(right0[x], k - seg[left0[x]]); //everything in left child will be kept, split down right
    else right0[ret] = right0[x], right0[x] = 0; //everything in right child will be split
    if(k < seg[left0[x]]) left0[ret] = split(left0[x], k); //everything in the right child will be split, split down left
    //update new values
    seg[ret] = seg[x] - k;
    seg[x] = k;
    return ret;
}
```