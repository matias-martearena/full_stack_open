import { useState } from 'react'

const Text = ({ text }) => <h2>{text}</h2>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Statistics = ({ text, value }) => <p>{text}: {value}</p>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    setTotal(total + 1)
    setAverage(average + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setTotal(total + 1)
    setAverage(average - 1)
  }

  const averageResult = total > 0 ? (average / total) : 0
  const goodPercentage = total > 0 ? ((good / total) * 100) : 0

  return (
    <div>
      <Text text={'Give feedback'} />
      <Button handleClick={handleGoodClick} text={'good'} />
      <Button handleClick={handleNeutralClick} text={'neutral'} />
      <Button handleClick={handleBadClick} text={'bad'} />
      <Text text={'Statistics'}/>
      <Statistics text={'Good'} value={good}/>
      <Statistics text={'Neutral'} value={neutral}/>
      <Statistics text={'Bad'} value={bad}/>
      <Statistics text={'All'} value={total}/>
      <Statistics text={'Average'} value={averageResult}/>
      <Statistics text={'Positive'} value={goodPercentage}/>
    </div>
  )
}

export default App
