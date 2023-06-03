clog-js
=======

Clog is a centralized logging system.

This is the JavaScript client-side counterpart to
[clog-server](https://github.com/imiric/clog-server) for submitting log data via
a JSON API.


Setup
-----

```
npm install clog-js
```

Standalone browser builds are available in the package under the `dist/`
directory courtesy of [Browserify](http://browserify.org/).


Usage
-----


```
var clog = require('clog-js');
```

Or in the browser:
```
<script src="clog-standalone.js"></script>
<script>var clog = Clog();</script>
```

You can then submit log events manually:

```
clog.log('Login failed');
// or...
try {
  throw new Error();
} catch (e) {
  clog.log(e.stack);
}
```

You can also setup Clog to pass on all uncaught errors:

```
window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
  clog.log(errorObj.stack);
}
```

Do note, however, that `window.onerror` functionality might not be consistent in
all browsers. See
[MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror).


Configuration
-------------

Here are the configuration options you can pass to the initializer:

- `host`: Host name or IP address to connect to. [default: `"localhost"`]
- `port`: The port the server is listening on. [default: `8000`]
- `source`: The identifier for the client's logs on the server.


Tests
-----

```
$ xdg-open test/test.html
```


License
-------

[MIT](LICENSE)
