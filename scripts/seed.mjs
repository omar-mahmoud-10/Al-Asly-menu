import { createClient } from '@sanity/client'
import { config } from 'dotenv'
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function seed() {
  console.log('🌱 Seeding Sanity dataset with restaurant menu...\n')

  // ── Clean up old data ──
  console.log('  🗑️  Cleaning up old data...')
  const oldItems = await client.fetch('*[_type == "menuItem"]._id')
  const oldCategories = await client.fetch('*[_type == "category"]._id')
  
  if (oldItems.length > 0) {
    const tx = client.transaction()
    for (const id of oldItems) tx.delete(id)
    await tx.commit()
    console.log(`  🗑️  Deleted ${oldItems.length} old menu items`)
  }
  if (oldCategories.length > 0) {
    const tx = client.transaction()
    for (const id of oldCategories) tx.delete(id)
    await tx.commit()
    console.log(`  🗑️  Deleted ${oldCategories.length} old categories`)
  }

  // ── Categories ──
  const categories = [
    { id: 'cat-grills', title: 'مشويات الأصلي', slug: 'grills', order: 1 },
    { id: 'cat-kitchen', title: 'مطبخ الأصلي', slug: 'kitchen', order: 2 },
    { id: 'cat-meals', title: 'وجبات الأصلي', slug: 'meals', order: 3 },
    { id: 'cat-third-meals', title: 'وجبات الثلث', slug: 'third-meals', order: 4 },
    { id: 'cat-sandwiches', title: 'سندوتشات الأصلي', slug: 'sandwiches', order: 5 },
    { id: 'cat-large-trays', title: 'صواني الأصلي الكبيرة', slug: 'large-trays', order: 6 },
    { id: 'cat-tray-offers', title: 'عروض الصواني', slug: 'tray-offers', order: 7 },
  ]

  const createdCategories = {}
  for (const cat of categories) {
    const doc = await client.createIfNotExists({
      _id: cat.id,
      _type: 'category',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      order: cat.order,
    })
    createdCategories[cat.id] = doc._id
    console.log(`  ✅ Category: ${cat.title}`)
  }

  // ── Menu Items ──
  const items = [
    // ─── مشويات الأصلي ───
    { name: 'كيلو ريش', price: 1050, category: 'cat-grills', order: 1 },
    { name: 'كيلو كباب', price: 1000, category: 'cat-grills', order: 2 },
    { name: 'استك مشوي', price: 1000, category: 'cat-grills', order: 3 },
    { name: 'كيلو نيفا', price: 1000, category: 'cat-grills', order: 4 },
    { name: 'كيلو مشكل', price: 800, category: 'cat-grills', order: 5 },
    { name: 'كيلو كبدة', price: 800, category: 'cat-grills', order: 6 },
    { name: 'كيلو مخاصي', price: 600, category: 'cat-grills', order: 7 },
    { name: 'كيلو طرب', price: 540, category: 'cat-grills', order: 8 },
    { name: 'كيلو كفتة ضاني', price: 540, category: 'cat-grills', order: 9 },
    { name: 'كيلو سجق ضاني', price: 440, category: 'cat-grills', order: 10 },
    { name: 'كيلو كفتة عجالي', price: 390, category: 'cat-grills', order: 11 },
    { name: 'رقبة تركي', price: 400, category: 'cat-grills', order: 12 },
    { name: 'موزة تركي', price: 400, category: 'cat-grills', order: 13 },
    { name: 'موزة', price: 400, category: 'cat-grills', order: 14 },
    { name: 'موزة بالفتة', price: 440, category: 'cat-grills', order: 15 },
    { name: 'فرخة شيش', price: 310, category: 'cat-grills', order: 16 },
    { name: 'فرخة شواية', price: 320, category: 'cat-grills', order: 17 },
    { name: 'جوز حمام', price: 350, category: 'cat-grills', order: 18 },
    { name: 'كيلو ممبار', price: 320, category: 'cat-grills', order: 19 },
    { name: 'كيلو شيش طاووق', price: 420, category: 'cat-grills', order: 20 },

    // ─── مطبخ الأصلي ───
    { name: 'طاجن فواكه الأصلي', price: 220, category: 'cat-kitchen', order: 1 },
    { name: 'ورقة كبدة', price: 220, category: 'cat-kitchen', order: 2 },
    { name: 'ورقة لحمة', price: 220, category: 'cat-kitchen', order: 3 },
    { name: 'طاجن خضار باللحمة', price: 220, category: 'cat-kitchen', order: 4 },
    { name: 'طاجن عكاوي بالبصل', price: 220, category: 'cat-kitchen', order: 5 },
    { name: 'طاجن كوارع ورق عنب', price: 220, category: 'cat-kitchen', order: 6 },
    { name: 'حمام كذاب', price: 115, category: 'cat-kitchen', order: 7 },
    { name: 'مكرونة بشاميل', price: 40, category: 'cat-kitchen', order: 8 },
    { name: 'أرز بسمتي', price: 35, category: 'cat-kitchen', order: 9 },
    { name: 'أرز بالخلطة', price: 35, category: 'cat-kitchen', order: 10 },
    { name: 'مكرونة اسباكتي', price: 50, category: 'cat-kitchen', order: 11 },
    { name: 'أرز كبير', price: 70, category: 'cat-kitchen', order: 12 },
    { name: 'أرز معمر باللحمة', price: 130, category: 'cat-kitchen', order: 13 },
    { name: 'أرز معمر', price: 35, category: 'cat-kitchen', order: 14 },
    { name: 'محشي مشكل', price: 60, category: 'cat-kitchen', order: 15 },
    { name: 'محشي ورق عنب', price: 60, category: 'cat-kitchen', order: 16 },
    { name: 'خضار اليوم سادة', price: 30, category: 'cat-kitchen', order: 17 },
    { name: 'شوربة لسان عصفور', price: 25, category: 'cat-kitchen', order: 18 },
    { name: 'ملوخية', price: 25, category: 'cat-kitchen', order: 19 },
    { name: 'شوربة كوارع', price: 60, category: 'cat-kitchen', order: 20 },
    { name: 'فتة', price: 50, category: 'cat-kitchen', order: 21 },

    // ─── وجبات الأصلي ───
    { name: '1/4 فرخة + 1/4 كفتة + أرز', price: 215, category: 'cat-meals', order: 1 },
    { name: '1/4 فرخة + 1/8 كفتة + أرز', price: 165, category: 'cat-meals', order: 2 },
    { name: 'حمام كذاب + 1/8 كفتة', price: 165, category: 'cat-meals', order: 3 },
    { name: 'حمام + 1/4 مشكل', price: 375, category: 'cat-meals', order: 4 },
    { name: 'وجبة ميكس (1/4 مشكل + 1/4 فرخة)', price: 280, category: 'cat-meals', order: 5 },
    { name: '1/4 شيش طاووق + 1/4 كفتة + أرز', price: 240, category: 'cat-meals', order: 6 },
    { name: '1/4 شيش طاووق + 1/8 كفتة + أرز', price: 190, category: 'cat-meals', order: 7 },
    { name: 'وجبة ميكس (1/4 شيش طاووق + 1/4 مشكل)', price: 305, category: 'cat-meals', order: 8 },
    { name: 'وجبة ميكس (1/4 شيش طاووق + حمامة)', price: 280, category: 'cat-meals', order: 9 },

    // ─── وجبات الثلث ───
    { name: 'ثلث ريش', price: 395, category: 'cat-third-meals', order: 1 },
    { name: 'ثلث كباب', price: 375, category: 'cat-third-meals', order: 2 },
    { name: 'ثلث نيفا', price: 375, category: 'cat-third-meals', order: 3 },
    { name: 'ثلث مشكل', price: 320, category: 'cat-third-meals', order: 4 },
    { name: 'ثلث كفتة ضاني', price: 205, category: 'cat-third-meals', order: 5 },
    { name: 'ثلث كفتة عجالي', price: 145, category: 'cat-third-meals', order: 6 },
    { name: 'ثلث طرب', price: 205, category: 'cat-third-meals', order: 7 },
    { name: 'ثلث سجق', price: 165, category: 'cat-third-meals', order: 8 },
    { name: 'ثلث شيش طاووق', price: 160, category: 'cat-third-meals', order: 9 },
    { name: 'ثلث كبدة', price: 300, category: 'cat-third-meals', order: 10 },
    { name: 'ثلث استيك', price: 375, category: 'cat-third-meals', order: 11 },
    { name: 'ثلث ممبار', price: 120, category: 'cat-third-meals', order: 12 },

    // ─── سندوتشات الأصلي ───
    { name: 'سندوتش كباب', price: 80, category: 'cat-sandwiches', order: 1 },
    { name: 'سندوتش كفتة', price: 30, category: 'cat-sandwiches', order: 2 },
    { name: 'سندوتش كبدة', price: 50, category: 'cat-sandwiches', order: 3 },
    { name: 'سندوتش كفتة ضاني', price: 35, category: 'cat-sandwiches', order: 4 },
    { name: 'سندوتش طرب', price: 60, category: 'cat-sandwiches', order: 5 },
    { name: 'سندوتش شيش طاووق', price: 50, category: 'cat-sandwiches', order: 6 },
    { name: 'حواوشي ضاني', price: 40, category: 'cat-sandwiches', order: 7 },
    { name: 'حواوشي مخصوص', price: 30, category: 'cat-sandwiches', order: 8 },

    // ─── صواني الأصلي الكبيرة ───
    {
      name: 'صنية الأصلي (5 أفراد)',
      price: 1865,
      category: 'cat-large-trays',
      order: 1,
      description: '1/3 كفتة ضاني + 1/2 كباب • 1/4 سجق ضاني + 1/4 ممبار • محاشي مشكل + 1/2 ريش • طاجن كوارع ورق عنب + 3 أرز بسمتي',
    },
    {
      name: 'صنية الملوك (7 أفراد)',
      price: 1825,
      category: 'cat-large-trays',
      order: 2,
      description: '1/2 شيش طاووق + 3/4 مشكل • 1/2 سجق ضاني + 3/4 فرخة • محاشي مشكل + 1/3 ممبار • 4 أرز بسمتي + 1/4 كبدة',
    },
    {
      name: 'صنية الأكيلة (4 أفراد)',
      price: 1415,
      category: 'cat-large-trays',
      order: 3,
      description: '1/2 مشكل + 1/2 فرخة • 1/2 كفتة + 1/4 استيك • 1/4 سجق ضاني + 1/4 ممبار • محاشي مشكل + 3 أرز بسمتي',
    },
    {
      name: 'صنية البهجة (6 أفراد)',
      price: 2210,
      category: 'cat-large-trays',
      order: 4,
      description: '1/3 كفتة ضاني + 1/3 ريش • 1/4 سجق ضاني + 1/3 كباب • 1/2 شيش طاووق + 1/3 نيفا • محاشي مشكل + 1/4 كبدة • 4 أرز بسمتي + 1/4 ممبار',
    },
    {
      name: 'صنية العائلة (5 أفراد)',
      price: 1185,
      category: 'cat-large-trays',
      order: 5,
      description: '3/4 كفتة ضاني + 1/4 ممبار • 1/3 سجق ضاني + فرخة • محاشي مشكل + 3 أرز بسمتي',
    },
    {
      name: 'صنية ليلة العمر (زوجي)',
      price: 1705,
      category: 'cat-large-trays',
      order: 6,
      description: '1/4 سجق ضاني + 4 حمام • محاشي مشكل + 1/2 مشكل • 4 أرز بسمتي + 1/4 ممبار • 1/2 فرخة',
    },

    // ─── عروض الصواني ───
    {
      name: 'صنية 1',
      price: 1290,
      category: 'cat-tray-offers',
      order: 1,
      description: 'فرخة + 1/4 ممبار + 1/4 سجق + 1/4 كفتة + 1/2 بسمتي + 1/2 كباب',
    },
    {
      name: 'صنية 2',
      price: 2380,
      category: 'cat-tray-offers',
      order: 2,
      description: '1 كيلو كباب + كيلو كفتة ضاني + 1/2 سجق + 1/2 طرب + 1/2 ممبار + 1/2 بسمتي',
    },
    {
      name: 'صنية 3',
      price: 1150,
      category: 'cat-tray-offers',
      order: 3,
      description: '3/4 فراخ + 3/4 كفتة + 1/2 ممبار + 1/2 سجق + 1/2 بسمتي + 1 محاشي',
    },
    {
      name: 'صنية 4',
      price: 1420,
      category: 'cat-tray-offers',
      order: 4,
      description: '1/2 كباب + 3/4 ضاني + 1/4 سجق + 1/4 طرب + 1/4 ممبار + 1/2 بسمتي',
    },
    {
      name: 'صنية 5',
      price: 1400,
      category: 'cat-tray-offers',
      order: 5,
      description: 'فرخة ونص + 1/2 كفتة + 1/2 طرب + 1/2 سجق + 1/2 بسمتي + 1 محاشي',
    },
    {
      name: 'صنية 6',
      price: 1090,
      category: 'cat-tray-offers',
      order: 6,
      description: '1/2 فرخة + 1/2 كفتة + 1/2 طرب + 1/2 سجق + 1/2 بسمتي + 1 محاشي',
    },
  ]

  for (const item of items) {
    const id = `item-${item.category.replace('cat-', '')}-${String(item.order).padStart(2, '0')}`
    const slug = item.name.replace(/\s+/g, '-').replace(/[/+]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
    await client.createIfNotExists({
      _id: id,
      _type: 'menuItem',
      name: item.name,
      slug: { _type: 'slug', current: slug },
      price: item.price,
      description: item.description || '',
      category: { _type: 'reference', _ref: createdCategories[item.category] },
      isActive: true,
      order: item.order,
    })
    console.log(`  ✅ ${item.name} — ${item.price} جنيه`)
  }

  console.log('\n✅ Seeding complete! All menu data added to Sanity.')
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
