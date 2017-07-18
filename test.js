var NprOneSDK = require('npr-one-sdk').default

var nprOneSDK = new NprOneSDK()

console.log('NPR One API SDK loaded!')

NprOneSDK.config = {
  accessToken: 'dd69063006432963cd797a58502e9efbfc38f18ea17d16bf5cd197ff5718b9a971c2aec218a46d58' // this access token is fake/will not work; replace this with your real access token
}

/*
 * The example here illustrates how multiple recommendations could be played within an app.
 * The play function handles recording a START an then a COMPLETED action, and finishes
 * by requesting another recommendation. The console.log message in between the actions would
 * be a great place feed a recommendation's audio url into an audio player.
 */
nprOneSDK.getRecommendation()
    .then(play)
    .then(play)
    .then(play)
    .then(play)
    .then(play)
    .catch((err) => {
      console.log('failure while playing: ', err)
    })

function play (recommendation) {
  recommendation.recordAction(NprOneSDK.Action.START, 0)

  console.log(`Currently playing ${recommendation.attributes.title}`)

  return new Promise((resolve) => {
    setTimeout(() => {
      recommendation.recordAction(NprOneSDK.Action.COMPLETED, recommendation.attributes.duration)
      resolve(nprOneSDK.getRecommendation())
    }, 2000)
  })
}
