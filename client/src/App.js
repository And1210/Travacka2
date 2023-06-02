import './App.css';

function App() {
// <Route path="/gallery" element={<Gallery />} />
// <Route path="/map" element={<Map />} />
// <Route path="/daybyday" element={<DayByDay />} />
// <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
// <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
// <Route path="/login" element={<Login />} />
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" exact element={<Home />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
