const PROPERTY_INDEX = {
  name: "PropertySearch",
  attributes: {
    searchableAttributes: [
      "location",
      "route",
      "rent",
      "rooms",
      "move_in_date_timestamp",
      "accommodation",
      "administrative_area_level_1",
    ],
    // Define business metrics for ranking and sorting
    customRanking: ["desc(popularity)"],
    // Set up some attributes to filter results on
    attributesForFaceting: [
      "rooms",
      "rent",
      "indoorFeatures",
      "outdoorFeatures",
      "type",
      "onTheMarket",
      "administrative_area_level_1",
      "country",
      "locality",
      "postal_code",
      "route",
    ],
  },
};

const USER_INDEX = {
  name: "UserSearch",
  attributes: {
    searchableAttributes: ["email", "firstName", "lastName"],
    attributesForFaceting: ["permissions"],
  },
};

const ALL_INDEXES = [PROPERTY_INDEX, USER_INDEX];

module.exports = { ALL_INDEXES, PROPERTY_INDEX, USER_INDEX };
