import Board from "../components/board/Board"
import DropZone from "../components/dropzone/DropZone"

export default function Game() {
    return (
        <div className='game'>
            <DropZone/>
            <Board/>
        </div>
    )
}