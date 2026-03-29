const App = () => {
  const userName = "John Doe";
  //Basic JSX with variables
  const name = "payal";
  const greeting = "Welcome to JSX";
  //JSX with expressions
  const num1 = 5;
  const num2 = "5";

  //JSX  with conditional rendering
  const isLoggedIn = true;

  //JSX with lists
  const Fruits = ["Apple", "Banana", "Mango", "Dates", "Dates"];

  return (
    <div>
      <h1>JSX Examples</h1>
      {/*!Basic JSX with variables*/}
      <section>
        <h2>1. Basic JSX with variables</h2>
        {name}, {greeting}
      </section>

      <section>
        {/*!JSX with expressions */}
        <h2>JSX with expressions</h2>
        {num1} + {num2} = {num1 + num2}
      </section>

      <section>
        {/*!JSX  with conditional rendering */}
        <h2>JSX  with conditional rendering</h2>
        <p>
          {isLoggedIn ? (
            <span>Welcome Back!</span>
          ) : (
            <span>please login again</span>
          )
          }
        </p>
      </section>

      <section>
        {/*!JSX with lists */}
        <ul>
          {Fruits.map((Fruits, index) => {
            return (
              <li key={index}>{Fruits}</li>
            )
          })}
        </ul>
      </section>
    </div>
  )

};
export default App;