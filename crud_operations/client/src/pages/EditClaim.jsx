import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ErrorAlert from '../components/ErrorAlert'

function EditClaim() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        item_id: '', claimant_name: '', contact_info: '', claim_status: 'pending'
    })

    useEffect(() => {
        // Load claim data
        fetch(`/api/claims/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const claim = data.data
                    setForm({
                        item_id: claim.item_id,
                        claimant_name: claim.claimant_name || '',
                        contact_info: claim.contact_info || '',
                        claim_status: claim.claim_status || 'pending'
                    })
                } else {
                    setError(data)
                }
            })
            .catch(() => setError({ message: 'Failed to load claim' }))

        // Load items for dropdown
        fetch('/api/items')
            .then(res => res.json())
            .then(data => {
                if (data.success) setItems(data.data)
            })
            .catch(() => { })
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const res = await fetch(`/api/claims/${id}`, {
                method: 'PUT',
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
            setError({ message: 'Failed to update claim' })
        }
    }

    const fieldError = (fieldName) => {
        if (!error || !error.details) return null
        const found = error.details.find(d => d.field === fieldName)
        return found ? found.msg : null
    }

    return (
        <>
            <h1>Edit Claim</h1>
            <ErrorAlert error={error} />

            <form onSubmit={handleSubmit}>
                <div className={`form-group ${fieldError('item_id') ? 'field-error' : ''}`}>
                    <label htmlFor="item_id">Item *</label>
                    <select id="item_id" name="item_id" value={form.item_id} onChange={handleChange}>
                        {items.map(item => (
                            <option key={item.id} value={item.id}>#{item.id} — {item.name}</option>
                        ))}
                    </select>
                    {fieldError('item_id') && <span className="field-error-msg">{fieldError('item_id')}</span>}
                </div>

                <div className={`form-group ${fieldError('claimant_name') ? 'field-error' : ''}`}>
                    <label htmlFor="claimant_name">Claimant Name *</label>
                    <input type="text" id="claimant_name" name="claimant_name"
                        value={form.claimant_name} onChange={handleChange} />
                    {fieldError('claimant_name') && <span className="field-error-msg">{fieldError('claimant_name')}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="contact_info">Contact Info</label>
                    <input type="text" id="contact_info" name="contact_info"
                        value={form.contact_info} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="claim_status">Claim Status</label>
                    <select id="claim_status" name="claim_status" value={form.claim_status} onChange={handleChange}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Update Claim</button>{' '}
                <Link to="/claims" className="btn btn-secondary">Cancel</Link>
            </form>
        </>
    )
}

export default EditClaim
