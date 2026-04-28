import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import { sql } from '@/lib/db'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return new Response('Missing webhook secret', { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses[0]?.email_address || ''

    await sql`
      INSERT INTO mcsa_profiles (clerk_id, email, first_name, last_name, role)
      VALUES (${id}, ${email}, ${first_name || null}, ${last_name || null}, 'member')
      ON CONFLICT (clerk_id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW()
    `
  }

  if (evt.type === 'user.deleted') {
    const { id } = evt.data
    if (id) {
      await sql`DELETE FROM mcsa_profiles WHERE clerk_id = ${id}`
    }
  }

  return new Response('OK', { status: 200 })
}
