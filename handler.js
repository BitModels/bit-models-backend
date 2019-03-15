'use strict'

const connectToDatabase = require("./db")
const Area = require("./models/area")
const Profile = require("./models/profile")

module.exports.areas = async (event, context) => {
  await connectToDatabase()

  const areas = await Area.find()
    .populate({
      path: 'profiles',
      match: { active: true }
    })

  return {
    statusCode: 200,
    body: JSON.stringify(areas),
    headers: {
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
    },
  }
}

module.exports.area = async (event, context) => {
  await connectToDatabase()

  const area = await Area.findById(event.pathParameters.id)
  .populate({
    path: 'profiles',
    match: { active: true }
  })

  return {
    statusCode: 200,
    body: JSON.stringify(area),
    headers: {
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
    },
  }
}

module.exports.profiles = async (event, context) => {
  await connectToDatabase()

  const profiles = await Profile.find().where('active', true)

  return {
    statusCode: 200,
    body: JSON.stringify(profiles),
    headers: {
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
    },
  }
}

module.exports.profile = async (event, context) => {
  await connectToDatabase()

  const profile = await Profile.findById(event.pathParameters.id)
  .populate({
    path: 'areas'
  })

  return {
    statusCode: 200,
    body: JSON.stringify(profile),
    headers: {
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
    },
  }
}

module.exports.createProfile = async (event, context) => {
  await connectToDatabase()
  const profile = await Profile.create(JSON.parse(event.body))

  for (const areaId of profile.areas) {
    const area = await Area.findById(areaId)
    area.profiles.push(profile._id)
    await area.save()
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
    },
  }
}