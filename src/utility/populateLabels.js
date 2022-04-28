const populateLabels = (group) => {
  group.expenses.forEach((expense, idx1) => (
    expense.expenseTags.forEach((expenseTag, idx2) => (
      group.groupTags.forEach(groupTag => {
        if(expenseTag === groupTag._id) {
          group.expenses[idx1].expenseTags[idx2] = groupTag
        }
      })
    ))
  ))
  return(group)
}

export default populateLabels
