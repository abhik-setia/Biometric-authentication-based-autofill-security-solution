  var signed_in=false;
  var config = {
    apiKey: "AIzaSyAsygVfFajw4A5gjMrZyun2hGlGVtN-m6Q",
    authDomain: "major-project-e5af0.firebaseapp.com",
    databaseURL: "https://major-project-e5af0.firebaseio.com",
    projectId: "major-project-e5af0",
    storageBucket: "major-project-e5af0.appspot.com",
    messagingSenderId: "138928372964"
  };
  firebase.initializeApp(config);

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 *  */

 function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);

    if(user==null){
      signed_in=false;
    }else{
      signed_in=true;
    }

  });
}

function get_status(){
  return signed_in;
}

window.onload = function() {
  initApp();
};
