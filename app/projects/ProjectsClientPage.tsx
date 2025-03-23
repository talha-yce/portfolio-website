"use client"

import { motion } from "framer-motion"

import { ProjectCard } from "@/components/project-card"
import { getAllProjects } from "@/lib/projects"

export default async function ProjectsClientPage() {
  const projects = await getAllProjects()

  return (
    <div className="container py-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
          Projects
        </h1>
        <p className="text-gray-400">
          A collection of my work in web development, game development, and AI applications.
        </p>
      </div>
      <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

