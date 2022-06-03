import { VisBurnPage } from './components/VisBurnPage'

function App() {
  return (
    <div className="App">
      <div className='container px-5'>
        <div className="row gx-5 p-3">
          <div className="col">
            <div className="p-3 border bg-light">
              <VisBurnPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
