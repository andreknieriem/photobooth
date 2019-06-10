# photobooth by Andre Rinas
A Photobooth webinterface for Raspberry Pi and Windows.

### Features
- Works on Windows and Linux.
  - Under Windows [digiCamControl](http://digicamcontrol.com/) by Duka Istvan can be used to control the camera and to take pictures.
  - Under Linux [gPhoto2](http://gphoto.org/) is used to control the camera and to take pictures.
- Images are processed with GD/ImageMagick.
- Photobooth caches all generated QR-Codes, Thumbnails and Prints.
- Pictures can be printed directly after they were taken or later from the gallery. Photobooth uses the command line to print the picture. The command can be modified in ```config.inc.php```.
- Most settings can be changed in ```config.inc.php``` or (most options) via Admin Page (under /admin):
  - You can hide the gallery.
  - The gallery can be ordered ascending oder descending by picture age (see ```$config['gallery']['newest_first']``` in ```config.inc.php```).
  - Choose between md5format and dateformat images.
  - You can switch between german, english and french language lables.
  - QR-Code to allow downloading pictures from your Photobooth can be enabled/disabled.
  - Print feature can be enabled/disabled.
  - LivePreview can be enabled/disabled. LivePreview works only on some cameras, check [here](http://gphoto.org/proj/libgphoto2/support.php) if "Liveview" for your model is supported.

### Prerequisites
- gphoto2 installed, if used on a Raspberry for DSLR control
- digiCamControl, if used unter Windows for DSLR control
- Apache

### Installation
#### On Raspbian:
```
sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get install git apache2 php php-gd libav-tools
cd /var/www/
sudo rm -r html/
sudo git clone https://github.com/andreknieriem/photobooth html
mkdir -p /var/www/html/thumbs
mkdir -p /var/www/html/images
mkdir -p /var/www/html/print
mkdir -p /var/www/html/qrcodes
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
#### Change Labels
There are three label files in the lang folder, one for de (german), one for en (english) and one for fr (french). The de lang-file is included at the bottom of the index.php.
If you want the english labels, just change the de.js to en.js.
If you want the french labels, just change the de.js to fr.js.

#### Keep pictures on Camera
Add ```--keep``` option for gphoto2 in ```config.inc.php```:
```
	$config['take_picture']['cmd'] = 'sudo gphoto2 --capture-image-and-download --keep --filename=%s images';
```
On some cameras you also need to define the capturetarget because Internal RAM is used to store captured picture. To do this use ```--set-config capturetarget=X``` option for gphoto2 in ```config.inc.php``` (replace "X" with the target of your choice):
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

### Changelog
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
