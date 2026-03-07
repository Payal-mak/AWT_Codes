import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ErrorAlert from '../components/ErrorAlert'

function ClaimsList() {
    const [claims, setClaims] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('/api/claims')
            .then(res => res.json())
            .then(data => {
                if (data.success) setClaims(data.data)
                else setError(data)
            })
            .catch(() => setError({ message: 'Failed to load claims' }))
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this claim?')) return
        try {
            const res = await fetch(`/api/claims/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                setClaims(claims.filter(c => c.id !== id))
            } else {
                setError(data)
            }
        } catch {
            setError({ message: 'Failed to delete claim' })
        }
    }

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this claim? The item will be marked as resolved.')) return
        try {
            const res = await fetch(`/api/claims/${id}/approve`, { method: 'POST' })
            const data = await res.json()
            if (data.success) {
                window.location.reload()
            } else {
                setError(data)
            }
        } catch {
            setError({ message: 'Failed to approve claim' })
        }
    }

    return (
        <>
            <h1>All Claims</h1>
            <ErrorAlert error={error} />

            <div className="action-bar">
                <Link to="/claims/add" className="btn btn-primary">+ File a Claim</Link>
            </div>

            {claims.length === 0 ? (
                <p className="text-muted">No claims filed yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Item</th>
                            <th>Claimant</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Filed On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map(claim => (
                            <tr key={claim.id}>
                                <td>{claim.id}</td>
                                <td><Link to={`/items/${claim.item_id}`} style={{ color: '#000', fontWeight: 600 }}>{claim.item_name}</Link></td>
                                <td>{claim.claimant_name}</td>
                                <td>{claim.contact_info || '—'}</td>
                                <td><span className={`badge badge-${claim.claim_status}`}>{claim.claim_status}</span></td>
                                <td>{new Date(claim.created_at).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`/claims/edit/${claim.id}`} className="btn btn-secondary btn-sm">Edit</Link>{' '}
                                    {claim.claim_status === 'pending' && (
                                        <button onClick={() => handleApprove(claim.id)} className="btn btn-primary btn-sm">Approve</button>
                                    )}{' '}
                                    <button onClick={() => handleDelete(claim.id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}

export default ClaimsList
