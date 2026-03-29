import React from 'react'

const Layout = (props) => {
    return (
        <div>
            {/*Header */}
            <header>
                <h1>{props.title}</h1>
            </header>

            {/*Main */}
            <main>
                {props.children}
            </main>
        </div>
    )
}

export default Layout
