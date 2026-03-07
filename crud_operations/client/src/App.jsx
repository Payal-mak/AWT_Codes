import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ItemsList from './pages/ItemsList'
import ItemDetail from './pages/ItemDetail'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import ClaimsList from './pages/ClaimsList'
import AddClaim from './pages/AddClaim'
import EditClaim from './pages/EditClaim'
import './App.css'

function App() {
    return (
        <BrowserRouter>
            {/* Navbar */}
            <nav>
                <Link className="brand" to="/">Lost &amp; Found</Link>
                <ul className="nav-links">
                    <li><Link to="/items">Items</Link></li>
                    <li><Link to="/claims">Claims</Link></li>
                </ul>
            </nav>

            {/* Main Content */}
            <main>
                <Routes>
                    <Route path="/" element={<ItemsList />} />
                    <Route path="/items" element={<ItemsList />} />
                    <Route path="/items/add" element={<AddItem />} />
                    <Route path="/items/edit/:id" element={<EditItem />} />
                    <Route path="/items/:id" element={<ItemDetail />} />
                    <Route path="/claims" element={<ClaimsList />} />
                    <Route path="/claims/add" element={<AddClaim />} />
                    <Route path="/claims/edit/:id" element={<EditClaim />} />
                </Routes>
            </main>

            {/* Footer */}
            <footer>
                Lost &amp; Found Management System &copy; 2026
            </footer>
        </BrowserRouter>
    )
}

export default App
