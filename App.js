/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import LoginControl from "./components/LoginControl";
import {authorize} from "./components/LoginControl";
import {getCurrentTab} from "./common/Utils";
import {getInputSuggestions} from "./data/SalesforceData";

class App extends Component {
    constructor(props) {
        super(props);
    }
    handleGetEventDataClick(){
      console.log('Check if user is logged in. If not Login popup');
      
      chrome.runtime.sendMessage({type: "giveMeCookies", domain: "localhost"}).then(response => {

        if(!(response.salesforce_access_token && response.salesforce_instance_url && response.salesforce_refresh_token)){
          authorize().then(updatedresponse => {
            console.log(response);
            response = updatedresponse;
          });
        }
       if(response.salesforce_access_token && response.salesforce_instance_url && response.salesforce_refresh_token){
        console.log('Loading');
        getInputSuggestions(response.salesforce_access_token, response.salesforce_instance_url, response.salesforce_refresh_token)
        .then((salesforce_data) => {
          console.log(salesforce_data);
      });
    }
      });
    }
    componentDidMount() {
    }

    render() {
        return (
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Welcome to GCal</h1>
              {/*<button onClick={this.handleGetEventDataClick} className="button">
                Get Event Data
              </button>*/}
              <LoginControl />
            </header>
          </div>
        );
    }
}

export default App;
