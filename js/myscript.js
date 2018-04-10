var notification_status=false;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == "send notification"){

        if(!notification_status){
            sendResponse({status:"send"});
            notification_status=true;
        }else{
            sendResponse({status:"do not send"});     
        }
    }
});

