# Banometer photo snagger

1. Listens to requests on Firebase Realtime
2. Captures photos with the Raspberry Pi Camera Module
3. Uploads photos to Firebase Realtime
4. Publishes photo URL on Firebase Realtime

## Setup

1. Install [node v15](https://garywoodfine.com/how-to-install-node-js-on-raspberry-pi/) on the Raspberry Pi
2. Clone project
3. `npm install`
4. Add [Firebase Service account](https://firebase.google.com/docs/admin/setup) secret to the `.secret` folder 

### Install as service

1. Symlink `photo-snagger.service` to systemd: `sudo ln -s /home/pi/banometer-photo-snagger/photo-snagger.service /etc/systemd/system/photo-snagger.service`
2. Reload systemd: `sudo systemctl daemon-reload`
3. Enable autostart on boot: `sudo systemctl enable photo-snagger`
4. Start: `sudo systemctl start photo-snagger`
