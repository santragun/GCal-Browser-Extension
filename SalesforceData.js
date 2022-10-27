export async function getInputSuggestions(token, instanceUrl, refreshToken){

  let suggestions = [];
  
  getavailableResources(token, instanceUrl, refreshToken, '/services/data/', '').then(response => {
    console.log(response);
    let latestVersion = response[response.length - 1].url;
    getavailableResources(token, instanceUrl, refreshToken, latestVersion, '/query?q=select+name+from+opportunity').then(response => {
      console.log('opportunities');
      let opportunities = [];
      let responseLength = 0;
      if(response['records']){
        responseLength = response['records'].length;
      }
      for(let i = 0; i < responseLength; i++){
        opportunities.push(response['records'][i]['Name']);
      }
      suggestions.push(opportunities);
    });

    
    getavailableResources(token, instanceUrl, refreshToken, latestVersion, '/query?q=select+(select+subject,+activitytype+from+activityhistories)+from+account').then(response =>{
      console.log('activities');
      let activities = [];
      let responseLength = 0;
      
      if(response['records']){
        responseLength = response['records'].length; 
      }
      for(let i = 0; i < responseLength; i++){
        if(response['records'][i]['ActivityHistories']){
          let accountactivities = response['records'][i]['ActivityHistories'];
          for(let j = 0; j < accountactivities['records'].length; j++){
            activities.push(accountactivities['records'][j]['Subject']);
          }
        }
      }
      suggestions.push(activities);
      
    });

    getavailableResources(token, instanceUrl, refreshToken, latestVersion, '/event').then(response => {
      console.log('events');
      suggestions.push(response);

      return suggestions;
    });
  });
  return suggestions;
}

async function getavailableResources(token, instanceUrl, refreshToken, resourceVersion, endpoint){
    
    let response = '';

    return await new Promise(resolve => {
      chrome.runtime.sendMessage({type: "getData", instanceUrl: instanceUrl, token: token, resourceVersion: resourceVersion, endpoint: endpoint}).then(response => {
        if(response[0] && response[0]['errorCode'] && response[0]['errorCode'] == 'INVALID_SESSION_ID'){
          chrome.runtime.sendMessage({type: "refreshToken", refresh_token: refreshToken}).then(updatedCookies => {
             chrome.cookies.set({
                url: "https://" + "localhost"  + "/", 
                name: "token",
                value: updatedCookies.access_token
              });
             token = updatedCookies.access_token;
             getavailableResources(token, instanceUrl, refreshToken, resourceVersion, endpoint);
          });
        }
        resolve(response);
        return response;
    });
    
  });
}
