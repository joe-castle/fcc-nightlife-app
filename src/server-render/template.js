import { renderToString } from 'react-dom/server';

export default (el, state) => (
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="UPDATE_DESCRIPTION">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi" crossorigin="anonymous">
    <link href="/assets/bundle.css" rel="stylesheet">
    <title>FCC Nightlife Coordination App</title>
  </head>
  <body>
    <div id="root">${renderToString(el)}</div>
    <script>
      window.__INITIAL_STATE__ = ${JSON.stringify(state)}
    </script>
    <script src="/assets/bundle.js"></script>
  </body>
</html>`
);
