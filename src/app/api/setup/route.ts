import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (token !== 'mcsa-setup-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await sql`CREATE TABLE IF NOT EXISTS mcsa_profiles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), clerk_id TEXT UNIQUE NOT NULL, email TEXT NOT NULL DEFAULT '', first_name TEXT, last_name TEXT, role TEXT NOT NULL DEFAULT 'member', organization TEXT, job_title TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS mcsa_course_categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, order_index INTEGER DEFAULT 0)`
    await sql`CREATE TABLE IF NOT EXISTS mcsa_courses (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category_id UUID, course_code TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT, level TEXT, duration_hours NUMERIC(4,1) DEFAULT 1.5, is_published BOOLEAN DEFAULT TRUE, order_index INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS mcsa_modules (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), course_id UUID REFERENCES mcsa_courses(id) ON DELETE CASCADE, title TEXT NOT NULL, content TEXT, duration_minutes INTEGER DEFAULT 20, order_index INTEGER DEFAULT 0, is_preview BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS mcsa_enrollments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), clerk_id TEXT NOT NULL REFERENCES mcsa_profiles(clerk_id), course_id UUID REFERENCES mcsa_courses(id), progress_percent INTEGER DEFAULT 0, completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(clerk_id, course_id))`
    await sql`CREATE TABLE IF NOT EXISTS mcsa_module_progress (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), enrollment_id UUID REFERENCES mcsa_enrollments(id) ON DELETE CASCADE, module_id UUID REFERENCES mcsa_modules(id), completed BOOLEAN DEFAULT FALSE, completed_at TIMESTAMPTZ, UNIQUE(enrollment_id, module_id))`
    await sql`CREATE TABLE IF NOT EXISTS mcsa_certifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), clerk_id TEXT NOT NULL REFERENCES mcsa_profiles(clerk_id), cert_number TEXT UNIQUE NOT NULL, course_id UUID REFERENCES mcsa_courses(id), issued_at TIMESTAMPTZ DEFAULT NOW(), expires_at TIMESTAMPTZ)`
    await sql`CREATE TABLE IF NOT EXISTS mcsa_resources (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT, resource_type TEXT, access_level TEXT DEFAULT 'free', file_url TEXT, external_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS mcsa_membership_plans (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, price_monthly INTEGER NOT NULL, price_annual INTEGER, features JSONB DEFAULT '[]', is_active BOOLEAN DEFAULT TRUE)`
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_clerk ON mcsa_profiles(clerk_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_enrollments_clerk ON mcsa_enrollments(clerk_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_modules_course ON mcsa_modules(course_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_progress_enroll ON mcsa_module_progress(enrollment_id)`

    await sql`INSERT INTO mcsa_course_categories (name,slug,description,order_index) VALUES ('Municipal Claims Training','municipal-claims','Full MCSA curriculum',1) ON CONFLICT(slug) DO NOTHING`

    const courses: [string,string,string,string,string,number,number][] = [
      ['MCSA-101','mcsa-101-introduction','Introduction to Municipal Claims','Why municipal claims require a different approach — the lifecycle, ecosystem, and MCSA framework.','Beginner',1.5,1],
      ['MCSA-102','mcsa-102-vehicle-classification','Vehicle Classification System','The three-tier classification system: standard fleet, modified commercial, and integrated emergency apparatus.','Beginner',2.0,2],
      ['MCSA-103','mcsa-103-documentation-standards','Documentation & Photo Standards','MCSA photo sequences by vehicle tier, file naming conventions, component inventory, and the carrier-ready file checklist.','Beginner',1.5,3],
      ['MCSA-104','mcsa-104-labor-control','Labor Control Without Labor Guides','Task decomposition method, reasonableness ranges for high-variance tasks, quantity scaling rules.','Intermediate',1.75,4],
      ['MCSA-105','mcsa-105-valuation','Municipal Equipment Valuation','Valuation bands by component category, the source hierarchy, post-2022 pricing reality, and the invoice rule.','Intermediate',1.5,5],
      ['MCSA-106','mcsa-106-repair-facility','Repair Facility Selection','The three-tier repair hierarchy, MCSA routing protocol, split routing, hidden damage, return to service standards.','Intermediate',1.25,6],
      ['MCSA-107','mcsa-107-police-vehicles','Police & Law Enforcement Vehicles','All major police platforms, Whelen/Federal Signal/SoundOff lighting, Havis consoles, Setina partitions, Motorola APX radios.','Intermediate',2.0,7],
      ['MCSA-108','mcsa-108-ambulance','Ambulance & EMS Vehicle Claims','Type I/II/III classification, module manufacturers, module systems, the remount decision, and total loss analysis.','Advanced',2.5,8],
      ['MCSA-109','mcsa-109-fire-apparatus','Fire Apparatus Claims','First 30 minutes on scene, apparatus types and OEMs, integrated systems, NFPA 1911/1071, OEM involvement requirements.','Advanced',2.5,9],
      ['MCSA-110','mcsa-110-municipal-fleet','Municipal Fleet & Public Works Equipment','Plow systems, dump body evaluation, hydraulic protocols, aerial boom trucks, and specialty equipment documentation.','Intermediate',1.75,10],
      ['MCSA-301','mcsa-301-file-compliance','File Compliance & Quality Review','The MCSA compliance scoring framework, conducting file reviews, automatic failure triggers, and building a QA program.','Advanced',1.5,11],
      ['MCSA-201','mcsa-201-cmca-certification','Certified Municipal Claims Adjuster (CMCA)','Comprehensive exam prep covering all MCSA-101 through MCSA-301 material. 60-question proctored examination. 80% passing score.','Certification',4.0,12],
    ]
    for (const [code,slug,title,desc,level,dur,idx] of courses) {
      await sql`INSERT INTO mcsa_courses (course_code,slug,title,description,level,duration_hours,is_published,order_index) VALUES (${code},${slug},${title},${desc},${level},${dur},true,${idx}) ON CONFLICT(slug) DO NOTHING`
    }

    const modules: [string,string,number,boolean,number][] = [
      ['mcsa-101-introduction','Why Municipal Claims Require a Different Approach',25,true,0],
      ['mcsa-101-introduction','The Municipal Claims Lifecycle',20,false,1],
      ['mcsa-101-introduction','The Municipal Claims Ecosystem',20,false,2],
      ['mcsa-101-introduction','MCSA-101 Knowledge Check',10,false,3],
      ['mcsa-102-vehicle-classification','The Three-Tier Classification System',25,true,0],
      ['mcsa-102-vehicle-classification','Tier 3 Deep-Dive — Fire Apparatus & Ambulances',30,false,1],
      ['mcsa-102-vehicle-classification','Police Vehicle Deep-Dive: PIU vs Retail Explorer',35,false,2],
      ['mcsa-102-vehicle-classification','Classification Practice & Knowledge Check',30,false,3],
      ['mcsa-103-documentation-standards','The Documentation Standard — What It Is and Why It Matters',20,true,0],
      ['mcsa-103-documentation-standards','MCSA Photo Standards by Vehicle Tier',30,false,1],
      ['mcsa-103-documentation-standards','File Structure, Naming & Organization',25,false,2],
      ['mcsa-103-documentation-standards','Documentation Knowledge Check',15,false,3],
      ['mcsa-104-labor-control','Understanding the Labor Problem',20,true,0],
      ['mcsa-104-labor-control','Task Decomposition Method',25,false,1],
      ['mcsa-104-labor-control','Reasonableness Ranges — High-Variance Tasks',35,false,2],
      ['mcsa-104-labor-control','Applying Labor Control — Knowledge Check',25,false,3],
      ['mcsa-105-valuation','The Valuation Challenge',20,true,0],
      ['mcsa-105-valuation','Valuation Bands by Component Category',30,false,1],
      ['mcsa-105-valuation','Valuation in Practice — Rules and Documentation',25,false,2],
      ['mcsa-105-valuation','Valuation Knowledge Check',15,false,3],
      ['mcsa-106-repair-facility','The Repair Hierarchy',20,true,0],
      ['mcsa-106-repair-facility','Routing Protocol — Step by Step',25,false,1],
      ['mcsa-106-repair-facility','Hidden Damage, OEM Requirements & Return to Service',20,false,2],
      ['mcsa-106-repair-facility','Routing Knowledge Check',10,false,3],
      ['mcsa-107-police-vehicles','Police Platforms — Factory Differences That Matter',30,true,0],
      ['mcsa-107-police-vehicles','Emergency Lighting — Identification, Systems & Estimation',30,false,1],
      ['mcsa-107-police-vehicles','Interior Systems — Consoles, Partitions & Communications',30,false,2],
      ['mcsa-107-police-vehicles','Police Vehicle Claims — Full Scenario Assessment',30,false,3],
      ['mcsa-108-ambulance','Ambulance Classification & Manufacturer Overview',25,true,0],
      ['mcsa-108-ambulance','Module Systems & Electrical Architecture',35,false,1],
      ['mcsa-108-ambulance','The Remount Decision',35,false,2],
      ['mcsa-108-ambulance','Total Loss Analysis for Ambulances',25,false,3],
      ['mcsa-108-ambulance','Ambulance Claims — Full Assessment',30,false,4],
      ['mcsa-109-fire-apparatus','Fire Apparatus — First Response for the Adjuster',20,true,0],
      ['mcsa-109-fire-apparatus','Apparatus Types, Manufacturers & Documentation Sources',30,false,1],
      ['mcsa-109-fire-apparatus','Integrated Systems — How They Connect',40,false,2],
      ['mcsa-109-fire-apparatus','NFPA Standards — What Adjusters Actually Need to Know',20,false,3],
      ['mcsa-109-fire-apparatus','Fire Apparatus Claims — Full Scenario Assessment',40,false,4],
      ['mcsa-110-municipal-fleet','Public Works Fleet Overview',20,true,0],
      ['mcsa-110-municipal-fleet','Plow Systems — Evaluation & Estimation',30,false,1],
      ['mcsa-110-municipal-fleet','Dump Bodies, Hoists & Specialty Equipment',30,false,2],
      ['mcsa-110-municipal-fleet','Fleet Claims Knowledge Check',25,false,3],
      ['mcsa-301-file-compliance','The MCSA Compliance Framework',25,false,0],
      ['mcsa-301-file-compliance','Conducting a File Review',25,false,1],
      ['mcsa-301-file-compliance','Building a QA Program',25,false,2],
      ['mcsa-301-file-compliance','Compliance Review Practicum',15,false,3],
      ['mcsa-201-cmca-certification','CMCA Prep — Classification, Documentation & Labor',70,false,0],
      ['mcsa-201-cmca-certification','CMCA Prep — Valuation, Routing & Compliance',60,false,1],
      ['mcsa-201-cmca-certification','CMCA Prep — Specialty Apparatus',60,false,2],
      ['mcsa-201-cmca-certification','CMCA Certification Examination',50,false,3],
    ]
    for (const [courseSlug,title,dur,preview,order] of modules) {
      await sql`INSERT INTO mcsa_modules (course_id,title,duration_minutes,is_preview,order_index) SELECT id,${title},${dur},${preview},${order} FROM mcsa_courses WHERE slug=${courseSlug} ON CONFLICT DO NOTHING`
    }

    await sql`INSERT INTO mcsa_membership_plans (slug,name,price_monthly,price_annual,features) VALUES ('professional','Professional',2900,29000,'["Full course access","CMCA certification","Resource library","Progress tracking"]'),('carrier-tpa','Carrier / TPA',9900,99000,'["Everything in Professional","Multi-user access","Compliance reporting","Priority support"]'),('founding','Founding Member',0,0,'["Lifetime access","All future features","Site recognition"]') ON CONFLICT(slug) DO NOTHING`

    const [cc] = await sql`SELECT count(*)::int as n FROM mcsa_courses`
    const [mc] = await sql`SELECT count(*)::int as n FROM mcsa_modules`
    return NextResponse.json({ success: true, courses: cc.n, modules: mc.n })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
