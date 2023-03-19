const sqlite3 = require('sqlite3').verbose();
const Sequelize = require('sequelize');
const db = new sqlite3.Database('../data/database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './../data/surf-maven-db.sqlite'
});

// Define the "behaviour" table
const Behaviour = sequelize.define('behaviour', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  definition_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  access_code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  target_url: {
    type: Sequelize.STRING,
    allowNull: true
  },
  json_definition: {
    type: Sequelize.JSON,
    allowNull: true
  },
  xml_definition: {
    type: Sequelize.JSON,
    allowNull: true
  },
  creation_date: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

sequelize.sync()
  .then(() => {
    console.log('Database synced');
  });

module.exports = {
  Behaviour
};
