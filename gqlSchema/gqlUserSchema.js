const bcrypt = require("bcrypt");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLBoolean,
} = require("graphql");
const UserCollection = require("../models/usersSchema");

//هنا ننشئ users graphql schema
const UserType = new GraphQLObjectType({
  name: "userType",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },

    /* 
    id: ID
username: String
email: String
password: String
    
    */
  }),
});
// هنا نحدد على ماذا نريد ان نحصل
const RootQuery = new GraphQLObjectType({
  name: "rootQuery",
  fields: {
    users: {
      type: new GraphQLObjectType({
        name: "res",
        fields: {
          success: { type: GraphQLBoolean },
          users: { type: new GraphQLList(UserType) },
        },
      }),
      async resolve(parent, args, context) {
        const users = await UserCollection.find();
        // return users;
        console.log(context);
        // return users;
        if (users.length > 0) {
          return { success: true, users: users };
        } else {
          throw new Error("Something bad happened.");
        }

        // console.log(parent);
        // console.log(args);
        // console.log(context);
        /*
	this is how we query for all users 
	 query{ users{
          id
          email
          username
           }
        }     
	      */
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        const user = await UserCollection.findById(args.id);

        return user;

        /*  this is you query for 1 user using id 
	query{ user(id: "6202e4f9ad42b7be46e0e488"){
          id
          email
          username
                      }
       }
	*/
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },

      async resolve(parent, args, context) {
        // console.log("====================================");
        // console.log(req);
        // console.log("====================================");
        // return res.send({ message: "email already" });
        // return { message: "email already" };
        // next({ message: "email already" });
        // try {
        //   const AddUser = await UserCollection.findOne({ email });
        //   if (AddUser) {
        //     throw new Error("email already exists");
        //   } else {
        //     return { success: true, user: addUser };
        //   }
        //   const hashedPassword = bcrypt.hashSync(password, 10);
        // } catch (error) {}
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
