const Course = ({ courses }) => {
  return (
    <section>
      <h1>Web development curriculum</h1>
      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.name}</h3>
          {course.parts.map((part) => (
            <p key={part.id}>{part.name}: {part.exercises} exercises</p>
          ))}
          <p>
            <strong>Total of {course.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</strong>
          </p>
        </div>
      ))}
    </section>
  )
}

export default Course
