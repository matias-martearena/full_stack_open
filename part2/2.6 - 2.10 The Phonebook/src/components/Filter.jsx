const Filter = ({ name, onFindName }) => {
  return (
    <div>
      <label>Search: </label>
      <input
        type="text"
        placeholder="name..."
        value={name}
        onChange={onFindName}
      />
    </div>
  )
}

export default Filter
