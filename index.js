import { StillCamera } from "pi-camera-connect";
import admin from "firebase-admin";
import stream from "stream";
import { firebaseAuth } from './config';

const stillCamera = new StillCamera({
    width: 640,
    height: 480
});

admin.initializeApp({
    credential: admin.credential.cert(firebaseAuth),
    databaseURL: "https://banometer.firebaseio.com",
    storageBucket: "banometer.appspot.com"
});

const db = admin.database();
const bucket = admin.storage().bucket();

const dbRef = db.ref("/test/banometer/photos/jorbu/");

dbRef.on("child_added", async function(snapshot) {
    if (!snapshot.val().url) {
        await snapshot.getRef().set(Object.assign(snapshot.val(), {
            status: 'PROCESSING'
        }));

        const image = await stillCamera.takeImage();
        const bufferImageStream = new stream.PassThrough();

        const fileName = `${snapshot.val().requested_at}.jpg`;
        const bucketFile = bucket.file(fileName);
        bufferImageStream.end(image)
            .pipe(bucketFile.createWriteStream())
            .on('error', function(error) {
                console.error(`Unable to upload ${fileName}`, error)
            })
            .on('finish', async function() {
                await bucketFile.makePublic();
                await snapshot.getRef().set(Object.assign(snapshot.val(), {
                    url: bucketFile.publicUrl(),
                    status: 'DONE'
                }));
            });
    }
});
