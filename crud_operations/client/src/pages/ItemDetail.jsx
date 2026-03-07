import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ErrorAlert from '../components/ErrorAlert'

function ItemDetail() {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [claims, setClaims] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(`/api/items/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setItem(data.data.item)
                    setClaims(data.data.claims)
                } else {
                    setError(data)
                }
            })
            .catch(() => setError({ message: 'Failed to load item' }))
    }, [id])

    const handleApprove = async (claimId) => {
        if (!window.confirm('Approve this claim? The item will be marked as resolved.')) return
        try {
            const res = await fetch(`/api/claims/${claimId}/approve`, { method: 'POST' })
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

    const handleDeleteClaim = async (claimId) => {
        if (!window.confirm('Delete this claim?')) return
        try {
            const res = await fetch(`/api/claims/${claimId}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                setClaims(claims.filter(c => c.id !== claimId))
            } else {
                setError(data)
            }
        } catch {
            setError({ message: 'Failed to delete claim' })
        }
    }

    if (error && !item) {
        return (
            <>
                <h1>Error</h1>
                <ErrorAlert error={error} />
                <Link to="/items" className="btn btn-secondary">← Back to Items</Link>
            </>
        )
    }

    if (!item) return <p>Loading...</p>

    return (
        <>
            <h1>{item.name}</h1>
            <ErrorAlert error={error} />

            <dl className="detail-list">
                <dt>ID</dt>
                <dd>{item.id}</dd>
                <dt>Description</dt>
                <dd>{item.description || 'No description'}</dd>
                <dt>Location Found</dt>
                <dd>{item.location_found || '—'}</dd>
                <dt>Date Found</dt>
                <dd>{item.date_found ? new Date(item.date_found).toLocaleDateString() : '—'}</dd>
                <dt>Status</dt>
                <dd><span className={`badge badge-${item.status}`}>{item.status}</span></dd>
                <dt>Created At</dt>
                <dd>{new Date(item.created_at).toLocaleString()}</dd>
            </dl>

            <div className="action-bar mt-10">
                <Link to={`/items/edit/${item.id}`} className="btn btn-secondary btn-sm">Edit</Link>
                <Link to={`/claims/add?item_id=${item.id}`} className="btn btn-primary btn-sm">+ File a Claim</Link>
            </div>

            <h2 style={{ marginTop: '24px', fontSize: '1.15rem', borderBottom: '1px solid #000', paddingBottom: '6px' }}>
                Claims for this Item
            </h2>

            {claims.length === 0 ? (
                <p className="text-muted mt-10">No claims filed for this item yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Claimant</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map(claim => (
                            <tr key={claim.id}>
                                <td>{claim.id}</td>
                                <td>{claim.claimant_name}</td>
                                <td>{claim.contact_info || '—'}</td>
                                <td><span className={`badge badge-${claim.claim_status}`}>{claim.claim_status}</span></td>
                                <td>
                                    <Link to={`/claims/edit/${claim.id}`} className="btn btn-secondary btn-sm">Edit</Link>{' '}
                                    {claim.claim_status === 'pending' && (
                                        <button onClick={() => handleApprove(claim.id)} className="btn btn-primary btn-sm">Approve</button>
                                    )}{' '}
                                    <button onClick={() => handleDeleteClaim(claim.id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Link to="/items" className="btn btn-secondary mt-10">← Back to Items</Link>
        </>
    )
}

export default ItemDetail
