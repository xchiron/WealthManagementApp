import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import Navbar from "./components/navbar.component";
import CreateWealth from "./components/create-wealth.component";
import EditWealth from "./components/edit-wealth.component";
import WealthList from "./components/wealth-list.component";

function App() {
  return (
     <Router>
      <div className="container">
      <Navbar />
      <br/>
      <Route path="/" exact component={WealthList} />
      <Route path="/edit/:id" component={EditWealth} />
      <Route path="/createWealth" component={CreateWealth} />
      </div>
    </Router>
  );
}

export default App;

//npm start 