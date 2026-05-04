import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (token !== 'mcsa-setup-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUrl = process.env.DATABASE_URL || ''
  const hasUrl = !!dbUrl
  let host = 'unknown'
  try {
    host = new URL(dbUrl).hostname
  } catch {}

  const diag: Record<string, any> = {
    DATABASE_URL_present: hasUrl,
    host,
    connection_test: null,
    schema: null,
    seed: null,
  }

  // Step 1 — connection test
  let client: any
  try {
    client = await pool.connect()
    const { rows } = await client.query('SELECT NOW() as now')
    diag.connection_test = `OK — ${rows[0].now}`
  } catch (e: any) {
    diag.connection_test = `FAILED: ${e.message}`
    return NextResponse.json({ error: 'Connection failed', diag }, { status: 500 })
  }

  // Step 2 — schema
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_id TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      first_name TEXT, last_name TEXT,
      role TEXT NOT NULL DEFAULT 'member',
      organization TEXT, job_title TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_course_categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
      description TEXT, order_index INTEGER DEFAULT 0
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_courses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id UUID,
      course_code TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL, description TEXT,
      level TEXT, duration_hours NUMERIC(4,1) DEFAULT 1.5,
      is_published BOOLEAN DEFAULT TRUE,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_modules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID REFERENCES mcsa_courses(id) ON DELETE CASCADE,
      title TEXT NOT NULL, content TEXT,
      duration_minutes INTEGER DEFAULT 20,
      order_index INTEGER DEFAULT 0,
      is_preview BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_enrollments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_id TEXT NOT NULL REFERENCES mcsa_profiles(clerk_id),
      course_id UUID REFERENCES mcsa_courses(id),
      progress_percent INTEGER DEFAULT 0,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(clerk_id, course_id)
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_module_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      enrollment_id UUID REFERENCES mcsa_enrollments(id) ON DELETE CASCADE,
      module_id UUID REFERENCES mcsa_modules(id),
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMPTZ,
      UNIQUE(enrollment_id, module_id)
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_certifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_id TEXT NOT NULL REFERENCES mcsa_profiles(clerk_id),
      cert_number TEXT UNIQUE NOT NULL,
      course_id UUID REFERENCES mcsa_courses(id),
      issued_at TIMESTAMPTZ DEFAULT NOW(),
      expires_at TIMESTAMPTZ
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_resources (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL, description TEXT,
      url TEXT, type TEXT, category TEXT, course_slug TEXT, source_name TEXT,
      resource_type TEXT, access_level TEXT DEFAULT 'free',
      file_url TEXT, external_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    for (const col of ['url','type','category','course_slug','source_name']) {
      await client.query(`ALTER TABLE mcsa_resources ADD COLUMN IF NOT EXISTS ${col} TEXT`).catch(() => {})
    }
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_activity_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_id TEXT, resource_id UUID, event_type TEXT NOT NULL,
      metadata JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    // Claim Package Builder tables
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_claim_packages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_id TEXT NOT NULL, claim_number TEXT, carrier_name TEXT, adjuster_name TEXT,
      municipality_name TEXT, department TEXT, loss_date DATE, inspection_date DATE,
      loss_type TEXT, loss_location TEXT, contact_person TEXT, contact_phone TEXT,
      unit_type TEXT, tier TEXT, year INTEGER, make TEXT, model TEXT, vin TEXT,
      mileage NUMERIC, hours NUMERIC, unit_number TEXT, in_service_status TEXT,
      specialty_body_manufacturer TEXT, specialty_body_serial TEXT,
      file_status TEXT DEFAULT 'Draft', risk_flags JSONB DEFAULT '[]',
      form_data JSONB DEFAULT '{}', compliance_score TEXT, missing_items TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_photo_checklist_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      package_id UUID NOT NULL REFERENCES mcsa_claim_packages(id) ON DELETE CASCADE,
      photo_item TEXT NOT NULL, status TEXT DEFAULT 'Missing',
      missing_reason TEXT, notes TEXT, sort_order INTEGER DEFAULT 0
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_component_inventory_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      package_id UUID NOT NULL REFERENCES mcsa_claim_packages(id) ON DELETE CASCADE,
      component_name TEXT NOT NULL, system_category TEXT, oem_aftermarket TEXT,
      condition TEXT, recommendation TEXT, documentation_needed TEXT,
      notes TEXT, sort_order INTEGER DEFAULT 0
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_claim_exports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      package_id UUID NOT NULL REFERENCES mcsa_claim_packages(id) ON DELETE CASCADE,
      clerk_id TEXT NOT NULL, export_type TEXT NOT NULL, file_url TEXT,
      watermarked BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_claim_pkgs_clerk ON mcsa_claim_packages(clerk_id)`).catch(()=>{})
    await client.query(`CREATE INDEX IF NOT EXISTS idx_photo_pkg ON mcsa_photo_checklist_items(package_id)`).catch(()=>{})
    await client.query(`CREATE INDEX IF NOT EXISTS idx_comp_pkg ON mcsa_component_inventory_items(package_id)`).catch(()=>{})
    await client.query(`CREATE TABLE IF NOT EXISTS mcsa_membership_plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      price_monthly INTEGER NOT NULL, price_annual INTEGER,
      features JSONB DEFAULT '[]', is_active BOOLEAN DEFAULT TRUE
    )`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_profiles_clerk ON mcsa_profiles(clerk_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_enrollments_clerk ON mcsa_enrollments(clerk_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_modules_course ON mcsa_modules(course_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_progress_enroll ON mcsa_module_progress(enrollment_id)`)
    diag.schema = 'OK — all tables created'
  } catch (e: any) {
    diag.schema = `FAILED: ${e.message}`
    client.release()
    return NextResponse.json({ error: 'Schema creation failed', diag }, { status: 500 })
  }

  // Step 3 — seed
  try {
    // Clear existing seed data before re-seeding to prevent duplicates
    await client.query(`DELETE FROM mcsa_module_progress`)
    await client.query(`DELETE FROM mcsa_enrollments`)
    await client.query(`DELETE FROM mcsa_modules`)
    await client.query(`DELETE FROM mcsa_resources`)
    await client.query(`DELETE FROM mcsa_courses`)
    await client.query(`DELETE FROM mcsa_course_categories`)
    await client.query(`DELETE FROM mcsa_membership_plans`)

    await client.query(`INSERT INTO mcsa_course_categories (name,slug,description,order_index)
      VALUES ('Municipal Claims Training','municipal-claims','Full MCSA curriculum',1)
      ON CONFLICT(slug) DO NOTHING`)

    const courses = [
      ['MCSA-101','mcsa-101-introduction','Introduction to Municipal Claims','Why municipal claims require a different approach — the lifecycle, ecosystem, and MCSA framework.','Beginner',1.5,1],
      ['MCSA-102','mcsa-102-vehicle-classification','Vehicle Classification System','The three-tier classification system: standard fleet, modified commercial, and integrated emergency apparatus.','Beginner',2.0,2],
      ['MCSA-103','mcsa-103-documentation-standards','Documentation & Photo Standards','MCSA photo sequences by vehicle tier, file naming conventions, component inventory, and the carrier-ready file checklist.','Beginner',1.5,3],
      ['MCSA-104','mcsa-104-labor-control','Labor Control Without Labor Guides','Task decomposition method, reasonableness ranges for high-variance tasks, quantity scaling rules.','Intermediate',1.75,4],
      ['MCSA-105','mcsa-105-valuation','Municipal Equipment Valuation','Valuation bands by component category, the source hierarchy, post-2022 pricing reality, and the invoice rule.','Intermediate',1.5,5],
      ['MCSA-106','mcsa-106-repair-facility','Repair Facility Selection','The three-tier repair hierarchy, MCSA routing protocol, split routing, hidden damage, return to service standards.','Intermediate',1.25,6],
      ['MCSA-107','mcsa-107-police-vehicles','Police & Law Enforcement Vehicles','All major police platforms, Whelen/Federal Signal lighting, Havis consoles, Setina partitions, Motorola APX radios.','Intermediate',2.0,7],
      ['MCSA-108','mcsa-108-ambulance','Ambulance & EMS Vehicle Claims','Type I/II/III classification, module manufacturers, module systems, the remount decision, and total loss analysis.','Advanced',2.5,8],
      ['MCSA-109','mcsa-109-fire-apparatus','Fire Apparatus Claims','First 30 minutes on scene, apparatus types and OEMs, integrated systems, NFPA 1911/1071, OEM involvement requirements.','Advanced',2.5,9],
      ['MCSA-110','mcsa-110-municipal-fleet','Municipal Fleet & Public Works Equipment','Plow systems, dump body evaluation, hydraulic protocols, aerial boom trucks, and specialty equipment documentation.','Intermediate',1.75,10],
      ['MCSA-301','mcsa-301-file-compliance','File Compliance & Quality Review','The MCSA compliance scoring framework, conducting file reviews, automatic failure triggers, and building a QA program.','Advanced',1.5,11],
      ['MCSA-201','mcsa-201-cmca-certification','Certified Municipal Claims Adjuster (CMCA)','Comprehensive exam prep covering all MCSA-101 through MCSA-301 material. 60-question proctored examination. 80% passing score.','Certification',4.0,12],
    ]
    for (const [code,slug,title,desc,level,dur,idx] of courses) {
      await client.query(
        `INSERT INTO mcsa_courses (course_code,slug,title,description,level,duration_hours,is_published,order_index)
         VALUES ($1,$2,$3,$4,$5,$6,true,$7) ON CONFLICT(slug) DO NOTHING`,
        [code,slug,title,desc,level,dur,idx]
      )
    }

    const modules = [
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
      await client.query(
        `INSERT INTO mcsa_modules (course_id,title,duration_minutes,is_preview,order_index)
         SELECT id,$1,$2,$3,$4 FROM mcsa_courses WHERE slug=$5
         ON CONFLICT DO NOTHING`,
        [title,dur,preview,order,courseSlug]
      )
    }

    await client.query(`INSERT INTO mcsa_membership_plans (slug,name,price_monthly,price_annual,features)
      VALUES
        ('professional','Professional',2900,29000,'["Full course access","CMCA certification","Resource library","Progress tracking"]'),
        ('carrier-tpa','Carrier / TPA',9900,99000,'["Everything in Professional","Multi-user access","Compliance reporting","Priority support"]'),
        ('founding','Founding Member',0,0,'["Lifetime access","All future features","Site recognition"]')
      ON CONFLICT(slug) DO NOTHING`)

    // Seed resource library
    const resources = [
      { title:'2024 Ford Police Interceptor Utility Modifier Guide', category:'OEM', type:'pdf', course_slug:'mcsa-107-police-vehicles', source_name:'Ford', url:'https://www.fordservicecontent.com/Ford_Content/Catalog/service_tip_files/2024_Police_Utility_Modifier_Guide_12052023.pdf', description:'Upfit safety, airbag zones, wiring, modifier cautions, and factory assumptions. Essential for understanding PIU factory constraints before scoping any upfit R&I.', access_level:'member' },
      { title:'Ford Pro Police Upfit-Friendly Features', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Ford', url:'https://www.ford.com/police-vehicles/features/upfit/', description:'Factory upfit features: pre-wired switches, wiring channel, 220A+ alternator, lighting and wiring architecture. The baseline for what the factory provides before the upfitter adds emergency equipment.', access_level:'free' },
      { title:'Ford Pro Upfitter Publications', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Ford Pro', url:'https://www.fordpro.com/en-us/upfit/publications/', description:'Complete Ford Pro upfitter library: Body Builder Layout Books, upfitter guides, CAD files, and BBAS support documentation. Primary OEM reference for PIU wiring and circuit locations by model year.', access_level:'free' },
      { title:'Whelen Install Guides Library', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Whelen', url:'https://www.whelen.com/support-and-training/install-guides', description:'Searchable install guide library for all Whelen lighting, siren, and warning systems. Use to verify wiring complexity, junction architecture, and connection counts for labor estimation.', access_level:'free' },
      { title:'Havis Ford Interceptor Console Installation Instructions (2020+)', category:'OEM', type:'pdf', course_slug:'mcsa-107-police-vehicles', source_name:'Havis', url:'https://www.havis.com/wp-content/uploads/2022/01/C-VSX-1800-INUT_INST_11-21.pdf', description:'Console mounting labor reference: bracket inventory, drilling cautions, obstruction notes, and mounting hardware. Use to validate console R&I labor and identify access complexity factors.', access_level:'member' },
      { title:'Havis Ford Interceptor Utility Console Product Resources', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Havis', url:'https://www.havis.com/product/vehicle-specific-22-angled-console-for-2020-2025-ford-interceptor-utility/', description:'Installation instructions, measurements, 3D rendering, and isoview drawing for the 2020-2025 PIU console. Use for component identification and valuation documentation.', access_level:'free' },
      { title:'Setina Flat Panel Tallman Partition Install Guide', category:'OEM', type:'pdf', course_slug:'mcsa-107-police-vehicles', source_name:'Setina', url:'https://setina.com/wp-content/uploads/2018/01/Flat-Panel-Tallman-Partition_2012-18-Interceptor-Utility-2.pdf', description:'Partition mounting guide: B-pillar attachment points, bracket hardware, lower extension panels, and installation sequence. Use to document partition mounting complexity and validate R&I labor.', access_level:'member' },
      { title:'Federal Signal Pathfinder PF100 Manual', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Federal Signal', url:'https://www.manualslib.com/manual/2089146/Federal-Signal-Corporation-Pathfinder-Pf100.html', description:'Siren/PA controller, lightbar control, relay configuration, wiring diagrams, and diagnostics reference. Use to understand integrated system architecture when scoping siren and lighting together.', access_level:'member' },
      { title:'Braun Type I vs Type III Ambulance Guide', category:'OEM', type:'link', course_slug:'mcsa-108-ambulance', source_name:'Braun Ambulances', url:'https://blog.braunambulances.com/type-1-ambulance-or-type-3-ambulance', description:'Type I vs Type III distinction from the OEM: pass-through design, chassis connection, module classification, and why it matters for claims. Essential reading before any ambulance inspection.', access_level:'free' },
      { title:'Type I/III Ambulance Layout Reference Diagram', category:'Diagram', type:'link', course_slug:'mcsa-108-ambulance', source_name:'ResearchGate', url:'https://www.researchgate.net/figure/Traditional-ambulance-layout-Type-I-III_fig8_269337962', description:'Academic publication diagram showing traditional ambulance layout for Type I and III configurations. Reference for module orientation, patient compartment access points, and pass-through location.', access_level:'free' },
      { title:'Type III Ambulance Patient Compartment Diagram', category:'Diagram', type:'link', course_slug:'mcsa-108-ambulance', source_name:'ResearchGate', url:'https://www.researchgate.net/figure/Diagram-and-photograph-of-Type-III-ambulance-patient-compartment_fig1_321847708', description:'Academic publication diagram showing Type III ambulance patient compartment orientation and pod dimensions. Use to understand module interior layout when documenting equipment damage.', access_level:'free' },
      { title:'Pierce Ascendant 107 Heavy-Duty Aerial Ladder', category:'OEM', type:'link', course_slug:'mcsa-109-fire-apparatus', source_name:'Pierce Manufacturing', url:'https://www.piercemfg.com/fire-trucks/aerials/ascendant-class/107-ladder', description:'Aerial ladder reach, load ratings, waterway flow, and structural specifications. Understanding aerial ladder architecture is required before scoping any aerial device damage or system inspection.', access_level:'free' },
      { title:'Pierce Aerial Ladder Product Family', category:'OEM', type:'link', course_slug:'mcsa-109-fire-apparatus', source_name:'Pierce Manufacturing', url:'https://www.piercemfg.com/fire-trucks/aerials/ladders', description:'Full Pierce aerial ladder product family: configurations, structural components, and mounting systems. Use for apparatus identification and understanding the systems affected by collision damage.', access_level:'free' },
      { title:'Rosenbauer Aerial Ladders System Overview', category:'OEM', type:'link', course_slug:'mcsa-109-fire-apparatus', source_name:'Rosenbauer', url:'https://www.rosenbauer.com/en/products/vehicles/aerials/aerial-ladders', description:'Jacking and stabilizer systems, rescue cage, water supply architecture, and safe-control features. Rosenbauer aerial system documentation for OEM consultation and scope verification.', access_level:'free' },
      { title:'E-ONE Aerial Ladder Operator Manual — Major Component Description', category:'OEM', type:'pdf', course_slug:'mcsa-109-fire-apparatus', source_name:'E-ONE', url:'https://e-one.com/wp-content/uploads/2025/12/E-ONE-RML-AL-75-137-AACS2-25-08.pdf', description:'Major component descriptions: ladder assembly, cradle, outrigger stabilizers, turntable, and control station. Use to identify components and understand OEM inspection requirements after collision.', access_level:'member' },
      { title:'NFPA 1911 & 1915 Apparatus Inspection and Maintenance', category:'Standards', type:'video', course_slug:'mcsa-109-fire-apparatus', source_name:'Emergency Reporting by ESO', url:'https://www.youtube.com/watch?v=U3AJi_Za6fE', description:'Standards overview video covering NFPA 1911 post-collision inspection and testing requirements. Use as a field orientation reference alongside the purchased NFPA standard.', access_level:'free' },
      { title:'Vactor 2100i Operator Manual', category:'OEM', type:'pdf', course_slug:'mcsa-110-municipal-fleet', source_name:'Vactor', url:'https://www.vactor.com/hubfs/6860826/514295_2100i_manual_r10.pdf', description:'Complete vacuum truck manual: boom system, water pump, hose reel, debris body, and maintenance checklist. Use to identify systems and component interdependencies when scoping combination sewer unit claims.', access_level:'member' },
      { title:'Vactor 2100i Product Overview', category:'OEM', type:'link', course_slug:'mcsa-110-municipal-fleet', source_name:'Vactor', url:'https://www.vactor.com/2100i', description:'RDB boom, Jet Rodder water pump, tanks, remote controls, and multi-flow system specifications. Component identification starting point for combination sewer cleaning truck claims.', access_level:'free' },
      { title:'Vactor 2100i Operations & Maintenance Video Library', category:'OEM', type:'video', course_slug:'mcsa-110-municipal-fleet', source_name:'Vactor', url:'https://www.vactor.com/2100i-operations-maint', description:'Startup, controls, remote operation, dumping, filtration, maintenance, and winterization procedures. Use to understand operational systems and identify which components are active during a collision.', access_level:'free' },
      { title:'Western Plow Mechanics Guides', category:'OEM', type:'link', course_slug:'mcsa-110-municipal-fleet', source_name:'Western Parts', url:'https://westernparts.com/western-plow-mechanics-guides/', description:'Mechanic guides for Western plow systems: electrical schematics, spreader documentation, and hydraulic system guides. Use for plow system identification and hydraulic damage assessment.', access_level:'free' },
      { title:'Western Plow Hydraulic, Electrical and Control Diagrams', category:'Diagram', type:'link', course_slug:'mcsa-110-municipal-fleet', source_name:'Western Parts', url:'https://westernparts.com/ultramount-hydraulic-western-plow-wiring-diagrams-diagrams-pdf-files/', description:'Parts diagrams for Western UltraMount: blade assembly, hydraulic manifold, electrical systems, and controls. Essential reference for documenting plow hydraulic and electrical damage after collision.', access_level:'free' },
      { title:'Fisher Snow Plow Reference Diagrams', category:'Diagram', type:'link', course_slug:'mcsa-110-municipal-fleet', source_name:'Zequip / Fisher', url:'https://www.zequip.com/store/fisher-snow-plow-reference-diagrams.html', description:'Fisher plow reference diagrams: blade assembly, A-frame, hydraulic system, headlamps, controls, and wiring harnesses. Fisher and Western share Douglas Dynamics architecture - applicable across both brands.', access_level:'free' },
    ]
    for (const r of resources) {
      await client.query(
        `INSERT INTO mcsa_resources (title, description, url, type, category, course_slug, source_name, access_level)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`,
        [r.title, r.description, r.url, r.type, r.category, r.course_slug, r.source_name, r.access_level]
      )
    }

    const { rows: cc } = await client.query('SELECT count(*)::int as n FROM mcsa_courses')
    const { rows: mc } = await client.query('SELECT count(*)::int as n FROM mcsa_modules')
    const { rows: rc } = await client.query('SELECT count(*)::int as n FROM mcsa_resources')
    diag.seed = `OK — ${cc[0].n} courses, ${mc[0].n} modules, ${rc[0].n} resources`

    client.release()
    return NextResponse.json({ success: true, courses: cc[0].n, modules: mc[0].n, resources: rc[0].n, diag })
  } catch (e: any) {
    diag.seed = `FAILED: ${e.message}`
    client.release()
    return NextResponse.json({ error: 'Seed failed', diag }, { status: 500 })
  }
}
