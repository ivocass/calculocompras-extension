
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-104978954-2', 'auto');

// bugfix for analytics working in localhost but not in extension:
// https://davidsimpson.me/2014/05/27/add-googles-universal-analytics-tracking-chrome-extension/
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');

ga('send', 'pageview', '/index.html');