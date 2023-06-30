import React, {useState} from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const arrayOfItems = [0, 1, 2, 
                        3, 4, 5, 
                        6, 7, 8]
  const [index, setIndex] = useState(initialIndex)
  const [steps, setSteps] = useState(initialSteps)
  const [message, setMessage] = useState(initialMessage)
  const [email , setEmail] = useState(initialEmail)
  

  function getCoordinates(index) {
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

  function getMessageError(direction) {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getCoordinates` helper above to obtain the coordinates, and then `getMessageError`
    // returns the fully constructed string.
    const x = getCoordinates(index)[0]
    const y = getCoordinates(index)[1]

      if (x === 1 && direction === 'left'){
      setMessage(`You can't go left`)
      return message
    } else if (x === 3 && direction === 'right'){
      setMessage(`You can't go right`)
      return message
    } else if (y === 1 && direction === 'up'){
      setMessage(`You can't go up`)
      return message
    } else if (y === 3 && direction === 'down'){
      setMessage(`You can't go down`)
      return message
    } else setMessage(initialMessage)
  } 

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage)
    setIndex(initialIndex)
    setSteps(initialSteps)
    setEmail(initialEmail)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === 'left' && (index != 0) && (index != 3) && (index != 6)){
      return [setIndex(index - 1), setMessage(initialMessage)]
    } else if (direction === 'down' && (index != 6) && (index != 7) && (index != 8)){
      return [setIndex(index + 3), setMessage(initialMessage)]
    } else if (direction === 'right' && (index != 2) && (index != 5) && (index != 8)){
      return [setIndex(index + 1), setMessage(initialMessage)]
    } else if (direction === 'up' && (index != 0) && (index != 1) && (index != 2)){
      return [setIndex(index - 3), setMessage(initialMessage)]
    } else if (direction === 'left'){
      return [getMessageError('left'), -1]
    }  else if (direction === 'down'){
      return [getMessageError('down'), -1]
    }  else if (direction === 'right'){
      return [getMessageError('right'), -1]
    }  else if (direction === 'up'){
      return [getMessageError('up'), -1]
    }
 }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B", and change any states accordingly.
    // counts the times you moved
      if (evt[1] != -1){
        return setSteps( steps + 1 )
      }
  }

  function stepsMessage() {
    if(steps === 1){
    return `You moved ${steps} time`
    } else return `You moved ${steps} times` 
  }

  function onChange(evt) {
    // You will need this to update the value of the submit input.
    setEmail(evt.target.value)
    
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    const states = {
      x: getCoordinates(index)[0],
      y: getCoordinates(index)[1],
      steps: steps,
      email: email
    }
    evt.preventDefault()
    axios.post('http://localhost:9000/api/result', states)
    .then(res => {setMessage(res.data.message)})
    .catch(err => {setMessage(err.response.data.message)})
    .finally(() => {setEmail(initialEmail)})
    
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({getCoordinates(index).toString()})</h3>
        <h3 id="steps">{stepsMessage()}</h3>
      </div>
      <div id="grid">
        {
          arrayOfItems.map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={(e) => move(getNextIndex('left'))}>LEFT</button>
        <button id="up" onClick={(e) => move(getNextIndex('up'))}>UP</button>
        <button id="right" onClick={(e) => move(getNextIndex('right'))}>RIGHT</button>
        <button id="down" onClick={(e) => move(getNextIndex('down'))}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="Type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
