import mongoose from "mongoose";
import { PrismaClient } from "./generated/prisma/index.js";
import Question from "./models/questionModel.js";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const sampleQuestions = [
  {
    title: "Hello World",
    description: "Your task is to return the given string s",
    examples: {
      input: 's="Hello World"',
      output: "Hello World",
      explanation: "Simply return the input string as it is.",
    },
    hints: ["Basics"],
    topics: ["Basics"],
    constraints: ["1 <= n <= 3"],
    timeLimit: 1,
    memoryLimit: 256,
    testCases: {
      input: `3
hello
world
solution`,
      output: `hello
world
solution`,
    },
    solutionCode: `class Solution{
    public:
        string solve(string& s){
            return s;
        }
};`,
    boilerPlateCodes: [
      {
        language: "cpp",
        code: `#include <bits/stdc++.h>
using namespace std;
class Solution{
    public:
        string solve(string& s){
            // Your code here
        }
};
int main(){
    int t;
    cin>>t;
    cin.ignore();
    Solution s=new Solution();
    while(t--){
        string s;
        cin>>s;
        string resp=s.solve(s);
        cout<<resp<<endl;
    }
}`,
      },
      {
        language: "python",
        code: `class Solution:
    def solve(self, s: str) -> str:
        # Your code here
        pass

if __name__ == "__main__":
    t = int(input())
    solution = Solution()
    for _ in range(t):
        s = input()
        print(solution.solve(s))`,
      },
      {
        language: "java",
        code: `import java.util.*;

class Solution {
    public String solve(String s) {
        // Your code here
        return "";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        sc.nextLine();
        Solution solution = new Solution();
        while(t-- > 0) {
            String s = sc.nextLine();
            System.out.println(solution.solve(s));
        }
    }
}`,
      },
    ],
  },
  {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    examples: {
      input: `nums = [2,7,11,15], target = 9`,
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    hints: [
      "Use a hash map to store the complement of each element",
      "For each element, check if its complement exists in the hash map",
    ],
    topics: ["Arrays", "Hash Table"],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists",
    ],
    timeLimit: 2,
    memoryLimit: 256,
    testCases: {
      input: `3
4 2 7 11 15
9
3 3 2 4
6
2 3 3
6`,
      output: `0 1
1 2
0 1`,
    },
    solutionCode: `class Solution{
    public:
        vector<int> twoSum(vector<int>& nums, int target) {
            unordered_map<int, int> map;
            for(int i = 0; i < nums.size(); i++){
                int complement = target - nums[i];
                if(map.find(complement) != map.end()){
                    return {map[complement], i};
                }
                map[nums[i]] = i;
            }
            return {};
        }
};`,
    boilerPlateCodes: [
      {
        language: "cpp",
        code: `#include <bits/stdc++.h>
using namespace std;
class Solution{
    public:
        vector<int> twoSum(vector<int>& nums, int target) {
            // Your code here
        }
};
int main(){
    int t;
    cin>>t;
    Solution solution;
    while(t--){
        int n;
        cin>>n;
        vector<int> nums(n);
        for(int i=0; i<n; i++){
            cin>>nums[i];
        }
        int target;
        cin>>target;
        vector<int> result = solution.twoSum(nums, target);
        for(int i=0; i<result.size(); i++){
            cout<<result[i];
            if(i < result.size()-1) cout<<" ";
        }
        cout<<endl;
    }
    return 0;
}`,
      },
      {
        language: "python",
        code: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Your code here
        pass

if __name__ == "__main__":
    t = int(input())
    solution = Solution()
    for _ in range(t):
        n = int(input())
        nums = list(map(int, input().split()))
        target = int(input())
        result = solution.twoSum(nums, target)
        print(' '.join(map(str, result)))`,
      },
      {
        language: "java",
        code: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        Solution solution = new Solution();
        while(t-- > 0) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            for(int i=0; i<n; i++){
                nums[i] = sc.nextInt();
            }
            int target = sc.nextInt();
            int[] result = solution.twoSum(nums, target);
            for(int i=0; i<result.length; i++){
                System.out.print(result[i]);
                if(i < result.length-1) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
      },
    ],
  },
  {
    title: "Palindrome Number",
    description:
      "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.",
    examples: {
      input: "x = 121",
      output: "true",
      explanation:
        "121 reads as 121 from left to right and from right to left.",
    },
    hints: [
      "You can reverse the second half of the number and compare it with the first half",
      "Be careful with negative numbers and numbers ending with 0",
    ],
    topics: ["Math"],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    timeLimit: 1,
    memoryLimit: 256,
    testCases: {
      input: `4
121
-121
10
12321`,
      output: `true
false
false
true`,
    },
    solutionCode: `class Solution{
    public:
        bool isPalindrome(int x) {
            if(x < 0 || (x % 10 == 0 && x != 0)) {
                return false;
            }
            int reversedHalf = 0;
            while(x > reversedHalf) {
                reversedHalf = reversedHalf * 10 + x % 10;
                x /= 10;
            }
            return x == reversedHalf || x == reversedHalf / 10;
        }
};`,
    boilerPlateCodes: [
      {
        language: "cpp",
        code: `#include <bits/stdc++.h>
using namespace std;
class Solution{
    public:
        bool isPalindrome(int x) {
            // Your code here
        }
};
int main(){
    int t;
    cin>>t;
    Solution solution;
    while(t--){
        int x;
        cin>>x;
        bool result = solution.isPalindrome(x);
        cout<<(result ? "true" : "false")<<endl;
    }
    return 0;
}`,
      },
      {
        language: "python",
        code: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        # Your code here
        pass

if __name__ == "__main__":
    t = int(input())
    solution = Solution()
    for _ in range(t):
        x = int(input())
        result = solution.isPalindrome(x)
        print("true" if result else "false")`,
      },
      {
        language: "java",
        code: `import java.util.*;

class Solution {
    public boolean isPalindrome(int x) {
        // Your code here
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        Solution solution = new Solution();
        while(t-- > 0) {
            int x = sc.nextInt();
            boolean result = solution.isPalindrome(x);
            System.out.println(result ? "true" : "false");
        }
    }
}`,
      },
    ],
  },
  {
    title: "Reverse String",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    examples: {
      input: 's = ["h","e","l","l","o"]',
      output: '["o","l","l","e","h"]',
      explanation: "The string hello is reversed to olleh.",
    },
    hints: [
      "Use two pointers approach",
      "Swap characters from both ends moving towards the center",
    ],
    topics: ["Two Pointers", "String"],
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character",
    ],
    timeLimit: 1,
    memoryLimit: 256,
    testCases: {
      input: `3
hello
world
algorithm`,
      output: `olleh
dlrow
mhtirogla`,
    },
    solutionCode: `class Solution{
    public:
        string reverseString(string s) {
            int left = 0, right = s.length() - 1;
            while(left < right){
                swap(s[left++], s[right--]);
            }
            return s;
        }
};`,
    boilerPlateCodes: [
      {
        language: "cpp",
        code: `#include <bits/stdc++.h>
using namespace std;
class Solution{
    public:
        string reverseString(string s) {
            // Your code here
        }
};
int main(){
    int t;
    cin>>t;
    cin.ignore();
    Solution solution;
    while(t--){
        string s;
        cin>>s;
        string result = solution.reverseString(s);
        cout<<result<<endl;
    }
    return 0;
}`,
      },
      {
        language: "python",
        code: `class Solution:
    def reverseString(self, s: str) -> str:
        # Your code here
        pass

if __name__ == "__main__":
    t = int(input())
    solution = Solution()
    for _ in range(t):
        s = input()
        result = solution.reverseString(s)
        print(result)`,
      },
      {
        language: "java",
        code: `import java.util.*;

class Solution {
    public String reverseString(String s) {
        // Your code here
        return "";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        sc.nextLine();
        Solution solution = new Solution();
        while(t-- > 0) {
            String s = sc.nextLine();
            String result = solution.reverseString(s);
            System.out.println(result);
        }
    }
}`,
      },
    ],
  },
  {
    title: "Valid Anagram",
    description:
      "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: {
      input: 's = "anagram", t = "nagaram"',
      output: "true",
      explanation:
        "Both strings contain the same characters with the same frequencies.",
    },
    hints: [
      "Use a hash map to count character frequencies",
      "Sort both strings and compare",
    ],
    topics: ["Hash Table", "String", "Sorting"],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters",
    ],
    timeLimit: 1,
    memoryLimit: 256,
    testCases: {
      input: `3
anagram nagaram
rat car
listen silent`,
      output: `true
false
true`,
    },
    solutionCode: `class Solution{
    public:
        bool isAnagram(string s, string t) {
            if(s.length() != t.length()) return false;
            unordered_map<char, int> count;
            for(char c : s) count[c]++;
            for(char c : t){
                if(--count[c] < 0) return false;
            }
            return true;
        }
};`,
    boilerPlateCodes: [
      {
        language: "cpp",
        code: `#include <bits/stdc++.h>
using namespace std;
class Solution{
    public:
        bool isAnagram(string s, string t) {
            // Your code here
        }
};
int main(){
    int t;
    cin>>t;
    cin.ignore();
    Solution solution;
    while(t--){
        string s, str;
        cin>>s>>str;
        bool result = solution.isAnagram(s, str);
        cout<<(result ? "true" : "false")<<endl;
    }
    return 0;
}`,
      },
      {
        language: "python",
        code: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # Your code here
        pass

if __name__ == "__main__":
    test_cases = int(input())
    solution = Solution()
    for _ in range(test_cases):
        s, t = input().split()
        result = solution.isAnagram(s, t)
        print("true" if result else "false")`,
      },
      {
        language: "java",
        code: `import java.util.*;

class Solution {
    public boolean isAnagram(String s, String t) {
        // Your code here
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        Solution solution = new Solution();
        while(t-- > 0) {
            String s = sc.next();
            String str = sc.next();
            boolean result = solution.isAnagram(s, str);
            System.out.println(result ? "true" : "false");
        }
    }
}`,
      },
    ],
  },
];

async function seedQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    let insertedCount = 0;

    for (const questionData of sampleQuestions) {
      try {
        // Check if question already exists
        const existingQuestion = await Question.findOne({
          title: questionData.title,
        });

        if (existingQuestion) {
          console.log(
            `Question "${questionData.title}" already exists. Skipping...`
          );
          continue;
        }

        // Create new question in MongoDB
        const newQuestion = new Question(questionData);
        await newQuestion.save();

        // Create entry in PostgreSQL with the MongoDB _id as UUID
        const nq = await prisma.question.create({
          data: {
            questionUUID: newQuestion._id.toString(),
          },
        });

        console.log(
          `✓ Created question: "${questionData.title}" with ID: ${nq.questionId}`
        );
        insertedCount++;
      } catch (error) {
        console.error(
          `✗ Error creating question "${questionData.title}":`,
          error.message
        );
      }
    }

    console.log(
      `\n✓ Successfully inserted ${insertedCount} out of ${sampleQuestions.length} questions`
    );

    // Disconnect
    await mongoose.disconnect();
    await prisma.$disconnect();
    console.log("Disconnected from databases");
  } catch (error) {
    console.error("Error seeding questions:", error);
    await mongoose.disconnect();
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedQuestions();
