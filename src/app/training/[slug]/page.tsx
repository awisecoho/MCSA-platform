import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, BookOpen, Award, CheckCircle, ChevronRight, Lock, Play, ArrowRight, ExternalLink, FileText, Youtube } from 'lucide-react'
import { supabase } from '@/lib/supabase'

async function getCourse(slug: string) {
  const { data } = await supabase
    .from('mcsa_courses')
    .select('*, mcsa_course_categories(name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

async function getModules(courseId: string) {
  const { data } = await supabase
    .from('mcsa_modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index')
  return data || []
}

const courseVideos: Record<string, { title: string; description: string; youtubeId: string; source: string; module: string }[]> = {
  'mcsa-107-police-vehicles': [
    { title: 'How We Upfitted This 2023 Ford Interceptor', description: 'Real upfit shop walkthrough showing full emergency equipment installation on a PIU — lighting, console, partition, and radio integration from start to finish. Demonstrates why PIU upfitting is not a simple bolt-on job.', youtubeId: 'msVEhQENp3g', source: 'YouTube — Emergency Vehicle Upfitter', module: 'Module 2 — Lighting Systems' },
    { title: '80+ Hours to Upfit This Ford Interceptor', description: 'Detailed upfit documentation of the complete scope of equipment installation. Shows the full labor picture for a properly equipped police interceptor.', youtubeId: '7n_pYfjRsvM', source: 'YouTube — Emergency Vehicle Upfitter', module: 'Module 3 — Interior Systems' },
    { title: 'Ford Pro VIS 2.0 — Upfitting & Vehicle Customization', description: 'Official Ford Pro webinar on the Upfitter Interface System and factory wiring architecture. Essential background for understanding what the factory builds before the upfitter starts.', youtubeId: 'X8HYpfePBQY', source: 'YouTube — Ford Pro', module: 'Module 1 — Police Platforms' },
    { title: 'Whelen Core System — Feature Spotlight', description: 'Whelen Engineering explains how the Core integrated lighting and siren control system works. Demonstrates the integrated system concept — lighting and siren share one controller.', youtubeId: 'zv64bVE00XY', source: 'YouTube — Whelen Engineering', module: 'Module 2 — Lighting Systems' },
  ],
  'mcsa-108-ambulance': [
    { title: 'How Ambulances Are Made at Braun Industries', description: 'VP of Sales walks through the complete ambulance manufacturing process. Shows structural extrusion frames, module construction, electrical systems, and cabinetry — what adjusters need to understand about system complexity.', youtubeId: 'DatLUUBPS-E', source: 'YouTube — Braun Ambulances', module: 'Module 1 — Classification & Manufacturers' },
    { title: 'Braun Ambulances — 50 Years of Manufacturing', description: 'Overview of the Braun ambulance build process and product line covering Type I and Type III configurations, module construction, and quality standards.', youtubeId: 'CQb_8ZDmBeI', source: 'YouTube — Braun Ambulances', module: 'Module 2 — Module Systems' },
  ],
  'mcsa-109-fire-apparatus': [
    { title: 'Inside the Rosenbauer Factory — How Fire Trucks Are Built', description: 'Complete behind-the-scenes factory tour showing chassis construction, body fabrication, pump integration, and electrical systems. The integrated system concept made visible.', youtubeId: 'vccEi4ob_YU', source: 'YouTube — Rosenbauer', module: 'Module 1 — First Response for the Adjuster' },
    { title: 'Rosenbauer Motors Facility Tour — Chassis & Cab', description: 'Tour of the Rosenbauer Wyoming facility showing how custom chassis and cab systems are designed and built. Why apparatus chassis are not standard commercial trucks.', youtubeId: 'dV6bwsomneA', source: 'YouTube — Rosenbauer America', module: 'Module 2 — Apparatus Types & Manufacturers' },
    { title: 'Pierce Manufacturing — Building the Most Advanced Fire Trucks', description: 'Detailed look at Pierce manufacturing processes including pump assembly, compartment fabrication, and final build. Shows the level of engineering integration that makes fire apparatus Tier 3.', youtubeId: 'm8EZCg2Y19I', source: 'YouTube — FD Engineering', module: 'Module 2 — Apparatus Types & Manufacturers' },
    { title: 'Rosenbauer Minnesota Body Facility Tour', description: 'Tour showing fire apparatus body manufacturing, compartmentation, and finishing. Demonstrates body construction complexity and compartment engineering.', youtubeId: 'uUo5hjD4xJk', source: 'YouTube — Rosenbauer America', module: 'Module 3 — Integrated Systems' },
    { title: 'NFPA 1911 & 1915 — Apparatus Inspection and Maintenance', description: 'Retired Battalion Chief explains NFPA 1911 requirements for in-service apparatus. Critical background — what post-collision testing is required before return to service.', youtubeId: 'U3AJi_Za6fE', source: 'YouTube — Emergency Reporting', module: 'Module 4 — NFPA Standards' },
  ],
  'mcsa-110-municipal-fleet': [
    { title: 'Fisher Engineering — Introduction to Plow Hydraulics', description: "Fisher's official training module on plow hydraulic systems. Covers hydraulic components, how they work together, and system operation. Essential for evaluating hidden hydraulic damage after a collision.", youtubeId: '8umoHfPh9YA', source: 'YouTube — Fisher Engineering', module: 'Module 2 — Plow Systems' },
  ],
}

const courseResources: Record<string, { title: string; description: string; url: string; type: 'pdf' | 'web'; badge: string }[]> = {
  'mcsa-107-police-vehicles': [
    { title: 'Ford Pro Upfitter Publications', description: 'Official Ford Pro resource hub — Body Builder Layout Books, wiring diagrams, upfitter interface guides, and CAD files for the Police Interceptor Utility. The primary OEM reference for PIU wiring and pre-wired circuit locations.', url: 'https://www.fordpro.com/en-us/upfit/publications/', type: 'web', badge: 'OEM Reference' },
    { title: 'Ford Pro BBAS Upfitter Support', description: 'Ford Pro Body Builder Advisory Service — technical support for upfitters. Where to direct OEM questions about PIU modifications and system integration.', url: 'https://www.fordpro.com/en-us/upfit/bbas/', type: 'web', badge: 'OEM Support' },
    { title: 'Whelen Install Guides (All Products)', description: 'All Whelen product installation guides — searchable by product. Critical reference for understanding wiring complexity, connection points, and system architecture for every Whelen emergency lighting and siren product.', url: 'https://www.whelen.com/support-and-training/install-guides', type: 'web', badge: 'Vendor Reference' },
    { title: 'Whelen Training & WEVT Certification', description: 'Free Whelen training courses covering emergency lighting products, installation, and programming. Includes the free WEVT (Whelen Engineering Vehicle Technician) certification program.', url: 'https://www.whelen.com/whelen-training', type: 'web', badge: 'Free Training' },
  ],
  'mcsa-108-ambulance': [
    { title: 'Braun — Type I vs Type III Ambulance Guide', description: "Braun's official comparison of Type I and Type III configurations — chassis differences, pass-through design, use cases. The clearest manufacturer explanation of type differences available publicly.", url: 'https://www.braunambulances.com/whats-the-difference-between-a-type-i-vs-type-iii-ambulance/', type: 'web', badge: 'OEM Reference' },
    { title: 'Braun Ambulance Types Overview', description: 'Complete Braun product line overview including all ambulance types, chassis options, and module configurations. Use to identify Braun-manufactured units in the field.', url: 'https://www.braunambulances.com/custom-ambulances/ambulance-types/', type: 'web', badge: 'OEM Reference' },
    { title: 'Braun Manufacturing Facility & Remount Center', description: "Braun's 105,000 sq ft plant in Van Wert, Ohio and dedicated remount facility in Elkhart, Indiana. Relevant for routing decisions — Braun has a dedicated remount facility.", url: 'https://www.braunambulances.com/us-ohio-ambulance-manufacturer/ambulance-manufacturers-in-usa/', type: 'web', badge: 'Manufacturer Info' },
    { title: 'Life Line — Type I vs Type III Comparison Guide', description: 'Independent guide to Type I vs Type III selection factors including chassis, fuel type, service life, and road conditions. Useful for total loss and replacement analysis.', url: 'https://www.lifelineambulance.com/resource-center/guide-to-ambulances-types-i-vs-type-iii/', type: 'web', badge: 'Reference Guide' },
  ],
  'mcsa-109-fire-apparatus': [
    { title: 'Pierce Mfg — Product Support & Training Hub', description: "Pierce's official support hub — operator manuals, training events, dealer network, and factory direct training. Starting point for any Pierce apparatus OEM documentation request.", url: 'https://www.piercemfg.com/service/product-support', type: 'web', badge: 'OEM Support' },
    { title: 'Pierce Inside Videos — Manufacturing Process Library', description: "Pierce's official video library showing pump assembly, ladder assembly, chassis build, cab construction, and more. Demonstrates the integration complexity that makes apparatus Tier 3.", url: 'https://www.piercemfg.com/Pierce/Videos', type: 'web', badge: 'OEM Videos' },
    { title: 'NFPA 1911 — Standard Overview (NFPA.org)', description: 'Official NFPA resource for NFPA 1911 Standard for the Inspection, Maintenance, Testing, and Retirement of In-Service Emergency Vehicles. Standard reference for post-collision testing requirements.', url: 'https://nfpa92.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=1911', type: 'web', badge: 'NFPA Standard' },
    { title: 'NFPA 1911 & 1071 — EVT Overview (IAFC PDF)', description: 'IAFC presentation on NFPA 1911/1071 and Emergency Vehicle Technician certification. Explains what the standards require and how they apply to apparatus in service.', url: 'https://www.iafc.org/docs/default-source/1emerg-vehicle-mgnt/evms_nfpa1911_1071andevt.pdf', type: 'pdf', badge: 'PDF Reference' },
    { title: 'NFPA 1911 — 2017 Update Explained', description: 'Clear explanation of the 2017 NFPA 1911 update including the expansion to cover ambulances. Practical overview for adjusters who need to understand what the standard requires.', url: 'https://www.fireapparatusmagazine.com/fire-apparatus/nfpa-1911-apparatus-maintenance-standard-updated-for-2017/', type: 'web', badge: 'Standards Guide' },
    { title: 'Rosenbauer America — Resource Hub', description: 'Rosenbauer America product information, facility tours, and technical resources. Starting point for Rosenbauer apparatus OEM documentation requests.', url: 'https://rosenbaueramerica.com', type: 'web', badge: 'OEM Reference' },
  ],
  'mcsa-110-municipal-fleet': [
    { title: 'BOSS Plow — Training & Tech Support Videos', description: 'BOSS Snowplow official training video library covering product operation, maintenance, hydraulics, and troubleshooting. Reference for plow system components and failure modes.', url: 'https://bossplow.com/en/support/videos', type: 'web', badge: 'Vendor Training' },
    { title: 'Fisher Engineering — Product & Technical Resources', description: 'Fisher Engineering official site — product specifications, installation guides, and technical resources. Fisher and Western are both Douglas Dynamics brands with shared technical architecture.', url: 'https://fisherplows.com/', type: 'web', badge: 'Vendor Reference' },
    { title: 'BOSS Plow Parts Glossary', description: 'Comprehensive glossary of snowplow terminology: A-frame, hydraulic manifold, lift cylinder, trip systems, cutting edge, power unit. Essential vocabulary for documenting plow system damage.', url: 'https://info.bossplow.com/blog/blog/bid/157843/the-ultimate-glossary-of-snow-plow-parts-terminology', type: 'web', badge: 'Terminology' },
  ],
  'mcsa-102-vehicle-classification': [
    { title: 'Ford Police Interceptor Utility — Factory Features', description: "Ford's official PIU features page — factory wiring packages, 250-amp alternator, pre-wired circuits, upfit-friendly features. Demonstrates factory-level differences from the retail Explorer.", url: 'https://www.ford.com/police-vehicles/features/upfit/', type: 'web', badge: 'OEM Reference' },
  ],
  'mcsa-106-repair-routing': [
    { title: 'West Penn Vehicle Specialists — Emergency Vehicle Upfitting', description: 'Example of a Tier 2 specialty upfitter shop — capabilities, process, and equipment handled. Reference for understanding what a qualified upfitter shop actually does versus a standard body shop.', url: 'https://westpennvs.com/emergency-vehicle-upfitting/', type: 'web', badge: 'Shop Example' },
  ],
}

const badgeColors: Record<string, string> = {
  'OEM Reference': 'bg-blue-50 text-blue-700 border-blue-200',
  'OEM Support': 'bg-blue-50 text-blue-700 border-blue-200',
  'OEM Videos': 'bg-blue-50 text-blue-700 border-blue-200',
  'Vendor Reference': 'bg-purple-50 text-purple-700 border-purple-200',
  'Vendor Training': 'bg-purple-50 text-purple-700 border-purple-200',
  'NFPA Standard': 'bg-red-50 text-red-700 border-red-200',
  'PDF Reference': 'bg-orange-50 text-orange-700 border-orange-200',
  'Standards Guide': 'bg-orange-50 text-orange-700 border-orange-200',
  'Free Training': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Reference Guide': 'bg-slate-100 text-slate-600 border-slate-200',
  'Terminology': 'bg-slate-100 text-slate-600 border-slate-200',
  'Manufacturer Info': 'bg-slate-100 text-slate-600 border-slate-200',
  'Shop Example': 'bg-amber-50 text-amber-700 border-amber-200',
}

const levelLabel: Record<string, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
const levelColor: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug)
  if (!course) notFound()
  const modules = await getModules(course.id)
  const previewModule = modules.find((m: any) => m.is_preview) || modules[0]
  const videos = courseVideos[params.slug] || []
  const resources = courseResources[params.slug] || []

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <div className="bg-navy-900 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/training" className="hover:text-white">Training</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white truncate max-w-xs">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {course.is_certification ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-gold-500/20 text-gold-400">
                    <Award className="w-3.5 h-3.5" /> Certification Course
                  </span>
                ) : (
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColor[course.level] || 'bg-slate-200 text-slate-700'}`}>
                    {levelLabel[course.level] || course.level}
                  </span>
                )}
                {videos.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-400">
                    <Youtube className="w-3 h-3" /> {videos.length} Videos
                  </span>
                )}
                {resources.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                    <FileText className="w-3 h-3" /> {resources.length} Resources
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-snug" style={{ fontFamily: 'var(--font-playfair)' }}>
                {course.title}
              </h1>
              <p className="text-slate-300 text-lg mb-4 leading-relaxed">{course.description}</p>
              {course.long_description && <p className="text-slate-400 leading-relaxed">{course.long_description}</p>}

              <div className="flex flex-wrap gap-6 mt-8 text-sm text-slate-300">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold-400" />{course.duration_minutes} min</div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-gold-400" />{modules.length} modules</div>
                {videos.length > 0 && <div className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-400" />{videos.length} videos</div>}
                {resources.length > 0 && <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-400" />{resources.length} resources</div>}
                {course.is_certification && <div className="flex items-center gap-2"><Award className="w-4 h-4 text-gold-400" />Earn CMCA</div>}
              </div>
            </div>

            {/* Enrollment card */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-24">
                <div className="text-center mb-6">
                  {course.is_member_free ? (
                    <><div className="text-3xl font-bold text-navy-900 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>Free</div><div className="text-sm text-slate-500">with MCSA membership</div></>
                  ) : (
                    <><div className="text-3xl font-bold text-navy-900 mb-1">${(course.price_cents / 100).toFixed(0)}</div><div className="text-sm text-slate-500">one-time purchase</div></>
                  )}
                </div>
                <Link href="/login?redirect=/dashboard/courses" className="block w-full text-center bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 rounded-xl mb-3 transition-colors">Enroll Now</Link>
                <Link href="/membership" className="block w-full text-center border border-gold-400 text-gold-600 hover:bg-gold-50 font-semibold py-3 rounded-xl mb-4 transition-colors text-sm">Get All Courses — Join MCSA</Link>
                <ul className="space-y-2.5 mt-2">
                  {['All modules included', videos.length > 0 ? `${videos.length} embedded training videos` : null, resources.length > 0 ? `${resources.length} reference resources` : null, 'Progress tracking & notes', course.is_certification ? 'CMCA exam included' : 'Module knowledge checks'].filter(Boolean).map(item => (
                    <li key={item as string} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">

            {/* Preview module */}
            {previewModule && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-navy-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                  <Play className="w-4 h-4 text-navy-700" />
                  <span className="font-semibold text-navy-900 text-sm">Preview: {previewModule.title}</span>
                  <span className="ml-auto text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Free Preview</span>
                </div>
                <div className="p-6 md:p-8">
                  <div className="prose-mcsa max-w-none">
                    {previewModule.content?.split('\n').map((line: string, i: number) => {
                      if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>
                      if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>
                      if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1.5rem' }}>{line.replace('- ', '')}</li>
                      if (line === '') return <br key={i} />
                      return <p key={i}>{line}</p>
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Embedded Videos */}
            {videos.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <Youtube className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">Training Videos</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Curated manufacturer & industry videos</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-200">{videos.length} videos</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {videos.map((video, i) => (
                    <div key={i} className="p-6">
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-slate-400 mb-1">{video.module}</div>
                        <h4 className="font-semibold text-navy-900 text-sm mb-1">{video.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-1">{video.description}</p>
                        <span className="text-xs text-slate-400">{video.source}</span>
                      </div>
                      <div className="relative w-full rounded-xl overflow-hidden bg-slate-900" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reference Resources */}
            {resources.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">Reference Resources</h3>
                    <p className="text-xs text-slate-500 mt-0.5">OEM documentation, vendor guides & standards</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-200">{resources.length} resources</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {resources.map((resource, i) => (
                    <a key={i} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors group">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${resource.type === 'pdf' ? 'bg-orange-50' : 'bg-blue-50'}`}>
                        {resource.type === 'pdf' ? '📄' : '🔗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-navy-900 text-sm group-hover:text-navy-700 transition-colors">{resource.title}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${badgeColors[resource.badge] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{resource.badge}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{resource.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-navy-600 flex-shrink-0 mt-0.5 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Module list */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="font-bold text-navy-900">Course Modules</h3>
                <p className="text-sm text-slate-500 mt-0.5">Enroll or log in to access all modules</p>
              </div>
              {modules.map((module: any, idx: number) => (
                <div key={module.id} className={`flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-0 ${module.is_preview ? 'bg-emerald-50/30' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${module.is_preview ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {module.is_preview ? <Play className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-navy-900">{module.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{module.duration_minutes} min</div>
                  </div>
                  {module.is_preview && <span className="text-xs text-emerald-600 font-semibold">Free</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-navy-900 mb-4">What you'll learn</h3>
              <ul className="space-y-2.5">
                {course.long_description?.split('.').filter((s: string) => s.trim().length > 20).slice(0, 5).map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-navy-600 flex-shrink-0 mt-0.5" />{point.trim()}.
                  </li>
                ))}
              </ul>
            </div>

            {videos.length > 0 && (
              <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Youtube className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-800 text-sm">{videos.length} Training Videos Included</span>
                </div>
                <p className="text-xs text-red-700 leading-relaxed">Curated videos from OEM manufacturers showing real equipment, real manufacturing, and real system complexity — not found anywhere else in claims training.</p>
              </div>
            )}

            {resources.length > 0 && (
              <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-800 text-sm">{resources.length} Reference Resources</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">Direct links to OEM documentation, vendor installation guides, and industry standards — the actual sources adjusters need in the field.</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-navy-900 mb-3">Complete the Curriculum</h3>
              <p className="text-sm text-slate-600 mb-4">Earn the CMCA designation by completing all 10 core courses and passing the certification exam.</p>
              <Link href="/accreditation" className="flex items-center gap-1 text-navy-700 font-semibold text-sm hover:gap-2 transition-all">
                CMCA Requirements <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
