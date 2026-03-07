function ErrorAlert({ error }) {
    if (!error) return null

    return (
        <div className="alert-error">
            <strong>{error.message || 'An error occurred'}</strong>
            {error.details && error.details.length > 0 && (
                <ul>
                    {error.details.map((d, i) => (
                        <li key={i}><strong>{d.field}:</strong> {d.msg}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ErrorAlert
