import './board.css'
import {rows, columns} from '../../constants/constants'

export default function Board() {
    const tiles = new Array(rows).fill().map( _ => new Array(columns).fill(''))

    return (
        <div className="board">
            {tiles.map(
                (rows, rowIndex) =>
                rows.map((_, colIndex) => <div key={rowIndex + '-' + colIndex} />)
            )}
        </div>
    )
}

