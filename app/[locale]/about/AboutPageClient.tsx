"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserData } from "@/lib/cv-manager"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/page-transition"

interface AboutPageClientProps {
  userData: UserData
  dictionary: Dictionary
  locale: Locale
  params: { locale: Locale }
}

export default function AboutPageClient({ userData, dictionary, locale, params }: AboutPageClientProps) {
  return (
    <PageTransition>
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-purple-900/40 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
              <Image
                src={userData.profileImage || "/placeholder.svg?height=400&width=400"}
                alt={userData.name}
                width={400}
                height={400}
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
                {dictionary.about.contact}
              </h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-purple-300">Email:</span>
                  <a href={`mailto:${userData.email}`} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {userData.email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-purple-300">{dictionary.about.contact}:</span>
                  <a href={`tel:${userData.phone}`} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {userData.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-purple-300">{dictionary.about.contact}:</span>
                  <span className="text-gray-400">{userData.location}</span>
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
                {dictionary.about.languages}
              </h2>
              <div className="space-y-2">
                {userData.languages.map((language) => (
                  <div key={language.name} className="flex justify-between">
                    <span className="text-purple-300">{language.name}</span>
                    <span className="text-gray-400">{language.level}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
                {dictionary.about.profiles}
              </h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-purple-300">GitHub:</span>
                  <a
                    href={userData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {userData.github.replace("https://github.com/", "")}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-purple-300">LinkedIn:</span>
                  <a
                    href={userData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {userData.linkedin.replace("https://www.linkedin.com/in/", "")}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
                {userData.name}
              </h1>
              <p className="mt-2 text-xl text-gray-400">{userData.title}</p>
              <p className="mt-4 text-gray-300">{userData.bio}</p>
            </div>

            <Tabs defaultValue="education" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-purple-900/40">
                <TabsTrigger
                  value="education"
                  className="data-[state=active]:bg-purple-950/40 data-[state=active]:text-purple-300"
                >
                  {dictionary.about.education}
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="data-[state=active]:bg-purple-950/40 data-[state=active]:text-purple-300"
                >
                  {dictionary.about.experience}
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="data-[state=active]:bg-purple-950/40 data-[state=active]:text-purple-300"
                >
                  {dictionary.about.skills}
                </TabsTrigger>
                <TabsTrigger
                  value="certifications"
                  className="data-[state=active]:bg-purple-950/40 data-[state=active]:text-purple-300"
                >
                  {dictionary.about.certifications}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="education" className="mt-6 space-y-4">
                {userData.education.map((edu) => (
                  <Card key={edu.institution} className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-purple-300">{edu.degree}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {edu.institution} | {edu.date}
                      </CardDescription>
                    </CardHeader>
                    {edu.description && (
                      <CardContent>
                        <p className="text-sm text-gray-400">{edu.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="experience" className="mt-6 space-y-4">
                {userData.experience.map((exp) => (
                  <Card key={exp.company + exp.date} className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-purple-300">{exp.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {exp.company} | {exp.date}
                      </CardDescription>
                    </CardHeader>
                    {exp.description && (
                      <CardContent>
                        <p className="text-sm text-gray-400">{exp.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="skills" className="mt-6 space-y-6">
                {userData.skills.map((skillGroup) => (
                  <div key={skillGroup.category}>
                    <h3 className="mb-2 font-semibold text-purple-300">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <Badge key={skill} className="border-green-600/40 bg-green-950/20 text-green-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="certifications" className="mt-6 space-y-4">
                {userData.certifications.map((cert) => (
                  <Card key={cert.title + cert.issuer} className="border-purple-900/40 bg-black/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-purple-300">{cert.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {cert.issuer} | {cert.date}
                      </CardDescription>
                    </CardHeader>
                    {cert.description && (
                      <CardContent>
                        <p className="text-sm text-gray-400">{cert.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

