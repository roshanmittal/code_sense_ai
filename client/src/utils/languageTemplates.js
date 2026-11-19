export const LANGUAGE_CONFIGS = {
  python: {
    id: 'python',
    name: 'Python 3',
    monacoLanguage: 'python',
    extension: 'py',
    boilerplate: `# Python 3 - CodeSense AI Workspace
def two_sum(nums, target):
    """
    Find two indices such that nums[i] + nums[j] == target.
    """
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []

# Test harness
if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(f"Result: {result}")
`,
    defaultTestCases: [
      { input: '', expectedOutput: 'Result: [0, 1]' },
    ],
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript (Node.js)',
    monacoLanguage: 'javascript',
    extension: 'js',
    boilerplate: `// JavaScript (Node.js) - CodeSense AI Workspace
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Test harness
const nums = [2, 7, 11, 15];
const target = 9;
console.log("Result:", JSON.stringify(twoSum(nums, target)));
`,
    defaultTestCases: [
      { input: '', expectedOutput: 'Result: [0,1]' },
    ],
  },
  cpp: {
    id: 'cpp',
    name: 'C++ (GCC)',
    monacoLanguage: 'cpp',
    extension: 'cpp',
    boilerplate: `// C++ (GCC) - CodeSense AI Workspace
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> lookup;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (lookup.count(complement)) {
            return {lookup[complement], i};
        }
        lookup[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    
    if (result.size() == 2) {
        cout << "Result: [" << result[0] << ", " << result[1] << "]" << endl;
    } else {
        cout << "No solution found." << endl;
    }
    return 0;
}
`,
    defaultTestCases: [
      { input: '', expectedOutput: 'Result: [0, 1]' },
    ],
  },
  java: {
    id: 'java',
    name: 'Java (OpenJDK)',
    monacoLanguage: 'java',
    extension: 'java',
    boilerplate: `// Java (OpenJDK) - CodeSense AI Workspace
import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("Result: " + Arrays.toString(result));
    }
}
`,
    defaultTestCases: [
      { input: '', expectedOutput: 'Result: [0, 1]' },
    ],
  },
};
