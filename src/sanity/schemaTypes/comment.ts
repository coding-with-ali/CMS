export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    { name: 'text', title: 'Text', type: 'text' },
    { name: 'authorName', title: 'Author Name', type: 'string' },
    { name: 'createdAt', title: 'Created At', type: 'datetime' }
  ]
}
