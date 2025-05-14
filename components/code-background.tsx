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
    rotation: Math.random() * 6 - 3, // Daha hafif rotasyon
    scale: 0.9 + Math.random() * 0.3,
    opacity: 0.4 + Math.random() * 0.3, // Daha görünür
    animationDuration: 40 + Math.random() * 60, // Daha yavaş ve nefesli hareket
    animationDelay: Math.random() * 10,
    waveSize: 10 + Math.random() * 20, // Dalga büyüklüğü
    waveSpeed: 0.5 + Math.random() * 0.5, // Dalga hızı
    colorVariation: Math.random() > 0.5 // Renk varyasyonu için
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
  waveSize: number
  waveSpeed: number
  colorVariation: boolean
}

export default function CodeBackground() {
  const [mounted, setMounted] = useState(false);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

  useEffect(() => {
    setMounted(true);
    setSnippets(getRandomSnippets(20)); // Daha fazla kod bloğu

    // Periyodik olarak yeni snippetler ekle/çıkar
    const interval = setInterval(() => {
      setSnippets(prevSnippets => {
        // Rastgele 3 snippeti kaldır
        const remainingSnippets = [...prevSnippets];
        for (let i = 0; i < 3; i++) {
          if (remainingSnippets.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingSnippets.length);
            remainingSnippets.splice(randomIndex, 1);
          }
        }
        
        // 3 yeni snippet ekle
        return [...remainingSnippets, ...getRandomSnippets(3)];
      });
    }, 6000); // Her 6 saniyede bir

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      {snippets.map((snippet, index) => (
        <pre
          key={index}
          className={`code-snippet font-mono text-sm absolute pointer-events-none shadow-sm ${snippet.colorVariation ? 'text-primary-700' : 'text-accent-700'}`}
          style={{
            top: `${snippet.y}%`,
            left: `${snippet.x}%`,
            transform: `rotate(${snippet.rotation}deg) scale(${snippet.scale})`,
            opacity: snippet.opacity,
            maxWidth: "350px", 
            whiteSpace: "pre-wrap",
            zIndex: -5, // Diğer içeriklerden daha arkada
            animation: `float-${index} ${snippet.animationDuration}s infinite ease-in-out ${snippet.animationDelay}s`,
          }}
        >
          {snippet.code}
        </pre>
      ))}

      {/* Stilizasyonu ayrı bir öğede tutarak tekrarı önleme */}
      <style jsx global>{`
        ${snippets.map((snippet, index) => `
          @keyframes float-${index} {
            0% {
              transform: translate(0, 0) rotate(${snippet.rotation}deg) scale(${snippet.scale});
            }
            25% {
              transform: translate(${snippet.waveSize * 0.5}px, ${snippet.waveSize * 0.8}px) rotate(${snippet.rotation + 0.5}deg) scale(${snippet.scale + 0.02});
            }
            50% {
              transform: translate(${snippet.waveSize}px, ${-snippet.waveSize * 0.5}px) rotate(${snippet.rotation + 1}deg) scale(${snippet.scale + 0.05});
            }
            75% {
              transform: translate(${-snippet.waveSize * 0.8}px, ${-snippet.waveSize * 0.8}px) rotate(${snippet.rotation + 0.5}deg) scale(${snippet.scale + 0.03});
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
