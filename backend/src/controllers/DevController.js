const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/ParseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {  
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      const techArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techArray,
        location,
      });

      //Fitrar conexões no máximo 10km
      //Pelo menos que tenha uma tecnologia igual
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techArray,
      )

      sendMessage(sendSocketMessageTo, 'newDev', dev);
    }
  
    return response.json(dev);
  },

  async update(request, response) {
    const dev = await Dev.findByIdAndUpdate(request.params._id, request.body, { new: true });

    return response.json(dev);
  },
};