# photobooth by Andre Rinas
A Photobooth webinterface for Raspberry Pi and Windows.

### Features
- Works on Windows and Linux.
  - Under Windows [digiCamControl](http://digicamcontrol.com/) by Duka Istvan can be used to control the camera and to take pictures.
  - Under Linux [gPhoto2](http://gphoto.org/) is used to control the camera and to take pictures.
- Images are processed with GD/ImageMagick.
- Photobooth caches all generated QR-Codes, Thumbnails and Prints.
- Pictures can be printed directly after they were taken or later from the gallery. Photobooth uses the command line to print the picture. The command can be modified in ```my.config.inc.php```.
- Pictures can be send via E-Mail.
- You can choose an image filter before taking a picture.
- Settings can be changed in ```my.config.inc.php``` or via Admin Page (under /admin):
  - You can hide the gallery.
  - The gallery can be ordered ascending oder descending by picture age (see ```$config['gallery']['newest_first']``` in ```my.config.inc.php```).
  - Choose between md5format and dateformat images.
  - You can switch between german, english, spanish and french language lables.
  - QR-Code to allow downloading pictures from your Photobooth can be enabled/disabled.
  - Print feature can be enabled/disabled.
    - Optional: Print a frame on your picture (replace resources/img/frames/frame.png with a proper frame).
    - Optional: Print text on your picture.
  - LivePreview can be enabled/disabled (uses device cam).
  - Wedding specifig config to show a symbol (e.g. heart) betweeen two names on the startpage.
  - Green screen keying can be enabled/disabled (chroma keying).
  - Photo collage function: take 4 pictures in a row and let it generate a collage out of it.
  - Blue-gray theme can be enabled.
  - Save pictures with a polaroid effect.

### Prerequisites
- gphoto2 installed, if used on a Raspberry for DSLR control
- digiCamControl, if used unter Windows for DSLR control
- Apache

### Installation
#### On Raspbian:
```
sudo apt-get update
sudo apt-get dist-upgrade
```
On Raspbian Stretch:
```
sudo apt-get install git apache2 php php-gd libav-tools
```
On Raspbian Buster
```
sudo apt-get install git apache2 php php-gd ffmpeg
```
Get the Photobooth source and set perms
```
cd /var/www/
sudo rm -r html/
sudo git clone https://github.com/andreknieriem/photobooth html
cd /var/www/html
sudo git submodule update --init
sudo cp config.inc.php my.config.inc.php
sudo mkdir -p /var/www/html/images
sudo mkdir -p /var/www/html/keying
sudo mkdir -p /var/www/html/print
sudo mkdir -p /var/www/html/qrcodes
sudo mkdir -p /var/www/html/thumbs
sudo mkdir -p /var/www/html/tmp
sudo chown -R pi: /var/www/
sudo chmod -R 777 /var/www

```
Install latest version of libgphoto2, choose last stable release
```
wget https://raw.githubusercontent.com/gonzalo/gphoto2-updater/master/gphoto2-updater.sh && sudo bash gphoto2-updater.sh
```

Give sudo rights to the webserver user (www-data)

```sudo nano /etc/sudoers```
and add the following line to the file:
```www-data ALL=(ALL) NOPASSWD: ALL```

Ensure that the camera trigger works:
```
sudo rm /usr/share/dbus-1/services/org.gtk.vfs.GPhoto2VolumeMonitor.service
sudo rm /usr/share/gvfs/mounts/gphoto2.mount
sudo rm /usr/share/gvfs/remote-volume-monitors/gphoto2.monitor
sudo rm /usr/lib/gvfs/gvfs-gphoto2-volume-monitor
```
Open the IP address of your raspberry pi in a browser

- Change the styling to your needs

#### On Windows
- Download [digiCamControl](http://digicamcontrol.com/) and extract the archive into ```digicamcontrol``` in the photobooth root, e.g. ```D:\xampp\htdocs\photobooth\digicamcontrol```

### Troubleshooting
#### Change configuration
Use the copy named ```my.config.inc.php``` to make config changes for personal use to prevent sharing personal data on Github by accident.

#### Change Labels
There are three label files in the lang folder, one for de (german), one for es (spanish), one for en (english) and one for fr (french). You can change the language inside ```my.config.inc.php``` or via Admin Page.

#### Keep pictures on Camera
Add ```--keep``` option for gphoto2 in ```my.config.inc.php```:
```
	$config['take_picture']['cmd'] = 'sudo gphoto2 --capture-image-and-download --keep --filename=%s images';
```
On some cameras you also need to define the capturetarget because Internal RAM is used to store captured picture. To do this use ```--set-config capturetarget=X``` option for gphoto2 in ```my.config.inc.php``` (replace "X" with the target of your choice):
```
	$config['take_picture']['cmd'] = 'sudo gphoto2 --set-config capturetarget=1 --capture-image-and-download --keep --filename=%s images';
```
To know which capturetarget needs to be defined you need to run:
```
gphoto2 --get-config capturetarget
```
Example:
```
pi@raspberrypi:~ $ gphoto2 --get-config capturetarget
Label: Capture Target
Readonly: 0
Type: RADIO
Current: Internal RAM
Choice: 0 Internal RAM
Choice: 1 Memory card
```
#### Kiosk Mode
##### Automatically start Photobooth in full screen
Edit the LXDE Autostart Script:
```
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```
and add the following lines:
```
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --incognito --kiosk http://localhost/
```
**NOTE:** If you're using QR-Code replace ```http://localhost/``` with your local IP-Adress (e.g. ```http://192.168.4.1```), else QR-Code does not work.

##### Enable touch events
If touch is not working on your Raspberry Pi edit the LXDE Autostart Script again
```
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```
and add ```--touch-events=enabled``` for Chromium:
```
@chromium-browser --incognito --kiosk http://localhost/ --touch-events=enabled
```

##### Hide the Mouse Cursor
To hide the Mouse Cursor we'll use "unclutter":
```
sudo apt-get install unclutter
```
Edit the LXDE Autostart Script again:
```
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```
and add the following line:
```
@unclutter -idle 0
```

#### E-Mail
If connection fails some help can be found [here](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting), especially gmail needs some special config.

#### Use Hardware Button to take a Picture
You can use a hardware button connected on GPIO24 to trigger a photo. Set ```$config['use_gpio_button']``` to ```true``` or use the Admin panel to enable this function.
You also need to run a python script in background to read the state of GPIO24 and send a key-combination (alt+p) if hardware button is pressed to trigger the website to take a photo.
To run the python script in background add a cronjob:
```
sudo crontab -e
@reboot python /var/www/html/button.py &
```

### Changelog
- 1.8.3: Adjust scrollbar config and add blue-gray scrollbar theme, allow using Pi Cam for preview and to take pictures, add hidden shortcut for admin settings, add polaroid effect, add print confirmation dialogue
- 1.8.2: Added spanish as supported language, print text on picture feature, optional blue-gray theme, adjust admin panel. Small bugfixes and improvements as always.
- 1.8.1: Small bugfixes and improvements. New Features: enable/disable printing QR-Code, enable/disable photo collage function, enable/disable printing a frame on your picture
- 1.8.0: Update jQuery, GSAP and PhotoSwipe to latest versions, add chroma keying feature (green screen keying)
- 1.7.0: Add possibillity to choose an image filter before taking a picture
- 1.6.3: Add config and instructions to use a GPIO Button to take a picture (address https://github.com/andreknieriem/photobooth/issues/10), translate sucess and error messages while sending images via mail
- 1.6.2: Add wedding specific config, fix gallery settings not being saved from admin panel
- 1.6.1: Add possibillity to disable mobile view, update Kiosk Mode instruction
- 1.6.0: Button to send image via mail (uses [PHPMailer](https://github.com/PHPMailer/PHPMailer) ), add use of "my.config.inc.php" for personal use to prevent sharing personal data (e.g. E-Mail password and username) on Github by accident
- 1.5.3: Several new options (disable gallery via config, set countdown timer via config, set cheeeese! Timer via config, ability to show the date/time in the caption of the images in the gallery), all config changes now available in admin page, complete french translation, add empty Gallery message, Fullscreen Mode on old iOS-Devices when starting photobooth from homescreen, StartScreen message is an option in config/admin page now, add instructions for Kiosk Mode, should fix #11, and #2, improve instructions in README, some more small Bugfixes and improvements. Merged pull-request #53 which includes updated pull-requests #52 & #54
- 1.5.2: Bugfixing QR-Code from gallery and live-preview position. Merged pull #45
- 1.5.1: Bugfixing
- 1.5.0: Added Options page under /admin. Bugfix for homebtn. Added option for device webcam preview on countdown
- 1.4.0: Merged several pull requests
- 1.3.2: Bugfix for QR Code on result page
- 1.3.1: Merged pull-request #6,#15 and #16
- 1.3.0: Option for QR and Print Butons, code rework, gulp-sass feature enabled
- 1.2.0: Printing feature, code rework, bugfixes
- 1.1.1: Bugix - QR not working on touch devices
- 1.1.0: Added QR Code to Gallery
- 1.0.0: Initial Release

### Tutorial
[Raspberry Pi Weddingphotobooth (german)](https://www.andrerinas.de/tutorials/raspberry-pi-einen-dslr-weddingphotobooth-erstellen.html)

### Contributors and thanks to
- [dimsemenov](https://github.com/dimsemenov/photoswipe) for photoswipe
- [t0k4rt](https://github.com/t0k4rt/phpqrcode) for phpqrcode
- [nihilor](https://github.com/nihilor/photobooth) for Printing feature, code rework and bugfixes
- [vrs01](https://github.com/vrs01)
- [F4bsi](https://github.com/F4bsi)
- [got-x](https://github.com/got-x)
- [RaphaelKunis](https://github.com/RaphaelKunis)
- [andi34](https://github.com/andi34)
- [Norman-Sch](https://github.com/Norman-Sch)
- [marcogracklauer](https://github.com/marcogracklauer)
- [dnks23](https://github.com/dnks23)
- [tobiashaas](https://github.com/tobiashaas)
- Martin Kaiser-Kaplaner
- [MoJou90](https://github.com/MoJou90)
- [Reinhard Reberning](https://www.reinhard-rebernig.at/website/websites/fotokasterl)
- [Steffen Musch](https://github.com/Nie-Oh)
- [flighter18](https://github.com/flighter18)
- [thymon13](https://github.com/thymon13)
- [vdubuk](https://github.com/vdubuk)
- [msmedien](https://github.com/msmedien)
