const newDate = new Date(this.modifiedAt)
if (newDate.getTime() !== previous.modifiedAt) {
  error('date does not match', { new: newDate.getTime(), server: previous.modifiedAt, currentTodo: previous })
} else {
  this.modifiedAt = Date.now()
  this.createdAt = previous.createdAt
}
