title: Aliens Trick (Template)
date: 10-23-2022
tag: template, aliens trick

---

## Goal

Lets say we are given a problem that requires you to do find the maximum answer while using exactly \\(K\\) elements and is convex (\\(f(k + 1) - f(k) \le f(k) - f(k - 1)\\)). In this problem, finding the maximum answer without that restriction can be done much faster than without. For example, a problem that requires you to take exactly \\(K\\) elements needs an extra state than a problem with no limit on the elements taken. We will attempt to remove this restriction with the cost of a binary search.

## Solution

Lets consider our convex function. If we are given a slope \\(c\\), we are able to find the point which it is tangent with the function (intersects at exactly one point). This point will also be the highest position possible. Let \\(y = c \\cdot x + b\\). Substuting \\(f(x)\\) for \\(y\\), we get that that \\(b = f(x) - c \\cdot x\\). In other words, over all possible \\(f(x) - c \\cdot x\\), we want to find the maximum one, thus successfully reducing the problem to finding an unrestricted maximum. Now, to find the value for a particular \\(x\\), we know that as \\(c\\) decreases, the \\(x\\) coordinate that it intersects the function increases. Thus, we can binary search on the \\(c\\) that will yield us the position where \\(f(k) - c \\cdot k\\) is maximal and solve for \\(f(k)\\).

## Code

```c++

    pair<int, int> check(int x){
        //do stuff here
        //return {any x such that f(x) - c*x is maximized, maximum f(x) - c*x}
    }

    int solve(){
        int l = -1e9, r = 1e9;
        while(l < r){
            int mid = (l + r + 1)/2;
            pair<int, int> ind = check(mid);
            if(ind.ff < k) r = mid - 1;
            else l = mid;
        }
        pair<int, int> ans = check(l); 
        return ans.ss + l*(k + 1);
    }
```