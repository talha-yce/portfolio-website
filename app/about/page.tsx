import type { Metadata } from "next"
import AboutPageClient from "./AboutPageClient"

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Learn more about Talha Yüce, a software engineer specializing in web development, game development, and AI applications.",
}

export default async function AboutPage() {
  return <AboutPageClient />
}

