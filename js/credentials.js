var config = {
  apiKey: "AIzaSyAsygVfFajw4A5gjMrZyun2hGlGVtN-m6Q",
  authDomain: "major-project-e5af0.firebaseapp.com",
  databaseURL: "https://major-project-e5af0.firebaseio.com",
  projectId: "major-project-e5af0",
  storageBucket: "major-project-e5af0.appspot.com",
  messagingSenderId: "138928372964"
};
firebase.initializeApp(config);

function initApp() {
// Listen for auth state changes.
// [START authstatelistener]
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



    // [START_EXCLUDE]
    document.getElementById('quickstart-button').textContent = 'Sign out';
    document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
    //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
    console.log("writing database");
    //writeUserData(uid,displayName,email,photoURL);
    readDB(uid);
    // [END_EXCLUDE]
  } else {
    // Let's try to get a Google auth token programmatically.
    // [START_EXCLUDE]
    document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
    document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
    document.getElementById('quickstart-account-details').textContent = 'null';
    // [END_EXCLUDE]
  }
  document.getElementById('quickstart-button').disabled = false;
});
// [END authstatelistener]

document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}
function writeUserData(userId, name, email, imageUrl) {
firebase.database().ref('users/' + userId).set({
  username: name,
  email: email,
  profile_picture : imageUrl
});
}

function readDB(userId){
var dburl=firebase.database().ref('users/' + userId);
dburl.on('value',function(snapshot){
  console.log(snapshot.val());
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


function send_Notification(){

  // Set up an asynchronous AJAX POST request
  var hr = new XMLHttpRequest();
  var url="https://fcm.googleapis.com/fcm/send";

  hr.open("POST", url, true);
  hr.setRequestHeader('Content-Type','application/json');
  hr.setRequestHeader('Authorization','key=AAAAIFjGvOQ:APA91bExRs9a6obdSf9BZIMDwZvNN_0NeLr6kS5jDq3kHQcUsKKh3JlNQpLOf9scnPvVGrpf97HOe0aCj71nMBe83O1AIIEFbbNgoRHQDJI64ejAOdpv8XNdxhNtFO_9wJvHogwdZIKh');      
  var data='{"to" : "dbuPCb0LkoE:APA91bGNsyxBpYtYJqt2s9a1zr9ElMS7-gdlsPe8yJzk3AKxdQIpTGfEfSBRCGfWeEawjmTEu-SjNpH0W-zhu3Di1KDTRx7bPaanA1c6m_sKX2fyqNvVHiuHD4AAPchLT0TdaTvKajKf","notification" : {"body" : "great match!","title" : "Portugal vs. Denmark","content_available" : true,"priority" : "high"},"data" : {"body" : "great match!","title" : "Portugal vs. Denmark","content_available" : true,"priority" : "high"}}';

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

window.onload = function() {
initApp();
document.getElementById("sn").addEventListener("click",send_Notification);
};


