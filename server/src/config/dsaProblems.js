module.exports = [
  // Two Pointers
  {
    id: 'two-sum-ii',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    tags: ['Two Pointers', 'Array', 'Binary Search'],
    description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.',
    url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: '3sum',
    title: '3Sum',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    tags: ['Two Pointers', 'Array', 'Sorting'],
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    url: 'https://leetcode.com/problems/3sum/',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1) or O(n)'
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    tags: ['Two Pointers', 'Array', 'Greedy'],
    description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    url: 'https://leetcode.com/problems/container-with-most-water/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    pattern: 'Two Pointers',
    tags: ['Two Pointers', 'Array', 'Stack', 'Dynamic Programming'],
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    url: 'https://leetcode.com/problems/trapping-rain-water/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // Sliding Window
  {
    id: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    pattern: 'Sliding Window',
    tags: ['Sliding Window', 'Hash Table', 'String'],
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, m))'
  },
  {
    id: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    pattern: 'Sliding Window',
    tags: ['Sliding Window', 'Hash Table', 'String'],
    description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
    url: 'https://leetcode.com/problems/minimum-window-substring/',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(m + n)'
  },
  {
    id: 'max-consecutive-ones-iii',
    title: 'Max Consecutive Ones III',
    difficulty: 'Medium',
    pattern: 'Sliding Window',
    tags: ['Sliding Window', 'Array', 'Binary Search'],
    description: 'Given a binary array nums and an integer k, return the maximum number of consecutive 1\'s in the array if you can flip at most k 0\'s.',
    url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // Binary Search
  {
    id: 'binary-search-basic',
    title: 'Binary Search',
    difficulty: 'Easy',
    pattern: 'Binary Search',
    tags: ['Binary Search', 'Array'],
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
    url: 'https://leetcode.com/problems/binary-search/',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    pattern: 'Binary Search',
    tags: ['Binary Search', 'Array'],
    description: 'Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
    url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'find-first-and-last-position',
    title: 'Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    pattern: 'Binary Search',
    tags: ['Binary Search', 'Array'],
    description: 'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.',
    url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },

  // Dynamic Programming
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    pattern: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Memoization', 'Math'],
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    url: 'https://leetcode.com/problems/climbing-stairs/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    pattern: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Array'],
    description: 'Determine the maximum amount of money you can rob tonight without alerting the police given non-adjacent houses constraint.',
    url: 'https://leetcode.com/problems/house-robber/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    pattern: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Breadth-First Search'],
    description: 'Given an integer array coins and an integer amount, return the fewest number of coins that you need to make up that amount.',
    url: 'https://leetcode.com/problems/coin-change/',
    timeComplexity: 'O(amount * n)',
    spaceComplexity: 'O(amount)'
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    pattern: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Binary Search', 'Array'],
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    timeComplexity: 'O(n log n) or O(n^2)',
    spaceComplexity: 'O(n)'
  },

  // Hashing
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    pattern: 'Hashing',
    tags: ['Hash Table', 'Array'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target using a hash table.',
    url: 'https://leetcode.com/problems/two-sum/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    pattern: 'Hashing',
    tags: ['Hash Table', 'String', 'Sorting'],
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    url: 'https://leetcode.com/problems/group-anagrams/',
    timeComplexity: 'O(n * k log k)',
    spaceComplexity: 'O(n * k)'
  },

  // Stack & Queue
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    pattern: 'Stack and Queue',
    tags: ['Stack', 'String'],
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    pattern: 'Stack and Queue',
    tags: ['Monotonic Stack', 'Array'],
    description: 'Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
    url: 'https://leetcode.com/problems/daily-temperatures/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },

  // Graph / BFS / DFS
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    pattern: 'Graph Algorithms',
    tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
    description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
    url: 'https://leetcode.com/problems/number-of-islands/',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)'
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    pattern: 'Graph Algorithms',
    tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Determine if you can finish all courses.',
    url: 'https://leetcode.com/problems/course-schedule/',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)'
  },

  // Tree Traversal
  {
    id: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    pattern: 'Tree Traversal',
    tags: ['Tree', 'Breadth-First Search', 'Binary Tree'],
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'lowest-common-ancestor-bst',
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    difficulty: 'Medium',
    pattern: 'Tree Traversal',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree'],
    description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.',
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(1) or O(h)'
  },

  // Greedy
  {
    id: 'jump-game',
    title: 'Jump Game',
    difficulty: 'Medium',
    pattern: 'Greedy',
    tags: ['Greedy', 'Array', 'Dynamic Programming'],
    description: 'You are given an integer array nums. You are initially positioned at the array\'s first index. Determine if you are able to reach the last index.',
    url: 'https://leetcode.com/problems/jump-game/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'gas-station',
    title: 'Gas Station',
    difficulty: 'Medium',
    pattern: 'Greedy',
    tags: ['Greedy', 'Array'],
    description: 'Given two integer arrays gas and cost, return the starting gas station\'s index if you can travel around the circuit once in the clockwise direction, otherwise return -1.',
    url: 'https://leetcode.com/problems/gas-station/',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // Backtracking
  {
    id: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    pattern: 'Backtracking',
    tags: ['Backtracking', 'Array', 'Bit Manipulation'],
    description: 'Given an integer array nums of unique elements, return all possible subsets (the power set).',
    url: 'https://leetcode.com/problems/subsets/',
    timeComplexity: 'O(n * 2^n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'n-queens',
    title: 'N-Queens',
    difficulty: 'Hard',
    pattern: 'Backtracking',
    tags: ['Backtracking', 'Array'],
    description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions.',
    url: 'https://leetcode.com/problems/n-queens/',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)'
  },

  // Sorting
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    pattern: 'Sorting',
    tags: ['Sorting', 'Array'],
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    url: 'https://leetcode.com/problems/merge-intervals/',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  }
];
