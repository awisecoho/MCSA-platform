export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== 'mcsa-setup-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await pool.connect()
  try {
    // Migrate schema — add new columns if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS mcsa_resources (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title        TEXT NOT NULL,
        description  TEXT,
        url          TEXT,
        type         TEXT,
        category     TEXT,
        course_slug  TEXT,
        source_name  TEXT,
        access_level TEXT DEFAULT 'free',
        created_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    // Add columns that older schema might be missing
    const cols = ['url','type','category','course_slug','source_name']
    for (const col of cols) {
      await client.query(`
        ALTER TABLE mcsa_resources ADD COLUMN IF NOT EXISTS ${col} TEXT
      `).catch(() => {})
    }

    // Activity log table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mcsa_activity_log (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_id     TEXT,
        resource_id  UUID REFERENCES mcsa_resources(id),
        event_type   TEXT NOT NULL,
        metadata     JSONB DEFAULT '{}',
        created_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_activity_clerk ON mcsa_activity_log(clerk_id)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_activity_resource ON mcsa_activity_log(resource_id)
    `)

    const resources = [
      // MCSA-107 Police Vehicles
      { title:'2024 Ford Police Interceptor Utility Modifier Guide', category:'OEM', type:'pdf', course_slug:'mcsa-107-police-vehicles', source_name:'Ford', url:'https://www.fordservicecontent.com/Ford_Content/Catalog/service_tip_files/2024_Police_Utility_Modifier_Guide_12052023.pdf', description:'Upfit safety, airbag zones, wiring, modifier cautions, and factory assumptions. Essential for understanding PIU factory constraints before scoping any upfit R&I.', access_level:'member' },
      { title:'Ford Pro Police Upfit-Friendly Features', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Ford', url:'https://www.ford.com/police-vehicles/features/upfit/', description:'Factory upfit features: pre-wired switches, wiring channel, 220A+ alternator, lighting and wiring architecture. The baseline for what the factory provides before the upfitter adds emergency equipment.', access_level:'free' },
      { title:'Ford Pro Upfitter Publications', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Ford Pro', url:'https://www.fordpro.com/en-us/upfit/publications/', description:'Complete Ford Pro upfitter library: Body Builder Layout Books, upfitter guides, CAD files, and BBAS support documentation. The primary OEM reference for PIU wiring and circuit locations by model year.', access_level:'free' },
      { title:'Whelen Install Guides Library', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Whelen', url:'https://www.whelen.com/support-and-training/install-guides', description:'Searchable install guide library for all Whelen lighting, siren, and warning systems. Use to verify wiring complexity, junction architecture, and connection counts for labor estimation.', access_level:'free' },
      { title:'Havis Ford Interceptor Console Installation Instructions (2020+)', category:'OEM', type:'pdf', course_slug:'mcsa-107-police-vehicles', source_name:'Havis', url:'https://www.havis.com/wp-content/uploads/2022/01/C-VSX-1800-INUT_INST_11-21.pdf', description:'Console mounting labor reference: bracket inventory, drilling cautions, obstruction notes, and mounting hardware. Use to validate console R&I labor and identify access complexity factors.', access_level:'member' },
      { title:'Havis Ford Interceptor Utility Console Product Resources', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Havis', url:'https://www.havis.com/product/vehicle-specific-22-angled-console-for-2020-2025-ford-interceptor-utility/', description:'Installation instructions, measurements, 3D rendering, and isoview drawing for the 2020-2025 PIU console. Use for component identification and valuation documentation.', access_level:'free' },
      { title:'Setina Flat Panel Tallman Partition Install Guide', category:'OEM', type:'pdf', course_slug:'mcsa-107-police-vehicles', source_name:'Setina', url:'https://setina.com/wp-content/uploads/2018/01/Flat-Panel-Tallman-Partition_2012-18-Interceptor-Utility-2.pdf', description:'Partition mounting guide: B-pillar attachment points, bracket hardware, lower extension panels, and installation sequence. Use to document partition mounting complexity and validate R&I labor.', access_level:'member' },
      { title:'Federal Signal Pathfinder PF100 Manual', category:'OEM', type:'link', course_slug:'mcsa-107-police-vehicles', source_name:'Federal Signal', url:'https://www.manualslib.com/manual/2089146/Federal-Signal-Corporation-Pathfinder-Pf100.html', description:'Siren/PA controller, lightbar control, relay configuration, wiring diagrams, and diagnostics reference. Use to understand integrated system architecture when scoping siren and lighting together.', access_level:'member' },
      // MCSA-108 Ambulance
      { title:'Braun Type I vs Type III Ambulance Guide', category:'OEM', type:'link', course_slug:'mcsa-108-ambulance', source_name:'Braun Ambulances', url:'https://blog.braunambulances.com/type-1-ambulance-or-type-3-ambulance', description:'Type I vs Type III distinction from the OEM: pass-through design, chassis connection, module classification, and why it matters for claims. Essential reading before any ambulance inspection.', access_level:'free' },
      { title:'Type I/III Ambulance Layout Reference Diagram', category:'Diagram', type:'link', course_slug:'mcsa-108-ambulance', source_name:'ResearchGate', url:'https://www.researchgate.net/figure/Traditional-ambulance-layout-Type-I-III_fig8_269337962', description:'Academic publication diagram showing traditional ambulance layout for Type I and III configurations. Reference for module orientation, patient compartment access points, and pass-through location.', access_level:'free' },
      { title:'Type III Ambulance Patient Compartment Diagram', category:'Diagram', type:'link', course_slug:'mcsa-108-ambulance', source_name:'ResearchGate', url:'https://www.researchgate.net/figure/Diagram-and-photograph-of-Type-III-ambulance-patient-compartment_fig1_321847708', description:'Academic publication diagram showing Type III ambulance patient compartment orientation and pod dimensions. Use to understand module interior layout when documenting equipment damage.', access_level:'free' },
      // MCSA-109 Fire Apparatus
      { title:'Pierce Ascendant 107 Heavy-Duty Aerial Ladder', category:'OEM', type:'link', course_slug:'mcsa-109-fire-apparatus', source_name:'Pierce Manufacturing', url:'https://www.piercemfg.com/fire-trucks/aerials/ascendant-class/107-ladder', description:'Aerial ladder reach, load ratings, waterway flow, and structural specifications. Understanding aerial ladder architecture is required before scoping any aerial device damage or system inspection.', access_level:'free' },
      { title:'Pierce Aerial Ladder Product Family', category:'OEM', type:'link', course_slug:'mcsa-109-fire-apparatus', source_name:'Pierce Manufacturing', url:'https://www.piercemfg.com/fire-trucks/aerials/ladders', description:'Full Pierce aerial ladder product family: configurations, structural components, and mounting systems. Use for apparatus identification and understanding the systems affected by collision damage.', access_level:'free' },
      { title:'Rosenbauer Aerial Ladders System Overview', category:'OEM', type:'link', course_slug:'mcsa-109-fire-apparatus', source_name:'Rosenbauer', url:'https://www.rosenbauer.com/en/products/vehicles/aerials/aerial-ladders', description:'Jacking and stabilizer systems, rescue cage, water supply architecture, and safe-control features. Rosenbauer aerial system documentation for OEM consultation and scope verification.', access_level:'free' },
      { title:'E-ONE Aerial Ladder Operator Manual — Major Component Description', category:'OEM', type:'pdf', course_slug:'mcsa-109-fire-apparatus', source_name:'E-ONE', url:'https://e-one.com/wp-content/uploads/2025/12/E-ONE-RML-AL-75-137-AACS2-25-08.pdf', description:'Major component descriptions: ladder assembly, cradle, outrigger stabilizers, turntable, and control station. Use to identify components and understand OEM-specified inspection requirements after collision.', access_level:'member' },
      { title:'NFPA 1911 & 1915 Apparatus Inspection and Maintenance', category:'Standards', type:'video', course_slug:'mcsa-109-fire-apparatus', source_name:'Emergency Reporting by ESO', url:'https://www.youtube.com/watch?v=U3AJi_Za6fE', description:'Standards overview video covering NFPA 1911 post-collision inspection and testing requirements. Use as a field orientation reference alongside the purchased NFPA standard.', access_level:'free' },
      // MCSA-110 Municipal Fleet
      { title:'Vactor 2100i Operator Manual', category:'OEM', type:'pdf', course_slug:'mcsa-110-municipal-fleet', source_name:'Vactor', url:'https://www.vactor.com/hubfs/6860826/514295_2100i_manual_r10.pdf', description:'Complete vacuum truck manual: boom system, water pump, hose reel, debris body, and maintenance checklist. Use to identify systems and component interdependencies when scoping combination sewer unit claims.', access_level:'member' },
      { title:'Vactor 2100i Product Overview', category:'OEM', type:'link', course_slug:'mcsa-110-municipal-fleet', source_name:'Vactor', url:'https://www.vactor.com/2100i', description:'RDB boom, Jet Rodder water pump, tanks, remote controls, and multi-flow system specifications. Component identification starting point for combination sewer cleaning truck claims.', access_level:'free' },
      { title:'Vactor 2100i Operations & Maintenance Video Library', category:'OEM', type:'video', course_slug:'mcsa-110-municipal-fleet', source_name:'Vactor', url:'https://www.vactor.com/2100i-operations-maint', description:'Startup, controls, remote operation, dumping, filtration, maintenance, and winterization procedures. Use to understand operational systems and identify which components are active during a collision.', access_level:'free' },
      { title:'Western Plow Mechanics Guides', category:'OEM', type:'link', course_slug:'mcsa-110-municipal-fleet', source_name:'Western Parts', url:'https://westernparts.com/western-plow-mechanics-guides/', description:'Mechanic guides for Western plow systems: electrical schematics, spreader documentation, and hydraulic system guides. Use for plow system identification and hydraulic damage assessment.', access_level:'free' },
      { title:'Western Plow Hydraulic, Electrical and Control Diagrams', category:'Diagram', type:'link', course_slug:'mcsa-110-municipal-fleet', source_name:'Western Parts', url:'https://westernparts.com/ultramount-hydraulic-western-plow-wiring-diagrams-diagrams-pdf-files/', description:'Parts diagrams for Western UltraMount: blade assembly, hydraulic manifold, electrical systems, and controls. Essential reference for documenting plow hydraulic and electrical damage after collision.', access_level:'free' },
      { title:'Fisher Snow Plow Reference Diagrams', category:'Diagram', type:'link', course_slug:'mcsa-110-municipal-fleet', source_name:'Zequip / Fisher', url:'https://www.zequip.com/store/fisher-snow-plow-reference-diagrams.html', description:'Fisher plow reference diagrams: blade assembly, A-frame, hydraulic system, headlamps, controls, and wiring harnesses. Fisher and Western share Douglas Dynamics architecture - applicable across both brands.', access_level:'free' },
    ]

    // Clear old seed and re-insert with UPSERT on title+course_slug
    let upserted = 0
    for (const r of resources) {
      await client.query(`
        INSERT INTO mcsa_resources (title, description, url, type, category, course_slug, source_name, access_level)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT DO NOTHING
      `, [r.title, r.description, r.url, r.type, r.category, r.course_slug, r.source_name, r.access_level])
      upserted++
    }

    const { rows: counts } = await client.query(`
      SELECT
        count(*)::int as total,
        count(*) FILTER (WHERE access_level='free')::int as free_count,
        count(*) FILTER (WHERE access_level='member')::int as member_count
      FROM mcsa_resources
    `)

    client.release()
    return NextResponse.json({ success: true, ...counts[0] })
  } catch (err: any) {
    client.release()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
