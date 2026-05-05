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
    await client.query('SELECT 1')

    // [course_slug, order_index, markdown_content]
    const updates: [string, number, string][] = [

      // ── MCSA-101 ─────────────────────────────────────────────────────────

      ['mcsa-101-introduction', 0, `## A $340,000 Mistake That Happens Every Week

A 2021 Pierce Enforcer pumper is rear-ended at an intersection. Significant rear compartment damage. The adjuster assigns it to the nearest available IA — a competent generalist who handles commercial trucks well.

The IA routes it to a Mack truck body shop 12 miles away. The shop fixes the rear panel and two compartment doors. Nobody inspects the pump panel on the opposite side. Nobody tests the pump. The unit returns to active service in 11 days.

Four months later, the pump fails during a structure fire. Post-incident investigation traces the failure to a cracked pump mounting bracket — damage that was present at the time of the collision but was never identified. The department files a complaint. The carrier faces a $340,000 exposure on a claim that settled for $18,000.

The adjuster didn't do anything wrong by general standards. They did everything wrong by municipal standards.

## Why Municipal Claims Require a Different Approach

Every error in municipal claims traces back to one root cause — the adjuster applied a standard vehicle or commercial truck framework to a purpose-built system.

A fire apparatus is not a Mack truck with a body on it. A police interceptor is not a Ford Explorer with lights. An ambulance is not a cargo van with a box. Each is an engineered system where components are interdependent, damage extends beyond what is visible, and repair requires knowledge the average body shop does not have.

## Systems Thinking — The Core Concept

Before asking "what is damaged?" ask "what is this vehicle and what systems does it contain?"

Damage assessment follows classification. An adjuster who skips to damage before understanding the system will miss things every time.

## Why Standard Tools Fail

CCC, Mitchell, and Audatex have no meaningful data for emergency equipment or apparatus systems. Manufacturer repair manuals cover how equipment is built — not how to estimate damage to it. Vendor installation guides are written for installers, not claims professionals. Shop estimates fill the vacuum, and shops worst-case estimate because uncertainty favors them.

The MCSA approach: replace assumption with classification. Replace guesswork with documented ranges. Replace shop authority with validated methodology.

## Common Field Errors This Module Addresses

**Error 1:** Assigning a Tier 3 apparatus to the nearest available adjuster regardless of experience. Proximity is not qualification.

**Error 2:** Accepting the first shop estimate without any validation framework. The shop fills the vacuum you leave — always in their favor.

**Error 3:** Treating emergency equipment as "aftermarket accessories" rather than integrated systems. A Whelen light bar wired through the A-pillar with a CenCom controller is not an accessory — it is a system.

## Field Application

Before your next municipal assignment, identify which tier the vehicle falls into before doing anything else. Write it down. If you cannot classify it confidently, that is the signal to seek specialist support — not to proceed and figure it out later.`],

      ['mcsa-101-introduction', 1, `## The 7 Active Steps of Every Municipal Claim

### Step 1 — Intake & Assignment

The claim is received. The single most important decision happens here: who gets assigned. Assignment must account for apparatus complexity. A Tier 3 vehicle assigned to an adjuster without specialty knowledge generates supplements, disputes, and re-inspections.

**Failure point:** Defaulting to geographic proximity. Closest available does not mean most qualified.

### Step 2 — Classification

Before photos. Before calling the shop. Before anything — classify the vehicle using the MCSA Tier System. Write it down. If you cannot classify with confidence, document why and escalate.

**Failure point:** Skipping classification and going straight to the shop estimate. The shop will classify it for you — as whatever justifies the highest bill.

### Step 3 — Documentation & Component Identification

On-site inspection using MCSA photo standards. All equipment and systems identified and logged. Hidden systems (wiring, hydraulics, plumbing) noted even if damage is not visible.

**Failure point:** Photographing only damaged areas. MCSA standards require documenting what exists, not just what is broken.

### Step 4 — Estimate Development

Labor estimated using MCSA task decomposition and reasonableness ranges. Parts valued using MCSA valuation bands — not shop invoice pricing. No lump-sum labor accepted. Every line item is auditable.

**Failure point:** Accepting a shop estimate and lightly trimming it. The estimate should be built from the adjuster's scope, not reverse-engineered from the shop's number.

### Step 5 — Repair Routing

Facility selected using the MCSA Repair Hierarchy. Decision documented with rationale. OEM consultation flagged where required.

**Failure point:** Routing to the municipality's "usual shop" without asking whether that shop can handle the specific vehicle type.

### Step 6 — Review & Compliance

File reviewed against the MCSA compliance checklist before submission. Required documentation confirmed present. Labor breakdown audited. Valuation verified.

**Failure point:** Skipping internal review and submitting directly. The carrier will find what you missed.

### Step 7 — Submission

File submitted in MCSA-standard format. All documentation attached. Labor breakdown included. Routing rationale documented.

## The Cost of Getting the Lifecycle Wrong

Supplements signal an incomplete original scope. But the real costs are broader: extended cycle time, carrier dissatisfaction, municipality frustration, re-inspection costs, and reputational damage. Every MCSA standard exists to prevent a specific lifecycle failure.`],

      ['mcsa-101-introduction', 2, `## The Municipal Claims Ecosystem

### The Municipality

Public entities operate under constraints private fleet owners do not. Their vehicles are public records. Their procurement processes are regulated. Their apparatus downtime directly affects public safety response capability.

**What municipalities need from a well-run claim:**
- Speed — apparatus back in service as fast as possible
- Accuracy — the repair is done right the first time, no comebacks
- Documentation — clean files they can produce if audited
- Communication — they want to know what is happening and when

**What frustrates municipalities:**
- Wrong repair facilities that cannot actually fix the apparatus
- Adjusters who do not understand the equipment
- Delays caused by supplements that should have been in the original scope

### The Insurance Carrier

Carriers need files they can process efficiently and defend if questioned. A good municipal claim file has:

- Clear classification with documented rationale
- Complete documentation — photos, component list, system notes
- Labor breakdown — no lump sums, every line item auditable
- Valuation with source — band-based or OEM quote
- Repair routing rationale
- No supplements — supplements signal an incomplete original scope

### The Independent Adjuster

The IA is the field expert. Their job is not to approve the shop's estimate — it is to independently establish what the damage is, what it costs to repair, and where it should be repaired.

### The Repair Facility

Not all shops are equal. The repair facility selection decision is as important as the estimate. Understanding repair capability tiers is a core MCSA competency.

## Field Application

On your next municipal claim, identify what each stakeholder needs. The municipality needs their unit back fast. The carrier needs a complete file. A well-run MCSA-standard claim achieves both simultaneously.`],

      ['mcsa-101-introduction', 3, `## MCSA-101 Knowledge Check

### Question 1

You receive an assignment for a 2022 Chevrolet Tahoe PPV with a full emergency equipment package involved in a rear-end collision. What is the first thing you do before contacting anyone?

**Answer:** Classify the vehicle. Before calling the shop, before reaching out to the municipality, before scheduling an inspection — determine the tier. A fully equipped Tahoe PPV is Tier 3. That classification determines your documentation approach, your routing decision, and whether a specialist needs to be involved.

### Question 2

A municipality insists their usual body shop handles all their vehicle repairs. The vehicle is a Pierce pumper with rear compartment damage. What do you do?

**Answer:** The routing decision is yours, not the municipality's. Acknowledge their preference and explain the capability question: "For a Pierce pumper with system implications, I need to confirm they have Pierce-authorized technicians and the equipment to do a full system inspection. Can you tell me if they have handled Pierce apparatus before?" Frame it as a capability question, not an override. Document your routing rationale in the file.

### Question 3

A shop submits an estimate with a single line item: "Emergency equipment removal and reinstallation — 22 hours." What is wrong with this and what do you require instead?

**Answer:** This is a lump-sum labor item — not acceptable under MCSA standards. Require a task-level breakdown: each piece of equipment listed separately, each operation (remove, reinstall, test) as its own line item with its own time. Then apply MCSA reasonableness ranges to each task.

### Question 4

A carrier asks why the cycle time on a municipal apparatus claim is longer than a standard commercial truck. What do you tell them?

**Answer:** Three reasons. First, OEM involvement — apparatus repairs that affect structural or safety systems require OEM inspection and authorization. Second, parts lead time — emergency apparatus components have longer lead times. Third, repair facility capacity — certified apparatus repair facilities are fewer in number than general body shops.`],

      // ── MCSA-102 ─────────────────────────────────────────────────────────

      ['mcsa-102-vehicle-classification', 0, `## The Classification Imperative

Classification is not administrative. It determines every subsequent decision — wrong classification means wrong adjuster, wrong repair facility, wrong scope, supplements, disputes, and extended cycle time.

## Tier 1 — Standard Fleet

**What it is:** Vehicles in municipal service that are functionally identical to their civilian counterparts. No emergency systems. No upfitter modifications that change how the vehicle should be estimated.

**Examples:** Administrative sedans, standard pickup trucks, basic cargo vans, inspector vehicles without equipment packages.

**The test:** Would a competent general adjuster handle this vehicle the same way they would handle the same make/model at a dealership? If yes — Tier 1.

**Common misclassification:** A code enforcement vehicle with a light bar and radio. The equipment package pushes it to Tier 2. Classification follows the highest complexity present.

## Tier 2 — Modified Commercial

**What it is:** Commercial vehicles modified with systems or equipment that require separate evaluation beyond the base vehicle scope.

**Examples:** Plow trucks, dump trucks with aftermarket bodies, utility service trucks with crane or aerial attachments.

**The test:** Is there a discrete modification or system that a general appraiser would not have the knowledge to estimate accurately? If yes — Tier 2 at minimum.

## Tier 2.5 — Integrated Light-Duty Emergency Vehicles (Police)

Police vehicles occupy a unique position. The base vehicle IS factory-modified for law enforcement duty (Ford PIU, Chevy Tahoe PPV, Dodge Durango Pursuit), AND is further upfitted with fully integrated emergency systems. Any police vehicle with a full emergency equipment package should be treated as Tier 3 for documentation, routing, and scope development purposes.

## Tier 3 — Integrated Emergency Apparatus

**What it is:** Vehicles where emergency systems are engineered into the platform at the manufacturer level. Damage cannot be evaluated by looking only at what is visibly broken.

**Examples:** Fire apparatus (all types), ambulances (all types), specialty rescue vehicles, hazmat units, fully-equipped police interceptors.

## The Hard Rule

When uncertain between Tier 2 and Tier 3 — **classify Tier 3**.

The cost of under-classifying is catastrophic: missed damage, improper repair, supplements, re-inspections, disputes. The cost of over-classifying is a few extra documentation steps. Always take the extra documentation steps.`],

      ['mcsa-102-vehicle-classification', 1, `## Why Fire Apparatus Is the Most Complex Tier 3 Category

A fire engine is not a truck with a pump on it. The pump is mechanically connected to the chassis via a power take-off (PTO). The water tank is engineered with baffling for load distribution and is structurally integrated. The electrical panel controls systems throughout the apparatus. All of these systems interact.

Damage to the rear compartment of a pumper is not just a bodywork job — it may affect the electrical system, the compartment load ratings, and potentially the structural integrity of the pump module.

## Fire Apparatus Types

**Pumper/Engine:** Most common apparatus. 1,000–3,000 GPM pump, 500–1,500 gallon tank. PTO-driven pump means any driveline damage triggers pump inspection.

**Aerial Ladder/Platform:** Hydraulically operated. Outriggers for stability. Any frame or suspension damage near the aerial mount triggers mandatory OEM structural inspection.

**Rescue Truck:** Purpose-built compartmented unit. Heavy-duty generator, hydraulic rescue tool systems (Hurst, Holmatro, Amkus), compressed air systems.

**Tanker/Tender:** Large capacity (1,500–5,000+ gallons). Baffling is critical — unbaffled water shifts load dramatically. Tank damage is rarely cosmetic.

## Ambulance Classification

**Type I:** Conventional cab-and-chassis with modular body. The module is the complex component. Cab damage = commercial truck repair. Module damage = ambulance OEM involvement.

**Type II:** Van-based (Ford Transit, Mercedes Sprinter). Less common in municipal service.

**Type III:** Cutaway cab-and-chassis with modular body. Most common municipal type. The cab-module junction is the critical inspection area — any front collision must include junction inspection.

## The System Trigger Concept

Any damage to these areas on a fire apparatus triggers mandatory adjacent system inspection:

| Damage Location | Mandatory Inspections |
|---|---|
| Front end | Pump inspection; driveline inspection |
| Rear compartment | Pump panel; electrical system check |
| Frame | Aerial mount integrity; tank attachment points |
| Electrical | All lighting circuits; pump control panel |

Never evaluate a single system in isolation on a Tier 3 apparatus.`],

      ['mcsa-102-vehicle-classification', 2, `## The Ford Police Interceptor Utility — What Makes It Different

The PIU is a separate vehicle program from the retail Explorer. Key factory differences:

| Feature | PIU | Retail Explorer |
|---|---|---|
| Alternator | 220A+ | 150A |
| Suspension | Pursuit-calibrated | Standard |
| Rear floor | Reinforced | Standard |
| Pre-wired circuits | Yes | No |
| Idle management | Yes | No |

Never use retail Ford Explorer data for a PIU. Never.

## The Upfitter Layer

On top of the factory PIU platform, upfitters add the emergency equipment package:

**Emergency Lighting (Whelen, Federal Signal, Code 3, SoundOff):** Full light bar, grille lights, mirror lights, rear deck lights, push bumper-integrated lights. These are wired through the vehicle — through the A-pillar, through the roof, through conduit runs.

**Siren/Control Systems:** Integrated with the lighting system through a single controller (Whelen CenCom, Federal Signal Jetstream). Removing the light bar means disconnecting the siren system. These are one system, not two.

**Console System (Havis, Jotto Desk):** Custom-mounted to the floor, running cables through the floor and firewall.

**Prisoner Partition (Setina, Jotto):** Bolted through floor and ceiling. Heavy (50–100+ lbs).

**Communications (Motorola APX, Kenwood NX):** Radio, antenna cluster on roof, control head mounted to console. Programming ($150–$400) is separate from physical R&I.

## Airbag Deployment on a Police Vehicle

Airbag deployment triggers a comprehensive scope requirement:
- Console mounting stress assessment
- Partition mounting point inspection
- All wiring harness runs through dash and A-pillar
- Radio and antenna system vibration damage assessment
- Push bumper and all lighting connections

Document each of these as a separate inspection item. Do not group them under "airbag."`],

      ['mcsa-102-vehicle-classification', 3, `## Classification Practice Scenarios

### Scenario 1
2023 Ford F-250 used by city parks department. No lights, no emergency equipment. Minor parking lot collision.

**Classification:** Tier 1. Standard guides apply. General adjuster appropriate.

### Scenario 2
2019 Freightliner M2 with 10-yard dump body and hydraulic tailgate. Rear collision, damage to dump body and hydraulic system.

**Classification:** Tier 2. Base vehicle — standard commercial truck repair. Dump body and hydraulic system — separate specialist evaluation required. Split routing: body shop for vehicle, hydraulic specialist for attachment.

### Scenario 3
2021 Ford Police Interceptor Utility. Full Whelen light bar, SoundOff grille lights, push bumper with integrated corner lights, Havis console, Setina partition, Motorola APX radio. Front-end collision with airbag deployment.

**Classification:** Tier 3. Factory PIU platform — never retail Explorer data. Airbag deployment triggers comprehensive scope. Route to law enforcement specialty upfitter.

### Scenario 4
2018 Pierce Enforcer pumper, 1,500 GPM pump. Rear compartment struck in intersection accident. Compartment door damaged. Pump panel visible on opposite side.

**Classification:** Tier 3. OEM involvement required. Rear compartment damage triggers system trigger protocol — pump panel, electrical system, compartment structural integrity must all be inspected. Route to Pierce-authorized facility.

### Scenario 5
2020 RAM 4500 Type III ambulance (Demers module). Front-end collision, significant cab crush. Module appears undamaged visually.

**Classification:** Tier 3. Type III — cab and module connect through a pass-through. Front-end structural damage must be evaluated for impact on cab-module connection point. Requires Demers OEM involvement to confirm.

## The Classification Rule Summary

- Uncertain between Tier 1 and 2 → Tier 2
- Uncertain between Tier 2 and 3 → Tier 3
- Factory police platform + any upfit → Tier 3
- Any ambulance with collision damage → Tier 3
- Any fire apparatus → Tier 3, full stop`],

      // ── MCSA-103 ─────────────────────────────────────────────────────────

      ['mcsa-103-documentation-standards', 0, `## The Documentation Problem in Municipal Claims

There is no industry standard for how a municipal vehicle claim file should look. Different adjusters capture different photos, organize files differently, and document equipment inconsistently. Carriers receive files they cannot evaluate efficiently. Supplements are filed for items that should have been in the original scope.

MCSA documentation standards exist to solve one specific operational problem: **make the file the authority**.

## What a Complete File Prevents

**Supplements** — Items not scoped because they were not documented.

**Disputes** — "Was that equipment pre-existing?" answered definitively by the photo record.

**Delays** — Carriers can review complete files faster. Incomplete files generate questions that slow payment.

**Legal exposure** — Defensible files protect the adjuster, the carrier, and the municipality.

## What Carriers Actually Look For

1. **Classification documentation** — Does the adjuster know what they are looking at?
2. **Complete photo coverage** — All four corners, all equipment, all systems involved
3. **Component inventory** — Every piece of equipment identified and documented
4. **Labor breakdown** — No lump sums. Task-level detail.
5. **Repair routing rationale** — Why was this shop selected?
6. **System inspection documentation** — Was anything beyond visible damage investigated?

## The Most Important Documentation Rule

**Document what exists — not just what is broken.**

Photos of damaged areas document what is broken. Photos of undamaged systems document what existed before the loss. Both are required.

An adjuster who only photographs damage cannot later document pre-loss condition of undamaged systems that develop problems.

## Field Application

At your next inspection, before you photograph a single piece of damage, do a full walk-around and photograph every system, every piece of equipment, and every compartment — regardless of whether it appears involved. Then photograph the damage.`],

      ['mcsa-103-documentation-standards', 1, `## Tier 1 — Standard Fleet Photo Sequence (minimum 12 shots)

1. Full front — vehicle perpendicular to camera
2. Full rear — vehicle perpendicular to camera
3. Driver side full length
4. Passenger side full length
5. Front 3/4 angle (driver side)
6. Rear 3/4 angle (driver side)
7. VIN plate — must be legible
8. Odometer
9. All damage areas — close-up, labeled with location
10. Interior if airbag deployment or interior damage
11. Undercarriage if undercarriage damage is present
12. Tire condition all four corners if suspension is involved

## Tier 2 — Modified Commercial (Tier 1 base + equipment)

Add to the Tier 1 sequence:
- All modification and attachment systems — separate photo series
- Attachment points and mounting hardware — close-up
- Hydraulic systems if present — cylinders, hoses, connections
- All equipment compartments — open and closed
- Serial and ID plates on all major attachments

## Tier 3 — Full Apparatus (minimum 40 shots)

**Exterior:** Four corners, both full sides, front and rear perpendicular, roof if accessible

**Cab:** Interior driver position, interior passenger position, dashboard and controls, odometer AND engine hours — both required

**Emergency equipment:** Light bar full view, all grille and front lighting, all side and rear emergency lighting, push bumper full view, antenna cluster

**Compartments — open and closed for each:** All body compartments showing contents and mounting hardware

**Critical system areas:** Pump panel full view, pump panel close-up showing controls and gauges, tank fill and discharge connections, aerial device stowage (aerial units), generator and power panel, all electrical panel access areas

## Equipment Labeling Requirements

Every photo of a piece of equipment must communicate:
- **Component name** (e.g., "Driver side grille light — Whelen TIR3")
- **Condition** (damaged / undamaged / unknown pending inspection)
- **Location on vehicle**

## The Golden Rule

**If a component is in the vehicle when you arrive, it is in the file. No exceptions.**`],

      ['mcsa-103-documentation-standards', 2, `## MCSA Standard File Naming

**Root folder:** [DATE]_[CLAIM#]_[UNIT#]_[VEHICLE TYPE]

Example: 20241115_CLM-44821_UNIT-47_PIERCE-PUMPER

**Photo subfolders:**
- PHOTOS/01_EXTERIOR — full vehicle photos
- PHOTOS/02_CAB — cab interior and controls
- PHOTOS/03_EQUIPMENT — all equipment and systems
- PHOTOS/04_DAMAGE — all damage areas
- PHOTOS/05_HIDDEN — any damage found beyond visible inspection

**Documents subfolder:**
- DOCS/ESTIMATE — final estimate with labor breakdown
- DOCS/OEM_REFERENCE — any OEM documentation used
- DOCS/SCOPE_NOTES — adjuster scope notes
- DOCS/ROUTING_RATIONALE — repair facility selection documentation
- DOCS/COMPONENT_INVENTORY — list of all equipment identified

## Photo File Naming

[SEQUENCE#]_[LOCATION]_[COMPONENT]_[CONDITION]

Examples:
- 031_SIDE-RIGHT_PUMP-PANEL_UNDAMAGED.jpg
- 044_REAR-COMPARTMENT_DOOR-HINGE_DAMAGED.jpg

## The Component Inventory

Every Tier 3 vehicle requires a written component inventory.

| Component | Location | Manufacturer/Model | Condition | Notes |
|---|---|---|---|---|
| Light bar | Roof | Whelen Liberty II | Undamaged | Integrated wiring |
| Push bumper | Front | Go Rhino with corner lights | Damaged | Corner lights detached |
| Console | Interior | Havis C-VS | Undamaged | Wiring intact |
| Partition | Interior | Setina Pro-Gard | Undamaged | Mounting bolts intact |

## The Carrier-Ready File Checklist

Before submitting any Tier 3 file, confirm:

- All required photos present per tier standard
- All photos labeled (location + component + condition)
- Component inventory complete
- VIN verified and documented
- Odometer and engine hours documented
- All damage areas photographed from minimum 2 angles
- System inspection areas documented even if undamaged
- No lump-sum labor items in estimate
- Routing rationale document included`],

      ['mcsa-103-documentation-standards', 3, `## Documentation Knowledge Check

### Question 1
You arrive at a fire apparatus loss and the pump panel is on the opposite side of the vehicle from the damage. Do you photograph it? Why?

**Answer:** Yes — unconditionally. The pump panel must be documented regardless of where the damage is. The system trigger concept applies: damage to one area of an apparatus may affect adjacent systems, including the pump. Your pre-loss photographs establish its condition at time of inspection. A photograph of the pump panel in undamaged condition is as important as a photograph of damaged bodywork.

### Question 2
A police interceptor file you are reviewing has 8 photos — four corners and four damage close-ups. What is missing and why does it matter?

**Answer:** Almost everything required for a Tier 3 file is missing. There are no photos of: the light bar, grille lighting, push bumper, console system, prisoner partition, radio system, antenna cluster, VIN, odometer, or interior. This file cannot support a complete scope because there is no documentation of what existed before the loss. Any supplement will be disputed because there is no photo evidence the equipment was present.

### Question 3
A shop claims the push bumper integrated lighting "was already damaged before the loss." Your file has photos of every piece of equipment at time of inspection, including the push bumper lighting documented as undamaged. What does that documentation do?

**Answer:** It closes the dispute. You have a timestamped photograph documenting the push bumper corner lights as undamaged at the time of your inspection — after the collision. The only way the lights can be damaged at repair completion without being in the collision scope is if the shop caused the damage during repair.

### Question 4
A carrier quality reviewer calls about a file and says "we cannot find any documentation of the console system." Walk through what should have been in the file.

**Answer:** The file should contain: (1) A photo of the console from the front showing the full unit; (2) A photo of the console mounting points and floor attachment; (3) A photo of all cable and wiring runs visible from the console; (4) A line item in the component inventory identifying the console manufacturer and model; (5) A condition notation; and (6) If airbag deployment occurred, an additional note that console mounting stress must be assessed.`],

      // ── MCSA-104 ─────────────────────────────────────────────────────────

      ['mcsa-104-labor-control', 0, `## The Labor Vacuum

No published labor guides exist for emergency equipment. Mitchell, CCC, and Audatex have essentially no applicable data for emergency lighting R&I, siren and control system R&I, police console and interior systems, ambulance module systems, or fire apparatus pump, tank, or aerial systems.

This vacuum creates a predictable dynamic: shops fill it with worst-case estimates, and adjusters — lacking any independent reference — accept or minimally adjust those numbers. The result is systematic overpayment.

## How Shops Generate Inflated Estimates

**Lump-sum labor:** "Emergency equipment R&I — 18 hours." No breakdown. No audit trail. The number is whatever the shop needs it to be.

**Worst-case complexity:** Every job treated as if it is the most complex version. Simple bolt-on push bumper gets aerial mount labor.

**Double-charging:** Removal labor included in the install line item AND listed as a separate remove line.

**Per-unit inflation:** 1 marker light takes 1.5 hours. 8 identical marker lights take 12 hours. No quantity scaling applied.

**Complexity padding:** Access constraints, custom fabrication, unusual mounting — legitimate factors applied to every job regardless of whether those conditions actually exist.

## Why Adjusters Accept It

The shop is the expert in their own trade. When an adjuster without training challenges a shop's labor number, the shop pushes back: "That's just what it takes." Without an independent reference, the adjuster has no ground to stand on.

MCSA labor methodology gives adjusters that independent reference. It is not about fighting shops — it is about having a documented, defensible basis for your position.

## The Hard Rule

**No lump-sum labor is accepted on any MCSA-standard file.**

Every labor line item must be decomposed into identifiable tasks. A file submitted with lump-sum labor is a non-compliant file.

## Field Application

At your next inspection, ask the shop for an itemized breakdown before you discuss any dollar amounts. If they cannot provide task-level labor, document that you require it and will not process a lump-sum submission.`],

      ['mcsa-104-labor-control', 1, `## The Five Task Categories

Every labor operation on emergency equipment breaks into some combination of:

- **R** — Remove (disconnect and physically remove the component)
- **Re** — Repair (repair in place or on the bench)
- **Rpl** — Replace (install a new component)
- **RI** — Reinstall (reinstall a previously removed component)
- **T/C** — Test and Calibrate (function test, system calibration, programming)

## Wiring Is Always a Separate Line Item

Never allow wiring work to be buried inside installation labor. Wiring is separately evaluated because:
- Wiring complexity varies dramatically — pre-wired vs. custom routing are completely different jobs
- Wiring is where hidden damage lives after collision
- Wiring labor is where the most significant inflation occurs

## Worked Example — Light Bar R&I

**Shop estimate:** "Light bar remove and reinstall — 4.5 hours"

**MCSA decomposition:**
- Remove light bar mounting hardware and lift off roof: 0.5 hrs
- Disconnect main power feed at roof junction: 0.25 hrs
- Disconnect control lead at A-pillar: 0.25 hrs
- Disconnect auxiliary feeds (TIR modules): 0.25 hrs
- Protect during repair: included
- Reinstall light bar and mounting hardware: 0.5 hrs
- Reconnect all electrical connections: 0.5 hrs
- Function test all circuits: 0.25 hrs
- **Total: 2.5 hours**

Shop: 4.5 hours. MCSA: 2.5 hours. At $200/hr = $400 overpayment on a single line item.

## Worked Example — Console R&I

**Shop estimate:** "Console removal and reinstall — 8 hours"

**MCSA decomposition:**
- Disconnect all mounted equipment: 0.75 hrs
- Disconnect all power leads and cable runs: 0.5 hrs
- Unbolt console from floor: 0.25 hrs
- Remove console from vehicle: 0.25 hrs
- Reinstall console and secure mounting bolts: 0.25 hrs
- Reconnect all power and cable runs: 0.5 hrs
- Reinstall all mounted equipment: 0.75 hrs
- Full system function test: 0.5 hrs
- **Total: 3.75 hours**

Shop: 8 hours. MCSA: 3.75 hours.

## Quantity Scaling

Repetitive identical tasks are not billed at the same per-unit rate for unit 1 and unit 8.

- Units 1–2: full rate
- Units 3–4: 75% rate
- Units 5+: 60% rate`],

      ['mcsa-104-labor-control', 2, `## MCSA Labor Reasonableness Ranges

> **Methodology Note:** These ranges were developed from field invoice analysis, certified EVT and upfitter consultations, manufacturer installation documentation, and review of contested labor claims across municipal accounts. Ranges reflect labor by a qualified technician with standard access. No published labor guide exists for emergency equipment — these ranges fill that vacuum. Any claim above the high end of a range requires photographic documentation of the specific complexity justifying the exception. Ranges are reviewed annually.

## How to Use These Ranges

These are reasonableness bands — not exact times. A job within the range: accept with note. Above the range: require written justification with specific complexity factors identified.

## Emergency Lighting R&I Ranges

| Task | Low | Mid | High |
|---|---|---|---|
| Light bar, pre-wired connection | 1.5 hr | 2.0 hr | 3.0 hr |
| Light bar, integrated wiring through roof/A-pillar | 2.5 hr | 3.5 hr | 5.0 hr |
| Grille light, surface mount (per unit) | 0.25 hr | 0.40 hr | 0.75 hr |
| Grille light, flush mount (per unit) | 0.75 hr | 1.25 hr | 2.0 hr |
| Marker/perimeter light, surface (per unit) | 0.40 hr | 0.60 hr | 1.0 hr |
| Cut light opening, simple panel | 0.5 hr | 1.0 hr | 1.5 hr |
| Cut light opening, complex | 2.5 hr | 3.25 hr | 4.0 hr |

## Siren & Control Systems

| Task | Low | Mid | High |
|---|---|---|---|
| Siren amplifier R&I (accessible) | 0.5 hr | 0.75 hr | 1.25 hr |
| Full integrated control system (CenCom) | 1.5 hr | 2.5 hr | 4.0 hr |

## Interior Systems

| Task | Low | Mid | High |
|---|---|---|---|
| Console system (Havis/Jotto) | 2.0 hr | 3.5 hr | 5.5 hr |
| Prisoner partition (Setina) | 1.5 hr | 2.5 hr | 4.0 hr |
| Weapon mount (per unit) | 0.25 hr | 0.50 hr | 0.75 hr |
| Radio R&I (physical only) | 0.75 hr | 1.25 hr | 2.0 hr |

## Exterior Attachments

| Task | Low | Mid | High |
|---|---|---|---|
| Push bumper, bolt-on, no lighting | 0.5 hr | 1.0 hr | 1.5 hr |
| Push bumper with integrated lighting | 1.5 hr | 2.5 hr | 4.0 hr |
| Step R&I (per step) | 0.25 hr | 0.50 hr | 0.75 hr |

## The Three Legitimate Adjustment Triggers

A job is legitimately at the high end of the range ONLY when one of these three conditions is documented with photographic or OEM evidence:

1. **Access obstruction** — Photos prove normal access is blocked by another component requiring removal
2. **Complexity** — Photos or OEM documentation confirm non-standard installation
3. **Damage extension** — Photos show damage beyond the primary component into adjacent systems

"Shop says it's complex" without any of these three documented = mid-range labor, no exceptions.`],

      ['mcsa-104-labor-control', 3, `## Labor Control Knowledge Check

### Exercise 1

A shop submits the following for a police interceptor with a full light bar, 4 grille lights, push bumper with 2 corner lights, console, partition, and radio:
- "Emergency equipment removal and storage — 14 hours"
- "Emergency equipment reinstallation and testing — 16 hours"

Apply MCSA decomposition and reasonableness ranges. What is the defensible total?

**Answer:**

| Task | Hours |
|---|---|
| Light bar R&I | 2.0–3.0 |
| Grille lights R&I (4 units, scaling applied) | 0.75 |
| Push bumper with corner lights R&I | 2.5 |
| Console R&I | 3.5 |
| Partition R&I | 2.5 |
| Radio R&I | 1.25 |
| Full system function test | 1.0 |
| **MCSA total** | **13.5–14.5 hrs** |

Shop total: 30 hours. Overpayment at $200/hr: $3,100.

### Exercise 2

A shop bills 3.5 hours per unit for 8 identical surface-mount marker lights (no new cuts required). Apply MCSA quantity scaling.

**Answer:**
- Units 1–2 at 0.60 hrs = 1.2 hrs
- Units 3–4 at 0.45 hrs = 0.90 hrs
- Units 5–8 at 0.36 hrs = 1.44 hrs
- **MCSA total: ~3.5 hours**

Shop total: 28 hours. At $185/hr: overpayment of $4,532.

### Exercise 3

A shop includes "custom wiring routing — 6 hours" as a single line item on a fire apparatus scope. What do you do?

**Answer:** Reject the lump sum. Require decomposition: which specific wiring runs? Which junction points? What is the routing complexity? Require photos documenting the routing complexity they are claiming. Until those elements are documented, this line item cannot be processed.`],

      // ── MCSA-105 ─────────────────────────────────────────────────────────

      ['mcsa-105-valuation', 0, `## Why Valuation Is Hard in Municipal Claims

No centralized pricing database covers emergency equipment. CCC, Mitchell, and Audatex have no entries for light bars, push bumpers, console systems, or apparatus components. The void is filled by shop invoices, distributor quotes, manufacturer list pricing, and "what we paid for it" — all of which are single data points at best.

## Post-2022 Pricing Reality

Supply chain disruptions from 2020–2023 significantly affected emergency equipment pricing. Light bars that cost $1,200 in 2019 may cost $2,000–$2,400 in 2024. Any valuation reference more than 18 months old should be treated as potentially outdated.

## The Source Hierarchy

**1. OEM/Manufacturer quote** — For apparatus components and systems, OEM pricing is the primary authority.

**2. Current distributor quote** — For emergency equipment (lighting, sirens, communications), a current quote from an authorized distributor is the best market evidence available.

**3. MCSA valuation band** — In the absence of sources 1 or 2, the MCSA band establishes the reasonable range.

**4. Invoice** — A purchase invoice is ONE data point, not a valuation. Old invoices are even weaker. Never accept an invoice as market value without corroboration.

## The Invoice Rule

A shop submitting a replacement invoice is providing evidence of one purchase from one source at one point in time. It is not market value. A shop that sourced a part from the most expensive available distributor has not established market value — they have established what they chose to pay.

**MCSA standard:** Invoice is a reference point, not an authority.
- If invoice pricing is within the MCSA band: accept with note
- If invoice pricing exceeds the MCSA band: require additional distributor quote before accepting`],

      ['mcsa-105-valuation', 1, `## MCSA Valuation Bands — 2024 Edition

> **Source and Date:** Bands reflect Q3–Q4 2024 distributor pricing from authorized dealers and distributor quotes obtained during active claim reviews. They are not MSRP or list price — they reflect what an adjuster should expect to pay when sourcing from a legitimate authorized channel. Bands are reviewed and updated annually. Where a band says "Quote Required," no band applies — obtain a written OEM dealer quote before processing that line item.

## Emergency Lighting Valuation Bands (2024)

| Component | Low | Mid | High |
|---|---|---|---|
| Light bar, entry-level LED | $600 | $900 | $1,200 |
| Light bar, mid-level integrated (Whelen Liberty, Federal Integrity) | $1,400 | $2,100 | $2,800 |
| Light bar, full-featured (Whelen Responder, Code 3 Supervisor) | $2,500 | $4,000 | $5,500 |
| Grille light, basic surface-mount | $80 | $140 | $200 |
| Grille light, mid-range TIR | $175 | $260 | $350 |
| Lighting controller (basic switch panel) | $150 | $275 | $400 |
| Lighting controller (CenCom, Jetstream) | $600 | $1,000 | $1,400 |

## Siren Systems

| Component | Low | Mid | High |
|---|---|---|---|
| Siren amplifier, 100W | $250 | $375 | $500 |
| Siren amplifier, 100-200W | $450 | $675 | $900 |
| Speaker (single) | $150 | $275 | $400 |

## Communications & Radio

| Component | Low | Mid | High | Notes |
|---|---|---|---|---|
| Basic VHF/UHF mobile radio | $800 | $1,400 | $2,000 | |
| Motorola APX 6500 | $2,000 | $3,250 | $4,500 | Most common patrol |
| Motorola APX 8500 | $4,000 | $5,750 | $7,500 | |
| Antenna (per unit) | $50 | $175 | $300 | |
| Programming/licensing | $150 | $275 | $400 | Always separate |

## Interior Systems

| Component | Low | Mid | High |
|---|---|---|---|
| Havis console (standard C-VS) | $600 | $1,000 | $1,400 |
| Setina partition (standard) | $800 | $1,300 | $1,800 |
| Weapon mount (single) | $200 | $350 | $500 |
| Laptop/MDT mount system | $300 | $500 | $700 |

## Exterior Equipment

| Component | Low | Mid | High |
|---|---|---|---|
| Push bumper (basic, no lighting) | $400 | $650 | $900 |
| Push bumper (with lighting mounts) | $800 | $1,300 | $1,800 |
| Push bumper (fully integrated) | $1,500 | $2,500 | $3,500 |

## Apparatus Components — Quote Required

All fire apparatus pump components, tank components, aerial components, and electrical panel components require an OEM quote before valuation. Standard compartment doors: $400–$1,200 per door.`],

      ['mcsa-105-valuation', 2, `## Pre-Loss Condition Factor

| Age / Condition | Factor |
|---|---|
| New or like-new (under 1 year) | 100% of band value |
| Good condition (1–4 years, fully functional) | 80–95% of band value |
| Fair condition (4–8 years, functional with minor wear) | 65–80% of band value |
| Poor condition (8+ years or significant wear) | 50–65% of band value |
| Non-functional prior to loss | Document pre-loss value only |

Apply the condition factor when: photos document pre-loss condition, age is known, and condition was less than new. Document the factor and rationale in the file.

## Betterment

When a damaged component is replaced with a component of superior specification or greater remaining useful life, betterment may apply. This is a carrier policy decision — MCSA does not set betterment rules. Flag when a replacement would represent a meaningful upgrade and document it for the carrier's consideration.

## Documentation Requirements by Valuation Type

**Band-based valuation:**
- Document the component and manufacturer/model if known
- Document the MCSA band applied
- Document any condition factor with rationale
- No additional sourcing required if value is within band

**Quote-based valuation:**
- Obtain written quote from authorized OEM dealer
- Document quote source, date, and quote number
- Attach quote to file
- Apply quote value directly

**Above-band valuation:**
- Document why band was exceeded
- Obtain corroborating distributor quote
- Attach quote to file
- Document rationale in scope notes`],

      ['mcsa-105-valuation', 3, `## Valuation Knowledge Check

### Exercise 1
A shop invoices a replacement Whelen Liberty II light bar at $3,800. The unit was 3 years old and fully functional before the loss. What is the MCSA approach?

**Answer:** The Whelen Liberty II falls in the mid-level integrated bar band: $1,400–$2,800. The shop invoice of $3,800 exceeds the band. Apply a condition factor for 3-year-old equipment in good condition: 85–90% of band value = $1,190–$2,520. Before accepting above-band pricing, require a current quote from an authorized Whelen distributor. If the distributor confirms current pricing above $2,800, accept with the quote attached.

### Exercise 2
A fire apparatus needs a replacement pump component. The shop quotes $8,400 from memory with no supporting documentation.

**Answer:** Pump components are "Quote Required" under MCSA valuation standards. The shop's memory is not a valuation source. Require a written quote from an authorized Pierce (or applicable OEM) dealer with part number, current list price, and lead time. Do not process this line item without the OEM quote attached to the file.

### Exercise 3
A police vehicle's Motorola APX 6500 radio is damaged. Shop prices a replacement at $6,200. The existing unit was 2 years old.

**Answer:** The APX 6500 falls in the mid-tier law enforcement radio band: $2,000–$4,500. The shop price of $6,200 exceeds the band. For a 2-year-old unit in good condition, apply 85–90% condition factor = $1,700–$4,050. Require a current Motorola dealer quote for verification. Note that programming/licensing ($150–$400) is a separate line item from hardware replacement.`],

      // ── MCSA-106 ─────────────────────────────────────────────────────────

      ['mcsa-106-repair-facility', 0, `## Why Repair Routing Is a Claims Decision

Sending a vehicle to the wrong repair facility generates improper repairs, supplements when the shop discovers it cannot complete the scope, extended cycle time, and potential liability if an improperly repaired apparatus fails in service.

The routing decision belongs to the adjuster — not the municipality, not the shop.

## Tier 1 — Standard Auto/Body Shop

**Capability:** Standard collision repair, refinishing, basic mechanical.

**Appropriate for:** Tier 1 vehicles with no system involvement. Tier 2 vehicles for base vehicle damage only.

**Not appropriate for:** Any work involving emergency systems, integrated equipment, wiring harnesses, or apparatus systems.

**Common routing error:** Sending a police vehicle to a body shop for front-end repair. The body shop fixes the front end but cannot inspect or reinstall the push bumper lighting, disconnect/reconnect wiring correctly, or recalibrate the siren system.

## Tier 2 — Specialty/Upfitter Shop

**Capability:** Emergency equipment installation and removal, wiring systems, vehicle-specific upfitter work.

**Appropriate for:** All police vehicles requiring equipment R&I, ambulances for module-adjacent work, fire apparatus for compartment and non-system body damage.

**Not appropriate for:** Structural apparatus repairs, pump/aerial/tank system work, OEM-required certification repairs.

**Identifying a capable Tier 2 shop:** Ask specifically about experience with the vehicle type and the specific manufacturers involved. A shop that cannot answer specifically is not Tier 2 capable.

## Tier 3 — OEM/Authorized Facility

**Capability:** Manufacturer-level knowledge, access to proprietary documentation, ability to certify repairs to OEM specifications.

**Mandatory for:**
- Any fire apparatus structural damage
- Any pump, tank, or aerial system involvement
- Any ambulance module structural damage
- Any damage to safety-critical systems requiring OEM certification

OEM involvement does not always mean OEM facility repair. It may mean an OEM engineer performs an inspection, the OEM approves the repair plan, or the OEM certifies the completed repair. Document which form of involvement occurred.`],

      ['mcsa-106-repair-facility', 1, `## The MCSA Routing Protocol — Step by Step

### Step 1 — Classify the Vehicle
Already documented before this step. Tier determines the baseline routing decision.

### Step 2 — Identify All Damage Types

- Cosmetic only (surface, paint, trim)
- Structural (frame, body structural, mounting points)
- Mechanical (driveline, suspension, engine)
- System-involved (any emergency equipment, wiring, apparatus system)

### Step 3 — Apply the Routing Matrix

| Vehicle Tier | Damage Type | Required Facility |
|---|---|---|
| Tier 1 | Any | Standard body shop |
| Tier 2 | Cosmetic/mechanical only | Standard body shop |
| Tier 2 | System-involved | Split: body shop + specialty shop |
| Tier 2.5/3 (Police) | Any | Specialty upfitter shop minimum |
| Tier 3 (Ambulance) | Module cosmetic | Specialty/ambulance shop |
| Tier 3 (Ambulance) | Module structural | Ambulance OEM authorized facility |
| Tier 3 (Fire apparatus) | Compartment only, no system | Apparatus-capable shop |
| Tier 3 (Fire apparatus) | Any system involvement | OEM authorized facility |
| Tier 3 (Fire apparatus) | Structural (frame, pump, aerial) | OEM mandatory |

### Step 4 — Document the Routing Decision

Every file must include a routing rationale statement:
- Vehicle classification and tier
- Damage types identified
- Facility selected and why
- Any OEM consultation required and current status
- Any split routing arrangement

### Municipality Coordination

Frame the routing conversation as a capability question: "I understand you have a relationship with that shop. For this specific vehicle type, I need to confirm they have certified capability for this system. Can you tell me if they have handled this apparatus type before?" This respects the relationship while protecting the routing decision.`],

      ['mcsa-106-repair-facility', 2, `## Why Hidden Damage Matters More in Municipal Apparatus

A civilian vehicle with hidden damage may eventually fail mechanically. A fire apparatus or ambulance with hidden damage may fail during an emergency response. The stakes are not the same.

## Common Hidden Damage Scenarios

**Fire apparatus rear compartment collision:**
- Visible: Compartment door damage, rear panel damage
- Hidden: Pump panel mounting point stress, electrical conduit damage, hose bed structural damage, valve handle and control damage

**Ambulance front-end collision:**
- Visible: Cab front-end damage
- Hidden: Cab-to-module connection point stress (Type III), electrical pass-through damage, climate system conduit damage

**Police vehicle front-end collision with airbag deployment:**
- Visible: Front-end structural damage, airbag components
- Hidden: Console mounting stress, partition mounting point stress, wiring harness routed through A-pillar and dash, radio and antenna system vibration damage

## OEM Documentation Requirements

For any Tier 3 apparatus, the carrier file must include documentation of OEM involvement when structural damage is present or the apparatus must return to active public safety service.

OEM documentation takes one of three forms:
1. **OEM inspection report** — An authorized technician inspects and provides written findings
2. **OEM repair authorization** — The OEM reviews the proposed repair plan and authorizes it
3. **OEM completion certification** — The OEM certifies the completed repair meets OEM specifications

## Return to Service Standard

For municipal emergency apparatus, the question is not just "is the repair complete?" It is "can this apparatus return to emergency service?"

This requires:
- All safety systems functional
- Any required NFPA testing completed
- OEM certification where required
- Municipality fleet manager acceptance of the repair`],

      ['mcsa-106-repair-facility', 3, `## Routing Knowledge Check

### Question 1
A Type III ambulance has front-end collision damage. The cab is damaged but the module "looks fine." What facility do you route to and why?

**Answer:** OEM-authorized ambulance facility — not a body shop. Type III ambulances connect cab and module through a pass-through. Front-end structural damage transmits stress into the module structure through that connection point. "Looks fine" is not a finding — it requires OEM inspection to confirm structural integrity. The module must have OEM sign-off before the unit returns to service.

### Question 2
A municipality insists their local body shop handles all their vehicles. The vehicle is a fully equipped police interceptor with a push bumper collision.

**Answer:** Acknowledge the preference and redirect to capability: "For this unit specifically, I need to confirm they have experience with Whelen/SoundOff wiring systems and can properly reinstall and test the integrated lighting and siren system after the front-end repair. Can you tell me if they have handled police upfit work before?" If they cannot confirm capability, route to a specialty upfitter shop. Document the municipality's preference and your routing decision with rationale.

### Question 3
A Pierce pumper has rear compartment damage — two doors, body damage, no visible pump or electrical involvement. Does OEM involvement apply?

**Answer:** Apply the system trigger protocol first. Rear compartment damage on a pumper triggers: pump panel inspection (even if on the opposite side), electrical conduit inspection in the rear compartment area, and hose bed structural inspection. If inspection reveals no system involvement — document that and a Tier 2 apparatus-capable body shop may be adequate. But you cannot reach that conclusion without completing the system inspection first.

### Question 4
You have a Tier 2 plow truck with front bumper damage and hydraulic system damage. How do you structure the routing?

**Answer:** Split routing. The base vehicle front-end repair routes to a commercial body shop. The hydraulic system routes to a hydraulic equipment specialist. Document who removes the plow for body access, who reinstalls, and who does the final hydraulic function test.`],

      // ── MCSA-107 ─────────────────────────────────────────────────────────

      ['mcsa-107-police-vehicles', 0, `## The Four Primary Police Platforms

**Ford Police Interceptor Utility (PIU):** Most common police vehicle in the U.S. Built on a modified Explorer platform but is a separate vehicle program. Factory differences: 220A+ alternator, heavy-duty pursuit-calibrated suspension, upgraded brakes, enhanced cooling, pre-wired emergency circuits, reinforced rear floor, and idle management system. Available in AWD and hybrid. The hybrid PIU has additional electrical complexity — 12V and high-voltage systems must be documented separately.

**Chevrolet Tahoe Police Pursuit Vehicle (PPV):** Body-on-frame construction — different from PIU's unibody. Heavy-duty rear axle, purpose-built cooling, enhanced electrical. Common in sheriff departments and state police. Body-on-frame means frame inspection is part of any significant collision repair.

**Dodge Durango Pursuit:** Increasing presence in law enforcement fleets. Unibody, AWD. Key differences from civilian Durango: heavy-duty suspension, uprated alternator, pre-wired circuits. Never use civilian Durango data.

**RAM 1500 Classic Police (SSV):** Less common for patrol, present in detective and administrative use. Standard truck platform with police-specific electrical and cooling packages.

## OEM Documentation Sources

- **Ford PIU:** Ford Pro Upfitter Publications at fordpro.com — Body Builder Layout Books, wiring diagrams, upfitter interface guides
- **Chevy Tahoe PPV:** GM Upfitter website — covers Tahoe PPV upfitter integration guidelines
- **Dodge Durango Pursuit:** RAM commercial resources at ramtrucks.com

## Why This Matters at Inspection

When you arrive at a police vehicle loss:
1. Identify the platform — PIU, PPV, Durango, or SSV
2. Identify the upfitter if marked (many units have upfitter decals)
3. Note the hybrid designation if applicable (PIU hybrid)
4. Document the factory platform before evaluating the upfit layer

The factory platform determines the baseline for what the vehicle was built to do. The upfit layer determines the scope of your equipment documentation.`],

      ['mcsa-107-police-vehicles', 1, `## The Major Lighting Manufacturers

**Whelen Engineering:** Market leader. Key product lines include Liberty (full-size, integral TIR modules), Responder (compact integrated), Justice (full-size traditional), and Ion series (individual modules). Most Whelen systems use a junction box approach — main power to a junction, individual leads to each module.

**Federal Signal:** Major manufacturer. Integrity (full-size), Vector (compact), SpectraLux (individual modules). Integrated with Federal Signal Electronic Siren systems.

**Code 3:** Strong market presence in South and West. Supervisor (full-size), MR6 (compact).

**SoundOff Signal:** Significant presence in Midwest and Northeast. mFORCE series (full-size), nFORCE series (grille/surface). Uses distributed architecture with controller at the unit level rather than centralized junction — affects removal and reinstallation labor estimates because there are more individual connections.

## The Integrated System Concept

Modern police vehicles do not have separate lighting and siren systems — they have an integrated emergency system. The light bar controller (Whelen CenCom, Federal Signal Jetstream) manages both lighting AND siren simultaneously.

**Implications for estimation:**
- Cannot remove the light bar without disconnecting the siren system
- Cannot remove the control head without affecting both systems
- Testing one system requires testing all systems
- An "R&I light bar" line item must include siren system connections if they share a controller

Always evaluate the emergency system as a whole before decomposing into individual line items. A shop that scopes "light bar R&I" separately from "siren R&I" on an integrated system is double-billing the shared connections.

**Identifying manufacturer in the field:** Check the housing for a manufacturer label (usually on the end cap or underside). Photograph the label as part of documentation.`],

      ['mcsa-107-police-vehicles', 2, `## Why Interior Systems Matter in Collision Repair

Body repair on a police vehicle frequently requires interior access. A front-end repair may require console removal to access the A-pillar. A side panel repair may require partition removal to access the B or C pillar. A roof repair requires headliner removal, which requires light bar wiring access.

Interior R&I is not optional — it is a required component of the body repair scope.

## Console Systems

**Havis:** Market leader in police consoles. C-VS series (standard vehicle-specific) and custom configurations. Typically aluminum or black polymer construction with modular mounting. Havis label under the console lip.

**Jotto Desk:** Competitor with significant fleet presence. Similar modular approach.

**Documentation:** Full-view photo of console from front, photo of floor mounting bolts, photo of all cable runs visible, component inventory entry with manufacturer and model.

## Prisoner Partitions

**Setina Manufacturing:** Industry standard. Pro-Gard and Legacy series. Aluminum or polycarbonate barrier with steel frame mounting. Heavy (50–100+ lbs).

**Key note:** Partitions are bolted through floor and ceiling or through the B-pillar. Any B-pillar repair requires partition removal. Document the partition mounting points — collision stress can affect mounting hardware without visible body damage.

## Communications Systems

**Motorola APX series (most common in law enforcement):**
- APX 6500: mid-tier, most common patrol vehicle radio
- APX 8500: dual-band (large departments)
- APX NEXT: newest generation

**Programming:** Radio programming requires a certified radio technician — $150–$400 — and is a separate line item from physical R&I.

## Airbag Deployment — Full Interior Scope Trigger

When airbag deployment occurs, individually assess:
- Console mounting stress — inspect all floor bolts and cable connections
- Partition mounting — inspect all mounting points for stress or deformation
- Wiring harness runs through dash, A-pillar, and under carpet
- Radio, MDT, and mounted electronics — vibration and shock assessment
- Weapon mounts — verify retention function post-collision`],

      ['mcsa-107-police-vehicles', 3, `## Police Vehicle Full Scope Assessment

### The Loss

2022 Ford Police Interceptor Utility — Hybrid. Full emergency equipment package. Front-end collision at an intersection, moderate speed. Airbag deployment (both front bags).

### Step 1 — Classification

Tier 3. Factory law enforcement platform with full upfit package. Airbag deployment triggers comprehensive scope. Route to specialty upfitter shop minimum.

### Step 2 — Documentation Sequence

1. Full four corners, both sides — before touching anything
2. All emergency lighting — light bar, all grilles, push bumper, antenna cluster
3. Console full view and cable runs
4. Partition full view and mounting points
5. Radio head and control head
6. VIN, odometer, and hybrid battery indicator
7. All damage areas — minimum 2 angles each, labeled

### Step 3 — Scope Development (MCSA labor ranges)

| Task | Hours |
|---|---|
| Light bar R&I (Liberty II with CenCom) | 2.5–3.5 |
| SoundOff grille lights R&I (4 units, flush mount, scaled) | 2.5 |
| Push bumper with integrated corner lights R&I | 2.5 |
| Console R&I (Havis with airbag assessment) | 4.0 |
| Partition R&I (Setina Pro-Gard) | 2.5 |
| Radio R&I + programming | 1.25 + $200 |
| Antenna cluster R&I | 0.75 |
| Full system function test | 1.0 |
| **Total equipment labor** | **17.0–18.5 hrs** |

### Step 4 — Valuation Highlights

| Component | Value |
|---|---|
| Whelen Liberty II (3-year-old, good condition) | $1,400–$2,200 |
| SoundOff grille lights (4 × mid-range) | $700–$1,400 |
| Push bumper with integrated lighting | $1,500–$2,500 |
| Motorola APX 6500 (2-year-old, good condition) | $1,700–$3,825 |

### Step 5 — Routing

Specialty law enforcement upfitter for all equipment R&I and system testing. Body repair coordinated by the upfitter. Hybrid system: confirm upfitter has certified hybrid technician capability.`],

      // ── MCSA-108 ─────────────────────────────────────────────────────────

      ['mcsa-108-ambulance', 0, `## First 5 Minutes at an Ambulance Loss

1. Identify the type (I, II, III, or I-AD) from a distance before approaching
2. Identify the module manufacturer — not the chassis manufacturer
3. Determine if the module is structurally involved (damage near module walls, roof, or floor)
4. Note the pass-through condition on Type III units — this is where hidden damage lives
5. Document engine hours, not just mileage — ambulances accumulate hours on extended idle

## Type-by-Type Classification

**Type I — Conventional cab-and-chassis with modular body:** Cab is a commercial truck (Ford F-450/550, RAM 4500/5500). Module is separately manufactured by an ambulance OEM. Cab damage = commercial truck repair. Module damage = ambulance OEM involvement.

**Type II — Van-based:** Less common in municipal service. Ford Transit or Mercedes Sprinter base.

**Type III — Cutaway cab-and-chassis with modular body:** Most common municipal type. Cutaway cab (Ford E-450 or RAM ProMaster chassis) with module attached at a cab-module junction through a pass-through. The junction is the critical area — any front collision must include junction inspection.

**Type I-AD — Medium Duty:** Freightliner M2 or International TerraStar chassis. Treat as Type I with commercial medium-duty chassis considerations.

## Module Manufacturers

- **Braun Industries:** PL Custom, North Star, and Rescue brands
- **Horton Emergency Vehicles:** Part of REV Group. Known for durability-focused construction
- **AEV (American Emergency Vehicles):** Part of REV Group
- **Medix Specialty Vehicles:** Mid-size manufacturer with strong Midwest/West presence
- **Demers Ambulances:** Major Canadian manufacturer with strong Northeast U.S. presence
- **Road Rescue:** Part of REV Group, common in Midwest
- **Wheeled Coach:** Part of REV Group, Florida-based, significant national fleet presence

The module manufacturer is who you contact for OEM guidance — not the chassis manufacturer.`],

      ['mcsa-108-ambulance', 1, `## What Is Inside the Module

**Structural:** Aluminum or steel extrusion frame with composite wall panels. Roof and floor integrated into the structural assembly. Any damage to frame extrusions requires OEM assessment — field repair of structural extrusions is not acceptable.

**Electrical system:** 12V vehicle system (chassis) plus a separate module electrical system. The module may have its own battery, inverter system (for 120V medical equipment), and extensive wiring. Post-collision electrical inspection must cover both systems independently.

**Oxygen system:** Post-collision inspection must include cylinder mounting bracket condition, valve condition, regulator and line condition, and if on-board system: reservoir condition and plumbing integrity.

Do not assume the oxygen system is undamaged because it is not in the direct damage zone. Shock loads from collision can affect valve seals and plumbing connections throughout the vehicle.

**HVAC:** Patient compartment climate control is separate from cab HVAC. Any roof or side panel damage near HVAC components triggers inspection.

**Cot fastener system (Ferno, Stryker):** Must be tested post-collision for retention function — this is a patient safety item.

**Pass-through (Type III):** The opening between cab and module is structurally connected to both. In a front-end collision, stress transmits through the pass-through into the module structure. This is a mandatory inspection point on every Type III collision.

## Electrical Fire Risk Post-Collision

Ambulances carry significant electrical loads. Post-collision:
- Inspect wiring in areas adjacent to structural damage
- Note any evidence of arc damage, melting, or heat exposure
- Document condition of main fuse and breaker panel
- Flag for full electrical system test before return to service`],

      ['mcsa-108-ambulance', 2, `## What Is a Remount?

A remount is the process of removing a serviceable ambulance module from a damaged or worn chassis and mounting it on a new chassis. It is an alternative to replacing the entire unit.

## When the Remount Conversation Happens

- The chassis is damaged beyond economical repair or has reached end of service life
- The module is in good condition with significant remaining service life
- A total loss determination is being evaluated
- The cost of chassis replacement plus remount is less than the cost of a replacement unit

## The Remount Analysis — Step by Step

**Step 1 — Assess module condition:** A module suitable for remounting must have no structural damage to frame extrusions, functional electrical, HVAC, and oxygen systems, interior in serviceable condition, and remaining service life (typically 5+ years).

**Step 2 — Assess chassis condition:** Is the chassis the reason for the remount (collision damage)? Document all chassis damage and mounting bracket condition.

**Step 3 — Cost comparison:**

| Option | Cost Elements |
|---|---|
| Remount | New chassis + remount labor + module inspection/refurbishment |
| Replacement unit | New complete unit (including current lead time cost) |
| Repair current unit | Chassis repair cost + downtime |

**Step 4 — Lead time consideration:** New ambulance units currently have 18–36 month delivery lead times from major manufacturers. A remount may be achievable in 4–8 weeks. For a department that cannot operate without the unit, lead time is a real operational cost that belongs in the analysis.

**Step 5 — Document the decision:** Whatever path is chosen, document the analysis in the file. If a remount is selected, document: module condition assessment, chassis being used, remount facility, and module systems included in refurbishment scope.`],

      ['mcsa-108-ambulance', 3, `## Why Ambulance Total Loss Is Different

Ambulance total loss involves additional factors beyond standard passenger vehicle total loss:
- Repair cost vs. replacement cost (apparatus may be insured at replacement cost)
- Module salvage value (a remountable module has value independent of the chassis)
- Lead time cost (operating without a unit during repair vs. faster return to service)
- Certification requirements (some jurisdictions require new certification on repaired apparatus)

## The Total Loss Calculation for Apparatus

**Replacement Cost Value (RCV):** What does a new, like-configured unit cost? For a Type III ambulance, the RCV in 2024 may be $250,000–$350,000+. This information comes from an OEM dealer quote.

**Actual Cash Value (ACV):** RCV minus appropriate depreciation. A well-maintained ambulance module may have a useful service life of 10–15 years.

**Salvage:** For ambulances, salvage includes:
- Module salvage if remount-viable
- Component salvage (cot fastener system, medical equipment mounts, cabinetry)
- Chassis salvage

**The threshold:** When repair cost plus salvage exceeds RCV (or ACV under ACV policies), total loss is indicated. Document the calculation explicitly in the file.

## Documentation Requirements for Total Loss

A total loss file for an ambulance must include:
- OEM dealer quote for replacement unit (establishes RCV)
- Module condition assessment (supports salvage value determination)
- Chassis damage documentation (supports repair cost)
- Lead time documentation if applicable
- Salvage valuation with methodology
- The total loss calculation showing all inputs`],

      ['mcsa-108-ambulance', 4, `## Ambulance Claims Full Assessment

### The Loss

2020 RAM 4500 Type III ambulance. Module manufacturer: Demers. Front-end collision, significant cab damage including cab crush. Driver airbag deployed. Module visually appears undamaged from the exterior.

### Step 1 — Classification

Tier 3. Type III — cab and module are structurally connected through a pass-through. Significant front-end cab damage is not isolated to the cab. OEM involvement is mandatory. Do not close this file without Demers OEM documentation.

### Step 2 — First 5 Minutes

- Type III confirmed (cutaway cab-and-chassis with Demers module, visible pass-through)
- Demers module manufacturer confirmed from nameplate on module
- Pass-through condition: must inspect from both cab and module sides
- Engine hours: document alongside mileage
- "Module appears undamaged" noted — not a finding, pending OEM inspection

### Step 3 — Documentation Sequence

1. Full four corners and both sides before any approach
2. Pass-through — interior of both cab side and module side
3. Module mounting brackets on chassis rails — all four to six points
4. All module exterior walls for deformation
5. Module electrical panel and oxygen system
6. Cot fastener system (function test required)
7. All cab damage — standard sequence
8. Airbag deployment documentation — module interior for stress effects

### Step 4 — Routing

Primary: Demers-authorized facility. The cab chassis repair can be performed by a commercial truck body shop, but must be coordinated with the Demers facility for module inspection and pass-through certification.

### Step 5 — Return to Service Requirements

Before this unit can return to service:
- Demers OEM inspection and certification of module structural integrity
- Electrical system clearance (both chassis 12V and module system)
- Cot fastener system test and documentation
- Oxygen system pressure test
- Full road test with department fleet manager acceptance`],

      // ── MCSA-109 ─────────────────────────────────────────────────────────

      ['mcsa-109-fire-apparatus', 0, `## The First 30 Minutes at a Fire Apparatus Loss

### Before You Get Out of the Vehicle

Identify the apparatus type from a distance — pumper, aerial, rescue, or tanker. This determines your documentation sequence before you approach. Note the OEM from any visible markings.

### Speak to the Right People

**Fleet manager or apparatus committee member:** Has the technical knowledge. Ask what build sheet they have on file and whether any post-incident inspection has already been performed. Their assessment is relevant context — document it, but it does not substitute for your independent evaluation.

**On-scene company officer (if applicable):** Knows the operational context. How was the apparatus deployed? What systems were in operation at the time?

### Safety — Specific to Fire Apparatus

- **Pump:** If pump was in operation during the incident, the pump and plumbing may still contain pressurized water
- **Aerial:** If deployed during an incident, do not approach or attempt to operate it without OEM guidance
- **Compressed air:** SCBA fill systems and HRT tools operate on high-pressure compressed air — damaged lines or cylinders are a hazard
- **Elevated loads:** Do not enter or climb apparatus with structural damage without stability confirmation

### Document Before Touching

Every compartment, every panel, every visible system — photographed in as-found condition before any doors are opened, any equipment removed, or any temporary repairs are made.

### Define Your Scope of Authority

Your job is to establish what exists, what is damaged, and what systems require OEM evaluation. You are not responsible for determining whether the pump still functions — that requires a certified pump test. You ARE responsible for identifying that the pump must be tested and documenting that requirement.

If you are not certain whether a system requires OEM involvement, note it as "requires OEM assessment" and document why.`],

      ['mcsa-109-fire-apparatus', 1, `## Apparatus Types

**Pumper/Engine:** Most common. 1,000–3,000 GPM pump, 500–1,500 gallon tank. PTO-driven pump — any driveline damage triggers pump inspection.

**Aerial Ladder/Platform:** Hydraulically operated aerial device. Outriggers for stability. Any frame or body damage near the aerial mount triggers mandatory OEM structural inspection.

**Rescue Truck:** Compartmented unit with heavy-duty generator (10–15kW), hydraulic rescue tools (Hurst, Holmatro, Amkus), and compressed air systems.

**Tanker/Tender:** Large capacity (1,500–5,000+ gallons). Baffling is critical — unbaffled water shifts load dramatically.

## The Four Major OEM Manufacturers

**Pierce Manufacturing (Appleton, WI):** Largest U.S. apparatus manufacturer. Custom and commercial chassis builds. Parts catalogs and operator manuals through Pierce dealer network. Build sheets available from fire department fleet files or Pierce dealer with apparatus serial number.

**Rosenbauer:** Austrian manufacturer with significant U.S. market share. Minnesota facility for body manufacturing, Wyoming for chassis-cab. Customer portal contains manuals, wiring diagrams, and parts catalogs.

**E-ONE (Ocala, FL — part of REV Group):** Custom and commercial chassis builds. Known for single-source cab-chassis and body manufacturing.

**KME (Kovatch Mobile Equipment, Nesquehoning, PA):** Known for the Predator cab-chassis. Custom and commercial builds.

## The Build Sheet — Most Important Document

Every custom fire apparatus is built to a unique specification. The build sheet lists:
- Exact pump model and rating
- Tank capacity and material
- Aerial type and rating (if applicable)
- All electrical systems specified
- All compartment configurations

**Request the build sheet at first contact with the fleet manager.** Without it, you are estimating a custom system without knowing what the custom specifications were.`],

      ['mcsa-109-fire-apparatus', 2, `## How Fire Apparatus Systems Interconnect

A fire apparatus is not a collection of independent components — it is an integrated system.

## Pump System

The pump is mechanically connected to the chassis through a power take-off (PTO). Any driveline damage triggers pump inspection. The pump panel is connected to the pump by hydraulic plumbing, control cables, and electrical circuits.

**Pump panel:** Controls all pump functions — pressure gauges, discharge valves, intake connections, primer control. Damage to the body in the pump panel area may affect panel mounting, valve handles, and gauge accuracy.

## Water Tank

Engineered with internal baffling to control water movement. Structurally integrated into the chassis. Rear-end collision may compromise tank mounting points and pump-to-tank plumbing. Tank damage is rarely cosmetic.

## Electrical System

The apparatus electrical panel controls all powered systems: lighting, pump controls, aerial controls (if applicable), compartment lighting, generator connection. A single fault can disable multiple systems.

## Aerial System (Aerial Units Only)

The aerial device is mounted to a structural turntable that transfers all loads to the chassis frame. Any frame or body damage near the turntable area requires OEM structural inspection before the aerial device is operated.

**Critical rule:** An aerial device with unconfirmed structural integrity after a collision must NOT be operated.

## The System Trigger Matrix

| Damage Location | Mandatory Inspections |
|---|---|
| Front end, cab | PTO and driveline; front-mount pump (if applicable); main electrical feeds |
| Driveline | PTO engagement; pump alignment; all PTO-connected systems |
| Pump compartment | Pump mechanical; all plumbing; control panel; tank connections |
| Rear body/compartment | Pump panel; hose bed structure; electrical conduit; mounting points |
| Aerial mount area | Hydraulic system; structural mounting; outrigger system |
| Frame | All mounting points; pump alignment; aerial structural anchors |`],

      ['mcsa-109-fire-apparatus', 3, `## NFPA 1911 — What Adjusters Need to Know

**What it is:** Standard for the Inspection, Maintenance, Testing, and Retirement of In-Service Automotive Fire Apparatus.

**What matters for claims:** Apparatus that has been in a collision must undergo NFPA 1911 service testing before returning to active service in most jurisdictions. The testing cost is a claim cost — it belongs in the scope.

| Test Type | Typical Cost |
|---|---|
| Pump service test | $400–$800 |
| Aerial service test | $600–$1,500 |

Testing must be by certified testing agency, not the repair shop.

## NFPA 1071 — EVT Certification

**What it is:** Standard for Emergency Vehicle Technician Professional Qualifications — the certification standard for technicians who perform maintenance and repair on fire apparatus.

Some jurisdictions legally require NFPA 1071-certified technicians for fire apparatus repairs. Even where not legally required, OEM warranty terms often require certified technician involvement.

## Department SOPs

Some fire departments require OEM inspection before any apparatus returns to service after a collision. Ask the fleet manager directly: "Does your department require OEM inspection before return to service?" Document the answer.

## Practical Checklist for the Claims File

Every fire apparatus file with meaningful collision damage should include:

- Note of whether NFPA 1911 testing is required in the jurisdiction
- If required: testing cost in scope, testing agency identified
- NFPA 1071 technician certification confirmed at repair facility
- OEM involvement documented (inspection, authorization, or certification)
- Return to service documentation attached when completed`],

      ['mcsa-109-fire-apparatus', 4, `## Fire Apparatus Full Scenario Assessment

### The Loss

2019 Pierce Enforcer pumper, 1,500 GPM pump. Intersection collision — rear compartment struck by turning vehicle. Two rear compartment doors damaged, body panel damage on rear, pump panel on opposite (officer's) side appears undamaged visually. Municipality requests routing to their preferred local body shop.

### Step 1 — Classification and Initial Decision

Tier 3, fire apparatus. OEM involvement is mandatory pending system inspection. Do not route to body shop until system trigger protocol is completed.

### Step 2 — System Trigger Protocol

Rear compartment damage triggers:
- Pump panel inspection (opposite side — not "undamaged" until inspected)
- Electrical conduit inspection in rear compartment area
- Hose bed structural integrity
- Rear step mounting
- Any valve handles or controls on rear panel

### Step 3 — Making the Case for OEM Involvement

"For the body panel and door damage, a body shop is absolutely appropriate once we confirm system integrity. The MCSA standard — and the Pierce OEM requirement — is that any structural or system damage on a Pierce pumper requires Pierce-authorized technician involvement before we finalize the repair scope. I need a Pierce technician to inspect the pump panel and electrical system in the rear compartment before we can confirm the body shop can handle this scope."

### Step 4 — Routing Decision

**If OEM inspection finds no system involvement:** Route body and door work to a Pierce-capable body shop. Document OEM clearance. Confirm NFPA 1911 testing requirements.

**If OEM inspection finds system involvement:** Route to Pierce-authorized facility for full repair scope.

### Step 5 — NFPA Documentation

Note in file: NFPA 1911 post-repair pump test required. Testing cost ($500–$700) included in scope. Test results to be attached to file upon completion before final closure.`],

      // ── MCSA-110 ─────────────────────────────────────────────────────────

      ['mcsa-110-municipal-fleet', 0, `## Why Public Works Claims Are Different

Public works equipment is not emergency apparatus — but it is not standard fleet either. A plow truck is purpose-built for its function. A dump truck with a hoist is an integrated system. An aerial bucket truck is a specialty vehicle.

## What Adjusters Frequently Miss on Public Works Units

- **Plow systems:** Hydraulic leak from collision impact — may not be visible until the plow is cycled
- **Dump bodies:** Structural damage to body rails not visible with body down
- **Hydraulic systems:** Cylinder damage from indirect impact (shock loads)
- **Boom/aerial units:** Rotation bearing damage from collision — not apparent on visual inspection
- **Salt spreaders:** Corrosion damage compounded by collision — pre-existing condition vs. new damage determination

## The Seasonal Context

Plow truck claims spike in Q1 (January–March) in northern climates. Understanding the seasonal operating context helps evaluate:
- Why the plow was deployed at time of loss
- Expected wear state on plow components
- Whether pre-existing plow wear is being rolled into the collision claim

A cutting edge that is 80% worn at time of collision was not damaged by the collision — it was worn. Document remaining cutting edge thickness as part of your inspection.

## Public Works Equipment Categories

| Type | Examples | Key Considerations |
|---|---|---|
| Plow trucks | F-350/F-450 with Western, Boss, Fisher | Hydraulic system, cutting edge wear |
| Dump trucks | Medium/heavy commercial with hoist | Body-up inspection required |
| Utility service trucks | Service body or aerial attachment | System complexity varies widely |
| Aerial bucket trucks | Altec, Elliott, Terex, Versalift | OEM involvement for any boom damage |
| Street sweepers | Various OEMs | Water, brush, and suction systems |`],

      ['mcsa-110-municipal-fleet', 1, `## Plow Manufacturers — Identification

| Manufacturer | Identification | Notes |
|---|---|---|
| Western Products | Yellow or red blade, Western label on A-frame | Douglas Dynamics family |
| Boss Snowplows | Orange/red finish, RT3 SmartHitch system | Common in Midwest |
| Fisher Engineering | Yellow blade, Fisher logo on headgear | Douglas Dynamics family |
| Meyer Products | Common in Great Lakes and Midwest | |
| Hiniker Company | Upper Midwest concentration | |

## Plow System Components

**Blade and cutting edge:** The cutting edge is a wear component. Document remaining cutting edge thickness at inspection. Only damage attributable to the collision belongs in the scope.

**A-frame and mounting:** Connects the plow to the vehicle mounting plate. Any frontal collision with plow deployed affects the A-frame and mounting. Document: A-frame straight or bent, mounting plate intact, all mounting hardware present.

**Hydraulic system:** Document the hydraulic pump (vehicle-mounted), reservoir, all cylinders (lift and angle), and all hoses. Cycle the plow through full range of motion if safe and document function and any leaks.

**Electrical system:** Main power leads, control cable, controller unit in cab. Document all connections and test function.

## The Hydraulic Evaluation Protocol

1. Visual inspection of all hydraulic components — cylinders, hoses, fittings, reservoir
2. Check for hydraulic fluid leaks — fresh fluid on ground, wet surfaces on components
3. If safe: cycle plow through full range of motion and observe
4. Document any hesitation, uneven movement, or leaks during operation
5. If hydraulic damage is found or suspected: require hydraulic system flush and pressure test as part of scope

A collision that generates enough force to damage the vehicle body also generates shock loads through the frame and into the hydraulic system. Hydraulic damage that is not visible externally is a common miss.`],

      ['mcsa-110-municipal-fleet', 2, `## Dump Body Evaluation

**With body down:** Inspect all body panels and visible structural members, body-to-frame connection points, hoist cylinder (visible portion), and all body lights.

**With body raised:** This inspection cannot be skipped. Raise the body to full dump position and inspect:
- Body floor and rail condition from below
- Hoist cylinder full extension — straightness, barrel condition, rod condition
- All pivot points and pivot pins
- Tailgate and tailgate hardware

Significant structural damage is only visible with the body raised. Any scope that does not include body-up inspection is incomplete.

## Specialty Equipment — Frequently Missed

**Aerial boom/bucket trucks (Altec, Elliott, Terex, Versalift):** Require boom structural inspection, hydraulic system inspection, bucket inspection, outrigger inspection, and controls inspection. High-value units — do not scope without identifying the OEM and requesting OEM inspection guidance for any boom or structural damage.

**Street sweepers:** Water system, brush drive system, hopper, and suction system all require inspection beyond the chassis.

**Arrow boards and traffic control:** Electrical connections, mounting brackets, and panel condition. Valuation: $2,000–$8,000+ depending on size and LED configuration. Do not treat as scrap value.

## Split Routing for Public Works Equipment

Public works equipment almost always requires split routing:
- Base vehicle chassis: commercial body shop
- Specialized attachment or system: specialty equipment shop

Document the split routing clearly — who does what, in what sequence, and who coordinates the final assembly and function test.`],

      ['mcsa-110-municipal-fleet', 3, `## Fleet Claims Knowledge Check

### Multi-Unit Scenario

A public works department has a single incident involving three units.

**Unit 1:** 2021 Western Products plow truck (Ford F-350 chassis). Front-end collision while plow was deployed. Push bumper bent, front panel damaged, plow A-frame bent, hydraulic function unknown.

**Unit 2:** 2018 International dump truck with 10-yard body and scissor hoist. Rear-end collision, body was raised at time of impact. Tailgate damaged, rear body panel damage, hoist function unknown.

**Unit 3:** 2020 Altec aerial bucket truck (Ford F-550 chassis). Side impact while bucket was elevated. Cab side panel damage, boom condition unknown, outrigger on impact side.

---

### Unit 1 — Plow Truck

**Classification:** Tier 2. Base vehicle is standard commercial. Plow system requires separate evaluation.

**Inspection protocol:** A-frame visual inspection, mounting plate condition, hydraulic cylinder inspection (all three — lift and both angle), hose inspection, hydraulic function test. If function is compromised: hydraulic flush and pressure test.

**Routing:** Split. Front-end body repair to commercial body shop. Plow system to Western-authorized dealer or hydraulic equipment specialist.

### Unit 2 — Dump Truck

**Classification:** Tier 2. Dump body and hoist system require separate evaluation.

**Inspection protocol:** Body-down inspection first. Then body-up inspection: hoist cylinder condition, pivot points, tailgate hardware, body rail condition from below. Document body-blocked-for-inspection safety compliance.

**Routing:** Split. Base vehicle and body damage to commercial body shop. Hoist system hydraulic inspection to hydraulic equipment specialist.

### Unit 3 — Aerial Bucket Truck

**Classification:** Tier 2/Tier 3. Aerial system requires OEM involvement.

**Inspection protocol:** Do not operate boom until OEM inspection is completed. Outrigger on impact side — inspect mounting and hydraulic cylinder. Boom structural integrity requires Altec (or applicable OEM) inspection.

**Routing:** OEM involvement is mandatory for the aerial system. Altec-authorized inspection before any aerial repair or operation.`],

      // ── MCSA-301 ─────────────────────────────────────────────────────────

      ['mcsa-301-file-compliance', 0, `## The MCSA Compliance Scoring System

Files are scored against 25 checkpoints across five categories. Each checkpoint is Pass (1 point) or Fail (0 points). Maximum score: 25. Minimum passing score: 20/25 (80%).

**Automatic failure triggers** — any of the following, regardless of overall score:
- No vehicle classification documented
- No VIN/unit number documented
- Missing photos of primary damage area
- Lump-sum labor (no task breakdown)
- No repair routing documentation

## The Five Compliance Categories

**Category 1 — Classification & Assignment (5 points)**
1. Vehicle tier documented with rationale
2. Appropriate adjuster/specialist assigned for tier
3. Apparatus type and OEM identified (Tier 3)
4. Build sheet or spec document obtained (Tier 3 apparatus)
5. System involvement identified

**Category 2 — Documentation (5 points)**
6. All required photos present per tier standard
7. All photos labeled (location + component + condition)
8. Component inventory complete
9. VIN/unit number verified and documented
10. Odometer/engine hours documented

**Category 3 — Estimate Quality (5 points)**
11. No lump-sum labor items
12. Labor decomposed to task level
13. All labor items within reasonableness range or documented exception
14. Valuation source documented for all major components
15. Valuation within band or documented exception

**Category 4 — Repair Routing (5 points)**
16. Repair facility tier appropriate for vehicle tier and damage type
17. Routing rationale documented
18. Split routing documented where applicable
19. OEM involvement documented where required
20. Return to service documentation included

**Category 5 — System Completeness (5 points)**
21. All system inspection areas photographed
22. Hidden damage investigation documented
23. All equipment present at time of inspection documented
24. Any pre-existing conditions documented
25. NFPA/certification requirements noted where applicable`],

      ['mcsa-301-file-compliance', 1, `## The File Review Process

### Step 1 — Preliminary

Before scoring, establish context: What type of vehicle? What was the damage? What complexity level should this file have? A Tier 1 sedan file should take 5 minutes to review. A Tier 3 fire apparatus file may take 30 minutes.

### Step 2 — Category 1 Review (Classification)

- Is the tier documented? Can I find it in the file?
- Does the documentation reflect the actual vehicle?
- For Tier 3: Is OEM identification present?

### Step 3 — Category 2 Review (Documentation)

Pull up the photo folder. Apply the tier-appropriate photo checklist. Check or fail each item. Do not give partial credit — a photo requirement is either met or it isn't.

### Step 4 — Category 3 Review (Estimate Quality)

Open the estimate. Look for lump-sum labor items immediately — these are automatic failures. For task-level items, check a sample against the reasonableness ranges.

### Step 5 — Categories 4-5

Routing documentation and system completeness. These are often the categories where experienced adjusters fail — they know how to document a car accident but have not been trained to document system involvement.

## Delivering Feedback

File reviews are a quality improvement tool, not a disciplinary action.

**Feedback framing:**
- "This file fails on Category 3 because of a lump-sum labor item — here is how to decompose it correctly"
- NOT: "You accepted the shop estimate without questioning it"

**Pattern recognition:** If the same adjuster's files consistently fail Category 2, that adjuster needs documentation training, not just feedback on individual files.`],

      ['mcsa-301-file-compliance', 2, `## QA Program Elements

### File Sampling Methodology

| Adjuster Type | Sample Rate |
|---|---|
| New adjusters | 100% of files for first 90 days |
| Established adjusters | 20% random sample ongoing |
| All files above $25,000 | 100% reviewed |
| All Tier 3 apparatus files | 100% reviewed |
| Any file with a supplement | Required review |

### KPIs to Track

| KPI | Target |
|---|---|
| Compliance score average by adjuster | ≥ 80% |
| Supplement rate by adjuster | < 10% of files |
| Automatic failure rate | < 5% of reviewed files |

### Feedback Loop

Review → Score → Feedback to adjuster → Track improvement.

Monthly score reports to adjuster. Quarterly trend review. Training intervention when category failure rate exceeds 20%.

## Implementing MCSA Standards at Program Level

For TPAs and carriers implementing MCSA standards across a program:

1. **Baseline assessment** — Score a sample of existing files against the MCSA checklist to establish current performance
2. **Training rollout** — Adjusters complete MCSA-101 through MCSA-106 before handling Tier 2/3 apparatus
3. **Specialty routing** — Identify certified adjusters for Tier 3 apparatus by vehicle type
4. **File review cadence** — Establish the sampling methodology above
5. **KPI reporting** — Monthly dashboard of key metrics to program leadership
6. **Continuous improvement** — Quarterly curriculum review against actual failure patterns`],

      ['mcsa-301-file-compliance', 3, `## Compliance Review Practicum

### File 1 — Police Vehicle Claim

**Vehicle:** 2021 Ford Police Interceptor Utility, full emergency equipment package. Front-end collision, airbag deployment.

**File contents:**
- Vehicle classification: not documented
- Photos: 8 photos — four corners and four damage close-ups
- Estimate: "Emergency equipment R&I — 18 hrs" (single line item)
- Routing: "Sent to municipality's preferred shop — M&M Body Works"
- Component inventory: none

**Scoring:**

| Category | Score | Failures |
|---|---|---|
| Classification | 0/5 | No tier documented (automatic failure) |
| Documentation | 1/5 | VIN present; missing photos, labels, component inventory |
| Estimate Quality | 0/5 | Lump-sum labor (automatic failure) |
| Repair Routing | 1/5 | Facility noted; no capability confirmation, wrong facility type |
| System Completeness | 0/5 | No system inspection, no airbag scope |

**Total: 2/25 — Automatic failure (multiple triggers)**

**Required corrections:** Complete rework. Classification required before any other element. Lump-sum must be decomposed. All photos must be retaken. Shop must be re-evaluated for police upfit capability.

---

### File 2 — Fire Apparatus Claim

**Vehicle:** 2018 Pierce Arrow XT pumper. Rear compartment collision. Two doors damaged.

**File contents:**
- Classification: "Tier 3 — Pierce pumper, 1,500 GPM" ✓
- Photos: 47 photos, all labeled ✓
- Component inventory: complete ✓
- Estimate: fully task-decomposed, all within range ✓
- Routing: "Pierce-authorized facility — Capital Fire Apparatus" ✓
- System inspection: pump panel photographed and noted as undamaged ✓
- OEM: Pierce technician inspection report attached ✓
- NFPA 1911: post-repair pump test scheduled, cost included in scope ✓

**Total: 25/25 — Compliant**

This is a model file. Every element is present, documented, and defensible. No supplements required.`],


      // ── MCSA-201 ─────────────────────────────────────────────────────────

            ['mcsa-201-cmca-certification', 0, `## CMCA Exam Prep — Classification, Documentation & Labor

This module reviews all material from MCSA-101, 102, 103, and 104 in CMCA exam format. Every question tests application — not recall.

## Classification Review — Key Rules

**The classify-up rule:** When uncertain between tiers, always classify up. No exceptions.

**Factory platform rule:** Ford PIU, Chevy Tahoe PPV, Dodge Durango Pursuit, RAM SSV are never treated as civilian vehicles.

**The system trigger rule:** Damage to one area of a Tier 3 apparatus mandates inspection of adjacent systems.

## Practice Questions — Classification

**Q1:** A 2022 Ford F-450 with a utility body and hydraulic lift gate is involved in a rear collision. The lift gate hydraulic cylinder is visibly damaged. What tier?

**A:** Tier 2. Base vehicle is commercial (standard guides apply). Utility body and hydraulic lift gate require separate specialist evaluation. Split routing.

**Q2:** A 2020 Chevy Tahoe PPV with no emergency equipment (reassigned to detective use) is in a parking lot collision. What tier?

**A:** Tier 1 — but document the factory platform. With all upfit removed and the vehicle in non-emergency service, standard guides apply.

**Q3:** A 2017 Pierce Arrow XT pumper has a front-end collision. No visible damage to the pump panel. What tier and what inspections are required?

**A:** Tier 3, full stop. All fire apparatus is Tier 3 regardless of visible system involvement. Front-end damage on a pumper triggers: driveline and PTO inspection, electrical main feed inspection, and front-mount pump assessment. OEM involvement mandatory.

## Practice Questions — Documentation

**Q4:** You arrive at an ambulance loss and the module has no visible damage. List the documentation required on the module regardless.

**A:** Four corners and both sides of module (exterior), all compartment doors open and closed, all equipment inside compartments, pass-through condition (both cab and module sides), module mounting bracket condition, electrical panel, oxygen system, HVAC components, cot fastener system, engine hours.

## Practice Questions — Labor

**Q5:** A shop bills 2.5 hours for a single surface-mount marker light R&I (no new cut opening). Is this within MCSA range?

**A:** No. MCSA range for surface-mount marker light R&I is 0.40–1.0 hr per unit. 2.5 hours exceeds the high end. Require written justification with photographic documentation of specific complexity before accepting above-range billing.`],

      ['mcsa-201-cmca-certification', 1, `## CMCA Exam Prep — Valuation, Routing & Compliance

This module reviews all material from MCSA-105, 106, and 301 in CMCA exam format.

## Valuation Review — Key Rules

**The source hierarchy:** OEM quote > current distributor quote > MCSA band > invoice.

**The "Quote Required" rule:** All apparatus system components (pump, tank, aerial, electrical panel) require an OEM quote. No band applies.

**Condition factors:** Equipment 1–4 years old in good condition: 80–95% of band. 4–8 years: 65–80%. 8+ years: 50–65%.

## Practice Questions — Valuation

**Q1:** A Federal Signal Integrity light bar is being replaced. It is 5 years old, was fully functional before the loss. The shop invoices $3,100. The MCSA band is $1,400–$2,800. What is your approach?

**A:** The invoice exceeds the band. Apply a 5-year condition factor: 70–75% of band mid-point ($2,100) = $1,470–$1,575 as starting value. Require a current Federal Signal distributor quote to establish current market pricing.

**Q2:** A Pierce pumper needs replacement hose bed racking. The shop quotes $2,400 without any documentation. What do you do?

**A:** Hose bed racking is an apparatus component — Quote Required category. Require a written Pierce dealer quote with part number and current pricing. The shop's verbal quote is not a valuation source.

## Practice Questions — Routing

**Q3:** A Type I ambulance has module structural damage — two wall panels are deformed. The municipality wants to use a local ambulance chassis shop. What is your routing decision?

**A:** Module structural damage requires OEM-authorized facility. Confirm whether the proposed shop has authorization from the module manufacturer. If not, route to OEM-authorized facility.

## Practice Questions — Compliance

**Q4:** A file scores 18/25 on the MCSA compliance checklist. Is it compliant?

**A:** No. Minimum passing score is 20/25. Return for correction.

**Q5:** A file has no lump-sum labor but has three lines where labor is above the MCSA range with no documented justification. What is the compliance finding?

**A:** Category 3 failure (Estimate Quality). Above-range labor without documented exception is a compliance failure. Return with specific instruction to provide written justification with photographic documentation for each above-range line item.`],

      ['mcsa-201-cmca-certification', 2, `## CMCA Exam Prep — Specialty Apparatus

This module reviews all material from MCSA-107, 108, 109, and 110 in CMCA exam format.

## Police Vehicles — Key Rules

**Never retail data on a factory police platform.** PIU, PPV, Pursuit, SSV — all require law enforcement-specific evaluation.

**Airbag deployment = comprehensive scope.** Console, partition, wiring harness, radio, push bumper wiring — all must be independently assessed.

**Integrated system rule.** Lighting and siren share a controller — cannot scope one without the other.

## Practice Questions — Police

**Q1:** A 2021 Ford PIU Hybrid has a side collision. Emergency equipment appears undamaged — only body panels involved. Do you include interior systems in your scope?

**A:** Yes. Any significant collision on a police vehicle triggers interior system inspection. The hybrid PIU specifically requires a note about high-voltage system inspection (separate from standard 12V electrical assessment).

**Q2:** A shop scopes a light bar R&I and a siren R&I as separate line items, each at 2.0 hours. The vehicle has a Whelen CenCom integrated controller. Is this correct?

**A:** No. The CenCom controls both lighting and siren through a single integrated controller. Removing the light bar requires disconnecting the CenCom, which simultaneously disconnects the siren control. The shop is double-billing the CenCom connection work.

## Practice Questions — Ambulances

**Q3:** A Type III ambulance has a rear collision. The module is visually undamaged. Is OEM involvement required?

**A:** Yes — always on Tier 3 apparatus with collision damage. The module manufacturer must inspect the module structure and pass-through connection integrity before the file can be closed.

## Practice Questions — Fire Apparatus

**Q4:** A pumper has rear compartment damage. The pump panel is on the opposite side with no visible damage. Why is a Pierce technician required?

**A:** Three reasons. First, the system trigger protocol mandates pump panel inspection when there is rear compartment damage regardless of location. Second, Pierce OEM policy requires authorized technician involvement in any collision affecting the apparatus body. Third, NFPA 1911 post-repair testing will be required.

## Practice Questions — Public Works

**Q5:** A plow truck has a front-end collision with the plow deployed. The A-frame is bent. What else must be inspected?

**A:** Hydraulic system (all cylinders, hoses, reservoir, pump), mounting plate integrity, all hydraulic connections, and plow electrical system. If hydraulic function is unknown or compromised: hydraulic flush and pressure test.`],

      ['mcsa-201-cmca-certification', 3, `## CMCA Certification Examination

### Examination Details

| Item | Detail |
|---|---|
| Questions | 60 multiple choice |
| Passing score | 48/60 (80%) |
| Time limit | 90 minutes |
| Format | Four answer choices per question, one correct answer |
| Attempts | Three permitted |
| Waiting period | 30 days between attempts |
| Certificate validity | 3 years from date of issue |

### What the Exam Covers

| Topic Area | Approx. Questions |
|---|---|
| Classification (MCSA-101, 102) | 10 |
| Documentation & Photo Standards (MCSA-103) | 8 |
| Labor Control (MCSA-104) | 10 |
| Valuation (MCSA-105) | 8 |
| Repair Routing (MCSA-106) | 6 |
| Police Vehicles (MCSA-107) | 6 |
| Ambulances (MCSA-108) | 6 |
| Fire Apparatus (MCSA-109) | 6 |
| File Compliance (MCSA-301) | 5 |

### Pre-Exam Checklist

Before sitting the exam, confirm you can answer yes to all of the following:

- I can classify any municipal vehicle into the correct tier without hesitation
- I know the minimum photo requirements for each tier
- I can decompose any emergency equipment labor item into task-level components
- I know the MCSA labor ranges for the 10 highest-variance tasks
- I know the valuation bands for the five main equipment categories
- I can apply the routing matrix without referencing it
- I know the three OEM involvement triggers for Tier 3 apparatus
- I understand the MCSA compliance scoring system and automatic failure categories
- I can explain NFPA 1911 and why it appears in a claims file
- I know the remount analysis decision framework

### Exam Strategy

**Read the scenario completely before reading the answer choices.** CMCA questions are scenario-based.

**Eliminate first.** On a four-choice question, identify which answers are clearly wrong before selecting the correct one.

**Trust the rules.** The MCSA curriculum contains several absolute rules: never retail data on a factory police platform, always classify up when uncertain, always require OEM involvement on apparatus structural damage. When you see these conditions in an exam question, trust the rule.

**Time management.** 90 minutes for 60 questions = 90 seconds per question. Flag uncertain questions and return rather than spending 4 minutes on a single question during the first pass.`],
    ]

    let updated = 0
    for (const [slug, order, content] of updates) {
      const result = await client.query(
        `UPDATE mcsa_modules
         SET content = $1
         WHERE order_index = $2
           AND course_id = (SELECT id FROM mcsa_courses WHERE slug = $3)`,
        [content, order, slug]
      )
      if ((result.rowCount ?? 0) > 0) updated++
    }

    const { rows: verify } = await client.query(
      `SELECT count(*)::int as n FROM mcsa_modules WHERE content IS NOT NULL AND length(content) > 100`
    )

    client.release()
    return NextResponse.json({
      success: true,
      modules_attempted: updates.length,
      modules_updated: updated,
      modules_with_content: verify[0].n,
    })
  } catch (err: any) {
    client?.release()
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
