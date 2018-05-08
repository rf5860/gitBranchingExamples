# Exploration of Git Branching Models

An exploration of different git branching models, using [GitGraph.js](http://gitgraphjs.com/).

## Example Content

The following is an of a GitFlow workflow (As of commit `3acea45e7889479415e5f877cc1b400415cd65fb`):

![GitFlow Workflow](./imgs/3acea45e78.png)

## Previewing the HTML

If you're using VSCode, then you may want to consider the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) Plugin, which will refresh the page on update.

---

Here are some options, if you don't have a preferred server already. You only need to run **one** of these.

Once you've picked an option, start the server, then, simply point your browser at: http://localhost:9999/src/current.html

### Live Reloading

These options will take care of automatically reloading the page on update.

```sh
# Using npm
npm install -g live-server
live-server --port=9999 .
```

### Static Servers

These won't options won't automatically refresh, but are also more lightweight.

```sh
# Using Python2
python2 -m SimpleHTTPServer 9999
# Using Python3
python3 -m http.server 9999
# Using Ruby
ruby -run -e httpd . -p 9999
```