import { renderToString } from 'react-dom/server';

// TODO: Update description
// TODO: Update title

export default el => (
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="UPDATE_DESCRIPTION">
    <link href="/assets/bundle.css" rel="stylesheet">
    <title>UPDATE_TITLE</title>
  </head>
  <body>
    <div id="root">${renderToString(el)}</div>
    <script src="/assets/bundle.js"></script>
  </body>
</html>`
);
