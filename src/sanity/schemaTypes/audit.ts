export default {
  name: 'audit',
  title: 'Audit',
  type: 'document',
  fields: [
    { name: 'action', title: 'Action', type: 'string' },
    { name: 'actor', title: 'Actor', type: 'string' },
    { name: 'timestamp', title: 'Timestamp', type: 'datetime' },
    { name: 'meta', title: 'Meta', type: 'object', fields: [{ name: 'note', title: 'Note', type: 'string' }] }
  ]
}
