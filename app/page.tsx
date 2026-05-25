import { Header } from "@/components/header"
import { MenuSection } from "@/components/menu-section"
import { getMenuItems, getCategories } from "@/sanity/queries"

export default async function Home() {
  const [items, categories] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <MenuSection items={items} categories={categories} />
    </main>
  )
}
