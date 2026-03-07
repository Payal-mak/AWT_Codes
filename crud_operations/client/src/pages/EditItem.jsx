import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ErrorAlert from '../components/ErrorAlert'

function EditItem() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        name: '', description: '', location_found: '', date_found: '', status: 'found'
    })

    useEffect(() => {
        fetch(`/api/items/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const item = data.data.item
                    setForm({
                        name: item.name || '',
                        description: item.description || '',
                        location_found: item.location_found || '',
                        date_found: item.date_found ? item.date_found.split('T')[0] : '',
                        status: item.status || 'found'
                    })
                } else {
                    setError(data)
                }
            })
            .catch(() => setError({ message: 'Failed to load item' }))
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const res = await fetch(`/api/items/${id}`, {
                method: 'PUT',
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
            setError({ message: 'Failed to update item' })
        }
    }

    const fieldError = (fieldName) => {
        if (!error || !error.details) return null
        const found = error.details.find(d => d.field === fieldName)
        return found ? found.msg : null
    }

    return (
        <>
            <h1>Edit Item</h1>
            <ErrorAlert error={error} />

            <form onSubmit={handleSubmit}>
                <div className={`form-group ${fieldError('name') ? 'field-error' : ''}`}>
                    <label htmlFor="name">Item Name *</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} />
                    {fieldError('name') && <span className="field-error-msg">{fieldError('name')}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={form.description} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="location_found">Location Found</label>
                    <input type="text" id="location_found" name="location_found" value={form.location_found} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="date_found">Date Found</label>
                    <input type="date" id="date_found" name="date_found" value={form.date_found} onChange={handleChange} />
                </div>

                <div className={`form-group ${fieldError('status') ? 'field-error' : ''}`}>
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={form.status} onChange={handleChange}>
                        <option value="found">Found</option>
                        <option value="lost">Lost</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    {fieldError('status') && <span className="field-error-msg">{fieldError('status')}</span>}
                </div>

                <button type="submit" className="btn btn-primary">Update Item</button>{' '}
                <Link to="/items" className="btn btn-secondary">Cancel</Link>
            </form>
        </>
    )
}

export default EditItem
