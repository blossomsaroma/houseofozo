const { allCountries } = require('country-telephone-data') as {
  allCountries: Array<{ name: string; iso2: string; dialCode: string }>
}

export type WaitlistCountryOption = {
  iso2: string
  dial: string
  label: string
}

function normalizeDialDigits(dialCode: string): string {
  return String(dialCode).replace(/\D/g, '')
}

/** Short English label: text before first "(" in dataset name. */
function shortLabel(name: string): string {
  return name.split('(')[0].trim()
}

/** Full list for the dropdown (one flag in UI; options are text-only). */
export const WAITLIST_COUNTRY_OPTIONS: WaitlistCountryOption[] = (() => {
  const mapped = allCountries
    .map((c) => {
      const digits = normalizeDialDigits(c.dialCode)
      if (!digits) return null
      return {
        iso2: c.iso2.toLowerCase(),
        dial: `+${digits}`,
        label: shortLabel(c.name),
      }
    })
    .filter((x): x is WaitlistCountryOption => x != null)

  mapped.sort((a, b) => a.label.localeCompare(b.label, 'en'))

  const inIdx = mapped.findIndex((x) => x.iso2 === 'in')
  if (inIdx > 0) {
    const [inRow] = mapped.splice(inIdx, 1)
    mapped.unshift(inRow)
  }

  return mapped
})()

export const DEFAULT_WAITLIST_COUNTRY_ISO = 'in'

export function dialForIso(iso2: string): string | null {
  return (
    WAITLIST_COUNTRY_OPTIONS.find((o) => o.iso2 === iso2.trim().toLowerCase())
      ?.dial ?? null
  )
}

export function isValidWaitlistCountryIso(iso2: string): boolean {
  return dialForIso(iso2) != null
}

/** Single flag next to the selector (options do not repeat the emoji). */
export function flagForIso(iso2: string): string {
  const u = iso2.trim().toUpperCase()
  if (u.length !== 2) return '🏳️'
  const a = u.charCodeAt(0)
  const b = u.charCodeAt(1)
  if (a < 65 || a > 90 || b < 65 || b > 90) return '🏳️'
  const base = 0x1f1e6
  return (
    String.fromCodePoint(base + a - 65) + String.fromCodePoint(base + b - 65)
  )
}
