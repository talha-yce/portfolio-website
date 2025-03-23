import path from "path"

const projectsDirectory = path.join(process.cwd(), "content/projects")

export interface Project {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  github?: string
  link?: string
  coverImage?: string
  content: string
}

export async function getAllProjects(): Promise<Project[]> {
  // For demo purposes, we'll return mock data
  // In a real implementation, this would read from the file system
  return [
    {
      slug: "sense-of-tunes",
      title: "Duygu Analizi ile Müzik Öneri Sistemi",
      description: "A web application that analyzes emotions in text and recommends music based on the analysis.",
      date: "October 2023 - January 2024",
      tags: ["ASP.NET Core", "C#", "Hugging Face API", "MongoDB"],
      github: "https://github.com/Sense-of-Tunes",
      coverImage: "/placeholder.svg?height=600&width=1200",
      content: `
        <h2>Project Overview</h2>
        <p>This project is a web application developed using ASP.NET Core (C#). Users can enter texts containing emotional expressions into the application, and emotion analysis is performed using artificial intelligence (Hugging Face API) and a custom filtering algorithm.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li>Text-based emotion analysis using Hugging Face API</li>
          <li>Custom filtering algorithm for improved accuracy</li>
          <li>Music recommendations based on emotional analysis</li>
          <li>MongoDB database integration for music data storage</li>
          <li>User-friendly interface for seamless interaction</li>
        </ul>
        
        <h2>Technical Implementation</h2>
        <p>The application uses ASP.NET Core for the backend, with C# as the primary programming language. The emotion analysis is performed using the Hugging Face API, which provides powerful natural language processing capabilities. The results are then filtered using a custom algorithm to improve accuracy.</p>
        
        <p>The music data is stored in a MongoDB database, which allows for flexible and scalable data storage. The application retrieves music recommendations based on the emotional analysis results and presents them to the user in an intuitive interface.</p>
      `,
    },
    {
      slug: "fly-rota",
      title: "Fly-rota",
      description: "A web application that visualizes flight traffic around the world in real-time.",
      date: "April 2024 - June 2024",
      tags: ["Web Development", "Real-time Data", "Visualization"],
      github: "https://github.com/fly-rota",
      coverImage: "/placeholder.svg?height=600&width=1200",
      content: `
        <h2>Project Overview</h2>
        <p>This project is a web application developed to visualize flight traffic around the world. Users can see the positions, altitudes, speeds, and routes of aircraft in real-time.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li>Real-time flight tracking and visualization</li>
          <li>Detailed aircraft information (position, altitude, speed, route)</li>
          <li>Interactive map interface for exploring flight data</li>
          <li>Data analysis and visualization tools</li>
          <li>User-friendly interface for seamless interaction</li>
        </ul>
        
        <h2>Technical Implementation</h2>
        <p>The application uses modern web technologies to provide a seamless and interactive experience. The flight data is retrieved from various sources and processed in real-time to provide accurate and up-to-date information.</p>
        
        <p>The visualization is implemented using advanced mapping and data visualization libraries, allowing users to explore the data in an intuitive and engaging way. The application also includes tools for analyzing and visualizing flight data, providing insights into flight patterns and trends.</p>
      `,
    },
    {
      slug: "moodbrew",
      title: "MoodBrew",
      description:
        "An AI-powered application for cafe businesses that provides beverage recommendations based on mood analysis.",
      date: "October 2024 - Present",
      tags: ["AI", "Mood Analysis", "Cafe Business"],
      github: "https://github.com/MoodBrew",
      coverImage: "/placeholder.svg?height=600&width=1200",
      content: `
        <h2>Project Overview</h2>
        <p>MoodBrew is an application designed for cafe businesses using AI-powered emotion analysis technology. The application aims to provide a better experience for customers by offering beverage recommendations based on their mood.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li>AI-powered emotion analysis</li>
          <li>Personalized beverage recommendations based on mood</li>
          <li>Analysis of average customer mood in the cafe</li>
          <li>Ambiance adjustment recommendations</li>
          <li>Music recommendations based on cafe atmosphere</li>
        </ul>
        
        <h2>Technical Implementation</h2>
        <p>The application uses advanced AI algorithms to analyze customer emotions and provide personalized beverage recommendations. The emotion analysis is performed using computer vision and natural language processing techniques, allowing the application to understand and respond to customer moods.</p>
        
        <p>The application also analyzes the average mood of customers in the cafe and provides recommendations for adjusting the ambiance and music to create a pleasant atmosphere. This helps cafe owners enhance the customer experience and increase satisfaction.</p>
      `,
    },
    {
      slug: "webtoon-mobile-app",
      title: "Webtoon Mobil Uygulama",
      description: "A mobile application that allows users to discover, read, and save their favorite webtoons.",
      date: "March 2024 - May 2024",
      tags: ["Mobile App", "React Native"],
      github: "https://github.com/talha-yce/Webtoon-Mobil-Uygulama",
      coverImage: "/placeholder.svg?height=600&width=1200",
      content: `
        <h2>Project Overview</h2>
        <p>DarkTon is a mobile application that allows users to discover, read, and save their favorite webtoons. With this application, you can easily follow webtoons and manage your favorites in your personal profile.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li>Discover and browse webtoons</li>
          <li>Read webtoons within the app</li>
          <li>Save favorite webtoons</li>
          <li>Personalized profile for managing favorites</li>
          <li>User-friendly interface for seamless interaction</li>
        </ul>
        
        <h2>Technical Implementation</h2>
        <p>The application is developed using React Native, allowing for cross-platform compatibility on both iOS and Android devices. The user interface is designed to be intuitive and engaging, providing a seamless reading experience.</p>
        
        <p>The application integrates with various webtoon sources to provide a wide selection of content. Users can browse, read, and save their favorite webtoons, with all data stored securely in the cloud for access across multiple devices.</p>
      `,
    },
    {
      slug: "ar-project",
      title: "AR Projesi",
      description: "An AR game project for children to make them more comfortable during flights.",
      date: "October 2024 - Present",
      tags: ["AR", "Unity", "Game Development"],
      github: "https://github.com/talha-yce/AR_Project",
      coverImage: "/placeholder.svg?height=600&width=1200",
      content: `
        <h2>Project Overview</h2>
        <p>An AR game project aimed at making children more comfortable during flights. The project uses augmented reality technology to create an engaging and distracting experience for children during air travel.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li>Augmented reality gameplay</li>
          <li>Child-friendly interface and content</li>
          <li>Engaging and distracting activities</li>
          <li>Designed specifically for air travel environment</li>
          <li>Educational and entertaining elements</li>
        </ul>
        
        <h2>Technical Implementation</h2>
        <p>The project is developed using Unity with AR Foundation, allowing for cross-platform AR experiences. The game is designed to be played on mobile devices, with a focus on creating an engaging and immersive experience that can distract children during flights.</p>
        
        <p>The AR technology allows the game to overlay virtual elements onto the real world, creating an interactive and engaging experience. The game includes various activities and challenges designed to keep children entertained and comfortable during air travel.</p>
      `,
    },
    {
      slug: "hang-gliding-game",
      title: "Hang Gliding Game",
      description: "A 3D game prototype developed with Unity for people undergoing physical therapy.",
      date: "July 2024 - August 2024",
      tags: ["Unity", "3D Game", "Physical Therapy"],
      coverImage: "/placeholder.svg?height=600&width=1200",
      content: `
        <h2>Project Overview</h2>
        <p>A 3D game prototype developed with Unity for people undergoing physical therapy. The game aims to help patients with their therapy by having them navigate through obstacles and pass through rings in a limited area using only direction keys.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li>3D hang gliding gameplay</li>
          <li>Obstacle avoidance challenges</li>
          <li>Ring passing objectives</li>
          <li>Simple controls using only direction keys</li>
          <li>Designed for physical therapy patients</li>
        </ul>
        
        <h2>Technical Implementation</h2>
        <p>The game is developed using Unity, with a focus on creating a simple yet engaging experience that can be played by people undergoing physical therapy. The controls are limited to direction keys, making it accessible for patients with limited mobility.</p>
        
        <p>The game features a 3D hang gliding experience, where players navigate through a limited area, avoiding obstacles and passing through rings. The challenges are designed to be engaging while also providing therapeutic benefits, helping patients with their recovery.</p>
      `,
    },
    {
      slug: "snowboard-race-game",
      title: "Snowboard Race Game",
      description: "A snowboard racing game prototype developed with Unity for people undergoing physical therapy.",
      date: "August 2024 - September 2024",
      tags: ["Unity", "Spline", "Racing Game", "Physical Therapy"],
      coverImage: "/placeholder.svg?height=600&width=1200",
      content: `
        <h2>Project Overview</h2>
        <p>A snowboard racing game prototype developed with Unity using spline for people undergoing physical therapy. The game aims to help patients with their therapy by having them race on a spline-created track, avoiding obstacles and trying to reach the finish line first against bots using only direction keys.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li>Snowboard racing gameplay</li>
          <li>Spline-created race tracks</li>
          <li>Obstacle avoidance challenges</li>
          <li>Racing against AI opponents</li>
          <li>Simple controls using only direction keys</li>
          <li>Designed for physical therapy patients</li>
        </ul>
        
        <h2>Technical Implementation</h2>
        <p>The game is developed using Unity with spline technology, allowing for the creation of smooth and dynamic race tracks. The controls are limited to direction keys, making it accessible for patients with limited mobility.</p>
        
        <p>The game features a snowboard racing experience, where players race against AI opponents on spline-created tracks, avoiding obstacles and trying to reach the finish line first. The challenges are designed to be engaging while also providing therapeutic benefits, helping patients with their recovery.</p>
      `,
    },
  ]
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getAllProjects()
  return projects.find((project) => project.slug === slug)
}

