import path from "path"

const postsDirectory = path.join(process.cwd(), "content/blog")

export interface Post {
  slug: string
  title: string
  date: string
  formattedDate: string
  excerpt: string
  tags: string[]
  readingTime: number
  content: string
}

export async function getAllPosts(): Promise<Post[]> {
  // For demo purposes, we'll return mock data
  // In a real implementation, this would read from the file system
  return [
    {
      slug: "getting-started-with-nextjs",
      title: "Getting Started with Next.js",
      date: "2024-03-15",
      formattedDate: "March 15, 2024",
      excerpt: "Learn how to build modern web applications with Next.js, a React framework.",
      tags: ["Next.js", "React", "Web Development"],
      readingTime: 5,
      content: `
        <p>Next.js is a React framework that enables you to build server-side rendered and statically generated web applications. It provides a great developer experience with features like file-system routing, API routes, and built-in CSS support.</p>
        
        <h2>Why Next.js?</h2>
        <p>Next.js simplifies the development process by providing a structured framework for building React applications. It handles the complex configuration for you, allowing you to focus on building your application.</p>
        
        <h2>Getting Started</h2>
        <p>To create a new Next.js application, you can use the create-next-app command:</p>
        
        <pre><code>npx create-next-app@latest my-app</code></pre>
        
        <p>This will create a new Next.js application in the my-app directory with all the necessary configuration.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li>File-system based routing</li>
          <li>API routes for backend functionality</li>
          <li>Built-in CSS and Sass support</li>
          <li>Static site generation and server-side rendering</li>
          <li>Image optimization</li>
          <li>Fast refresh for instant feedback</li>
        </ul>
        
        <p>Next.js is a powerful framework that makes it easy to build modern web applications. Whether you're building a simple blog or a complex e-commerce site, Next.js provides the tools and features you need to succeed.</p>
      `,
    },
    {
      slug: "unity-game-development-basics",
      title: "Unity Game Development Basics",
      date: "2024-02-20",
      formattedDate: "February 20, 2024",
      excerpt: "An introduction to game development with Unity, covering the basics of the engine and C# scripting.",
      tags: ["Unity", "Game Development", "C#"],
      readingTime: 8,
      content: `
        <p>Unity is a powerful game engine that allows you to create 2D and 3D games for various platforms. In this article, we'll cover the basics of Unity game development, including the Unity interface, GameObjects, Components, and C# scripting.</p>
        
        <h2>The Unity Interface</h2>
        <p>The Unity interface consists of several windows, including the Scene view, Game view, Hierarchy, Project, and Inspector. The Scene view is where you build your game, the Game view shows what the player will see, the Hierarchy lists all the objects in your scene, the Project window shows all the assets in your project, and the Inspector shows the properties of the selected object.</p>
        
        <h2>GameObjects and Components</h2>
        <p>In Unity, everything in your game is a GameObject. GameObjects are containers that can hold Components, which define the behavior of the GameObject. For example, a GameObject might have a Transform component (which defines its position, rotation, and scale), a Renderer component (which makes it visible), and a Collider component (which allows it to interact with other objects).</p>
        
        <h2>C# Scripting</h2>
        <p>Unity uses C# as its primary scripting language. C# scripts are Components that you can attach to GameObjects to define their behavior. Here's a simple example of a C# script that moves a GameObject:</p>
        
        <pre><code>using UnityEngine;

public class Movement : MonoBehaviour
{
    public float speed = 5.0f;

    void Update()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");

        Vector3 movement = new Vector3(horizontal, 0, vertical) * speed * Time.deltaTime;
        transform.Translate(movement);
    }
}</code></pre>
        
        <p>This script moves the GameObject based on input from the horizontal and vertical axes (typically the arrow keys or WASD). The speed variable can be adjusted in the Inspector to control how fast the GameObject moves.</p>
        
        <h2>Building Your First Game</h2>
        <p>To build your first game in Unity, you'll need to create a new project, set up your scene, add GameObjects, attach Components, write scripts, and build the game for your target platform. Unity provides extensive documentation and tutorials to help you get started.</p>
        
        <p>Unity is a versatile engine that can be used to create a wide variety of games, from simple 2D platformers to complex 3D RPGs. With practice and experimentation, you'll be able to bring your game ideas to life.</p>
      `,
    },
    {
      slug: "introduction-to-ai-in-web-development",
      title: "Introduction to AI in Web Development",
      date: "2024-01-10",
      formattedDate: "January 10, 2024",
      excerpt: "Explore how artificial intelligence is transforming web development and creating new possibilities.",
      tags: ["AI", "Web Development", "Machine Learning"],
      readingTime: 6,
      content: `
        <p>Artificial Intelligence (AI) is revolutionizing web development, enabling developers to create more intelligent, personalized, and efficient web applications. In this article, we'll explore how AI is being used in web development and the tools and frameworks that make it possible.</p>
        
        <h2>AI-Powered Features</h2>
        <p>AI can enhance web applications with features like:</p>
        <ul>
          <li>Personalized content recommendations</li>
          <li>Intelligent search functionality</li>
          <li>Chatbots and virtual assistants</li>
          <li>Image and speech recognition</li>
          <li>Sentiment analysis</li>
        </ul>
        
        <h2>Tools and Frameworks</h2>
        <p>Several tools and frameworks make it easier to integrate AI into web applications:</p>
        <ul>
          <li>TensorFlow.js: A JavaScript library for training and deploying machine learning models in the browser</li>
          <li>Brain.js: A JavaScript neural network library</li>
          <li>Natural: A natural language processing library for Node.js</li>
          <li>OpenAI API: Provides access to powerful language models like GPT-4</li>
        </ul>
        
        <h2>Getting Started</h2>
        <p>To get started with AI in web development, you can use pre-trained models or train your own models using libraries like TensorFlow.js. Here's a simple example of using TensorFlow.js to classify images:</p>
        
        <pre><code>import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

async function classifyImage(imageElement) {
  const model = await mobilenet.load();
  const predictions = await model.classify(imageElement);
  return predictions;
}</code></pre>
        
        <p>This function loads a pre-trained MobileNet model and uses it to classify an image. The model returns an array of predictions, each containing a class name and a probability.</p>
        
        <h2>The Future of AI in Web Development</h2>
        <p>As AI technology continues to advance, we can expect to see even more innovative applications in web development. From more sophisticated chatbots to advanced personalization algorithms, AI will continue to transform the way we build and interact with web applications.</p>
        
        <p>By staying up-to-date with the latest AI tools and techniques, web developers can create more engaging, efficient, and personalized experiences for their users.</p>
      `,
    },
  ]
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts()
  return posts.find((post) => post.slug === slug)
}

