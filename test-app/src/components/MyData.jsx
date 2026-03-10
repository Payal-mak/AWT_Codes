import React from 'react'
import { useState } from 'react'

export const MyData = ({ items }) => {
    const MyData = ({ items, setItems }) => {
        const [inp, setInp] = useState('');
        const handleAdd = () => {
            setItems(items => [...items, inp])
            setInp('')
        }
    }
    return (
        <div>MyData
            <hr />
            <input
                type='text'
                value={inp}
                onChange={(e) => setInp(e.target.value)} />
            <button onClick={handleAdd}>Add</button>
            <hr />
            {items.length > 0 &&
                <p>
                    items are
                    {
                        items.map(item => (<p key={item}>{items}</p>))
                    }
                </p>}
        </div>
    )
}

export default MyData