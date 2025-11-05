import ComplaintForm from '@/components/ComplaintForm'
import { sanityClient } from '@/sanity/lib/sanity'

export default async function Page() {
  const departments = await sanityClient.fetch('*[_type=="department"]{_id, name} ')
  // @ts-ignore
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Report Complaint — Master Motor Company</h1>
      {/* @ts-ignore */}
      <ComplaintForm departments={departments} />
    </main>
  )
}
