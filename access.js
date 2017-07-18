const NPR = require('npr-api'),
  npr = new NPR()

// paste in your token here
const token = '88f6b9aa1e5f3d068ff8cefaf20f9b0ba4acf26233ca29fe99ee264e1bb6f610a10352cd24d3b812'

npr.one.init(token)
  .then(function () {
    return npr.one.listening.getRecommendations({ channel: 'npr' })
  })
  .then(function (recommendations) {
    // print out the first two recommendations to the console
    console.log(recommendations.items.slice(0, 2))
  }).catch(console.err)
