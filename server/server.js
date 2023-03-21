const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Behaviour, UserLog } = require('./database');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 5000;

const db = new sqlite3.Database('./../data/surf-maven-db.sqlite');

app.use(cors());
app.use(bodyParser.json());

// Get all behaviours
app.get('/behaviours', (req, res) => {
  Behaviour.findAll()
    .then(behaviours => res.json(behaviours))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Get a behaviour by ID
app.get('/behaviours/:id', (req, res) => {
  Behaviour.findByPk(req.params.id)
    .then(behaviour => {
      if (behaviour) {
        res.json(behaviour);
      } else {
        res.status(404).json({ error: 'Behaviour not found' });
      }
    })
    .catch(error => res.status(500).json({ error: error.message }));
});


// Create a new behaviour
app.post('/add-behaviour', (req, res) => {
  log_start('add-behaviour');
  console.log(req.body);

  let bh = req.body;

  console.log(bh);
  Behaviour.create({
    definition_name: bh.definition_name,
    access_code: bh.access_code,
    target_url: bh.target_url,
    json_definition: bh.json_definition,
    xml_definition: bh.xml_definition,
    creation_date: new Date()
  })
    .then(() => res.json({ success: true }))
    .catch(error => res.status(500).json({ error: error.message }));
  log_end('add-behaviour');
});

// Update an existing behaviour
app.put('/behaviours/:id', (req, res) => {
  const behaviour = req.body;
  Behaviour.update(behaviour, { where: { id: req.params.id } })
    .then(() => res.json({ success: true }))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Delete a behaviour by ID
app.post('/delete-behaviour/:id', (req, res) => {
  log_start('delete-behaviour' + req.params.id);
  Behaviour.destroy({ where: { id: req.params.id } })
    .then(() => res.json({ success: true }))
    .catch(error => res.status(500).json({ error: error.message }));
  log_end('delete-behaviour');
});

function log_start(method) {
  const d = new Date();
  let text = d.toString();
  console.log("API method '" + method + "' accessed at " + text);
}

function log_end(method) {
  const d = new Date();
  let text = d.toString();
  console.log("API method '" + method + "' finished at " + text);
}

app.get("/table-list", (req, res) => {

  log_start('table-list');
  db.all("SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;", (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    res.json(JSON.stringify(rows));
    log_end('table-list');
  });
});

app.get("/api", (req, res) => {

  log_start('api');

  res.json('Service is on.')

  log_end('table-list');
});

app.listen(port, () => {
  const d = new Date();
  let text = d.toString();
  console.log("Started at " + text);

  console.log("Server started at port" + port.toString());

});


// Create a new behaviour
app.post('/add-userlog', (req, res) => {
  log_start('add-userlog');
  console.log(req.body);

  let logEntry = req.body;

  console.log(logEntry);
  UserLog.create({
    definition_name: logEntry.definition_name,
    user_ip: logEntry.user_ip,
    browser_type: logEntry.browser_type,
    current_url: logEntry.current_url,
    creation_date: new Date(),
  })
    .then(() => res.json({ success: true }))
    .catch(error => res.status(500).json({ error: error.message }));
  log_end('add-userlog');
}
);

app.get("/userlog-last10", (req, res) => {
  log_start('userlog-last10');
  db.all("SELECT * FROM userlogs ORDER BY creation_date desc;", (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    res.json(JSON.stringify(rows));
    log_end('userlog-last10');
  });

});

