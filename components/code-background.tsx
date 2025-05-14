"use client"

import { useEffect, useState } from "react"

const codeSnippets = [
  `// React Component
function Welcome() {
  return <h1>Hello World!</h1>;
}`,
  `// Next.js API Route
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello!' })
}`,
  `// TypeScript Interface
interface User {
  id: number;
  name: string;
  email: string;
}`,
  `// Async Function
async function fetchData() {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}`,
  `// Tailwind CSS
const styles = {
  button: 'bg-blue-500 hover:bg-blue-700 
    text-white font-bold py-2 px-4 rounded'
}`,
  `// React Hook
const [count, setCount] = useState(0);
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);`,

`// Hello World in C
#include <stdio.h>
int main() {
  printf("Hello, World!");
  return 0;
}`,

  `// FizzBuzz
for (let i = 1; i <= 100; i++) {
  let out = "";
  if (i % 3 === 0) out += "Fizz";
  if (i % 5 === 0) out += "Buzz";
  console.log(out || i);
}`,

  `// Singleton Pattern (JavaScript)
const Singleton = (() => {
  let instance;
  return {
    getInstance: () => instance || (instance = {})
  };
})();`,

  `// Fibonacci (recursive)
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`,

  `// Binary Search
function binarySearch(arr, x) {
  let start = 0, end = arr.length - 1;
  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    if (arr[mid] === x) return mid;
    else if (arr[mid] < x) start = mid + 1;
    else end = mid - 1;
  }
  return -1;
}`,

  `// Palindrome Checker
function isPalindrome(str) {
  return str === str.split('').reverse().join('');
}`,

  `// Python Zen (Easter Egg)
import this`,

  `// CSS Centering (classic)
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}`,

  `// Don't Repeat Yourself (DRY)
function greet(name) {
  return \`Hello, \${name}!\`;
}`,

  `// Git One-Liner to Undo Last Commit
git reset --soft HEAD~1`,

  `// Yoda Conditions (anti-pattern)
if (42 === answer) {
  // Use the force
}`,
]

// Generate a random position for each snippet
const getRandomPosition = () => {
  return {
    x: Math.random() * 90 + 5, // Keep snippets within 5% of edges
    y: Math.random() * 90 + 5,
    rotation: Math.random() * 10 - 5, // Less extreme rotation (-5 to 5 degrees)
    scale: 0.9 + Math.random() * 0.3, // Larger scale for better visibility
    opacity: 0.35 + Math.random() * 0.25, // Increased opacity range
    animationDuration: 30 + Math.random() * 30, // Slower animations
    animationDelay: Math.random() * 5,
    xMovement: Math.random() * 30 - 15, // Larger movement range
    yMovement: Math.random() * 30 - 15
  }
}

const getRandomSnippets = (count: number) => {
  const shuffled = [...codeSnippets].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(snippet => ({
    code: snippet,
    ...getRandomPosition()
  }));
};

interface CodeSnippet {
  code: string
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
  animationDuration: number
  animationDelay: number
  xMovement: number
  yMovement: number
}

export default function CodeBackground() {
  const [mounted, setMounted] = useState(false);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

  useEffect(() => {
    setMounted(true);
    setSnippets(getRandomSnippets(12)); // Fewer but more visible snippets

    // Periodically add new snippets and remove old ones for a dynamic effect
    const interval = setInterval(() => {
      setSnippets(prevSnippets => {
        // Remove 2 random snippets
        const remainingSnippets = [...prevSnippets];
        for (let i = 0; i < 2; i++) {
          if (remainingSnippets.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingSnippets.length);
            remainingSnippets.splice(randomIndex, 1);
          }
        }
        
        // Add 2 new snippets
        return [...remainingSnippets, ...getRandomSnippets(2)];
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30">
      {snippets.map((snippet, index) => (
        <pre
          key={index}
          className="code-snippet font-mono text-sm text-primary-700 dark:text-primary-400 absolute pointer-events-none shadow-sm bg-white/5 p-2 rounded-md"
          style={{
            top: `${snippet.y}%`,
            left: `${snippet.x}%`,
            transform: `rotate(${snippet.rotation}deg) scale(${snippet.scale})`,
            opacity: snippet.opacity,
            maxWidth: "350px", 
            whiteSpace: "pre-wrap",
            animation: `float-${index} ${snippet.animationDuration}s infinite ease-in-out ${snippet.animationDelay}s`,
            border: '1px solid rgba(59, 130, 246, 0.1)',
            backdropFilter: 'blur(2px)'
          }}
        >
          {snippet.code}
        </pre>
      ))}
      <style jsx>{`
        ${snippets.map((snippet, index) => `
          @keyframes float-${index} {
            0% {
              transform: translate(0, 0) rotate(${snippet.rotation}deg) scale(${snippet.scale});
            }
            50% {
              transform: translate(${snippet.xMovement}px, ${snippet.yMovement}px) rotate(${snippet.rotation + 2}deg) scale(${snippet.scale + 0.05});
            }
            100% {
              transform: translate(0, 0) rotate(${snippet.rotation}deg) scale(${snippet.scale});
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
