import Layout from "./components/Layout";
function App() {
  return (
    <div>
      {/*Homepage Layout*/}
      <Layout title='Welcome Page'>
        <h2>Welcome</h2>
        <p>This is a basic React Layout using Reusable component</p>
        <p>You can use this layout in any kind of operations</p>
      </Layout>

      {/*Services */}
      <Layout>
        <h2>Our Services</h2>
        <ul>
          <li>Web Development</li>
          <li>UI/UX</li>
          <li>Mobile App Development</li>
        </ul>
      </Layout>

      {/*Footer */}
      <footer>
        &copy; All Rights Reserved
      </footer>
    </div>
  )
}

export default App
