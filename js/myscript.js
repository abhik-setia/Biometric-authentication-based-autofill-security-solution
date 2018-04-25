var notification_status = false;

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log("incoming message " + request.message);
		if (request.message == "send notification") {

			if (!notification_status) {
				sendResponse({
					status: "send"
				});
				notification_status = true;
			} else {
				sendResponse({
					status: "do not send"
				});
			}
		} else if (request.message == "start injection") {

			username = request.username;
			password = request.password;

			$(".js-username-field").val(username);
			$(".js-password-field").val(password);

			sendResponse({
				status: "injection successful"
			});
		} else {}
	});