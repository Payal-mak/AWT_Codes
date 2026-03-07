import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ErrorAlert from '../components/ErrorAlert'

function ItemsList() {
    const [items, setItems] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('/api/items')
            .then(res => res.json())
            .then(data => {
                if (data.success) setItems(data.data)
                else setError(data)
            })
            .catch(() => setError({ message: 'Failed to load items' }))
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return
        try {
            const res = await fetch(`/api/items/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                setItems(items.filter(item => item.id !== id))
            } else {
                setError(data)
            }
        } catch {
            setError({ message: 'Failed to delete item' })
        }
    }

    return (
        <>
            <h1>All Items</h1>
            <ErrorAlert error={error} />

            <div className="action-bar">
                <Link to="/items/add" className="btn btn-primary">+ Add Item</Link>
            </div>

            {items.length === 0 ? (
                <p className="text-muted">No items found. Add one to get started.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Date Found</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.location_found || '—'}</td>
                                <td>{item.date_found ? new Date(item.date_found).toLocaleDateString() : '—'}</td>
                                <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                                <td>
                                    <Link to={`/items/${item.id}`} className="btn btn-secondary btn-sm">View</Link>{' '}
                                    <Link to={`/items/edit/${item.id}`} className="btn btn-secondary btn-sm">Edit</Link>{' '}
                                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}

export default ItemsList
