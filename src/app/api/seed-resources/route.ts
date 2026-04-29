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

    // ─── FREE RESOURCES ──────────────────────────────────────────────────────
    // Available to all visitors, no login required

    const freeResources = [
      {
        title: 'MCSA Tier Classification Quick Reference',
        description: 'One-page guide to the three-tier MCSA vehicle classification system. When to classify Tier 1, 2, or 3. The classify-up rule. Factory police platform list.',
        resource_type: 'Reference Guide',
        access_level: 'free',
        external_url: null,
      },
      {
        title: 'Ford Police Interceptor Utility — Factory Features Overview',
        description: 'Official Ford Pro resource covering PIU factory differences from retail Explorer: 220A+ alternator, pre-wired emergency circuits, pursuit-calibrated suspension, reinforced rear floor. Essential for distinguishing PIU from civilian platform.',
        resource_type: 'OEM Reference',
        access_level: 'free',
        external_url: 'https://www.ford.com/police-vehicles/features/upfit/',
      },
      {
        title: 'Whelen Engineering — Install Guides (All Products)',
        description: 'Complete Whelen product installation guide library. Covers wiring complexity, junction box architecture, module-level connections, and system integration for Liberty, Responder, Justice, and Ion series products.',
        resource_type: 'OEM Reference',
        access_level: 'free',
        external_url: 'https://www.whelen.com/support-and-training/install-guides',
      },
      {
        title: 'Whelen Training & WEVT Certification (Free)',
        description: 'Free Whelen Emergency Vehicle Technician (WEVT) training program. Covers all Whelen product families, installation procedures, and system troubleshooting. WEVT certification included at no cost.',
        resource_type: 'Training',
        access_level: 'free',
        external_url: 'https://www.whelen.com/whelen-training',
      },
      {
        title: 'NFPA 1911 — Standard Overview',
        description: 'NFPA 1911: Standard for Inspection, Maintenance, Testing, and Retirement of In-Service Automotive Fire Apparatus (2022 edition). What post-collision testing requirements apply before apparatus returns to service.',
        resource_type: 'Regulatory Standard',
        access_level: 'free',
        external_url: 'https://nfpa92.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=1911',
      },
      {
        title: 'NFPA 1911 & 1071 — EVT Overview (IAFC)',
        description: 'International Association of Fire Chiefs presentation covering NFPA 1911 and 1071 requirements and Emergency Vehicle Technician certification. Explains why EVT certification matters in apparatus repair routing decisions.',
        resource_type: 'Reference Guide',
        access_level: 'free',
        external_url: 'https://www.iafc.org/docs/default-source/1emerg-vehicle-mgnt/evms_nfpa1911_1071andevt.pdf',
      },
      {
        title: 'Braun Ambulances — Type I vs Type III Guide',
        description: "Braun's official comparison of Type I and Type III ambulance configurations. Covers chassis differences, module construction, pass-through design, and common municipal selection factors.",
        resource_type: 'OEM Reference',
        access_level: 'free',
        external_url: 'https://www.braunambulances.com/whats-the-difference-between-a-type-i-vs-type-iii-ambulance/',
      },
      {
        title: 'Braun Ambulance Types — Complete Product Overview',
        description: 'Full Braun product line overview: all ambulance types, chassis options (Ford F-450/550, RAM 4500), module configurations, and SolidBody construction details. OEM reference for module manufacturer identification.',
        resource_type: 'OEM Reference',
        access_level: 'free',
        external_url: 'https://www.braunambulances.com/custom-ambulances/ambulance-types/',
      },
      {
        title: 'Pierce Manufacturing — Product Support Hub',
        description: "Pierce's official product support portal. Access operator manuals, service training, dealer network locator, and factory direct support. Starting point for Pierce apparatus OEM documentation requests.",
        resource_type: 'OEM Support',
        access_level: 'free',
        external_url: 'https://www.piercemfg.com/service/product-support',
      },
      {
        title: 'Rosenbauer America — Resource Hub',
        description: 'Rosenbauer America product information and technical resources. U.S. operations in Wyoming (chassis/cab) and Minnesota (body manufacturing). Starting point for Rosenbauer OEM documentation requests on apparatus claims.',
        resource_type: 'OEM Reference',
        access_level: 'free',
        external_url: 'https://rosenbaueramerica.com',
      },
      {
        title: 'BOSS Plow — Training & Tech Videos',
        description: "BOSS Products official training library. Covers plow operation, hydraulic system maintenance, troubleshooting, and component identification. Essential for evaluating plow system damage in public works claims.",
        resource_type: 'Training',
        access_level: 'free',
        external_url: 'https://bossplow.com/en/support/videos',
      },
      {
        title: 'BOSS Plow Parts Glossary',
        description: 'Complete snowplow terminology reference: A-frame, hydraulic manifold, lift cylinder, angle cylinder, trip spring, cutting edge, headgear assembly. Use for accurate damage documentation on plow truck claims.',
        resource_type: 'Reference Guide',
        access_level: 'free',
        external_url: 'https://info.bossplow.com/blog/blog/bid/157843/the-ultimate-glossary-of-snow-plow-parts-terminology',
      },
      {
        title: 'Fisher Engineering — Technical Resources',
        description: 'Fisher product specs and installation guides. Fisher shares the Douglas Dynamics platform with Western Products — understanding this architecture is useful when evaluating plow hydraulic systems from either brand.',
        resource_type: 'OEM Reference',
        access_level: 'free',
        external_url: 'https://fisherplows.com/',
      },
    ]

    // ─── MEMBER RESOURCES ────────────────────────────────────────────────────
    // Requires login — MCSA-produced standards documents and reference tools

    const memberResources = [
      {
        title: 'MCSA Photo Standards Checklist — Tier 1 (Printable)',
        description: 'Field-ready checklist for Tier 1 standard fleet photo documentation. 12-shot minimum sequence with checkboxes. Print and bring to every inspection.',
        resource_type: 'Checklist',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA Photo Standards Checklist — Tier 2 (Printable)',
        description: 'Field-ready checklist for Tier 2 modified commercial vehicle photo documentation. Covers base vehicle plus attachment/modification photo sequences. Print and bring to every inspection.',
        resource_type: 'Checklist',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA Photo Standards Checklist — Tier 3 Apparatus (Printable)',
        description: 'Field-ready 40+ shot checklist for Tier 3 fire apparatus, ambulance, and fully-equipped police vehicle documentation. Organized by zone: exterior, cab, emergency equipment, compartments, critical systems, damage.',
        resource_type: 'Checklist',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA Component Inventory Template',
        description: 'Blank component inventory spreadsheet for Tier 3 vehicles. Columns: Component, Location, Manufacturer/Model, Serial Number (if visible), Condition, Notes. Complete this at every Tier 3 inspection.',
        resource_type: 'Template',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA Labor Reasonableness Ranges — Quick Reference Card',
        description: 'All MCSA labor ranges in a single printable reference card. Emergency lighting, siren systems, console and interior systems, exterior attachments, quantity scaling table, and the three legitimate adjustment triggers.',
        resource_type: 'Reference Guide',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA Valuation Bands — 2024 Reference Table',
        description: '2024 valuation bands across all emergency equipment categories: emergency lighting (all tiers), siren systems, communications and radio (APX 6500, APX 8500, APX NEXT), interior systems (Havis, Setina), exterior equipment. Includes condition factor table and Quote Required designations.',
        resource_type: 'Reference Guide',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA Repair Routing Matrix',
        description: 'Complete routing decision matrix: vehicle tier × damage type → required facility tier. Includes split routing triggers, OEM involvement mandatory conditions, and municipality coordination language.',
        resource_type: 'Reference Guide',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA File Compliance Checklist — 25 Checkpoints',
        description: 'The complete MCSA 25-point compliance checklist organized by category: Classification & Assignment, Documentation, Estimate Quality, Repair Routing, System Completeness. Includes automatic failure trigger list and scoring instructions.',
        resource_type: 'Checklist',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA System Trigger Protocol — Fire Apparatus',
        description: 'Reference matrix for fire apparatus system trigger requirements. Damage location → mandatory adjacent system inspections. Covers front-end, rear compartment, driveline, pump compartment, aerial mount, and frame damage zones.',
        resource_type: 'Reference Guide',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'Ambulance Remount Decision Framework',
        description: 'Step-by-step framework for evaluating whether a remount is appropriate on an ambulance total loss. Module condition assessment criteria, chassis evaluation, cost comparison model, lead time factor, and documentation requirements.',
        resource_type: 'Reference Guide',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'Ford Pro Upfitter Publications — PIU Body Builder Layout Books',
        description: 'Ford Pro official upfitter publications for the Police Interceptor Utility: Body Builder Layout Books, wiring diagrams, upfitter interface guides, and CAD files. The primary OEM reference for PIU wiring and pre-wired circuit locations by model year.',
        resource_type: 'OEM Reference',
        access_level: 'member',
        external_url: 'https://www.fordpro.com/en-us/upfit/publications/',
      },
      {
        title: 'Horton Emergency Vehicles — Type I & Type III Specs',
        description: "Horton product specifications covering Vi-Tech mounting system (tested to 35G), HOPS occupant protection, HVAC (45,000 BTU heat, 32,000 BTU cool), and chassis options. Useful for REV Group ambulance identification and module system documentation.",
        resource_type: 'OEM Reference',
        access_level: 'member',
        external_url: 'https://hortonambulance.com/ambulances/',
      },
      {
        title: 'Life Line Ambulances — Type I vs Type III Comparison Guide',
        description: 'Independent comparison of Type I and Type III ambulance configurations covering chassis options, fuel types, module dimensions, weight ratings, and service life considerations. Supplement to OEM documentation for type identification.',
        resource_type: 'Reference Guide',
        access_level: 'member',
        external_url: 'https://www.lifelineambulance.com/resource-center/guide-to-ambulances-types-i-vs-type-iii/',
      },
      {
        title: 'MCSA Scope Notes Template — Police Vehicle',
        description: 'Structured scope notes template for police vehicle claims. Sections: platform identification, upfitter identification, emergency equipment inventory, airbag deployment assessment, routing decision, and OEM consultation notes.',
        resource_type: 'Template',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA Scope Notes Template — Fire Apparatus',
        description: 'Structured scope notes template for fire apparatus claims. Sections: apparatus type and OEM, build sheet obtained, system trigger protocol findings, OEM contact and inspection status, routing decision, NFPA testing requirements.',
        resource_type: 'Template',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA Scope Notes Template — Ambulance',
        description: 'Structured scope notes template for ambulance claims. Sections: type identification, module manufacturer, pass-through assessment (Type III), module system findings, routing decision, remount analysis trigger evaluation, return to service requirements.',
        resource_type: 'Template',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'MCSA Routing Rationale Language — Municipality Communication Scripts',
        description: 'Pre-written language for common municipality routing conversations: redirecting from preferred shop (capability framing), requesting OEM involvement on apparatus, explaining split routing, and documenting municipality preference override.',
        resource_type: 'Reference Guide',
        access_level: 'member',
        external_url: null,
      },
      {
        title: 'Havis Police Vehicle Console Guide',
        description: 'Havis vehicle-specific console selection guide covering C-VS series for Ford PIU (2020–2026), Tahoe PPV (2021–2024), RAM Police SSV (2013–2024), and Dodge Durango Pursuit. Identifies console model from vehicle and assists in component inventory.',
        resource_type: 'OEM Reference',
        access_level: 'member',
        external_url: 'https://www.havis.com/blog/choosing-the-right-police-vehicle-consoles/',
      },
    ]

    // Clear existing resources and re-seed
    await client.query(`DELETE FROM mcsa_resources`)

    let inserted = 0
    for (const r of [...freeResources, ...memberResources]) {
      await client.query(
        `INSERT INTO mcsa_resources (title, description, resource_type, access_level, external_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [r.title, r.description, r.resource_type, r.access_level, r.external_url || null]
      )
      inserted++
    }

    const { rows: counts } = await client.query(`
      SELECT
        count(*) as total,
        count(*) FILTER (WHERE access_level = 'free') as free_count,
        count(*) FILTER (WHERE access_level = 'member') as member_count
      FROM mcsa_resources
    `)

    client.release()
    return NextResponse.json({
      success: true,
      total: Number(counts[0].total),
      free: Number(counts[0].free_count),
      member: Number(counts[0].member_count),
    })

  } catch (err: any) {
    client.release()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
