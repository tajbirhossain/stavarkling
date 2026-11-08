import { withClient } from '@/lib/db'

export type AcquisitionStatus =
  | 'received'
  | 'in_conversation'
  | 'completed'
  | 'closed'

export type AcquisitionEnquiry = {
  id: string
  status: AcquisitionStatus
  createdAt: Date
}

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
  message: string | null
  clientIp: string | null
  userAgent: string | null
}): Promise<{ created: boolean; enquiry: AcquisitionEnquiry }> {
  return withClient(async (client) => {
    const inserted = await client.query<EnquiryRow>(
      `INSERT INTO acquisition_enquiries (
         application_id, message, client_ip, user_agent
       ) VALUES ($1, $2, $3::inet, $4)
       ON CONFLICT (application_id) DO NOTHING
       RETURNING id, status, created_at`,
      [input.applicationId, input.message, input.clientIp, input.userAgent]
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
