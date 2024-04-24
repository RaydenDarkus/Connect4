import PropTypes from 'prop-types'
import './winner.css'

export default function Winner({winner, reset}) {
    return(  
        <p className='winner-message'> 
        {winner === -1 
            ? <span>No player won</span>
            : <span>Player {winner} has won</span>
            }
            <button className='play-again-button' title='Play again' onClick={reset}>Play Again</button>
        </p>
    )
}

Winner.propTypes = {
    winner: PropTypes.number.isRequired, // Ensure winner is a number and is required
    reset: PropTypes.func.isRequired // Ensure reset is a function and is required
}