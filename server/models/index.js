import fs from 'fs';
import path from 'path';

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};

fs.readdirSync(__dirname)
  .filter(function(file){
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file){
    const model = require(path.join(__dirname, file));
    db[model.modelName] = model;
  });

export default db;
