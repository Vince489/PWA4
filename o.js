const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Recursive function to generate routes based on the "views" directory structure
const registerRoutes = (baseDir, baseRoute = '') => {
  const entries = fs.readdirSync(baseDir);

  entries.forEach((entry) => {
    const fullPath = path.join(baseDir, entry);
    const route = baseRoute + '/' + entry.replace(/\.ejs$/, ''); // Remove ".ejs"

    if (fs.statSync(fullPath).isDirectory()) {
      // Recursive call for nested directories
      registerRoutes(fullPath, route);
    } else if (entry.includes('[id]')) {
      // Handle dynamic ":id" routes
      const dynamicRoute = route.replace('[id]', ':id');
      app.get(dynamicRoute, (req, res) => {
        res.render(path.relative(__dirname, fullPath).replace(/\.ejs$/, ''), req.params);
      });
    } else if (entry.includes('[name]')) {
      // Handle dynamic ":name" routes
      const dynamicRoute = route.replace('[name]', ':name');
      app.get(dynamicRoute, (req, res) => {
        res.render(path.relative(__dirname, fullPath).replace(/\.ejs$/, ''), req.params);
      });
    } else {
      // Static routes
      app.get(route === '/index' ? '/' : route, (req, res) => {
        res.render(path.relative(__dirname, fullPath).replace(/\.ejs$/, ''));
      });
    }
  });
};

// Register routes dynamically
registerRoutes(path.join(__dirname, 'views'));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
