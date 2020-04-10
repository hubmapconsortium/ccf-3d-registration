mergeInto(LibraryManager.library, {

  ShowSignupScreen: function() {
    return window.hideSignupScreen != true;
  },

  CopyToClipboard: function (str) {
    str = Pointer_stringify(str);
    console.log(str); // Log the JSON data to the console

    // If a callback is provided for registering, use that. 
    // Otherwise, throw up a prompt for copying to clipboard.
    if (window.ruiRegistrationCallback) {
      window.ruiRegistrationCallback(str);
      return true;
    } else {
      var result = prompt("Please copy this string manually:", str); // eslint-disable-line no-alert
      return !!result;
    }  
  },

  openPage: function (url) {
    url = Pointer_stringify(url);
    console.log('Opening link: ' + url);
    window.open(url,'_blank');
  }

});
