'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Link from 'next/link'
import {
  ChevronRight, ChevronLeft, Save, Download, Printer,
  CheckCircle, AlertTriangle, XCircle, Lock, FileText,
  Shield, Truck, Flame, Wrench, Wind, LayoutGrid,
  Info, Eye, Clock, AlertCircle
} from 'lucide-react'

// ─── TYPES ───────────────────────────────────────────────────────────────────

type PhotoItem = {
  photo_item: string
  status: 'Present' | 'Missing' | 'N/A'
  notes: string
}

type ComponentItem = {
  component_name: string
  system_category: string
  oem_aftermarket: string
  condition: string
  recommendation: string
  documentation_needed: string
  notes: string
}

type FormData = Record<string, any>

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STEPS = [
  { id: 'claim_info',         label: 'Claim Info',           icon: FileText },
  { id: 'unit_classification',label: 'Unit Classification',  icon: Truck },
  { id: 'scene_inspection',   label: 'Scene Inspection',     icon: Eye },
  { id: 'photo_checklist',    label: 'Photo Checklist',      icon: CheckCircle },
  { id: 'component_inventory',label: 'Component Inventory',  icon: LayoutGrid },
  { id: 'repair_labor_review',label: 'Repair / Labor',       icon: Wrench },
  { id: 'valuation_total_loss',label: 'Valuation',           icon: AlertTriangle },
  { id: 'compliance_review',  label: 'Compliance',           icon: Shield },
  { id: 'export_packet',      label: 'Export',               icon: Download },
]

const UNIT_TYPES = ['Police Vehicle','Ambulance','Fire Apparatus','Public Works','Sweeper / Vacuum Truck','Other Municipal Fleet']
const TIERS = ['Tier 1 - Standard Fleet','Tier 2 - Modified Commercial','Tier 3 - Integrated Apparatus / Specialty Unit']

const UNIT_ICON: Record<string, any> = {
  'Police Vehicle': Shield,
  'Ambulance': AlertCircle,
  'Fire Apparatus': Flame,
  'Public Works': Truck,
  'Sweeper / Vacuum Truck': Wind,
  'Other Municipal Fleet': LayoutGrid,
}

const RISK_FLAGS = [
  'High labor variance','Specialty equipment involved','OEM/dealer required',
  'Estimate likely inflated','Valuation support weak','Total loss exposure',
  'Municipal downtime concern','Safety/return-to-service concern',
  'Insufficient photos','Missing serial/VIN evidence',
]

const PHOTO_BASE = [
  'VIN / serial plate','Odometer / hour meter','4-corner exterior',
  'Damage overview','Damage close-ups','Interior overview',
  'Tire/wheel area','Undercarriage where accessible',
  'Equipment overview','Prior damage / unrelated condition',
]

const PHOTO_BY_TYPE: Record<string, string[]> = {
  'Police Vehicle': ['Emergency lights','Siren speaker','Console','Cage / partition','Radio equipment','Push bumper','Spotlight','Prisoner transport area','Weapon/rack mounts'],
  'Ambulance': ['Module exterior','Module interior','Cot/retention system','Oxygen system','Shoreline / inverter','HVAC','Cab-to-module pass-through','Warning lights','Cabinetry'],
  'Fire Apparatus': ['Pump panel','Pump plumbing','Tank fill/discharge','Compartments','Aerial/ladder system','Stabilizers/outriggers','Generator','Lighting','Hose bed'],
  'Public Works': ['Plow frame','Hydraulic pump','Hydraulic hoses/cylinders','Dump body','Spreader','PTO','Lighting/arrow board','Tool boxes'],
  'Sweeper / Vacuum Truck': ['Debris hopper','Vacuum fan','Boom hose','Broom assemblies','Water tank','Spray nozzles','Hydraulic lines','Control panel'],
  'Other Municipal Fleet': ['Specialty equipment overview','Mounting points','Controls','Accessories','Serial plates'],
}

const COMPONENT_PRESETS: Record<string, string[]> = {
  'Police Vehicle': ['Emergency lightbar','Grille/intersection lights','Siren amplifier','Siren speaker','Push bumper','Spotlight','Center console','Partition / prisoner cage','Rear seat / transport insert','Radio head / microphone','Antenna / roof penetrations','Power distribution / wiring harness'],
  'Ambulance': ['Modular ambulance body','Cab-to-module pass-through','Cot fastener / retention system','Oxygen cabinet/system','Interior cabinetry','Shoreline / inverter / charger','Warning lights','HVAC module unit','Scene lighting','Rear doors / compartment doors','Module mounting points'],
  'Fire Apparatus': ['Pump panel','Fire pump','Pump plumbing / valves','Water tank','Aerial ladder / boom','Turntable','Outriggers / stabilizers','Compartments / roll-up doors','Generator','Scene lighting','Hose bed','Steps / grab handles'],
  'Public Works': ['Snow plow blade','Plow frame / mount','Hydraulic pump','Hydraulic hoses/cylinders','Dump body','Tailgate','Salt spreader','PTO','Arrow board','Tool boxes / storage'],
  'Sweeper / Vacuum Truck': ['Debris hopper','Vacuum fan','Boom hose','Suction tube','Side broom assembly','Main broom','Water tank','Spray nozzles','Hydraulic pump/lines','Control panel'],
}

const STATUSES = ['Draft','Field Complete','Pending Documentation','Ready for Estimate Review','Ready for Carrier Submission','Returned for Correction','Closed']

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder = '', className = '' }: any) {
  return (
    <input type={type} value={value||''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 ${className}`} />
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value||''} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 bg-white">
      <option value="">Select...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function Textarea({ value, onChange, rows = 3, placeholder = '' }: any) {
  return (
    <textarea value={value||''} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none" />
  )
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-amber-400' : 'bg-gray-200'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

function CurrencyInput({ value, onChange }: { value: number|string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
      <input type="number" value={value||''} onChange={e => onChange(e.target.value)} min="0" step="100"
        className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
    </div>
  )
}

// ─── PRINT PACKET ────────────────────────────────────────────────────────────

function PrintPacket({ pkg, photos, components, watermarked, onClose }: any) {
  const date = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
  const fd = pkg.form_data || {}

  useEffect(() => {
    const t = setTimeout(() => window.print(), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto print:static print:overflow-visible">
      {/* Screen controls */}
      <div className="print:hidden flex items-center justify-between px-6 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <span className="text-sm text-gray-600">Print preview — use Ctrl+P / Cmd+P to print or save as PDF</span>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800">✕ Close</button>
      </div>

      <div className="max-w-4xl mx-auto p-8 print:p-6 font-[Arial,sans-serif] relative">
        {watermarked && (
          <div className="print:block hidden fixed inset-0 flex items-center justify-center pointer-events-none z-50" style={{transform:'rotate(-35deg)'}}>
            <span className="text-6xl font-bold text-gray-200 opacity-60 tracking-widest">PREVIEW ONLY</span>
          </div>
        )}
        {watermarked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 print:hidden"
            style={{transform:'rotate(-35deg)'}}>
            <span className="text-5xl font-bold text-gray-200 tracking-widest">PREVIEW ONLY</span>
          </div>
        )}

        {/* Cover */}
        <div className="border-b-4 border-amber-400 pb-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#07061f] rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="font-bold text-[#07061f] text-lg" style={{fontFamily:'Georgia,serif'}}>MCSA</div>
                  <div className="text-xs text-gray-500">Municipal Claims Standards Association</div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#07061f] mt-4" style={{fontFamily:'Georgia,serif'}}>
                Claim Package — {pkg.claim_number || 'Draft'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Generated {date}</p>
            </div>
            <div className="text-right text-sm text-gray-600 space-y-1">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${pkg.compliance_score === 'Pass' ? 'bg-emerald-100 text-emerald-700' : pkg.compliance_score === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                {pkg.compliance_score || 'Pending Review'}
              </div>
              <div className="text-gray-400 text-xs">{pkg.file_status}</div>
            </div>
          </div>
        </div>

        {/* Inspection Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#07061f] border-b border-gray-200 pb-2 mb-4" style={{fontFamily:'Georgia,serif'}}>1. Inspection Summary</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[['Carrier',pkg.carrier_name],['Adjuster',pkg.adjuster_name],['Municipality',pkg.municipality_name],
              ['Department',pkg.department],['Loss Date',pkg.loss_date],['Inspection Date',pkg.inspection_date],
              ['Loss Type',pkg.loss_type],['Location',pkg.loss_location],['Contact',pkg.contact_person],
              ['Phone',pkg.contact_phone]].map(([k,v]) => v ? (
              <div key={k} className="flex gap-2"><span className="text-gray-500 w-28 flex-shrink-0">{k}:</span><span className="font-medium text-gray-800">{v}</span></div>
            ) : null)}
          </div>
        </section>

        {/* Unit Classification */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#07061f] border-b border-gray-200 pb-2 mb-4" style={{fontFamily:'Georgia,serif'}}>2. Unit Classification</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[['Unit Type',pkg.unit_type],['MCSA Tier',pkg.tier],['Year',pkg.year],['Make',pkg.make],
              ['Model',pkg.model],['VIN',pkg.vin],['Mileage',pkg.mileage],['Hours',pkg.hours],
              ['Unit #',pkg.unit_number],['Status',pkg.in_service_status],
              ['Body Mfr',pkg.specialty_body_manufacturer],['Body Serial',pkg.specialty_body_serial]].map(([k,v]) => v ? (
              <div key={k} className="flex gap-2"><span className="text-gray-500 w-28 flex-shrink-0">{k}:</span><span className="font-medium text-gray-800">{v}</span></div>
            ) : null)}
          </div>
        </section>

        {/* Scene Inspection */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#07061f] border-b border-gray-200 pb-2 mb-4" style={{fontFamily:'Georgia,serif'}}>3. Scene Inspection</h2>
          <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
            {[['Drivable','drivable'],['Safety Issues','safety_issues_present'],['Structural Damage','structural_damage'],
              ['Equipment Damage','equipment_damage'],['Fluids/Leaks','fluids_or_leaks'],['Electrical Issues','electrical_issues']].map(([label,key]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex-shrink-0 ${fd[key] ? 'bg-amber-400' : 'bg-gray-200'}`} />
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
          {fd.initial_damage_summary && <div className="text-sm"><span className="font-medium text-gray-700">Damage Summary: </span>{fd.initial_damage_summary}</div>}
        </section>

        {/* Photo Checklist */}
        {photos.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#07061f] border-b border-gray-200 pb-2 mb-4" style={{fontFamily:'Georgia,serif'}}>4. Photo Checklist</h2>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-[#07061f] text-white"><th className="text-left px-3 py-2">Item</th><th className="text-left px-3 py-2 w-24">Status</th><th className="text-left px-3 py-2">Notes</th></tr></thead>
              <tbody>
                {photos.map((p: any, i: number) => (
                  <tr key={i} className={i%2===0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-3 py-1.5">{p.photo_item}</td>
                    <td className="px-3 py-1.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status==='Present' ? 'bg-emerald-100 text-emerald-700' : p.status==='N/A' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                    </td>
                    <td className="px-3 py-1.5 text-gray-500">{p.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Component Inventory */}
        {components.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#07061f] border-b border-gray-200 pb-2 mb-4" style={{fontFamily:'Georgia,serif'}}>5. Component Inventory</h2>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-[#07061f] text-white text-xs">
                <th className="text-left px-2 py-2">Component</th>
                <th className="text-left px-2 py-2">OEM/AM</th>
                <th className="text-left px-2 py-2">Condition</th>
                <th className="text-left px-2 py-2">Action</th>
                <th className="text-left px-2 py-2">Notes</th>
              </tr></thead>
              <tbody>
                {components.map((c: any, i: number) => (
                  <tr key={i} className={i%2===0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-2 py-1.5 font-medium">{c.component_name}</td>
                    <td className="px-2 py-1.5 text-xs">{c.oem_aftermarket}</td>
                    <td className="px-2 py-1.5 text-xs">{c.condition}</td>
                    <td className="px-2 py-1.5 text-xs">{c.recommendation}</td>
                    <td className="px-2 py-1.5 text-xs text-gray-500">{c.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Repair & Valuation */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#07061f] border-b border-gray-200 pb-2 mb-4" style={{fontFamily:'Georgia,serif'}}>6. Repair / Labor & Valuation</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[['Facility',fd.repair_facility_name],['Facility Type',fd.facility_type],
              ['Est. Labor Hrs',fd.estimated_labor_hours],['Est. Repair Cost',fd.estimated_repair_cost ? `$${Number(fd.estimated_repair_cost).toLocaleString()}` : null],
              ['Est. ACV',fd.estimated_acv ? `$${Number(fd.estimated_acv).toLocaleString()}` : null],
              ['Salvage Value',fd.salvage_value ? `$${Number(fd.salvage_value).toLocaleString()}` : null],
              ['Total Loss',fd.total_loss_likely ? 'Yes — evaluate' : 'No']].map(([k,v]) => v ? (
              <div key={k} className="flex gap-2"><span className="text-gray-500 w-32 flex-shrink-0">{k}:</span><span className="font-medium">{v}</span></div>
            ) : null)}
          </div>
          {fd.valuation_notes && <p className="text-sm mt-3 text-gray-600"><strong>Valuation Notes:</strong> {fd.valuation_notes}</p>}
        </section>

        {/* Compliance */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#07061f] border-b border-gray-200 pb-2 mb-4" style={{fontFamily:'Georgia,serif'}}>7. Compliance Review</h2>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            {[['Photo Complete','photo_complete'],['Documentation Complete','documentation_complete'],
              ['Estimate Supported','estimate_supported'],['OEM Requirements Addressed','oem_requirements_addressed'],
              ['Component Inventory Complete','component_inventory_complete']].map(([label,key]) => (
              <div key={key} className="flex items-center gap-2">
                {fd[key] ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                <span>{label}</span>
              </div>
            ))}
          </div>
          {pkg.missing_items && <p className="text-sm text-red-600"><strong>Missing:</strong> {pkg.missing_items}</p>}
          {fd.claim_manager_notes && <p className="text-sm mt-2 text-gray-600"><strong>Notes:</strong> {fd.claim_manager_notes}</p>}
        </section>

        {/* Carrier Cover Sheet */}
        <section className="mt-10 pt-6 border-t-2 border-[#07061f]">
          <h2 className="text-lg font-bold text-[#07061f] mb-4" style={{fontFamily:'Georgia,serif'}}>Carrier Submission Cover Sheet</h2>
          <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-2">
            <p><strong>Claim:</strong> {pkg.claim_number} · <strong>Unit:</strong> {[pkg.year,pkg.make,pkg.model].filter(Boolean).join(' ')} · <strong>Municipality:</strong> {pkg.municipality_name}</p>
            <p><strong>MCSA Recommendation:</strong></p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Proceed with estimate review','Return for documentation','Refer to OEM/dealer','Consider total loss evaluation'].map(r => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <span className="w-4 h-4 border border-gray-400 rounded flex-shrink-0" />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-gray-200 text-xs text-gray-400 flex items-center justify-between">
          <span>Municipal Claims Standards Association · MCSA Claim Package Builder · Generated {date}</span>
          {watermarked && <span className="text-red-400 font-bold">PREVIEW ONLY — Join MCSA for clean export</span>}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

function ClaimPackageBuilderInner() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get('id')

  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(packageId)
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPrint, setShowPrint] = useState(false)
  const [printData, setPrintData] = useState<any>(null)
  const [exporting, setExporting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<FormData>({})
  const [fileStatus, setFileStatus] = useState('Draft')
  const [riskFlags, setRiskFlags] = useState<string[]>([])
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [components, setComponents] = useState<ComponentItem[]>([])
  const [complianceScore, setComplianceScore] = useState('')
  const [missingItems, setMissingItems] = useState('')

  const unitType = formData.unit_type || ''

  // Load existing package
  useEffect(() => {
    if (!packageId || !user) return
    fetch(`/api/claim-packages/${packageId}`)
      .then(r => r.json())
      .then(data => {
        if (data.package) {
          const pkg = data.package
          setFormData({
            ...pkg.form_data,
            claim_number: pkg.claim_number,
            carrier_name: pkg.carrier_name,
            adjuster_name: pkg.adjuster_name,
            municipality_name: pkg.municipality_name,
            department: pkg.department,
            loss_date: pkg.loss_date?.slice(0,10),
            inspection_date: pkg.inspection_date?.slice(0,10),
            loss_type: pkg.loss_type,
            loss_location: pkg.loss_location,
            contact_person: pkg.contact_person,
            contact_phone: pkg.contact_phone,
            unit_type: pkg.unit_type,
            tier: pkg.tier,
            year: pkg.year,
            make: pkg.make,
            model: pkg.model,
            vin: pkg.vin,
            mileage: pkg.mileage,
            hours: pkg.hours,
            unit_number: pkg.unit_number,
            in_service_status: pkg.in_service_status,
            specialty_body_manufacturer: pkg.specialty_body_manufacturer,
            specialty_body_serial: pkg.specialty_body_serial,
          })
          setFileStatus(pkg.file_status || 'Draft')
          setRiskFlags(pkg.risk_flags || [])
          setComplianceScore(pkg.compliance_score || '')
          setMissingItems(pkg.missing_items || '')
          setPhotos(data.photos || [])
          setComponents(data.components || [])
        }
      })
      .catch(() => {})
  }, [packageId, user])

  // Auto-populate photo checklist when unit type changes
  useEffect(() => {
    if (!unitType) return
    const base = PHOTO_BASE.map(item => ({
      photo_item: item, status: 'Missing' as const, notes: ''
    }))
    const conditional = (PHOTO_BY_TYPE[unitType] || []).map(item => ({
      photo_item: item, status: 'Missing' as const, notes: ''
    }))
    const allItems = [...base, ...conditional]
    setPhotos(prev => {
      if (prev.length > 0) return prev // Don't override if already populated
      return allItems
    })
  }, [unitType])

  // Auto-populate components when unit type changes
  useEffect(() => {
    if (!unitType) return
    const presetNames = COMPONENT_PRESETS[unitType] || []
    setComponents(prev => {
      if (prev.length > 0) return prev
      return presetNames.map(name => ({
        component_name: name,
        system_category: '',
        oem_aftermarket: '',
        condition: '',
        recommendation: '',
        documentation_needed: '',
        notes: '',
      }))
    })
  }, [unitType])

  function set(key: string, value: any) {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  // Compute risk flags automatically
  useEffect(() => {
    const flags: string[] = []
    if (formData.labor_variance_flag) flags.push('High labor variance')
    if (unitType && unitType !== 'Other Municipal Fleet') flags.push('Specialty equipment involved')
    if (formData.oem_involvement_required) flags.push('OEM/dealer required')
    if (formData.total_loss_likely) flags.push('Total loss exposure')
    if (formData.department_impact === 'Critical - affects operations') flags.push('Municipal downtime concern')
    if (formData.safety_issues_present) flags.push('Safety/return-to-service concern')
    const missing = photos.filter(p => p.status === 'Missing').length
    if (missing > 3) flags.push('Insufficient photos')
    if (!formData.vin) flags.push('Missing serial/VIN evidence')
    setRiskFlags([...new Set(flags)])
  }, [formData, photos, unitType])

  // Validation per step
  function validateStep(stepIdx: number): boolean {
    const errs: Record<string, string> = {}
    const s = STEPS[stepIdx]
    if (s.id === 'claim_info') {
      if (!formData.claim_number) errs.claim_number = 'Required'
      if (!formData.carrier_name) errs.carrier_name = 'Required'
      if (!formData.adjuster_name) errs.adjuster_name = 'Required'
      if (!formData.municipality_name) errs.municipality_name = 'Required'
      if (!formData.department) errs.department = 'Required'
      if (!formData.loss_date) errs.loss_date = 'Required'
      if (!formData.inspection_date) errs.inspection_date = 'Required'
      if (!formData.loss_type) errs.loss_type = 'Required'
    }
    if (s.id === 'unit_classification') {
      if (!formData.unit_type) errs.unit_type = 'Required'
      if (!formData.tier) errs.tier = 'Required'
      if (!formData.year) errs.year = 'Required'
      if (!formData.make) errs.make = 'Required'
      if (!formData.model) errs.model = 'Required'
      if (!formData.vin) errs.vin = 'Required'
      if (!formData.in_service_status) errs.in_service_status = 'Required'
    }
    if (s.id === 'scene_inspection') {
      if (!formData.initial_damage_summary) errs.initial_damage_summary = 'Required'
      if (!formData.department_impact) errs.department_impact = 'Required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function save(explicit = false) {
    if (!user) return
    setSaveStatus('saving')
    setSaving(true)
    try {
      const payload = {
        ...formData,
        file_status: fileStatus,
        form_data: formData,
        risk_flags: riskFlags,
        compliance_score: complianceScore,
        missing_items: missingItems,
      }
      let id = savedId
      if (!id) {
        const res = await fetch('/api/claim-packages', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        id = data.package?.id
        setSavedId(id)
        if (id) router.replace(`/tools/claim-package-builder?id=${id}`)
      } else {
        await fetch(`/api/claim-packages/${id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }
      if (id) {
        if (photos.length > 0) {
          await fetch(`/api/claim-packages/${id}/photo-items`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(photos)
          })
        }
        if (components.length > 0) {
          await fetch(`/api/claim-packages/${id}/component-items`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(components)
          })
        }
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  async function exportCSV() {
    if (!savedId) { await save(); return }
    setExporting(true)
    try {
      const res = await fetch(`/api/claim-packages/${savedId}/export`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ export_type: 'csv' })
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mcsa-claim-${formData.claim_number || savedId}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  async function exportPrint() {
    const id = savedId
    if (!id && user) { await save(); return }
    setExporting(true)
    try {
      const targetId = id || 'preview'
      let data: any
      if (id) {
        const res = await fetch(`/api/claim-packages/${id}/export`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ export_type: user ? 'clean' : 'watermarked' })
        })
        data = await res.json()
      } else {
        // Public preview — build fake data
        data = {
          package: { ...formData, id: 'preview', file_status: fileStatus, form_data: formData, risk_flags: riskFlags },
          photos,
          components,
          watermarked: true,
        }
      }
      setPrintData(data)
      setShowPrint(true)
    } finally {
      setExporting(false)
    }
  }

  function goNext() {
    if (!validateStep(step)) return
    setStep(s => Math.min(s + 1, STEPS.length - 1))
    if (user && step === 0) save()
  }

  function goPrev() {
    setErrors({})
    setStep(s => Math.max(s - 1, 0))
  }

  const completedSteps = STEPS.map((s, i) => {
    if (i === 0) return !!formData.claim_number && !!formData.carrier_name
    if (i === 1) return !!formData.unit_type && !!formData.vin
    if (i === 2) return !!formData.initial_damage_summary
    if (i === 3) return photos.filter(p => p.status === 'Present').length > 0
    if (i === 4) return components.length > 0
    if (i === 5) return formData.oem_involvement_required !== undefined
    if (i === 6) return formData.total_loss_likely !== undefined
    if (i === 7) return !!complianceScore
    return false
  })

  const photoComplete = photos.length > 0 && photos.filter(p=>p.status==='Missing').length === 0
  const missingPhotoCount = photos.filter(p => p.status === 'Missing').length

  if (!isLoaded) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      {/* Top bar */}
      <div className="bg-[#07061f] text-white px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-base">MCSA Claim Package Builder</h1>
            <p className="text-xs text-gray-400">
              {formData.claim_number ? `Claim ${formData.claim_number}` : 'New Package'} ·{' '}
              {formData.unit_type || 'Unit not classified'} · {fileStatus}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!user && (
              <Link href="/sign-up" className="text-xs bg-amber-400 text-[#07061f] font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-300">
                Join to Save
              </Link>
            )}
            {user && (
              <>
                <select value={fileStatus} onChange={e => setFileStatus(e.target.value)}
                  className="text-xs bg-white/10 text-white border border-white/20 rounded-lg px-2 py-1.5 focus:outline-none">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => save(true)} disabled={saving}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                    ${saveStatus==='saved' ? 'bg-emerald-500 text-white' : saveStatus==='error' ? 'bg-red-500 text-white' : 'bg-amber-400 text-[#07061f] hover:bg-amber-300'}`}>
                  <Save className="w-3.5 h-3.5" />
                  {saveStatus==='saving' ? 'Saving...' : saveStatus==='saved' ? 'Saved' : saveStatus==='error' ? 'Error' : 'Save Draft'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const done = completedSteps[i]
              const active = i === step
              return (
                <button key={s.id} onClick={() => { setErrors({}); setStep(i) }}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0
                    ${active ? 'border-amber-400 text-[#07061f]' : done ? 'border-emerald-400 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  {done && !active ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Icon className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{i+1}. {s.label}</span>
                  <span className="sm:hidden">{i+1}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Non-member notice */}
      {!user && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-700">
          <Lock className="w-3.5 h-3.5 inline mr-1" />
          Preview mode — <Link href="/sign-up" className="font-semibold underline">create a free account</Link> to save packages, export clean PDFs, and reopen saved work
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left step nav (desktop) */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-4">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Steps</h3>
              </div>
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const done = completedSteps[i]
                const active = i === step
                return (
                  <button key={s.id} onClick={() => { setErrors({}); setStep(i) }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-l-2
                      ${active ? 'bg-amber-50 border-amber-400' : done ? 'border-emerald-300 hover:bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                      ${done && !active ? 'bg-emerald-500' : active ? 'bg-amber-400' : 'bg-gray-100'}`}>
                      {done && !active
                        ? <CheckCircle className="w-3.5 h-3.5 text-white" />
                        : <span className="text-xs font-bold text-gray-600">{i+1}</span>
                      }
                    </div>
                    <span className={`text-xs font-medium ${active ? 'text-[#07061f]' : 'text-gray-600'}`}>{s.label}</span>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Main form */}
          <main className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-[#07061f]">{STEPS[step].label}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Step {step+1} of {STEPS.length}</p>
              </div>

              <div className="px-6 py-6 space-y-5">

                {/* ─ STEP 1: CLAIM INFO ─ */}
                {step === 0 && <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Claim Number" required><Input value={formData.claim_number} onChange={(v:string)=>set('claim_number',v)} placeholder="CLM-00000" /></Field>
                    <Field label="Loss Date" required><Input type="date" value={formData.loss_date} onChange={(v:string)=>set('loss_date',v)} /></Field>
                  </div>
                  {errors.claim_number && <p className="text-xs text-red-500">{errors.claim_number}</p>}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Carrier Name" required><Input value={formData.carrier_name} onChange={(v:string)=>set('carrier_name',v)} /></Field>
                    <Field label="Adjuster Name" required><Input value={formData.adjuster_name} onChange={(v:string)=>set('adjuster_name',v)} /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Municipality Name" required><Input value={formData.municipality_name} onChange={(v:string)=>set('municipality_name',v)} /></Field>
                    <Field label="Department" required>
                      <Select value={formData.department} onChange={v=>set('department',v)}
                        options={['Police','Fire','EMS','Public Works','Highway Department','Parks/Recreation','Other']} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Inspection Date" required><Input type="date" value={formData.inspection_date} onChange={(v:string)=>set('inspection_date',v)} /></Field>
                    <Field label="Loss Type" required>
                      <Select value={formData.loss_type} onChange={v=>set('loss_type',v)}
                        options={['Collision','Fire','Mechanical','Weather','Vandalism','Water/Flood','Theft','Other']} />
                    </Field>
                  </div>
                  <Field label="Location of Loss"><Input value={formData.loss_location} onChange={(v:string)=>set('loss_location',v)} /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Municipality Contact"><Input value={formData.contact_person} onChange={(v:string)=>set('contact_person',v)} /></Field>
                    <Field label="Contact Phone"><Input type="tel" value={formData.contact_phone} onChange={(v:string)=>set('contact_phone',v)} /></Field>
                  </div>
                  <Field label="Assignment Notes"><Textarea value={formData.assignment_notes} onChange={(v:string)=>set('assignment_notes',v)} /></Field>
                </>}

                {/* ─ STEP 2: UNIT CLASSIFICATION ─ */}
                {step === 1 && <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit Type <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {UNIT_TYPES.map(ut => {
                        const Icon = UNIT_ICON[ut] || LayoutGrid
                        return (
                          <button key={ut} type="button" onClick={() => {
                            set('unit_type', ut)
                            setPhotos([]) // Reset to trigger auto-populate
                            setComponents([])
                          }}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left
                              ${formData.unit_type===ut ? 'border-amber-400 bg-amber-50 text-[#07061f]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                            <Icon className={`w-4 h-4 flex-shrink-0 ${formData.unit_type===ut ? 'text-amber-600' : 'text-gray-400'}`} />
                            {ut}
                          </button>
                        )
                      })}
                    </div>
                    {errors.unit_type && <p className="text-xs text-red-500 mt-1">{errors.unit_type}</p>}
                  </div>
                  <Field label="MCSA Tier" required>
                    <Select value={formData.tier} onChange={v=>set('tier',v)} options={TIERS} />
                  </Field>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Year" required><Input type="number" value={formData.year} onChange={(v:string)=>set('year',v)} placeholder="2022" /></Field>
                    <Field label="Make" required><Input value={formData.make} onChange={(v:string)=>set('make',v)} placeholder="Ford" /></Field>
                    <Field label="Model" required><Input value={formData.model} onChange={(v:string)=>set('model',v)} placeholder="PIU" /></Field>
                  </div>
                  <Field label="VIN / Serial Number" required><Input value={formData.vin} onChange={(v:string)=>set('vin',v)} placeholder="1FMCU0GX..." /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Mileage"><Input type="number" value={formData.mileage} onChange={(v:string)=>set('mileage',v)} /></Field>
                    <Field label="Engine / Equipment Hours"><Input type="number" value={formData.hours} onChange={(v:string)=>set('hours',v)} /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Fleet / Unit Number"><Input value={formData.unit_number} onChange={(v:string)=>set('unit_number',v)} /></Field>
                    <Field label="In-Service Status" required>
                      <Select value={formData.in_service_status} onChange={v=>set('in_service_status',v)}
                        options={['Active','Out of Service','Limited Use','Reserve Unit','Unknown']} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Specialty Body / Apparatus Manufacturer"><Input value={formData.specialty_body_manufacturer} onChange={(v:string)=>set('specialty_body_manufacturer',v)} placeholder="Pierce, Horton, Braun..." /></Field>
                    <Field label="Body / Module Serial Number"><Input value={formData.specialty_body_serial} onChange={(v:string)=>set('specialty_body_serial',v)} /></Field>
                  </div>
                </>}

                {/* ─ STEP 3: SCENE INSPECTION ─ */}
                {step === 2 && <>
                  <div className="grid grid-cols-2 gap-4">
                    {[['Drivable / Movable','drivable'],['Safety Issues Present','safety_issues_present'],
                      ['Structural Damage Observed','structural_damage'],['Specialty Equipment Damage','equipment_damage'],
                      ['Fluids / Leaks Observed','fluids_or_leaks'],['Electrical Issues Observed','electrical_issues']].map(([label,key]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{label}</span>
                        <Toggle value={!!formData[key]} onChange={v=>set(key,v)} />
                      </div>
                    ))}
                  </div>
                  <Field label="Initial Damage Summary" required>
                    <Textarea value={formData.initial_damage_summary} onChange={(v:string)=>set('initial_damage_summary',v)}
                      rows={4} placeholder="Describe visible damage, affected systems, and initial findings..." />
                    {errors.initial_damage_summary && <p className="text-xs text-red-500 mt-1">{errors.initial_damage_summary}</p>}
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Department Operational Impact" required>
                      <Select value={formData.department_impact} onChange={v=>set('department_impact',v)}
                        options={['None','Limited','Critical - affects operations','Unknown']} />
                    </Field>
                    <Field label="Downtime Concern">
                      <Select value={formData.downtime_concern} onChange={v=>set('downtime_concern',v)}
                        options={['Low','Moderate','High','Critical','Unknown']} />
                    </Field>
                  </div>
                  <Field label="Immediate Actions Needed">
                    <Textarea value={formData.immediate_actions_needed} onChange={(v:string)=>set('immediate_actions_needed',v)}
                      placeholder="e.g. OEM inspection required, unit secured, evidence preserved..." />
                  </Field>
                </>}

                {/* ─ STEP 4: PHOTO CHECKLIST ─ */}
                {step === 3 && <>
                  {photos.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">Select a unit type in Step 2 to load the photo checklist.</p>
                    </div>
                  )}
                  {photos.length > 0 && <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">{photos.filter(p=>p.status==='Present').length} of {photos.length} confirmed present</p>
                      {missingPhotoCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          {missingPhotoCount} missing
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {photos.map((p, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors
                          ${p.status==='Present' ? 'border-emerald-200 bg-emerald-50' : p.status==='N/A' ? 'border-gray-100 bg-gray-50' : 'border-red-100 bg-red-50'}`}>
                          <span className="text-xs text-gray-600 flex-1">{p.photo_item}</span>
                          <div className="flex gap-1">
                            {(['Present','Missing','N/A'] as const).map(s => (
                              <button key={s} onClick={() => setPhotos(prev => prev.map((x,j) => j===i ? {...x, status:s} : x))}
                                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors
                                  ${p.status===s
                                    ? s==='Present' ? 'bg-emerald-500 text-white'
                                    : s==='N/A' ? 'bg-gray-400 text-white'
                                    : 'bg-red-500 text-white'
                                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                          <input
                            placeholder="Notes..."
                            value={p.notes}
                            onChange={e => setPhotos(prev => prev.map((x,j) => j===i ? {...x, notes:e.target.value} : x))}
                            className="text-xs border border-gray-200 rounded px-2 py-1 w-28 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      ))}
                    </div>
                  </>}
                </>}

                {/* ─ STEP 5: COMPONENT INVENTORY ─ */}
                {step === 4 && <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{components.length} components</p>
                    <button onClick={() => setComponents(prev => [...prev, {component_name:'',system_category:'',oem_aftermarket:'',condition:'',recommendation:'',documentation_needed:'',notes:''}])}
                      className="text-xs text-amber-600 font-medium hover:underline">+ Add Component</button>
                  </div>
                  {components.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">Select unit type in Step 2 to auto-load components.</div>
                  )}
                  <div className="space-y-3">
                    {components.map((c, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <input value={c.component_name} onChange={e => setComponents(prev => prev.map((x,j)=>j===i?{...x,component_name:e.target.value}:x))}
                            placeholder="Component name"
                            className="font-medium text-sm text-[#07061f] border-0 outline-none flex-1 bg-transparent" />
                          <button onClick={() => setComponents(prev => prev.filter((_,j)=>j!==i))}
                            className="text-gray-300 hover:text-red-400 text-xs ml-2">✕</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <select value={c.oem_aftermarket} onChange={e=>setComponents(prev=>prev.map((x,j)=>j===i?{...x,oem_aftermarket:e.target.value}:x))}
                            className="border border-gray-200 rounded px-2 py-1 bg-white">
                            <option value="">OEM / Aftermarket / Unknown</option>
                            {['OEM','Aftermarket','Unknown'].map(o=><option key={o}>{o}</option>)}
                          </select>
                          <select value={c.condition} onChange={e=>setComponents(prev=>prev.map((x,j)=>j===i?{...x,condition:e.target.value}:x))}
                            className="border border-gray-200 rounded px-2 py-1 bg-white">
                            <option value="">Condition</option>
                            {['Good','Fair','Poor','Damaged','Unknown'].map(o=><option key={o}>{o}</option>)}
                          </select>
                          <select value={c.recommendation} onChange={e=>setComponents(prev=>prev.map((x,j)=>j===i?{...x,recommendation:e.target.value}:x))}
                            className="border border-gray-200 rounded px-2 py-1 bg-white">
                            <option value="">Action</option>
                            {['Repair','Replace','Inspect Further','No Action','Unknown'].map(o=><option key={o}>{o}</option>)}
                          </select>
                          <select value={c.documentation_needed} onChange={e=>setComponents(prev=>prev.map((x,j)=>j===i?{...x,documentation_needed:e.target.value}:x))}
                            className="border border-gray-200 rounded px-2 py-1 bg-white">
                            <option value="">Documentation Needed</option>
                            {['OEM Quote','Invoice','Photo','None','Unknown'].map(o=><option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <input value={c.notes} onChange={e=>setComponents(prev=>prev.map((x,j)=>j===i?{...x,notes:e.target.value}:x))}
                          placeholder="Notes..."
                          className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-amber-400" />
                      </div>
                    ))}
                  </div>
                </>}

                {/* ─ STEP 6: REPAIR / LABOR ─ */}
                {step === 5 && <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Repair Facility Name"><Input value={formData.repair_facility_name} onChange={(v:string)=>set('repair_facility_name',v)} /></Field>
                    <Field label="Facility Type">
                      <Select value={formData.facility_type} onChange={v=>set('facility_type',v)}
                        options={['Auto Body Shop','Truck Repair','Apparatus Dealer','OEM / Manufacturer','Specialty Upfitter','Municipality Shop','Unknown']} />
                    </Field>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">OEM / Dealer Involvement Required <span className="text-red-500">*</span></span>
                    <Toggle value={!!formData.oem_involvement_required} onChange={v=>set('oem_involvement_required',v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Primary Labor Type">
                      <Select value={formData.labor_type} onChange={v=>set('labor_type',v)}
                        options={['Body','Mechanical','Electrical','Fabrication','Hydraulic','Paint/refinish','Diagnostic','Specialty apparatus']} />
                    </Field>
                    <Field label="Estimated Labor Hours"><Input type="number" value={formData.estimated_labor_hours} onChange={(v:string)=>set('estimated_labor_hours',v)} /></Field>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-sm text-gray-700 font-medium">Labor Variance Flag <span className="text-red-500">*</span></span>
                    <Toggle value={!!formData.labor_variance_flag} onChange={v=>set('labor_variance_flag',v)} />
                  </div>
                  {formData.labor_variance_flag && (
                    <Field label="Labor Variance Explanation">
                      <Textarea value={formData.variance_reason} onChange={(v:string)=>set('variance_reason',v)}
                        placeholder="Explain why labor is above MCSA reasonableness ranges..." />
                    </Field>
                  )}
                  <Field label="Estimate Review Notes">
                    <Textarea value={formData.estimate_review_notes} onChange={(v:string)=>set('estimate_review_notes',v)}
                      placeholder="Documenting estimate review findings, task-level decomposition notes..." />
                  </Field>
                </>}

                {/* ─ STEP 7: VALUATION ─ */}
                {step === 6 && <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Estimated Repair Cost"><CurrencyInput value={formData.estimated_repair_cost} onChange={v=>set('estimated_repair_cost',v)} /></Field>
                    <Field label="Estimated ACV"><CurrencyInput value={formData.estimated_acv} onChange={v=>set('estimated_acv',v)} /></Field>
                    <Field label="Replacement Cost Indicator"><CurrencyInput value={formData.replacement_cost_indicator} onChange={v=>set('replacement_cost_indicator',v)} /></Field>
                    <Field label="Salvage Value"><CurrencyInput value={formData.salvage_value} onChange={v=>set('salvage_value',v)} /></Field>
                  </div>
                  {formData.estimated_repair_cost && formData.estimated_acv && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${Number(formData.estimated_repair_cost) >= Number(formData.estimated_acv)*0.75 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      {Number(formData.estimated_repair_cost) >= Number(formData.estimated_acv)*0.75
                        ? `⚠️ Repair cost is ${Math.round((Number(formData.estimated_repair_cost)/Number(formData.estimated_acv))*100)}% of ACV — total loss threshold likely exceeded`
                        : `✓ Repair cost is ${Math.round((Number(formData.estimated_repair_cost)/Number(formData.estimated_acv))*100)}% of ACV — within repair threshold`
                      }
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Total Loss Likely <span className="text-red-500">*</span></span>
                    <Toggle value={!!formData.total_loss_likely} onChange={v=>set('total_loss_likely',v)} />
                  </div>
                  <Field label="Valuation Source">
                    <div className="flex flex-wrap gap-2">
                      {['Dealer quote','OEM quote','Invoice','Comparable sale','Market listing','Municipality records','Appraisal judgement','Other'].map(src => (
                        <button key={src} type="button"
                          onClick={() => {
                            const curr: string[] = formData.valuation_source || []
                            set('valuation_source', curr.includes(src) ? curr.filter((s:string)=>s!==src) : [...curr, src])
                          }}
                          className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors
                            ${(formData.valuation_source||[]).includes(src) ? 'bg-[#07061f] text-white border-[#07061f]' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                          {src}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Replacement Lead Time Impact">
                    <Select value={formData.lead_time_impact} onChange={v=>set('lead_time_impact',v)}
                      options={['None','Moderate','High','Critical','Unknown']} />
                  </Field>
                  <Field label="Valuation Notes">
                    <Textarea value={formData.valuation_notes} onChange={(v:string)=>set('valuation_notes',v)}
                      placeholder="Document valuation methodology, sources used, and any betterment considerations..." />
                  </Field>
                </>}

                {/* ─ STEP 8: COMPLIANCE ─ */}
                {step === 7 && <>
                  <div className="space-y-2">
                    {[['Photo Complete','photo_complete'],['Documentation Complete','documentation_complete'],
                      ['Estimate Supported','estimate_supported'],['OEM Requirements Addressed','oem_requirements_addressed'],
                      ['Component Inventory Complete','component_inventory_complete'],['Valuation Supported','valuation_supported']].map(([label,key]) => (
                      <div key={key} className={`flex items-center justify-between p-3 rounded-lg border transition-colors
                        ${formData[key] ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                        <span className="text-sm text-gray-700">{label} <span className="text-red-500">*</span></span>
                        <Toggle value={!!formData[key]} onChange={v=>set(key,v)} />
                      </div>
                    ))}
                  </div>
                  <Field label="Compliance Score">
                    <div className="flex gap-2">
                      {['Pass','Conditional','Fail'].map(s => (
                        <button key={s} type="button" onClick={() => setComplianceScore(s)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors
                            ${complianceScore===s
                              ? s==='Pass' ? 'bg-emerald-500 text-white border-emerald-500'
                              : s==='Fail' ? 'bg-red-500 text-white border-red-500'
                              : 'bg-amber-400 text-[#07061f] border-amber-400'
                              : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Missing Items">
                    <Textarea value={missingItems} onChange={setMissingItems}
                      placeholder="List any missing documentation, photos, or required information..." />
                  </Field>
                  <Field label="Risk Flags">
                    <div className="flex flex-wrap gap-1.5">
                      {RISK_FLAGS.map(f => (
                        <span key={f} className={`text-xs px-2 py-0.5 rounded-full border font-medium
                          ${riskFlags.includes(f) ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                          {f}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Flags are auto-detected based on your entries above.</p>
                  </Field>
                  <Field label="Claim Manager Notes">
                    <Textarea value={formData.claim_manager_notes} onChange={(v:string)=>set('claim_manager_notes',v)}
                      placeholder="Final notes for carrier submission, internal review, or escalation..." rows={4} />
                  </Field>
                </>}

                {/* ─ STEP 9: EXPORT ─ */}
                {step === 8 && <>
                  <div className="space-y-4">
                    {/* Summary card */}
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                      <h3 className="font-semibold text-[#07061f] text-sm">Package Summary</h3>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-500">Claim #</span><span className="font-medium">{formData.claim_number||'—'}</span>
                        <span className="text-gray-500">Unit</span><span className="font-medium">{[formData.year,formData.make,formData.model].filter(Boolean).join(' ')||'—'}</span>
                        <span className="text-gray-500">Type</span><span className="font-medium">{formData.unit_type||'—'}</span>
                        <span className="text-gray-500">Photos</span><span className="font-medium">{photos.filter(p=>p.status==='Present').length}/{photos.length} confirmed</span>
                        <span className="text-gray-500">Components</span><span className="font-medium">{components.length} documented</span>
                        <span className="text-gray-500">Compliance</span>
                        <span className={`font-semibold ${complianceScore==='Pass'?'text-emerald-600':complianceScore==='Fail'?'text-red-600':'text-amber-600'}`}>
                          {complianceScore||'Not scored'}
                        </span>
                      </div>
                    </div>

                    {/* Risk flags */}
                    {riskFlags.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-semibold text-amber-700">Risk Flags</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {riskFlags.map(f => (
                            <span key={f} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{f}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Export actions */}
                    <div className="space-y-3">
                      {!user && (
                        <div className="bg-[#07061f] rounded-xl p-4 text-center">
                          <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                          <p className="text-white text-sm font-medium mb-1">Save & Export requires a free account</p>
                          <p className="text-gray-400 text-xs mb-3">Preview the print layout below, or join to save and export clean files</p>
                          <Link href="/sign-up" className="inline-block bg-amber-400 text-[#07061f] font-semibold px-5 py-2 rounded-lg text-sm hover:bg-amber-300">
                            Create Free Account
                          </Link>
                        </div>
                      )}

                      <button onClick={exportPrint} disabled={exporting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#07061f] text-white font-semibold rounded-xl hover:bg-[#1e1b4b] transition-colors disabled:opacity-60">
                        <Printer className="w-4 h-4" />
                        {user ? 'Print / Save PDF Packet' : 'Preview Print Layout (Watermarked)'}
                      </button>

                      {user && (
                        <button onClick={exportCSV} disabled={exporting}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#07061f] text-[#07061f] font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60">
                          <Download className="w-4 h-4" />
                          Export CSV
                        </button>
                      )}

                      {savedId && (
                        <Link href="/dashboard" className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-2">
                          ← Return to Dashboard
                        </Link>
                      )}
                    </div>
                  </div>
                </>}

              </div>

              {/* Navigation */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <button onClick={goPrev} disabled={step===0}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                {step < STEPS.length-1 && (
                  <button onClick={goNext}
                    className="flex items-center gap-1.5 px-5 py-2 bg-amber-400 text-[#07061f] text-sm font-semibold rounded-lg hover:bg-amber-300 transition-colors">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* Right panel — risk + summary */}
          <aside className="hidden lg:block">
            <div className="space-y-4 sticky top-4">
              {/* Risk flags */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Risk Flags</h3>
                {riskFlags.length === 0 ? (
                  <p className="text-xs text-gray-400">No flags detected yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {riskFlags.map(f => (
                      <div key={f} className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span className="text-xs text-amber-700">{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Package status */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Package Status</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">File Status</span>
                    <span className="font-medium text-[#07061f]">{fileStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Compliance</span>
                    <span className={`font-semibold ${complianceScore==='Pass'?'text-emerald-600':complianceScore==='Fail'?'text-red-600':complianceScore?'text-amber-600':'text-gray-400'}`}>
                      {complianceScore||'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Photos</span>
                    <span className="font-medium">{photos.filter(p=>p.status==='Present').length}/{photos.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Components</span>
                    <span className="font-medium">{components.length}</span>
                  </div>
                  {savedId && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Saved</span>
                      <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Yes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Missing docs warning */}
              {missingPhotoCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-semibold text-red-600">Missing Documentation</span>
                  </div>
                  <p className="text-xs text-red-500">{missingPhotoCount} photo items not confirmed. File may fail compliance review.</p>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>

      {/* Print packet overlay */}
      {showPrint && printData && (
        <PrintPacket
          pkg={printData.package}
          photos={printData.photos}
          components={printData.components}
          watermarked={printData.watermarked}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  )
}

import { Suspense } from 'react'
export default function ClaimPackageBuilder() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#07061f] border-t-transparent rounded-full animate-spin"/></div>}>
      <ClaimPackageBuilderInner />
    </Suspense>
  )
}
