import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import ErrorAlert from '../components/ErrorAlert'

function AddClaim() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [items, setItems] = useState([])
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        item_id: searchParams.get('item_id') || '',
        claimant_name: '',
        contact_info: ''
    })

    useEffect(() => {
        fetch('/api/items')
            .then(res => res.json())
            .then(data => {
                if (data.success) setItems(data.data)
            })
            .catch(() => setError({ message: 'Failed to load items' }))
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const res = await fetch('/api/claims', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()

            if (data.success) {
                navigate('/claims')
            } else {
                setError(data)
            }
        } catch {
            setError({ message: 'Failed to create claim' })
        }
    }

    const fieldError = (fieldName) => {
        if (!error || !error.details) return null
        const found = error.details.find(d => d.field === fieldName)
        return found ? found.msg : null
    }

    return (
        <>
            <h1>File a Claim</h1>
            <ErrorAlert error={error} />

            <form onSubmit={handleSubmit}>
                <div className={`form-group ${fieldError('item_id') ? 'field-error' : ''}`}>
                    <label htmlFor="item_id">Select Item *</label>
                    <select id="item_id" name="item_id" value={form.item_id} onChange={handleChange}>
                        <option value="">— Choose an item —</option>
                        {items.map(item => (
                            <option key={item.id} value={item.id}>#{item.id} — {item.name}</option>
                        ))}
                    </select>
                    {fieldError('item_id') && <span className="field-error-msg">{fieldError('item_id')}</span>}
                </div>

                <div className={`form-group ${fieldError('claimant_name') ? 'field-error' : ''}`}>
                    <label htmlFor="claimant_name">Your Name *</label>
                    <input type="text" id="claimant_name" name="claimant_name" placeholder="e.g. John Doe"
                        value={form.claimant_name} onChange={handleChange} />
                    {fieldError('claimant_name') && <span className="field-error-msg">{fieldError('claimant_name')}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="contact_info">Contact Info</label>
                    <input type="text" id="contact_info" name="contact_info" placeholder="e.g. email or phone"
                        value={form.contact_info} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary">Submit Claim</button>{' '}
                <Link to="/claims" className="btn btn-secondary">Cancel</Link>
            </form>
        </>
    )
}

export default AddClaim
