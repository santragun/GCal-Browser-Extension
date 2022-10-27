export default class LoginControl extends Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {
        isLoggedIn: false,
        isTabCalendar: false
    };
    this.instance = '';
  }

  handleLoginClick() {
    authorize().then(response =>
    {
        if(response._token && response._instance_url && response._refresh_token){
            this.setState({isLoggedIn: true});
            this.instance = response.salesforce_instance_url;
        }
        chrome.runtime.sendMessage({type: "refresh_tab"});
    });
    
  }

  handleLogoutClick() {
    chrome.runtime.sendMessage({type: "deleteCookies", domain: "localhost"}).then(response => {
        if(response){
            this.setState({isLoggedIn: false});    
        }   
        chrome.runtime.sendMessage({type: "refresh_tab"});     
    });
    

  }

  componentDidMount() {
    getCurrentTab((tab) => {
        if(tab){
            console.log(tab.url);
            if(tab.url.includes('://calendar.google.com/')){
                this.setState({isTabCalendar: true});
            }  
        }
    });

    chrome.runtime.sendMessage({type: "giveMeCookies", domain: "localhost"}).then(response => {
        if(response.salesforce_access_token && response.salesforce_instance_url && response.salesforce_refresh_token){
            this.setState({isLoggedIn: true});
            this.instance = response.salesforce_instance_url;
        }
        
    });
  }
  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} isTabCalendar={this.state.isTabCalendar} instance={this.instance}/>
        {button}
      </div>
    );
  }
}
function OnCalendarTabGreeting(props){
    return (
        <div>
            <p className="App-intro">GCal is up and Running with<br />{props.instance}</p>
            <p>Enjoy GCal!</p>
        </div>
    );
}
function OnOtherTabsGreeting(props){
    return (
        <div>
            <p className="App-intro">GCal is up and Running with<br />{props.instance}</p>
            <p>Go to <a href="https://calendar.google.com"> Google Calendar</a> to create Events!</p>
        </div>
    );
}
