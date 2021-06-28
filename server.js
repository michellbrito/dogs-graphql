/* eslint-disable no-console */
const express = require('express');

const PORT = process.env.PORT || 8080;
const exphbs = require('express-handlebars');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema, graphql } = require('graphql');
const axios = require('axios');

const app = express();

var schema = buildSchema(`
  type Query {
    user(id: Int!): Owner
    users(first_name: String): [Owner]
    pets(name: String): [Pet]
  },
  type Owner {
    id: Int
    first_name: String
    last_name: String
    pets: [Pet!]
  }
  type Pet {
    id: Int
    name: String
    breed: String
    color: String
    size: String
    img: String
    owner_id: Owner!
  }
`);

var owners = [
  {
    id: 1,
    first_name: 'Alexandra',
    last_name: 'Becci'
  },
  {
    id: 2,
    first_name: 'Charles',
    last_name: 'Victoria'
  },
  {
    id: 3,
    first_name: 'Marie',
    last_name: 'Loreta'
  },
];

var pets = [
  {
    id: 1,
    name: 'Rocky',
    breed: 'Dalmatian',
    color: 'White and Black',
    size: 'Large',
    img: 'https://i.imgur.com/dEMxUqK.jpg',
    owner_id: 1
  },
  {
    id: 2,
    name: 'Skippy',
    breed: 'Chinese Shar Pei',
    color: 'Cream',
    size: 'Medium',
    img: 'https://i.imgur.com/ob0qRSz.jpg',
    owner_id: 1
  },
  {
    id: 3,
    name: 'Biscuit',
    breed: 'Maltese Shih Tzu',
    color: 'White',
    size: 'Small',
    img: 'https://i.imgur.com/amBCLmT.png',
    owner_id: 2
  },
  {
    id: 4,
    name: 'Zeke',
    breed: 'Great Dane',
    color: 'Black',
    size: 'Large',
    img: 'https://i.imgur.com/o2ttnds.jpg',
    owner_id: 3
  },
  {
    id: 5,
    name: 'Booker',
    breed: 'Goldendoodle',
    color: 'Gold',
    size: 'Medium',
    img: 'https://i.imgur.com/v3tepaM.jpg',
    owner_id: 4
  },
  {
    id: 5,
    name: 'Max',
    breed: 'West Highland White Terrier',
    color: 'White',
    size: 'Small',
    img: 'https://i.imgur.com/VaGS1A0.jpg',
    owner_id: 4
  }
];

// Return a single user (based on id)
var getUser = function (args) {
  var userID = args.id;
  return owners.filter(owner => owner.id == userID)[0];
}

// Return a list of users (takes an optional shark parameter)
var retrieveUsers = function (args) {
  if (args.first_name) {
    var first_name = args.first_name;
    return owners.filter(owner => owner.first_name === first_name);
  } else {
    return owners;
  }
}

// Return a list of users (takes an optional shark parameter)
var retrievePets = function (args) {
  if (args.name) {
    var name = args.name;
    return pets.filter(pet => pet.name === name);
  } else {
    return pets;
  }
}

// Root resolver
var root = {
  user: getUser,
  users: retrieveUsers,
  pets: retrievePets
};

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/graphql', graphqlHTTP({
  schema: schema,  // Must be provided
  rootValue: root,
  graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));

// get route -> index
app.get("/", (req, res) => {
  axios.get('http://localhost:8080/graphql?query={pets{name,breed,img}}')
  .then(function (response) {
    // handle success
    const data = response.data.data.pets;
    res.render("index", { data: data  });
  })
  
});
app.listen(PORT, () => {
  console.log('Listening on port:%s', PORT);
});
