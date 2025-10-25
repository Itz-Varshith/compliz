/**
 * Extracts the class/solution part from boilerplate code
 * This function identifies and extracts the user-editable portion (typically the class definition)
 * @param {string} code - The full boilerplate code
 * @param {string} language - The programming language
 * @returns {string} - The extracted class/solution code
 */
export function extractSolutionCode(code, language) {
  if (!code) return "";

  const lang = language.toLowerCase();

  try {
    if (lang === "cpp" || lang === "c++" || lang === "c") {
      // Extract class Solution { ... } or class Solution{ ... }
      const classMatch = code.match(/class\s+Solution\s*\{[\s\S]*?\n\};?/);
      if (classMatch) {
        return classMatch[0].trim();
      }
    } else if (lang === "python" || lang === "py") {
      // Extract class Solution: with all its methods (indented code)
      const lines = code.split("\n");
      const classIndex = lines.findIndex((line) =>
        line.trim().startsWith("class Solution")
      );

      if (classIndex !== -1) {
        const result = [];
        result.push(lines[classIndex]); // Add the class definition line

        // Get all indented lines that are part of the class
        for (let i = classIndex + 1; i < lines.length; i++) {
          const line = lines[i];
          // Stop if we hit a non-indented line (except empty lines)
          if (
            line.trim() &&
            !line.startsWith("    ") &&
            !line.startsWith("\t")
          ) {
            break;
          }
          result.push(line);
        }
        return result.join("\n").trim();
      }
    } else if (lang === "java") {
      // Extract class Solution { ... }
      const classMatch = code.match(/class\s+Solution\s*\{[\s\S]*?\n\}/);
      if (classMatch) {
        return classMatch[0].trim();
      }
    } else if (lang === "javascript" || lang === "js") {
      // Extract class Solution { ... }
      const classMatch = code.match(/class\s+Solution\s*\{[\s\S]*?\n\}/);
      if (classMatch) {
        return classMatch[0].trim();
      }
    }
  } catch (error) {
    console.error("Error extracting solution code:", error);
  }

  // If extraction fails, return the original code
  return code;
}

/**
 * Combines the user's edited solution code with the hidden boilerplate
 * @param {string} userSolutionCode - The user's edited class/solution code
 * @param {string} originalBoilerplate - The original boilerplate code
 * @param {string} language - The programming language
 * @returns {string} - The complete code ready for submission
 */
export function combineWithBoilerplate(
  userSolutionCode,
  originalBoilerplate,
  language
) {
  if (!originalBoilerplate) return userSolutionCode;

  const lang = language.toLowerCase();

  try {
    if (lang === "cpp" || lang === "c++" || lang === "c") {
      // Replace the class Solution { ... } in the boilerplate with user's code
      const replaced = originalBoilerplate.replace(
        /class\s+Solution\s*\{[\s\S]*?\n\};?/,
        userSolutionCode
      );
      return replaced;
    } else if (lang === "python" || lang === "py") {
      // Find and replace the class Solution: section
      const lines = originalBoilerplate.split("\n");
      const classIndex = lines.findIndex((line) =>
        line.trim().startsWith("class Solution")
      );

      if (classIndex !== -1) {
        const before = lines.slice(0, classIndex);

        // Find where the class ends (first non-indented line after class)
        let endIndex = classIndex + 1;
        for (let i = classIndex + 1; i < lines.length; i++) {
          const line = lines[i];
          if (
            line.trim() &&
            !line.startsWith("    ") &&
            !line.startsWith("\t")
          ) {
            endIndex = i;
            break;
          }
          if (i === lines.length - 1) {
            endIndex = lines.length;
          }
        }

        const after = lines.slice(endIndex);

        return [...before, userSolutionCode, ...after].join("\n");
      }
    } else if (lang === "java") {
      // Replace class Solution { ... }
      const replaced = originalBoilerplate.replace(
        /class\s+Solution\s*\{[\s\S]*?\n\}/,
        userSolutionCode
      );
      return replaced;
    } else if (lang === "javascript" || lang === "js") {
      // Replace class Solution { ... }
      const replaced = originalBoilerplate.replace(
        /class\s+Solution\s*\{[\s\S]*?\n\}/,
        userSolutionCode
      );
      return replaced;
    }
  } catch (error) {
    console.error("Error combining code:", error);
  }

  // If combination fails, return user's code as-is
  return userSolutionCode;
}

/**
 * Gets the Monaco editor language identifier from our language string
 * @param {string} language - Our language string (cpp, python, java, etc.)
 * @returns {string} - Monaco editor language identifier
 */
export function getMonacoLanguage(language) {
  const langMap = {
    cpp: "cpp",
    "c++": "cpp",
    c: "c",
    python: "python",
    py: "python",
    java: "java",
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
  };

  return langMap[language.toLowerCase()] || language;
}
