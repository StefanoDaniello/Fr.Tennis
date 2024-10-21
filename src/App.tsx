import { ContextProvider } from './store/context'
import './App.css'
import MainComp from './components/MainComp'
import HeaderComp from './components/HeaderComp'


function App() {

  return (
    <ContextProvider>
      <HeaderComp></HeaderComp>
      <MainComp></MainComp>
    </ContextProvider>
  )
}

export default App
