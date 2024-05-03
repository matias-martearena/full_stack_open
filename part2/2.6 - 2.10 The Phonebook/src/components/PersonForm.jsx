const PersonForm = ({ onSubmitForm, name, onChageName, number, onChangeNumber }) => {
  return (
    <form onSubmit={onSubmitForm}>
        <fieldset>
          <legend>New contact:</legend>
          <article>
            <label>Name: </label>
            <input value={name} onChange={onChageName}/>
          </article>
          <article>
            <label >Number:</label>
            <input value={number} onChange={onChangeNumber}/>
          </article>
        </fieldset>
        <button type="submit">Add</button>
    </form>
  )
}

export default PersonForm
