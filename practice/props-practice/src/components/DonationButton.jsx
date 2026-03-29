import React from 'react'

const DonationButton = ({ onDonate }) => {

    return (
        <div>
            <button onClick={onDonate}>Donate now</button>
        </div>
    )
}

export default DonationButton
