import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { loadServiceAccountCredentials } from '@/lib/googleServiceAccount'

export const runtime = 'nodejs'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** Plain text for Sheets; avoids USER_ENTERED parsing ISO / dates into wrong columns. */
function formatSubmittedAt(d: Date): string {
  const tz = process.env.WAITLIST_TIMEZONE || 'Asia/Kolkata'
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: tz,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(d)
}

export async function POST(request: Request) {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const range = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A:D'
  if (!sheetId) {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { name: rawName, phone: rawPhone, email: rawEmail } = body as Record<
    string,
    unknown
  >

  const name =
    typeof rawName === 'string' ? rawName.trim().slice(0, 200) : ''
  const phone =
    typeof rawPhone === 'string' ? rawPhone.trim().slice(0, 40) : ''
  const email =
    typeof rawEmail === 'string' ? rawEmail.trim().slice(0, 254) : ''

  if (!name || !phone || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  let credentials
  try {
    credentials = loadServiceAccountCredentials()
  } catch {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 },
    )
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const submittedAt = formatSubmittedAt(new Date())

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      // RAW keeps each cell as literal text (phone, email, readable time stay separate).
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[name, phone, email, submittedAt]],
      },
    })
  } catch (err) {
    console.error('Sheets append failed', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
