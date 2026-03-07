import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ErrorAlert from '../components/ErrorAlert'

function AddItem() {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        name: '', description: '', location_found: '', date_found: '', status: 'found'
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const res = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()

            if (data.success) {
                navigate('/items')
            } else {
                setError(data)
            }
        } catch {
            setError({ message: 'Failed to create item' })
        }
    }

    // Helper to check if a field has an error
    const fieldError = (fieldName) => {
        if (!error || !error.details) return null
        const found = error.details.find(d => d.field === fieldName)
        return found ? found.msg : null
    }

    return (
        <>
            <h1>Add New Item</h1>
            <ErrorAlert error={error} />

            <form onSubmit={handleSubmit}>
                <div className={`form-group ${fieldError('name') ? 'field-error' : ''}`}>
                    <label htmlFor="name">Item Name *</label>
                    <input type="text" id="name" name="name" placeholder="e.g. Blue Backpack"
                        value={form.name} onChange={handleChange} />
                    {fieldError('name') && <span className="field-error-msg">{fieldError('name')}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" placeholder="Describe the item..."
                        value={form.description} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="location_found">Location Found</label>
                    <input type="text" id="location_found" name="location_found" placeholder="e.g. Library, Room 201"
                        value={form.location_found} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="date_found">Date Found</label>
                    <input type="date" id="date_found" name="date_found"
                        value={form.date_found} onChange={handleChange} />
                </div>

                <div className={`form-group ${fieldError('status') ? 'field-error' : ''}`}>
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={form.status} onChange={handleChange}>
                        <option value="found">Found</option>
                        <option value="lost">Lost</option>
                    </select>
                    {fieldError('status') && <span className="field-error-msg">{fieldError('status')}</span>}
                </div>

                <button type="submit" className="btn btn-primary">Add Item</button>{' '}
                <Link to="/items" className="btn btn-secondary">Cancel</Link>
            </form>
        </>
    )
}

export default AddItem
