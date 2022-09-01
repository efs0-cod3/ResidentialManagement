const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authorization = request.get('authorization')
  let token = ''

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  let decodedToken = {}

  try {
    decodedToken = jwt.verify(token, process.env.TKN_S_WORD)
  } catch (err) {
    console.error(err)
  }

  if (!token || !decodedToken.id) {
    return response(401).json({
      error: 'Token missing or invalid'
    })
  }

  const { id: userId } = decodedToken
  request.userId = userId
  console.log(request.userId)

  next()
}
