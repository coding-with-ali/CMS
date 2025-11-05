import { sanityClient } from '@/sanity/lib/sanity'
import StatsCards from '@/components/StatsCards'

export default async function DashboardPage() {
  const counts = await sanityClient.fetch(`
    {
      "open": count(*[_type=="complaint" && status=="Open"]),
      "inProgress": count(*[_type=="complaint" && status=="In Progress"]),
      "completed": count(*[_type=="complaint" && status=="Completed"]),
      "critical": count(*[_type=="complaint" && priority=="Critical"])
    }
  `)
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Maintenance Dashboard</h1>
      <StatsCards />
      {/* Other widgets: recent complaints etc. */}
    </div>
  )
}
