/**
 * MCSA Authorization Helpers
 * Roles: admin > member > tester > public
 */
import { auth, currentUser } from '@clerk/nextjs/server'

export type Role = 'admin' | 'member' | 'tester' | 'public'

export interface UserAccess {
  role: Role
  userId: string | null
  canViewCourses: boolean
  canEnroll: boolean
  canViewContent: boolean
  canDownloadResources: boolean
  canExportCleanPDF: boolean
  canExportCSV: boolean
  canAccessAdmin: boolean
  canUseCPBFull: boolean   // Claim Package Builder full workflow
}

export async function getUserAccess(): Promise<UserAccess> {
  const { userId } = await auth()
  if (!userId) return publicAccess()

  const user = await currentUser()
  const meta = user?.publicMetadata as Record<string, string> | undefined
  const role = (meta?.role as Role) || 'member'

  return buildAccess(userId, role)
}

export function buildAccess(userId: string, role: Role): UserAccess {
  const base = {
    userId,
    canViewCourses: true,
    canEnroll: true,
    canViewContent: true,
  }

  switch (role) {
    case 'admin':
      return { ...base, role, canDownloadResources: true, canExportCleanPDF: true, canExportCSV: true, canAccessAdmin: true, canUseCPBFull: true }
    case 'member':
      return { ...base, role, canDownloadResources: true, canExportCleanPDF: true, canExportCSV: true, canAccessAdmin: false, canUseCPBFull: true }
    case 'tester':
      return { ...base, role, canDownloadResources: false, canExportCleanPDF: false, canExportCSV: false, canAccessAdmin: false, canUseCPBFull: true }
    default:
      return publicAccess()
  }
}

function publicAccess(): UserAccess {
  return {
    role: 'public', userId: null,
    canViewCourses: true, canEnroll: false, canViewContent: false,
    canDownloadResources: false, canExportCleanPDF: false, canExportCSV: false,
    canAccessAdmin: false, canUseCPBFull: false,
  }
}

export async function requireAdmin(): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const user = await currentUser()
  const meta = user?.publicMetadata as Record<string, string> | undefined
  if (meta?.role !== 'admin') throw new Error('Forbidden')
  return userId
}

export function getRoleBadge(role: Role): { label: string; color: string } {
  switch (role) {
    case 'admin':   return { label: 'Admin',   color: 'bg-red-100 text-red-700' }
    case 'member':  return { label: 'Member',  color: 'bg-emerald-100 text-emerald-700' }
    case 'tester':  return { label: 'Tester',  color: 'bg-violet-100 text-violet-700' }
    default:        return { label: 'Preview', color: 'bg-gray-100 text-gray-500' }
  }
}
