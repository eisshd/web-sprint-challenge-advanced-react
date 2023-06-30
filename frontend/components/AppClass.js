import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

const arrayOfItems = [0, 1, 2, 
                      3, 4, 5, 
                      6, 7, 8]

export default class AppClass extends React.Component {

  constructor(props){
    super()
    this.state = {
      index: initialIndex,
      steps: initialSteps,
      message: initialMessage,
      email: initialEmail
    }
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getCoordinates = (index) => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let x = (index % 3) + 1
    let y = 0
    if (index < 3)
    {y = 1}
    else if (index < 6) 
    {y = 2}
    else if (index < 9) 
    {y = 3}
    return [x, y]
  }

  getMessageError = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getMessageError`
    // returns the fully constructed string.
    const x = getCoordinates(this.state.index)[0]
    const y = getCoordinates(this.state.index)[1]

      if (x === 1){
      setMessage(`You can't go left`)
      console.log('left')
      return message
    } else if (x === 3){
      setMessage(`You can't go right`)
      console.log('right')
      return message
    } else if (y === 1){
      setMessage(`You can't go up`)
      console.log('up')
      return message
    } else if (y === 3){
      setMessage(`You can't go down`)
      console.log('down')
      return message
    } else this.setState({message: initialMessage})
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      index: initialIndex,
      steps: initialSteps,
      message: initialMessage,
      email: initialEmail})
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === 'left' && (this.state.index != 0) && (this.state.index != 3) && (this.state.index != 6)){
      return this.setState({index: this.state.index - 1})
    } else if (direction === 'down' && (this.state.index != 6) && (this.state.index != 7) && (this.state.index != 8)){
      return this.setState({index:  this.state.index + 3})
    } else if (direction === 'right' && (this.state.index != 2) && (this.state.index != 5) && (this.state.index != 8)){
      return this.setState({index:  this.state.index + 1})
    } else if (direction === 'up' && (this.state.index != 0) && (this.state.index != 1) && (this.state.index != 2)){
      return this.setState({index:  this.state.index - 3})
    } else return 0
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    if (evt != 0){
      return this.setState({ steps: this.state.steps + 1})
    } else this.getMessageError
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({email: evt.target.value})
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    const states = {
      x: this.getCoordinates(this.state.index)[0],
      y: this.getCoordinates(this.state.index)[1],
      steps: this.state.steps,
      email: this.state.email
    }
    evt.preventDefault()
    axios.post('http://localhost:9000/api/result', states)
        //  .then(res => console.log(res))
         .then(res => {this.setState({message: res.data.message})})
        //  .catch(err => console.log(err.response.data.message))
         .catch(err => {this.setState({message: err.response.data.message})})
         .finally(() => {this.setState({email: initialEmail})})

  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({this.getCoordinates(this.state.index).toString()})</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            arrayOfItems.map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(e) => this.move(this.getNextIndex('left'))}>LEFT</button>
          <button id="up" onClick={(e) => this.move(this.getNextIndex('up'))}>UP</button>
          <button id="right" onClick={(e) => this.move(this.getNextIndex('right'))}>RIGHT</button>
          <button id="down" onClick={(e) => this.move(this.getNextIndex('down'))}>DOWN</button>
          <button id="reset"onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email}></input>
          <input id="submit" type="submit" ></input>
        </form>
      </div>
    )
  }
}
