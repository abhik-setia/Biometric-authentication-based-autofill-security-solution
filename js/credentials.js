var config = {
  apiKey: "AIzaSyAsygVfFajw4A5gjMrZyun2hGlGVtN-m6Q",
  authDomain: "major-project-e5af0.firebaseapp.com",
  databaseURL: "https://major-project-e5af0.firebaseio.com",
  projectId: "major-project-e5af0",
  storageBucket: "major-project-e5af0.appspot.com",
  messagingSenderId: "138928372964"
};
firebase.initializeApp(config);

var userId;

function initApp() {
// Listen for auth state changes.
// [START authstatelistener]

Materialize.toast('Checking status of sign-in...', 1000);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

    userId=uid;
    Materialize.toast("Welcome "+displayName+",Checking live status....",4000);
    $("#after_login").show();
    $("#before_login").hide();

    writeUserData(uid,displayName,email,photoURL);

  } else {
    $("#after_login").hide();
    $("#before_login").show();   
  }

});
// [END authstatelistener]

document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

function writeUserData(userId, name, email, imageUrl) {

    var user_data={ username: name,
      email: email,
      profile_picture : imageUrl,
      twitter_username:"",
      twitter_password:"",
      authorization_request:"Not Initialised"};

      firebase.database().ref('users/' + userId).transaction(function(currentUserData){
       if (currentUserData === null){
          return user_data;  
        }
      }, function(error, committed) {
        console.log("do not write data again");
        check_db_for_twitter(userId);
      });    
}

/**
* Start the auth flow and authorizes to Firebase.
* @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
*/

function startAuth(interactive) {
// Request an OAuth token from the Chrome Identity API.
chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
  if (chrome.runtime.lastError && !interactive) {
    console.log('It was not possible to get a token programmatically.');
  } else if(chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
  } else if (token) {
    // Authorize Firebase with the OAuth Access Token.
    var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
    firebase.auth().signInWithCredential(credential).catch(function(error) {
      // The OAuth token might have been invalidated. Lets' remove it from cache.
      if (error.code === 'auth/invalid-credential') {
        chrome.identity.removeCachedAuthToken({token: token}, function() {
          startAuth(interactive);
        });
      }
    });
  } else {
    console.error('The OAuth Token was null');
  }
});
}

/**
* Starts the sign-in process.
*/
function startSignIn() {
document.getElementById('quickstart-button').disabled = true;
if (firebase.auth().currentUser) {
  firebase.auth().signOut();
} else {
  startAuth(true);
}
}


function save_details(twitter_username,twitter_password,userId){

    firebase.database().ref('users/' + userId).transaction(function(currentUserData){
    
      currentUserData.twitter_username=twitter_username;
      currentUserData.twitter_password=twitter_password;
      return currentUserData;
    });
   
    console.log("Saved data");
    $("#login_details").hide();
    Materialize.toast("All set and ready to go!!",1000);

    $("#landing_txt").text("Notification has been sent to your device, please authorise request.");
    send_Notification(userId);
  
}

function send_Notification(userId){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message:"send notification",messageBody: userId}, function(response) {
      if(response.status=="send"){
        send_Notification_direct(userId);
      }else{
        //do not send any notification
      }
    });
  });
  $("#resend_notification").show();
}

function send_Notification_direct(userId){

  // Set up an asynchronous AJAX POST request
  var hr = new XMLHttpRequest();
  var url="https://fcm.googleapis.com/fcm/send";

  hr.open("POST", url, true);
  hr.setRequestHeader('Content-Type','application/json');
  hr.setRequestHeader('Authorization','key=AAAAIFjGvOQ:APA91bExRs9a6obdSf9BZIMDwZvNN_0NeLr6kS5jDq3kHQcUsKKh3JlNQpLOf9scnPvVGrpf97HOe0aCj71nMBe83O1AIIEFbbNgoRHQDJI64ejAOdpv8XNdxhNtFO_9wJvHogwdZIKh');      
  var data='{"to" : "dbuPCb0LkoE:APA91bGNsyxBpYtYJqt2s9a1zr9ElMS7-gdlsPe8yJzk3AKxdQIpTGfEfSBRCGfWeEawjmTEu-SjNpH0W-zhu3Di1KDTRx7bPaanA1c6m_sKX2fyqNvVHiuHD4AAPchLT0TdaTvKajKf","notification" : {"body" : "Need Authorisation for autologin.","title" : "Twitter autologin request","content_available" : true,"priority" : "high","icon":"ic_launcher"},"data" : {"userId":"'+userId+'"}}';

  // Handle request state change events
  hr.onreadystatechange = function() { 
    // If the request completed
  if (hr.readyState == 4) {
      if (hr.status == 200) {
          // success
          resp=JSON.parse(hr.responseText);
          console.log('Response Sent with params '+data );
      } else {
          // Show what went wrong
          console.log('Something went wrong '+ hr.responseText);
      }
  }
  }; 			
  hr.send(data);
  } 


function check_db_for_twitter(userId){

  var dburl=firebase.database().ref('users/' + userId);
  dburl.on('value',function(snapshot){
    var user_obj=snapshot.val();

    if(user_obj.twitter_password!="" && user_obj.twitter_username!=""){
      $("#login_details").hide();
      $("#landing_txt").text("Notification has been sent to your device, please authorise request.");
      send_Notification(userId);       
    }else{
      $("#login_details").show();
    }  

  });
}

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){

  var curr_tab=tabs[0].url;
  var urlPattern=new RegExp("https://twitter.com/*");

  if(curr_tab.match(urlPattern)){

    $("#landing_txt").text("Please provide sign in details for one time only.");   
    $("#login_details").show();
    //Materialize.toast("checking live status, please wait....",2000);
  }else{
    $("#landing_txt").text("Hi,Please open twitter login page to autologin.");
    $("#login_details").hide();
  }});

  

window.onload = function() {
initApp();
$("#resend_notification").click(function(){
  send_Notification_direct(userId);
});

$("#save_btn").click(function(){
  twitter_username=$("#username").val();
  twitter_password=$("#password").val();

  if(!twitter_username || !twitter_password)
{
  Materialize.toast("Please fill all details",1000);
}else
  save_details(twitter_username,twitter_password,userId);
})
};


