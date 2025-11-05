export default {
  name: 'companyUser',
  title: 'Company User',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'role', title: 'Role', type: 'string', options: { list: ['reporter','maintenance','admin'] } }
  ]
}
