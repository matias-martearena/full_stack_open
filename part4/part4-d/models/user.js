import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 100
  },
  name: {
    type: String,
    minLength: 5,
    maxLength: 100
  },
  passwordHash: {
    type: String,
    required: true,
    minLength: 3
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

export default mongoose.model('User', userSchema)
