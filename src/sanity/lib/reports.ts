export function aggregateByStatus(items: any[]) {
  return items.reduce((acc:any, it:any) => { acc[it.status] = (acc[it.status] || 0) + 1; return acc }, {})
}
