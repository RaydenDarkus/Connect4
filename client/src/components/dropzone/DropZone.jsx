import './dropzone.css'
import { useEffect, useState } from 'react'
import { size, rows, columns } from '../../constants/constants'
import ActiveCoin from '../ActiveCoin'
import Winner from '../winner/Winner'

export default function DropZone() {

    const [turn, setTurn] = useState(1)
    const [winner, setWinner] = useState(0)
    const [dropped, setDropped] = useState([])

    const reset = () => {
        setTurn(1)
        setDropped([])
        setWinner(0)
    }

    const checkWin = (player, x, y, dx, dy) => {
        for (let i = 0; i < 4; i++) {
            const newX = x + i * dx
            const newY = y + i * dy
            if (!dropped.find(m => m.x === newX && m.y === newY && m.player === player)) {
                return false
            }
        }
        return true
    }

    const findWinner = () => {
        const directions = [ [1, 0], [0, 1], [1, 1], [1, -1] ]
        for (const [dx, dy] of directions) {
            for (const drop of dropped) {
                const { player, x, y } = drop
                if (checkWin(player, x, y, dx, dy))
                    setWinner(player)
            }
        }
        if (dropped.length === rows * columns) 
            setWinner(-1)
    }

    useEffect(() => {
        findWinner()
    }, [dropped.length])

    useEffect(() => console.log(winner), [winner])

    return (
        <div className='dropzone'>
            {dropped.map((drop, index) => 
                <div key = {index} 
                    className={`p${drop.player}`}
                    style={{transform: `translate(${drop.y * size}px, ${drop.x * size + 150}px)`}}
                />
            )}

            {
                winner ? <Winner winner = {winner} reset = {reset}/>
                : <ActiveCoin turn={turn} dropped={dropped} setDropped={setDropped} setTurn={setTurn}/>
            }
            
        </div>
    )
}