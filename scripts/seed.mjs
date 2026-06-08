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
    { id: 'cat-third-meals', title: 'وجبات التلت', slug: 'third-meals', order: 4 },
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
  const weightGroups = [
    { baseName: 'ريش', kiloPrice: 990, items: [
      { name: 'كيلو ريش', price: 990 }, { name: 'نصف كيلو ريش', price: 495 }, { name: 'ربع كيلو ريش', price: 248 },
    ]},
    { baseName: 'كباب', kiloPrice: 950, items: [
      { name: 'كيلو كباب', price: 950 }, { name: 'نصف كيلو كباب', price: 475 }, { name: 'ربع كيلو كباب', price: 238 },
    ]},
    { baseName: 'استيك', kiloPrice: 950, items: [
      { name: 'استيك مشوي', price: 950 }, { name: 'نصف استيك', price: 475 }, { name: 'ربع استيك', price: 238 },
    ]},
    { baseName: 'نيفا', kiloPrice: 950, items: [
      { name: 'كيلو نيفا', price: 950 }, { name: 'نصف كيلو نيفا', price: 475 }, { name: 'ربع كيلو نيفا', price: 238 },
    ]},
    { baseName: 'مشكل', kiloPrice: 740, items: [
      { name: 'كيلو مشكل', price: 740 }, { name: 'نصف كيلو مشكل', price: 370 }, { name: 'ربع كيلو مشكل', price: 185 },
    ]},
    { baseName: 'كبدة', kiloPrice: 800, items: [
      { name: 'كيلو كبدة', price: 800 }, { name: 'نصف كيلو كبدة', price: 400 }, { name: 'ربع كيلو كبدة', price: 200 },
    ]},
    { baseName: 'مخاصي', kiloPrice: 600, items: [
      { name: 'كيلو مخاصي', price: 600 }, { name: 'نصف كيلو مخاصي', price: 300 }, { name: 'ربع كيلو مخاصي', price: 150 },
    ]},
    { baseName: 'طرب', kiloPrice: 500, items: [
      { name: 'كيلو طرب', price: 500 }, { name: 'نصف كيلو طرب', price: 250 }, { name: 'ربع كيلو طرب', price: 125 },
    ]},
    { baseName: 'كفتة ضاني', kiloPrice: 500, items: [
      { name: 'كيلو كفتة ضاني', price: 500 }, { name: 'نصف كيلو كفتة ضاني', price: 250 }, { name: 'ربع كيلو كفتة ضاني', price: 125 },
    ]},
    { baseName: 'سجق ضاني', kiloPrice: 400, items: [
      { name: 'كيلو سجق ضاني', price: 400 }, { name: 'نصف كيلو سجق ضاني', price: 200 }, { name: 'ربع كيلو سجق ضاني', price: 100 },
    ]},
    { baseName: 'كفتة عجالي', kiloPrice: 350, items: [
      { name: 'كيلو كفتة عجالي', price: 350 }, { name: 'نصف كيلو كفتة عجالي', price: 175 }, { name: 'ربع كيلو كفتة عجالي', price: 88 },
    ]},
    { baseName: 'ممبار', kiloPrice: 300, items: [
      { name: 'كيلو ممبار', price: 300 }, { name: 'نصف كيلو ممبار', price: 150 }, { name: 'ربع كيلو ممبار', price: 75 },
    ]},
    { baseName: 'شيش طاووق', kiloPrice: 400, items: [
      { name: 'كيلو شيش طاووق', price: 400 }, { name: 'نصف كيلو شيش طاووق', price: 200 }, { name: 'ربع كيلو شيش طاووق', price: 100 },
    ]},
  ]

  const standaloneGrills = [
    { name: 'رقبة تركي', price: 380, order: 101 },
    { name: 'موزة تركي', price: 380, order: 102 },
    { name: 'موزة', price: 380, order: 103 },
    { name: 'موزة بالفتة', price: 400, order: 104 },
    { name: 'فرخة شيش', price: 300, order: 105 },
    { name: 'فرخة شواية', price: 320, order: 106 },
    { name: 'جوز حمام', price: 350, order: 107 },
  ]

  const items = [
    // ─── مشويات الأصلي (weight groups) ───
    ...weightGroups.flatMap((group, gi) =>
      group.items.map((item, wi) => ({
        name: item.name,
        price: item.price,
        category: 'cat-grills',
        order: gi * 10 + wi + 1,
        group: group.baseName,
      }))
    ),
    // ─── مشويات الأصلي (standalone) ───
    ...standaloneGrills.map(item => ({ ...item, category: 'cat-grills' })),

    // ─── مطبخ الأصلي ───
    { name: 'طاجن فواكه الأصلي', price: 200, category: 'cat-kitchen', order: 1 },
    { name: 'ورقة كبدة', price: 200, category: 'cat-kitchen', order: 2 },
    { name: 'ورقة لحمة', price: 200, category: 'cat-kitchen', order: 3 },
    { name: 'طاجن خضار باللحمة', price: 200, category: 'cat-kitchen', order: 4 },
    { name: 'طاجن عكاوي بالبصل', price: 200, category: 'cat-kitchen', order: 5 },
    { name: 'طاجن كوارع ورق عنب', price: 200, category: 'cat-kitchen', order: 6 },
    { name: 'حمام كذاب', price: 110, category: 'cat-kitchen', order: 7 },
    { name: 'مكرونة بشاميل', price: 35, category: 'cat-kitchen', order: 8 },
    { name: 'أرز بسمتي', price: 30, category: 'cat-kitchen', order: 9 },
    { name: 'أرز بالخلطة', price: 30, category: 'cat-kitchen', order: 10 },
    { name: 'مكرونة اسباكتي', price: 50, category: 'cat-kitchen', order: 11 },
    { name: 'أرز كبير', price: 60, category: 'cat-kitchen', order: 12 },
    { name: 'أرز معمر باللحمة', price: 120, category: 'cat-kitchen', order: 13 },
    { name: 'أرز معمر', price: 35, category: 'cat-kitchen', order: 14 },
    { name: 'محشي مشكل', price: 50, category: 'cat-kitchen', order: 15 },
    { name: 'محشي ورق عنب', price: 50, category: 'cat-kitchen', order: 16 },
    { name: 'خضار اليوم سادة', price: 25, category: 'cat-kitchen', order: 17 },
    { name: 'شوربة لسان عصفور', price: 20, category: 'cat-kitchen', order: 18 },
    { name: 'ملوخية', price: 25, category: 'cat-kitchen', order: 19 },
    { name: 'شوربة كوارع', price: 60, category: 'cat-kitchen', order: 20 },
    { name: 'فتة', price: 40, category: 'cat-kitchen', order: 21 },

    // ─── وجبات الأصلي ───
    { name: '1/4 فرخة + 1/4 كفتة + أرز', price: 195, category: 'cat-meals', order: 1 },
    { name: '1/4 فرخة + 1/8 كفتة + أرز', price: 150, category: 'cat-meals', order: 2 },
    { name: 'حمام كذاب + 1/8 كفتة', price: 150, category: 'cat-meals', order: 3 },
    { name: 'حمام + 1/4 مشكل', price: 335, category: 'cat-meals', order: 4 },
    { name: 'وجبة ميكس (1/4 مشكل + 1/4 فرخة)', price: 265, category: 'cat-meals', order: 5 },
    { name: '1/4 شيش طاووق + 1/4 كفتة + أرز', price: 220, category: 'cat-meals', order: 6 },
    { name: '1/4 شيش طاووق + 1/8 كفتة + أرز', price: 180, category: 'cat-meals', order: 7 },
    { name: 'وجبة ميكس (1/4 شيش طاووق + 1/4 مشكل)', price: 280, category: 'cat-meals', order: 8 },
    { name: 'وجبة ميكس (1/4 شيش طاووق + حمامة)', price: 275, category: 'cat-meals', order: 9 },

    // ─── وجبات التلت ───
    { name: 'تلت ريش', price: 370, category: 'cat-third-meals', order: 1 },
    { name: 'تلت كباب', price: 370, category: 'cat-third-meals', order: 2 },
    { name: 'تلت نيفا', price: 370, category: 'cat-third-meals', order: 3 },
    { name: 'تلت مشكل', price: 300, category: 'cat-third-meals', order: 4 },
    { name: 'تلت كفتة ضاني', price: 200, category: 'cat-third-meals', order: 5 },
    { name: 'تلت كفتة عجالي', price: 130, category: 'cat-third-meals', order: 6 },
    { name: 'تلت طرب', price: 200, category: 'cat-third-meals', order: 7 },
    { name: 'تلت سجق', price: 150, category: 'cat-third-meals', order: 8 },
    { name: 'تلت شيش طاووق', price: 150, category: 'cat-third-meals', order: 9 },
    { name: 'تلت كبدة', price: 300, category: 'cat-third-meals', order: 10 },
    { name: 'تلت استيك', price: 360, category: 'cat-third-meals', order: 11 },
    { name: 'تلت ممبار', price: 110, category: 'cat-third-meals', order: 12 },

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
      price: 1740,
      category: 'cat-large-trays',
      order: 1,
      description: '1/3 كفتة ضاني • 1/2 كباب • 1/4 سجق ضاني • 1/4 ممبار • محاشي مشكل • 1/2 ريش • طاجن كوارع بورق العنب • 3 أرز بسمتي',
    },
    {
      name: 'صنية الأكيلة (4 أفراد)',
      price: 1320,
      category: 'cat-large-trays',
      order: 2,
      description: '1/2 مشكل • 1/2 فرخة • 1/2 كفتة • 1/4 استيك • 1/4 سجق ضاني • 1/4 ممبار • محاشي مشكل • 3 أرز بسمتي',
    },
    {
      name: 'صنية العائلة (5 أفراد)',
      price: 1090,
      category: 'cat-large-trays',
      order: 3,
      description: '3/4 كفتة ضاني • 1/4 ممبار • 1/3 سجق ضاني • فرخة • محاشي مشكل • 3 أرز بسمتي',
    },
    {
      name: 'صنية الملوك (7 أفراد)',
      price: 1830,
      category: 'cat-large-trays',
      order: 4,
      description: '1/2 شيش طاووق • 3/4 مشكل • 1/2 سجق ضاني • 3/4 فرخة • محاشي مشكل • 1/3 ممبار • 4 أرز بسمتي • 1/4 كبدة',
    },
    {
      name: 'صنية البهجة (6 أفراد)',
      price: 2085,
      category: 'cat-large-trays',
      order: 5,
      description: '1/3 كفتة ضاني • 1/3 ريش • 1/4 سجق ضاني • 1/3 كباب • 1/2 شيش طاووق • 1/3 نيفا • محاشي مشكل • 1/4 كبدة • 4 أرز بسمتي • 1/4 ممبار',
    },
    {
      name: 'صنية ليلة العمر (زوجي)',
      price: 1600,
      category: 'cat-large-trays',
      order: 6,
      description: '1/4 سجق ضاني • 4 حمام • محاشي مشكل • 1/2 مشكل • 4 أرز بسمتي • 1/4 ممبار • 1/2 فرخة',
    },

    // ─── عروض الصواني ───
    {
      name: 'صنية 1',
      price: 1245,
      category: 'cat-tray-offers',
      order: 1,
      description: 'فرخة + 1/4 ممبار + 1/4 سجق + 1/4 كفتة + 1/2 بسمتي + 1/2 كباب',
    },
    {
      name: 'صنية 2',
      price: 2240,
      category: 'cat-tray-offers',
      order: 2,
      description: '1 كيلو كباب + كيلو كفتة ضاني + 1/2 سجق + 1/2 طرب + 1/2 ممبار + 1/2 بسمتي',
    },
    {
      name: 'صنية 3',
      price: 1025,
      category: 'cat-tray-offers',
      order: 3,
      description: '3/4 فراخ + 3/4 كفتة + 1/2 ممبار + 1/2 سجق + 1/2 بسمتي + 1 محاشي',
    },
    {
      name: 'صنية 4',
      price: 1320,
      category: 'cat-tray-offers',
      order: 4,
      description: '1/2 كباب + 3/4 ضاني + 1/4 سجق + 1/4 طرب + 1/4 ممبار + 1/2 بسمتي',
    },
    {
      name: 'صنية 5',
      price: 1370,
      category: 'cat-tray-offers',
      order: 5,
      description: 'فرخة ونص + 1/2 كفتة + 1/2 طرب + 1/2 سجق + 1/2 بسمتي + 1 محاشي',
    },
    {
      name: 'صنية 6',
      price: 1000,
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
      ...(item.group ? { group: item.group } : {}),
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
