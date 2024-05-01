import { useState } from 'react'

const Text = ({ text }) => <h2>{text}</h2>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({ text, value }) => {
  return (
    <tbody>
      <tr>
        <th>{text}:</th>
        <td>{value}</td>
      </tr>
    </tbody>
  )
}

const Statistics = ({ good, neutral, bad, total, average, goodPercentage }) => {
  if (total > 0) {
    return (
      <table>
        <StatisticLine text="Good" value={good} />
        <StatisticLine text="Neutral" value={neutral} />
        <StatisticLine text="Bad" value={bad} />
        <StatisticLine text="All" value={total} />
        <StatisticLine text="Average" value={average} />
        <StatisticLine text="Good (%)" value={goodPercentage} />
     </table>
    )
  }

  return <p>No feedback given</p>
}

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
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={averageResult} goodPercentage={goodPercentage} />
    </div>
  )
}

export default App
