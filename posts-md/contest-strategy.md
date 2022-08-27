title: USACO Contest Strategy
date: 7-21-2022
tag: contest strategy

---

## General

- First thing to do is always to read all the problems.
    - Identify the seemingly easiest and work on that first.
- Focus at one problem at a time. Spreading out your thoughts will only make you less productive.
- Make sure to leave at least 30 minutes for thinking about each problem.

## Thinking Phase

- Unless full solution is relatively obvious, try to solve each subtask
    - If you have a subtask solution just code it. The time cost is not that high.
    - Always code a trivial brute force and verify it by submitting. It will verify your understanding as well as being helpful for stress testing
- First thing to do is work out samples/write out cases and notice properties. Helps solve the problem and verifies your understanding.
- Write down everything while thinking
    - When formulating a solution, write down all thoughts no matter how useful they seem. They will eventually lead somewhere.
        - Every reduction
        - Every observation
        - Every algorithm or trick
        - Possible properties (even if not proven)
    - In the thinking part of the problem, just go through ideas as fast as possible
- For some problems it is optimal to try to fix an technique and solve using that technique. For others, making observations will be faster. Use your better judgement.
- Some observations/reductions will be completely irrelevant to the solution. If you feel some obesrvation is a trap, just force yourself to not think about it. Don't let your brain trick you into not "wasting" your previous efforts.
- If the problem is reduced to something seemingly classic that you cannot solve, there are a few possibilities.
    - Your reduction is completely wrong.
    - There are some special properties of the problem structure that you are missing.
    - This is a standard technique that you have not learned yet
- When you no longer feel productive, go take a break for a couple minutes. After coming back, reset and pretend like you are starting a new contest.
- Possible Techniques:
    - Sqrt
    - Random
    - Divide and Conquer
    - Offline
    - Backwards
    - Fix a variable
    - Visualize on a plane
    - Visualize as a graph/tree
- Possible Algorithms
    - Data Structure
    - Dynamic Programming
    - Greedy
    - Binary Lifting
    - Binary Search
    - Prefix Sums
    - Flows
    - Hashing
- Possibly Useful Observations
    - Invariance
    - Monotonic

## Coding Phase

- If the implementation seems short, just go for it.
- For longer implementations
    - Run it on the samples first. Nothing worse than coding something only to find out your idea is wrong on samples
    - Work out the details and some other cases. Nothing worse than coding something only find out your idea is wrong on everything but samples
    - If you are going off an assumption based on instinct, good luck. Theres probably a 50 50 chance of it passing.
- Wrong answer?
    - Look over code for a few minutes to find obvious bugs
    - If no obvious bugs, go straight to stress testing. Takes 1 minute to write a generator (ideally you already have the brute force), and will instantly find an edge case. Much more efficient than working out cases or debugging by hand.