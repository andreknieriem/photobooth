/*
This script checks for new pictures in regular intervals.
If changes are detected, the page will automatically be reloaded.

Needs:
jQuery
photoBooth Javascript

Remarks:
- Not made for highly demanded pages (as pages is requested regulary
and would pile up in high load with thausend of users)
- Instead of reloading, adding the pictures directly would be an
improvement, but would need further changes in gallery-templates

*/

var lastDBSize=-1;		 //Size of the DB - is used to determine changes
var interval = 1000 * 5; // Interval, the page is checked (/ms)
var ajaxurl="gallery.php?status"; //URL to request for changes

/*
This function will be called if there are new pictures
*/
function dbUpdated(){
	console.log("DB is updated - refreshing");
	//location.reload(true); //Alternative
	photoBooth.reloadPage();
}


var checkForUpdates = function() {
	if(photoBooth.isTimeOutPending())
		return;	//If there is user interaction, do not check for updates
	$.getJSON({url: ajaxurl, success:
	  function(result){
		var currentDBSize=result['dbsize'];
		if(lastDBSize!=currentDBSize && lastDBSize !=-1){
			dbUpdated();
		}
		lastDBSize=currentDBSize;
    }});
};
setInterval(checkForUpdates, interval);
