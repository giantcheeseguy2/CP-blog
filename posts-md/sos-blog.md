title: SOS DP (Tutorial)
date: 4-22-2023
tag: sos, template

---

## Goal

Find the sum of all values that has an identifier that is a subset of a query. 

## Solution

We will solve this using dynamic programming. Let \\(dp[mask][i] = ) the sum of all values whose first \\(i\\) bits are a subset of \\(mask\\) and the remainder are exactly \\(mask\\). Then, \\(dp[mask][i] = dp[mask][i - 1]\\) if \\(i\\) is not set, and \\(dp[mask][i] = dp[mask][i - 1] + dp[mask ^ (1 << i)][i - 1]\\) if \\(i\\) is set. The second state can be removed and the dp can be generalized to non binary masks.

## Code

Subsets

```c++
for(int i = 0; i < n; i++){
    for(int j = 0; j < (1 << n); j++){
        if(j & (1 << i)){
            dp[j] += dp[j ^ (1 << i)];
        }
    }
}
```

Supersets

```c++
for(int i = 0; i < n; i++){
    for(int j = 0; j < (1 << n); j++){
        if(!(j & (1 << i))){
            dp[j] += dp[j ^ (1 << i)];
        }
    }
}
```

Generalized

```c++
//v denotes the size of each state, ie. a vector of (1, 3, 4, 2) would cover all subsets of (1, 3, 4, 2)
int ind[v.size()];
int lim = 1;

for(int i = 0; i < v.size(); i++){
    ind[i] = lim;
    lim *= v[i].ss + 1;
}

for(int i = 0; i < v.size(); i++){
    for(int j = lim - 1; j >= 0; j--){
        int cur = (j/ind[i])%(v[i] + 1);
        if(cur < v[i]){
            sos[j] += sos[j + ind[i]];
        }
    }
}
```