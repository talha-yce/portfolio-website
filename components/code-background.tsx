"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

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
  button: 'bg-purple-500 hover:bg-purple-700 
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



export default function CodeBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {codeSnippets.map((snippet, index) => (
        <pre
          key={index}
          className="code-snippet"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          {snippet}
        </pre>
      ))}
      
    </div>
  )
}
