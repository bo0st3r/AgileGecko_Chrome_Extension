// //start connection in content script
// let contentPort = chrome.runtime.connect({
//   name: 'background-content'
// });
//
// // chrome.extension.onMessage.addListener(
// //   function(message, sender, sendResponse) {
// //     if ( message.type == 'getTabId' )
// //     {
// //       sendResponse({ tabId: sender.tab.id });
// //     }
// //   }
// // );
//
// //Append your pageScript.js to "real" webpage. So will it can full access to webpate.
// var s = document.createElement('script');
// s.src = chrome.extension.getURL('scripts/pagescript.js');
// (document.head || document.documentElement).appendChild(s);
// //Our pageScript.js only add listener to window object,
// //so we don't need it after it finish its job. But depend your case,
// //you may want to keep it.
// // s.parentNode.removeChild(s);
//
// //Listen for runtime message
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if(message.action === 'GET_ETHEREUM') {
//     console.log('a')
//     //fire an event to get ethereum
//     let event = new CustomEvent('GET_ETHEREUM');
//     window.dispatchEvent(event);
//   }
// });
//
// window.addEventListener('message', function receiveEthereum(event) {
//   if(event.data.action === 'GOT_ETHEREUM') {
//     console.log('b')
//     //Remove this listener, but you can keep it depend on your case
//     window.removeEventListener('message', receiveEthereum, false);
//     contentPort.postMessage({type: 'GOT_ETHEREUM', payload: event.data.payload});
//   }
// }, false);
//
