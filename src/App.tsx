import Form from "./components/form"
import Header from "./components/header"

function App() {

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black p-6  text-lightText">
      <Header/>
      <Form />
    </div>
  );
}

export default App
