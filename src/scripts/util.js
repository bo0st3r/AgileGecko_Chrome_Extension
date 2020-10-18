// // https://stackoverflow.com/questions/5448246/how-to-get-the-id-of-a-chrome-tab/32978880
// //   http://waitingphoenix.com/how-to-make-your-chrome-extension-access-webpage/
//
// let contentPort
// chrome.runtime.onConnect.addListener(function(portFrom) {
//   if(portFrom.name === 'background-content') {
//     //This is how you add listener to a port.
//     portFrom.onMessage.addListener(function(message) {
//       console.log('message');
//       console.log(message);
//       //Do something to duck
//     });
//   }
// });
//
// // var tabId;
// // chrome.extension.sendMessage({ type: 'getTabId' }, function(res) {
// //   tabId = res.tabId;
// // });
//
// //Send a message to a tab which has your content script injected
// chrome.tabs.sendMessage(tabId, {action: 'GET_ETHEREUM'});
//
