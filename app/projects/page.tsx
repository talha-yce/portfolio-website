import type { Metadata } from "next"

import ProjectsClientPage from "./ProjectsClientPage"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of web development, game development, and AI projects.",
}

export default async function ProjectsPage() {
  return <ProjectsClientPage />
}

