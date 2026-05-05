import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { MenuSection } from "@/components/menu-section"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"
import { getMenuItems, getCategories } from "@/sanity/queries"

export default async function Home() {
  const [items, categories] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ])

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <MenuSection items={items} categories={categories} />
      <AboutSection />
      <Footer />
    </main>
  )
}
