const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config/index');

// Encodes a text string as a valid component of a Uniform Resource Identifier (URI).
// @param uriComponent — A value representing an encoded URI component.
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true }); //Creating a new instance of a mongo client
    this.dbName = DB_NAME; //Passing the dbName to the class
  }

  connect() {
    if (!MongoLib.connection) {
      //Check if there is an active connection already
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          //Trying to connect the client to the cluster
          if (err) {
            reject(err); //If there is an error reject the promise
          }

          console.log('Connected succesfully to Mongo');
          resolve(this.client.db(this.dbName)); //If everything ok, return the connection to the db
        });
      });
    }

    return MongoLib.connection; //If a connection exits, returned it
  }

  //Setting the general functions to work
  getAll(collection, query) {
    //Returning the current connection, this connect returns an instance of the db to work with
    return this.connect().then((db) => {
      return db.collection(collection).find(query).toArray(); //Returning the whole collection and converting it into an array
    });
  }

  get(collection, id) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).findOne({ _id: ObjectId(id) }); //Returning the element by id
      })
      .then((result) => result.insertedId);
  }

  create(collection, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).insertOne(data); //Inserting the new element
      })
      .then((result) => result.insertedId); //Getting the result id from the query
  }

  update(collection, id, data) {
    return this.connect()
      .then((db) => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true }); //updating by id, if the id doesnt exits, it will create the element
      })
      .then((result) => result.upsertedId || id); //passing the upserted id or the
  }

  delete(collection, id) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) }); //Deleting by id
      })
      .then(() => id); //Passing the id of the deleted element
  }
}

module.exports = MongoLib;
