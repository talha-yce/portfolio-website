"use client"

import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { getUserData } from "@/lib/user"
import { useEffect, useState } from "react"

export default function AboutPageClient() {
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserData()
      setUserData(data)
    }

    fetchData()
  }, [])

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-6">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-purple-900/40 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Talha Yüce"
              width={400}
              height={400}
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
              Contact
            </h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-purple-300">Email:</span>
                <a
                  href="mailto:yucetalha00@gmail.com"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  yucetalha00@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-purple-300">Phone:</span>
                <a href="tel:+905385507019" className="text-gray-400 hover:text-purple-400 transition-colors">
                  +90 538 550 7019
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-purple-300">Location:</span>
                <span className="text-gray-400">Mersin, Turkey</span>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
              Languages
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-300">Turkish</span>
                <span className="text-gray-400">Native</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">English</span>
                <span className="text-gray-400">A2</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
              Profiles
            </h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-purple-300">GitHub:</span>
                <a
                  href="https://github.com/talha-yce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  github.com/talha-yce
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-purple-300">LinkedIn:</span>
                <a
                  href="https://www.linkedin.com/in/talha-yüce/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  linkedin.com/in/talha-yüce
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
              Talha Yüce
            </h1>
            <p className="mt-2 text-xl text-gray-400">Software Engineer</p>
            <p className="mt-4 text-gray-300">
              I am a software engineering student at Firat University with a passion for web development, game
              development, and AI applications. I have experience with various programming languages and frameworks, and
              I am always eager to learn new technologies.
            </p>
          </div>

          <Tabs defaultValue="education" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-purple-900/40">
              <TabsTrigger
                value="education"
                className="data-[state=active]:bg-purple-950/40 data-[state=active]:text-purple-300"
              >
                Education
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="data-[state=active]:bg-purple-950/40 data-[state=active]:text-purple-300"
              >
                Experience
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="data-[state=active]:bg-purple-950/40 data-[state=active]:text-purple-300"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="certifications"
                className="data-[state=active]:bg-purple-950/40 data-[state=active]:text-purple-300"
              >
                Certifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="education" className="mt-6 space-y-4">
              <Card className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-300">Software Engineering</CardTitle>
                  <CardDescription className="text-gray-400">Firat University | 2021 - Present</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Currently pursuing a degree in Software Engineering at Firat University, Elazig, Turkey.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="mt-6 space-y-4">
              <Card className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-300">Unity Game Development Internship</CardTitle>
                  <CardDescription className="text-gray-400">
                    İnosens Bilişim Teknolojileri | July 2024 - September 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Worked on Unity game development projects, including a 3D game prototype for physical therapy
                    patients and a snowboard racing game.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="mt-6 space-y-6">
              <div>
                <h3 className="mb-2 font-semibold text-purple-300">Programming Languages</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">Java</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">Python</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">C#</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">JavaScript</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">HTML</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">CSS</Badge>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-purple-300">Web Development</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">HTML</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">JavaScript</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">CSS</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">ASP.NET</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">Web API</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">React</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">React Native</Badge>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-purple-300">Databases</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">MySQL</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">MS SQL</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">MongoDB</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">Firebase</Badge>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-purple-300">Tools & Environments</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">Visual Studio</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">Unity</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">Visual Studio Code</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">Git</Badge>
                  <Badge className="border-green-600/40 bg-green-950/20 text-green-400">GitHub</Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="mt-6 space-y-4">
              <Card className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-300">Unity Game Development</CardTitle>
                  <CardDescription className="text-gray-400">Udemy | July 2023 - September 2023</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-300">Version Control: Git and GitHub</CardTitle>
                  <CardDescription className="text-gray-400">
                    BTK Akademi | August 2023 - September 2023
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-300">Unity Digital Game Development</CardTitle>
                  <CardDescription className="text-gray-400">BTK Akademi | August 2023 - October 2023</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-300">Web Development</CardTitle>
                  <CardDescription className="text-gray-400">BTK Akademi | January 2024 - Present</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-300">Programming Design Patterns for Unity</CardTitle>
                  <CardDescription className="text-gray-400">Udemy | June 2024</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

