// // "use client"

// // import { useEffect, useRef } from "react"
// // import Prism from "prismjs"
// // import "prismjs/themes/prism-tomorrow.css"

// // const LANGUAGES = [
// //   "javascript",
// //   "typescript",
// //   "python",
// //   "java",
// //   "cpp",
// //   "c",
// //   "csharp",
// //   "go",
// //   "rust",
// //   "ruby",
// //   "php",
// //   "swift",
// //   "kotlin",
// // ]

// // export function CodeEditor({ value, onChange, language }) {
// //   const textareaRef = useRef(null)
// //   const preRef = useRef(null)
// //   const codeRef = useRef(null)

// //   useEffect(() => {
// //     // Dynamically load Prism language components
// //     LANGUAGES.forEach((lang) => {
// //       import(`prismjs/components/prism-${lang}`)
// //     })
// //   }, [])

// //   // ... rest of your CodeEditor logic
// //   useEffect(() => {
// //     if (codeRef.current) {
// //       codeRef.current.textContent = value
// //       Prism.highlightElement(codeRef.current)
// //     }
// //   }, [value, language])

// //   const handleScroll = (e) => {
// //     if (preRef.current) {
// //       preRef.current.scrollTop = e.currentTarget.scrollTop
// //       preRef.current.scrollLeft = e.currentTarget.scrollLeft
// //     }
// //   }

// //   const handleKeyDown = (e) => {
// //     if (e.key === "Tab") {
// //       e.preventDefault()
// //       const start = e.currentTarget.selectionStart
// //       const end = e.currentTarget.selectionEnd
// //       const newValue = value.substring(0, start) + "  " + value.substring(end)
// //       onChange(newValue)

// //       setTimeout(() => {
// //         if (textareaRef.current) {
// //           textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
// //         }
// //       }, 0)
// //     }
// //   }

// //   return (
// //     <div className="relative h-full w-full overflow-hidden bg-[#1e1e1e]">
// //       {/* Line numbers */}
// //       <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-border/20 overflow-hidden pointer-events-none z-10">
// //         <div className="py-4 px-2 text-right font-mono text-xs text-muted-foreground/50 leading-6">
// //           {value.split("\n").map((_, i) => (
// //             <div key={i}>{i + 1}</div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Syntax highlighted code (background) */}
// //       <pre
// //         ref={preRef}
// //         className="absolute left-12 top-0 right-0 bottom-0 overflow-auto pointer-events-none m-0 p-4 font-mono text-sm leading-6"
// //         style={{ background: "transparent" }}
// //       >
// //         <code ref={codeRef} className={`language-${language}`}>
// //           {value}
// //         </code>
// //       </pre>

// //       {/* Textarea (foreground, transparent text) */}
// //       <textarea
// //         ref={textareaRef}
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //         onScroll={handleScroll}
// //         onKeyDown={handleKeyDown}
// //         spellCheck={false}
// //         className="absolute left-12 top-0 right-0 bottom-0 w-[calc(100%-3rem)] h-full p-4 font-mono text-sm leading-6 bg-transparent resize-none outline-none border-none caret-white"
// //         style={{
// //           color: "transparent",
// //           caretColor: "#fff",
// //         }}
// //       />
// //     </div>
// //   )
// // }
// "use client"

// import { useEffect, useRef } from "react"
// import Prism from "prismjs"
// import "prismjs/themes/prism-tomorrow.css"

// const LANGUAGES = [
//   "javascript",
//   "typescript",
//   "python",
//   "java",
//   "cpp",
//   "c",
//   "csharp",
//   "go",
//   "rust",
//   "ruby",
//   "php",
//   "swift",
//   "kotlin",
// ]

//  export function CodeEditor({ value, onChange, language }) {
//    const textareaRef = useRef(null)
//    const preRef = useRef(null)
//    const codeRef = useRef(null)
//    useEffect(() => {
//      // Dynamically load Prism language components
//      LANGUAGES.forEach((lang) => {
//        import(`prismjs/components/prism-${lang}`)
//      })
//    }, [])
//    // ... rest of your CodeEditor logic
//    useEffect(() => {
//      if (codeRef.current) {
//        codeRef.current.textContent = value
//        Prism.highlightElement(codeRef.current)
//      }
//    }, [value, language])
//   const handleScroll = (e) => {
//     if (preRef.current) {
//       preRef.current.scrollTop = e.currentTarget.scrollTop
//       preRef.current.scrollLeft = e.currentTarget.scrollLeft
//     }
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Tab") {
//       e.preventDefault()
//       const start = e.currentTarget.selectionStart
//       const end = e.currentTarget.selectionEnd
//       const newValue = value.substring(0, start) + "  " + value.substring(end)
//       onChange(newValue)

//       setTimeout(() => {
//         if (textareaRef.current) {
//           textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
//         }
//       }, 0)
//     }
//   }

//   return (
//     <div className="relative h-full w-full overflow-hidden bg-[#1a1a1a]">
//       <div className="absolute left-0 top-0 bottom-0 w-14 bg-[#252525] border-r border-[#3a3a3a] overflow-hidden pointer-events-none z-10 select-none">
//         <div className="py-5 px-3 text-right font-mono text-[13px] text-[#858585] leading-[1.6] tracking-tight">
//           {value.split("\n").map((_, i) => (
//             <div key={i} className="hover:text-[#d4d4d4] transition-colors">
//               {i + 1}
//             </div>
//           ))}
//         </div>
//       </div>

//       <pre
//         ref={preRef}
//         className="absolute left-14 top-0 right-0 bottom-0 overflow-auto pointer-events-none m-0 py-5 px-4 font-mono text-[14px] leading-[1.6] tracking-tight"
//         style={{
//           background: "transparent",
//           WebkitFontSmoothing: "antialiased",
//           MozOsxFontSmoothing: "grayscale",
//         }}
//       >
//         <code ref={codeRef} className={`language-${language}`}>
//           {value}
//         </code>
//       </pre>

//       <textarea
//         ref={textareaRef}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         onScroll={handleScroll}
//         onKeyDown={handleKeyDown}
//         spellCheck={false}
//         className="absolute left-14 top-0 right-0 bottom-0 w-[calc(100%-3.5rem)] h-full py-5 px-4 font-mono text-[14px] leading-[1.6] tracking-tight bg-transparent resize-none outline-none border-none caret-orange-500 selection:bg-orange-500/20"
//         style={{
//           color: "transparent",
//           caretColor: "#f97316",
//           WebkitFontSmoothing: "antialiased",
//           MozOsxFontSmoothing: "grayscale",
//           scrollBehavior: "smooth",
//         }}
//       />
//     </div>
//   )
// }
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "c",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
];

export function CodeEditor({ value, onChange, language }) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const codeRef = useRef(null);
  const containerRef = useRef(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Dynamically load Prism language components
    LANGUAGES.forEach((lang) => {
      import(`prismjs/components/prism-${lang}`).catch(() => {
        console.warn(`Failed to load Prism language: ${lang}`);
      });
    });
  }, []);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.textContent = value;
      Prism.highlightElement(codeRef.current);
    }
  }, [value, language]);

  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Use requestAnimationFrame for smoother cursor positioning
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = start + 2;
          textareaRef.current.focus();
        }
      });
    }
  };

  const handleInput = (e) => {
    onChange(e.target.value);

    // Maintain cursor position after state update
    const cursorPos = e.target.selectionStart;
    requestAnimationFrame(() => {
      if (
        textareaRef.current &&
        document.activeElement === textareaRef.current
      ) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          cursorPos;
      }
    });
  };

  // Shared styling for perfect alignment
  const sharedStyles = {
    fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
    fontSize: "14px",
    lineHeight: "1.6",
    letterSpacing: "0",
    tabSize: "2",
    whiteSpace: "pre",
    wordWrap: "normal",
    padding: "1.25rem 1rem",
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden transition-colors"
      style={{
        backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
      }}
    >
      {/* Line numbers */}
      <div
        className="absolute left-0 top-0 bottom-0 w-14 overflow-hidden pointer-events-none z-10 select-none transition-colors"
        style={{
          backgroundColor: isDark ? "#252525" : "#e8e8e8",
          borderRight: `1px solid ${isDark ? "#3a3a3a" : "#d0d0d0"}`,
        }}
      >
        <div
          className="py-5 px-3 text-right font-mono text-[13px] leading-[1.6] transition-colors"
          style={{
            fontFamily: sharedStyles.fontFamily,
            color: isDark ? "#858585" : "#6b7280",
          }}
        >
          {value.split("\n").map((_, i) => (
            <div
              key={i}
              className="transition-colors"
              style={{
                color: isDark ? "#858585" : "#6b7280",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = isDark ? "#d4d4d4" : "#374151")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isDark ? "#858585" : "#6b7280")
              }
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Syntax highlighted code */}
      <pre
        ref={preRef}
        className="absolute left-14 top-0 right-0 bottom-0 overflow-auto pointer-events-none m-0"
        style={{
          ...sharedStyles,
          background: "transparent",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <code
          ref={codeRef}
          className={`language-${language}`}
          style={{
            fontFamily: sharedStyles.fontFamily,
            fontSize: sharedStyles.fontSize,
            lineHeight: sharedStyles.lineHeight,
          }}
        >
          {value}
        </code>
      </pre>

      {/* Textarea for input */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="absolute left-14 top-0 right-0 bottom-0 w-[calc(100%-3.5rem)] h-full resize-none outline-none border-none caret-orange-500 selection:bg-orange-500/20"
        style={{
          ...sharedStyles,
          background: "transparent",
          color: "transparent",
          caretColor: "#f97316",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          overflow: "auto",
        }}
      />
    </div>
  );
}
