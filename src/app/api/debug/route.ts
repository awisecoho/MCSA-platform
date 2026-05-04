export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const courses     = await sql`SELECT count(*)::int as n FROM mcsa_courses`
    const modules     = await sql`SELECT count(*)::int as n FROM mcsa_modules`
    const withContent = await sql`SELECT count(*)::int as n FROM mcsa_modules WHERE content IS NOT NULL AND length(content) > 100`
    const resources   = await sql`SELECT count(*)::int as n FROM mcsa_resources`
    const resFree     = await sql`SELECT count(*)::int as n FROM mcsa_resources WHERE access_level = 'free'`
    const resMember   = await sql`SELECT count(*)::int as n FROM mcsa_resources WHERE access_level = 'member'`
    const resWithUrl  = await sql`SELECT count(*)::int as n FROM mcsa_resources WHERE url IS NOT NULL`
    const resCols     = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'mcsa_resources' ORDER BY ordinal_position`
    const resSample   = await sql`SELECT id, title, url, type, category, course_slug, access_level FROM mcsa_resources LIMIT 3`

    return NextResponse.json({
      courses: courses[0].n,
      modules: modules[0].n,
      modules_with_content: withContent[0].n,
      resources: resources[0].n,
      resources_free: resFree[0].n,
      resources_member: resMember[0].n,
      resources_with_url: resWithUrl[0].n,
      resource_columns: resCols.map((r: any) => r.column_name),
      resource_sample: resSample,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
