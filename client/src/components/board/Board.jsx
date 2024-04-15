import './board.css'
import {row, col} from '../../constants/constants'

export default function Board() {
    const tiles = 
    new Array(row).fill().map( _ => new Array(col).fill(''))

    return (
        <div className="board">
            {tiles.map(
                (row, rowIndex) =>
                row.map((_, colIndex) => <div key={rowIndex + '-' + colIndex} />)
            )}
        </div>
    )
}

