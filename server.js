/* eslint-disable no-console */
const express = require('express');

const PORT = process.env.PORT || 8080;
const exphbs = require('express-handlebars');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema, graphql } = require('graphql');
const axios = require('axios');

const app = express();

// GraphQL schema for the data
var schema = buildSchema(`
  type Query {
    owner(id: Int!): Owner
    owners(first_name: String): [Owner]
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
    owner: Owner!
  }
  type Mutation {
    updateOwner(id: Int!, first_name: String!, last_name: String!): Owner
    updatePet(id: Int!, name: String!, breed: String!, color: String!, size: String!, img: String!): Pet
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

// Return a list of users (takes an optional first_name parameter)
var retrieveUsers = function (args) {
  if (args.first_name) {
    var first_name = args.first_name;
    return owners.filter(owner => owner.first_name === first_name);
  } else {
    return owners;
  }
}

// Return a list of pets (takes an optional name parameter)
var retrievePets = function (args) {
  if (args.name) {
    var name = args.name;
    return pets.filter(pet => pet.name === name);
  } else {
    return pets;
  }
}

// Update a user and return new user details
var updateOwner = function ({ id, first_name, last_name }) {
  owners.map(owner => {
    if (owner.id === id) {
      owner.first_name = first_name;
      owner.last_name = last_name;
      return owner;
    }
  });
  return owners.filter(owner => owner.id === id)[0];
}

// Update a pet and return new pet details
var updatePet = function ({ id, name, breed, color, size, img }) {
  pets.map(pet => {
    if (pet.id === id) {
      pet.name = name;
      pet.breed = breed;
      pet.color = color;
      pet.size = size;
      pet.img = img;
      return pet;
    }
  });
  return pets.filter(pet => pet.id === id)[0];
}

// Root resolver
var root = {
  owner: getUser,
  owners: retrieveUsers,
  pets: retrievePets,
  updateOwner: updateOwner,
  updatePet: updatePet
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
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}graphql?query={pets{name,breed,img}}`;
  axios.get(fullUrl)
    .then(function (response) {
      // handle success
      const data = response.data.data.pets;
      res.render("index", { data: data });
    })

});

app.listen(PORT, () => {
  console.log('Listening on port:%s', PORT);
});
