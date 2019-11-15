import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const rp = require('request-promise');
const googleMapsApiKey = functions.config().routes['google-maps-api-key'];
const homeCoordinate = functions.config().routes['home-coordinate'];
const workOneCoordinate = functions.config().routes['work-one-coordinate'];
const workTwoCoordinate = functions.config().routes['work-two-coordinate'];

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

export const getRoutes = functions.pubsub
  .schedule('every 15 minutes')
  .onRun(async () => {
    console.log('get new routes!');
    const databseObject = {
      homeToWork: {},
      workOneToHome: {},
      workTwoToHome: {},
      date: admin.firestore.Timestamp.now()
    };
    const homeToWork = rp(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${homeCoordinate}&destinations=${workOneCoordinate}|${workTwoCoordinate}&departure_time=now&language=de-DE&key=${googleMapsApiKey}`
    )
      .then((body: any) => {
        const data = JSON.parse(body);
        databseObject.homeToWork = {
          workOne: {
            distance: data.rows[0].elements[0].distance.text,
            duration: data.rows[0].elements[0].duration.text,
            duration_in_traffic:
              data.rows[0].elements[0].duration_in_traffic.text
          },
          workTwo: {
            distance: data.rows[0].elements[1].distance.text,
            duration: data.rows[0].elements[1].duration.text,
            duration_in_traffic:
              data.rows[0].elements[1].duration_in_traffic.text
          }
        };
      })
      .catch((err: any) => {
        console.error('Home to work was not fetching', err);
      });

    const workOneToHome = rp(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${workOneCoordinate}&destinations=${homeCoordinate}&departure_time=now&language=de-DE&key=${googleMapsApiKey}`
    )
      .then((body: any) => {
        const data = JSON.parse(body);
        databseObject.workOneToHome = {
          distance: data.rows[0].elements[0].distance.text,
          duration: data.rows[0].elements[0].duration.text,
          duration_in_traffic: data.rows[0].elements[0].duration_in_traffic.text
        };
      })
      .catch((err: any) => {
        console.error('Work 1 to Home was not fetching', err);
      });

    const workTwoToHome = rp(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${workTwoCoordinate}&destinations=${homeCoordinate}&departure_time=now&language=de-DE&key=${googleMapsApiKey}`
    )
      .then((body: any) => {
        const data = JSON.parse(body);
        databseObject.workTwoToHome = {
          distance: data.rows[0].elements[0].distance.text,
          duration: data.rows[0].elements[0].duration.text,
          duration_in_traffic: data.rows[0].elements[0].duration_in_traffic.text
        };
      })
      .catch((err: any) => {
        console.error('Work 2 to Home was not fetching', err);
      });

    await Promise.all([workTwoToHome, workOneToHome, homeToWork])
      .then(() => {
        databseObject.date = admin.firestore.Timestamp.now();
      })
      .then(() => {
        return admin
          .firestore()
          .collection('routes')
          .doc('current')
          .set(databseObject, { merge: true });
      })
      .then(() => {
        return admin
          .firestore()
          .collection('routes')
          .add(databseObject);
      })
      .catch(err => {
        console.error('Promise failed', err);
      });

    return null;
  });
