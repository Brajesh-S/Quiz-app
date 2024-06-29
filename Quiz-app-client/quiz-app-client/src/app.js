// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Dashboard from './dashboard';
// import QuestionPage from './questionPage';

// function App() {
//   return (
//     <Router>
        
//       <Switch>
//         <Route exact path="/" component={Dashboard} />
//         <Route path="/quiz/:category" component={QuestionPage} />
//       </Switch>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import QuestionPage from './questionPage';

function App() {
  return (
    <Router>
      <div className="app"> {/* Root element with class name 'app' */}
        <Routes>
          
          <Route 
                path="/quiz/:category" element={<QuestionPage />}>
          </Route> 
          <Route exact path="/" element={<Dashboard/>}> 
           </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;