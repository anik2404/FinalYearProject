const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // path to your Firebase Admin SDK JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'recipieapp-b2b36.appspot.com', // replace with your actual bucket
});

module.exports = admin;