const idOne = "1";

const houseImage1 = {
  // id: idOne,
  filename: "dummy house image 1",
  encoding: "encoding",
  mimetype: "image/jpeg",
  url:
    "https://res.cloudinary.com/dkhe0hx1r/image/upload/v1625180476/dummy/Brick_Bay_home_3a.jpg"
};

const houseImage2 = {
  // id: "2",
  filename: "dummy house image 2",
  encoding: "encoding",
  mimetype: "image/jpeg",
  url:
    "https://res.cloudinary.com/dkhe0hx1r/image/upload/v1625180474/dummy/fcee0899b61010f167687b344bf6c8a2.jpg"
};

const houseImage3 = {
  // id: "3",
  filename: "dummy house image 3",
  encoding: "encoding",
  mimetype: "image/jpeg",
  url:
    "https://res.cloudinary.com/dkhe0hx1r/image/upload/v1625180467/dummy/platinum-double-storey-compressed-1024x618.jpg"
};

// filename: String!
// mimetype: String!
// encoding: String!

const imagesList = [houseImage1, houseImage2, houseImage3];

module.exports = process.env.STAGE === "dev" ? imagesList : [];
// module.exports = imagesList;
