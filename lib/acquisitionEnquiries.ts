import { withClient } from '@/lib/db'

export type AcquisitionStatus =
  | 'received'
  | 'in_conversation'
  | 'handover_open'
  | 'handover_submitted'
  | 'completed'
  | 'closed'

export type AcquisitionEnquiry = {
  id: string
  status: AcquisitionStatus
  createdAt: Date
}

export const CONTACT_METHODS = ['email', 'phone', 'video'] as const
export type ContactMethod = (typeof CONTACT_METHODS)[number]

type EnquiryRow = {
  id: string
  status: AcquisitionStatus
  created_at: Date
}

function mapRow(row: EnquiryRow): AcquisitionEnquiry {
  return { id: row.id, status: row.status, createdAt: row.created_at }
}

export async function getAcquisitionEnquiry(
  applicationId: string
): Promise<AcquisitionEnquiry | null> {
  return withClient(async (client) => {
    const result = await client.query<EnquiryRow>(
      `SELECT id, status, created_at
       FROM acquisition_enquiries
       WHERE application_id = $1
       LIMIT 1`,
      [applicationId]
    )
    return result.rows[0] ? mapRow(result.rows[0]) : null
  })
}

export async function createAcquisitionEnquiry(input: {
  applicationId: string
  placeAnswer: string
  drawAnswer: string | null
  contactMethod: ContactMethod
  contactDetail: string | null
  bestTime: string | null
  clientIp: string | null
  userAgent: string | null
}): Promise<{ created: boolean; enquiry: AcquisitionEnquiry }> {
  return withClient(async (client) => {
    const inserted = await client.query<EnquiryRow>(
      `INSERT INTO acquisition_enquiries (
         application_id, place_answer, draw_answer, contact_method,
         contact_detail, best_time, client_ip, user_agent
       ) VALUES ($1, $2, $3, $4, $5, $6, $7::inet, $8)
       ON CONFLICT (application_id) DO NOTHING
       RETURNING id, status, created_at`,
      [
        input.applicationId,
        input.placeAnswer,
        input.drawAnswer,
        input.contactMethod,
        input.contactDetail,
        input.bestTime,
        input.clientIp,
        input.userAgent,
      ]
    )

    if (inserted.rows[0]) {
      return { created: true, enquiry: mapRow(inserted.rows[0]) }
    }

    const existing = await client.query<EnquiryRow>(
      `SELECT id, status, created_at FROM acquisition_enquiries
       WHERE application_id = $1 LIMIT 1`,
      [input.applicationId]
    )
    return { created: false, enquiry: mapRow(existing.rows[0]) }
  })
}

/** Details the artist's alert email needs. */
export async function getApplicantForEmail(applicationId: string) {
  return withClient(async (client) => {
    const result = await client.query<{
      full_name: string
      email: string
      country: string | null
    }>(
      `SELECT full_name, email, country
       FROM access_applications WHERE id = $1 LIMIT 1`,
      [applicationId]
    )
    return result.rows[0] ?? null
  })
}
