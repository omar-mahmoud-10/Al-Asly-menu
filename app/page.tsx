import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MenuSection } from "@/components/menu-section"
import { getMenuItems, getCategories } from "@/sanity/queries"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [items, categories] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <MenuSection items={items} categories={categories} />
      <Footer />
    </main>
  )
}
