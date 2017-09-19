const path = require('path')
const express = require('express')
const request = require('request')
const getAddress = require('./get-address')


const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')

app.use('/static', express.static(
  path.resolve(__dirname, 'static')
))

app.set('history', [{
  address: 'NTU',
  result:{
    formatted_address:'羅斯福路四段一號',
    lat:'123',
    lng:'456',
  }
}])

app.get('/history', function(req, res){
  res.send(app.get('history'))
})

app.get('/home', function (req, res) {
  res.render('home', {
    title: 'hello world',
    menu:['Features','Contact','about']
  });
})

app.get('/', function (req, res) {
  res.sendFile(
    path.resolve(__dirname,'views/index.html')
  )
})

// /query-address?address=NTU
app.get('/query-address', function (req, res) {
  let address = req.query.address
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`
  request(url,
    function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response.statusCode);
      console.log('body:', body);
      let result = getAddress(JSON.parse(body))
      res.send(result)

      let history = app.get('history');
      history.push({address, result})
      app.set('history', history)
    });
})

const getPlaceInfoByGoogle = (location, type) => {
  let promise = new Promise((resolve, reject) => {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    let options = {
      url: url,
      qs: {
        key: 'AIzaSyDxhmUgV4o14YcieA2-ucf9GBBIaYOnbvs',
        location: location,
        radius: '1000',
        type: type,
      },
      method: 'GET'
    }
    request(options, function (error, response, body) {
      if (error) { reject(error) } 
      else {resolve(body)}
    });
  })
  return promise;
}

const getPlaceInfoByFacebook = (center) => {
  let promise = new Promise((resolve, reject) => {
    let url = 'https://graph.facebook.com/v2.10/search'
    let options = {
      url: url,
      qs: {
        type: 'place',
        center: center,
        access_token: 'EAACEdEose0cBAKD9RJplDdEblZBTthA6E2k728k2oaQW6wZBy08164jwNTM8OMHIXNj2vjhd79qpyFX4pwKaWaSPDh0u8ZAEbvqaZBz5fZButuhFinOR3ZC9CokCVBhOegwYpZANblnoznTRMIWOmDKQNZCUE5et5E9AyzdpLpgBbzEx12YOteGKpr9Ra6HFQrd2zxpqHrPJPAZDZD',
        fields: 'about,name,description,category_list',
      },
      method: 'GET'
    }
    request(options, function (error, response, body) {
      if (error) { reject(error) } 
      else {resolve(body)}
    });
  })
  return promise;
}

// /query-place?location=25.0155396,121.5414717&type=bar
app.get('/query-place', function (req, res) {
  let location = req.query.location
  let type = req.query.type
  let promise1 = getPlaceInfoByGoogle(location, type)
  let promise2 = getPlaceInfoByFacebook(location)
  Promise.all([promise1, promise2]).then((result) => {
    res.send({
      google: JSON.parse(result[0]),
      facebook: JSON.parse(result[1]),
    })
  });
})

app.get('/homework', function (req, res) {
  res.send({
    "name": "陳柏諺",
    "email": "pobovchen@gmail.com",
  });
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})