import fs from 'fs'
import path from 'path'

export type ServiceAccountCredentials = {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
}

export function loadServiceAccountCredentials(): ServiceAccountCredentials {
  const inline = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (inline) {
    return JSON.parse(inline) as ServiceAccountCredentials
  }
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
  if (b64) {
    return JSON.parse(
      Buffer.from(b64, 'base64').toString('utf8'),
    ) as ServiceAccountCredentials
  }
  const file =
    process.env.GOOGLE_SERVICE_ACCOUNT_FILE || 'service-account.json'
  const abs = path.isAbsolute(file) ? file : path.join(process.cwd(), file)
  if (!fs.existsSync(abs)) {
    throw new Error(
      'Missing Google credentials: set GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, or add service-account.json',
    )
  }
  return JSON.parse(
    fs.readFileSync(abs, 'utf8'),
  ) as ServiceAccountCredentials
}
