const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

class UserService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email }); //getting the user by email
    return user;
  }

  async createUser({ user }) {
    const { name, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10); //encrypting the password

    const createUserId = await this.mongoDB.create(this.collection, {
      name,
      email,
      password: hashedPassword,
    });

    return createUserId;
  }

  async verifyUserExists({ email }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  //If an user exists, get it, if not, create it
  async getOrCreateUser({ user }) {
    const queriedUser = await this.getUser({ email: user.email });

    //If the user exists, return it
    if (queriedUser) {
      return queriedUser;
    }

    //Creating the user
    await this.createUser({ user });
    //Returning the user after creating it
    return await this.getUser({ email: user.email });
  }
}

module.exports = UserService;
