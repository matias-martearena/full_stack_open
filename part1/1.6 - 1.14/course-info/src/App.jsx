import { useState } from 'react'

const Text = ({ text }) => <h2>{text}</h2>

const Anecdote = ({ anecdote, votes, onVote, onRandomAnecdote }) => {
  return (
    <div>
      <Text text={'Anecdote of the day'}/>
      <p><strong>{anecdote}</strong></p>
      <p>This anecdote has {votes} votes</p>
      <button onClick={onVote}>Vote</button>
      <button onClick={onRandomAnecdote}>Next anecdote</button>
    </div>
  )
}

const AnecdoteWithMostVotes = ({ anecdote, votes }) => {
  if (votes) {
    return (
      <div>
        <Text text={'Anecdote with most votes'}/>
        <p><strong>{anecdote}</strong></p>
        <p>Has {votes} votes</p>
      </div>
    )
  }

  return (
    <div>
      <Text text={'Anecdote with most votes'}/>
      <p>Please vote</p>
    </div>
  )
}

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
      <div>
        <Text text={'Statistics'}/>
        <table>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="All" value={total} />
          <StatisticLine text="Average" value={average} />
          <StatisticLine text="Good (%)" value={goodPercentage} />
        </table>
      </div>
    )
  }

  return (
    <div>
      <Text text={'Statistics'}/>
      <p>No feedback given</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [average, setAverage] = useState(0)
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const getRandomAnecdote = () => {
    const randomNumber = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomNumber)
  }

  const handleGoodClick = () => {
    setGood(good + 1)
    setAverage(average + 1)
  }

  const handleNeutralClick = () => setNeutral(neutral + 1)

  const handleBadClick = () => {
    setBad(bad + 1)
    setAverage(average - 1)
  }

  const total = good + neutral + bad
  const averageResult = total > 0 ? (average / total) : 0
  const goodPercentage = total > 0 ? ((good / total) * 100) : 0
  const mostVotedAnecdoteIndex = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <Anecdote
        anecdote={anecdotes[selected]}
        votes={votes[selected]}
        onVote={handleVote}
        onRandomAnecdote={getRandomAnecdote}
      />
      <AnecdoteWithMostVotes anecdote={anecdotes[mostVotedAnecdoteIndex]} votes={votes[mostVotedAnecdoteIndex]} />
      <Text text={'Give feedback'} />
      <Button handleClick={handleGoodClick} text={'good'} />
      <Button handleClick={handleNeutralClick} text={'neutral'} />
      <Button handleClick={handleBadClick} text={'bad'} />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={averageResult}
        goodPercentage={goodPercentage}
      />
    </div>
  )
}

export default App
