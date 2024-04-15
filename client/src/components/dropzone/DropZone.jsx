import './dropzone.css'
import { useEffect, useState } from 'react'
import { size, row, col } from '../../constants/constants'
import ActiveCoin from '../ActiveCoin'
import Winner from '../Winner'

export default function DropZone() {

    const [turn, setTurn] = useState(1)
    const [winner, setWinner] = useState(0)
    const [dropped, setDropped] = useState([])

    const reset = () => {
        setTurn(1)
        setDropped([])
        setWinner(0)
    }

    const findWinner = () => {
        const p1 = dropped.filter(d => d.player === 1)
        p1.forEach(({x, y}) => {
            if (p1.find(m => x === m.x + 1 && y === m.y) &&
                p1.find(m => x === m.x + 2 && y === m.y) &&
                p1.find(m => x === m.x + 3 && y === m.y))
                    setWinner(1)
            if (p1.find(m => x === m.x && y === m.y + 1) &&
                p1.find(m => x === m.x && y === m.y + 2) &&
                p1.find(m => x === m.x && y === m.y + 3))
                    setWinner(1)
            if (p1.find(m => x === m.x + 1 && y === m.y + 1) &&
                p1.find(m => x === m.x + 2 && y === m.y + 2) &&
                p1.find(m => x === m.x + 3 && y === m.y + 3))
                    setWinner(1)
            if (p1.find(m => x === m.x + 1 && y === m.y - 1) &&
                p1.find(m => x === m.x + 2 && y === m.y - 2) &&
                p1.find(m => x === m.x + 3 && y === m.y - 3))
                    setWinner(1)
        })

        const p2 = dropped.filter(d => d.player === 2)
        p2.forEach(({x, y}) => {
            if (p2.find(m => x === m.x + 1 && y === m.y) &&
                p2.find(m => x === m.x + 2 && y === m.y) &&
                p2.find(m => x === m.x + 3 && y === m.y))
                    setWinner(2)
            if (p2.find(m => x === m.x && y === m.y + 1) &&
                p2.find(m => x === m.x && y === m.y + 2) &&
                p2.find(m => x === m.x && y === m.y + 3))
                    setWinner(2)
            if (p2.find(m => x === m.x + 1 && y === m.y + 1) &&
                p2.find(m => x === m.x + 2 && y === m.y + 2) &&
                p2.find(m => x === m.x + 3 && y === m.y + 3))
                    setWinner(2)
            if (p2.find(m => x === m.x + 1 && y === m.y - 1) &&
                p2.find(m => x === m.x + 2 && y === m.y - 2) &&
                p2.find(m => x === m.x + 3 && y === m.y - 3))
                    setWinner(2)
        })
    }

    useEffect(() => {
        if(dropped.length === row * col)
            setWinner(-1)
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