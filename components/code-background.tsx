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
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.8 + Math.random() * 0.4,
    opacity: 0.2 + Math.random() * 0.2,
    animationDuration: 20 + Math.random() * 40,
    animationDelay: Math.random() * 10,
    xMovement: Math.random() * 20 - 10,
    yMovement: Math.random() * 20 - 10
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
    setSnippets(getRandomSnippets(18)); // Increased number of snippets for fuller effect

    // Periodically add new snippets and remove old ones for a dynamic effect
    const interval = setInterval(() => {
      setSnippets(prevSnippets => {
        // Remove 3 random snippets
        const remainingSnippets = [...prevSnippets];
        for (let i = 0; i < 3; i++) {
          if (remainingSnippets.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingSnippets.length);
            remainingSnippets.splice(randomIndex, 1);
          }
        }
        
        // Add 3 new snippets
        return [...remainingSnippets, ...getRandomSnippets(3)];
      });
    }, 8000); // Every 8 seconds

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      {snippets.map((snippet, index) => (
        <pre
          key={index}
          className="code-snippet font-mono text-xs text-primary-600 dark:text-primary-400 absolute pointer-events-none"
          style={{
            top: `${snippet.y}%`,
            left: `${snippet.x}%`,
            transform: `rotate(${snippet.rotation}deg) scale(${snippet.scale})`,
            opacity: snippet.opacity,
            maxWidth: "300px", 
            whiteSpace: "pre-wrap",
            animation: `float-${index} ${snippet.animationDuration}s infinite ease-in-out ${snippet.animationDelay}s`,
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
              transform: translate(${snippet.xMovement}px, ${snippet.yMovement}px) rotate(${snippet.rotation + 5}deg) scale(${snippet.scale});
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
