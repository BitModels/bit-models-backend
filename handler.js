'use strict'

const connectToDatabase = require("./db")
const Area = require("./models/area")
const Profile = require("./models/profile")
const AdminLogin = require("./models/adminLogin")

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

  var dateTime = require('node-datetime');

  const profileData = {
    ...JSON.parse(event.body),
    registrationDate: dateTime.create()._now
  }
  console.log('date', dateTime.create()._now)
  console.log('profile', profileData)
  const profile = await Profile.create(profileData)

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

module.exports.adminLogin = async (event, context) => {
  try {
    await connectToDatabase()

  const user = JSON.parse(event.body)
  const admin = await AdminLogin.find().where({ login: user.login })

  if (admin.length !== 1) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
      },
    }
  }

  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', process.env.SECRET)
                   .update(user.password)
                   .digest('hex');

  if (admin[0].password === hash) {
    const jwt  = require('jsonwebtoken');
    const token = jwt.sign({ id: admin._id }, process.env.SECRET);

    return {
      statusCode: 200,
      body: JSON.stringify({ token: token }),
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
      },
    }
  } else {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
      },
    }
  }
  } catch(error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
      },
    }
  }
}

module.exports.adminGetProfiles = async (event, context) => {
  try {
    await connectToDatabase()

    const jwt  = require('jsonwebtoken');
    var legit = jwt.verify(event.queryStringParameters.token, process.env.SECRET);

    const profiles = await Profile.find()
    return {
      statusCode: 200,
      body: JSON.stringify(profiles),
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
      },
    }
  } catch(error) {
    if (error.name === 'JsonWebTokenError'){
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
        },
      }
    }
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
      },
    }
  }
}

module.exports.createAdminUser = async (event, context) => {
  try {
    await connectToDatabase()

    const user = JSON.parse(event.body)
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha256', process.env.SECRET)
                     .update(user.password)
                     .digest('hex');
    const newAdmin = await AdminLogin.create({login: user.login, password: hash})
    await newAdmin.save()

    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
      },
    }
  } catch(error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.CORS_ORIGIN,
      },
    }
  }

}