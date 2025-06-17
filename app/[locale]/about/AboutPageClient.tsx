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
import { SiteLayout } from "@/components/site-layout"
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"

interface AboutPageClientProps {
  userData: UserData
  dictionary: Dictionary
  locale: Locale
  params: { locale: Locale }
}

export default function AboutPageClient({ userData, dictionary, locale, params }: AboutPageClientProps) {
  return (
    <SiteLayout locale={locale} dictionary={dictionary}>
      <PageTransition>
      <div className="relative min-h-screen pb-12">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 via-background to-accent-50/30 pointer-events-none -z-10"></div>
        
        <div className="container py-12 relative z-10">
          {/* Modern Grid Layout */}
          <div className="grid gap-8 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr]">
            {/* Left Column - Profile */}
            <motion.div 
              className="flex flex-col gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Profile Card */}
              <Card className="overflow-hidden border bg-white/90 backdrop-blur-sm shadow-md">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={userData.profileImage || "/placeholder.svg?height=400&width=400"}
                    alt={userData.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <CardContent className="p-5">
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 pb-1">
                    {userData.name}
                  </h1>
                  <p className="text-muted-foreground">{userData.title}</p>
                </CardContent>
              </Card>
              
              {/* Contact Info Card */}
              <Card className="border bg-white/90 backdrop-blur-sm shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-primary-600">
                    {dictionary.about.contact}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary-500" />
                    <a href={`mailto:${userData.email}`} className="text-muted-foreground hover:text-primary-600 transition-colors">
                      {userData.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary-500" />
                    <a href={`tel:${userData.phone}`} className="text-muted-foreground hover:text-primary-600 transition-colors">
                      {userData.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary-500" />
                    <span className="text-muted-foreground">{userData.location}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Languages Card */}
              <Card className="border bg-white/90 backdrop-blur-sm shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-primary-600">
                    {dictionary.about.languages}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userData.languages.map((language) => (
                    <div key={language.name} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">{language.name}</span>
                        <span className="text-muted-foreground">{language.level}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-primary-400 to-accent-400" 
                          style={{ 
                            width: language.level === 'Native' ? '100%' : 
                                 language.level === 'Fluent' ? '90%' : 
                                 language.level === 'Advanced' ? '80%' : 
                                 language.level === 'Intermediate' ? '60%' : '40%' 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Social Profiles */}
              <Card className="border bg-white/90 backdrop-blur-sm shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-primary-600">
                    {dictionary.about.profiles}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-primary-500" />
                    <a
                      href={userData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary-600 transition-colors"
                    >
                      {userData.github.replace("https://github.com/", "")}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-primary-500" />
                    <a
                      href={userData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary-600 transition-colors"
                    >
                      {userData.linkedin.replace("https://www.linkedin.com/in/", "")}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Right Column - Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Bio Section */}
              <Card className="border bg-white/90 backdrop-blur-sm shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary-600">Hakkımda</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{userData.bio}</p>
                </CardContent>
              </Card>

              {/* Tabs Section */}
              <Tabs defaultValue="education" className="w-full">
                <TabsList className="w-full grid grid-cols-4 bg-white/70 border rounded-lg p-1">
                  <TabsTrigger
                    value="education"
                    className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-600 rounded"
                  >
                    {dictionary.about.education}
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-600 rounded"
                  >
                    {dictionary.about.experience}
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-600 rounded"
                  >
                    {dictionary.about.skills}
                  </TabsTrigger>
                  <TabsTrigger
                    value="certifications"
                    className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-600 rounded"
                  >
                    {dictionary.about.certifications}
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="education" className="space-y-4">
                    {userData.education.map((edu, index) => (
                      <motion.div 
                        key={edu.institution}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card className="border bg-white/90 backdrop-blur-sm shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg text-primary-600">{edu.degree}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  {edu.institution}
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200">
                                {edu.date}
                              </Badge>
                            </div>
                          </CardHeader>
                          {edu.description && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{edu.description}</p>
                            </CardContent>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    {userData.experience.map((exp, index) => (
                      <motion.div 
                        key={exp.company + exp.date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card className="border bg-white/90 backdrop-blur-sm shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg text-primary-600">{exp.title}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  {exp.companyUrl ? (
                                    <a 
                                      href={exp.companyUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:text-primary-600 transition-colors underline"
                                    >
                                      {exp.company}
                                    </a>
                                  ) : (
                                    exp.company
                                  )}
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200">
                                {exp.date}
                              </Badge>
                            </div>
                          </CardHeader>
                          {exp.description && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{exp.description}</p>
                            </CardContent>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-6">
                    {userData.skills.map((skillGroup, groupIndex) => (
                      <motion.div 
                        key={skillGroup.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                        className="p-6 border rounded-lg bg-white/90 backdrop-blur-sm shadow-sm"
                      >
                        <h3 className="mb-3 font-medium text-xl text-primary-600">{skillGroup.category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {skillGroup.items.map((skill) => (
                            <Badge 
                              key={skill} 
                              className="bg-accent-100 text-accent-700 border-accent-200 hover:bg-accent-200 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="certifications" className="space-y-4">
                    {userData.certifications.map((cert, index) => (
                      <motion.div
                        key={cert.title + cert.issuer}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card className="border bg-white/90 backdrop-blur-sm shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg text-primary-600">{cert.title}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  {cert.issuer}
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200">
                                {cert.date}
                              </Badge>
                            </div>
                          </CardHeader>
                          {cert.description && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{cert.description}</p>
                            </CardContent>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
      </PageTransition>
    </SiteLayout>
  )
}

