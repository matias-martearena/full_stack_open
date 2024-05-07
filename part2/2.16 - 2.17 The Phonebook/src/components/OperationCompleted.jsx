const OperationCompleted = ({ message }) => {
  if (message === null) return null

  return (
    <div className="successMessage">{message}</div>
  )
}

export default OperationCompleted
