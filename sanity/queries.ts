import { client } from './lib/client'
import { groq } from 'next-sanity'

export async function getMenuItems() {
  const query = `*[_type == "menuItem" && isActive == true] | order(order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    image,
    "category": category->{
      _id,
      title,
      "slug": slug.current
    }
  }`
  return client.fetch(query)
}

export async function getCategories() {
  const query = `*[_type == "category"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    image
  }`
  return client.fetch(query)
}

export async function getMenuItemsByCategory(slug: string) {
  const query = `{
    "category": *[_type == "category" && slug.current == $slug][0] { title, image },
    "items": *[_type == "menuItem" && isActive == true && category->slug.current == $slug] | order(order asc, name asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      image
    }
  }`
  return client.fetch(query, { slug })
}

export async function getBranches() {
  const query = `*[_type == "branch" && isActive == true] | order(name asc) {
    _id,
    name,
    location,
    phone,
    address
  }`
  return client.fetch(query)
}

export async function getDeliveryPrices() {
  const query = `*[_type == "deliveryPrice"] | order(order asc, area asc) {
    _id,
    area,
    price,
    bookingPrice
  }`
  return client.fetch(query)
}

export async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0] {
    phone,
    email,
    location,
    workingHoursWeekdays,
    workingHoursFriday,
    instagramUrl,
    facebookUrl,
    heroSubtitle,
    heroTitle,
    heroDescription
  }`
  return client.fetch(query)
}
