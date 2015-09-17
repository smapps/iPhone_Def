$(document).bind("mobileinit", function()
{
	//alert('loaded');
});

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
	document.addEventListener("backbutton", onBackKeyDown, false);
		
};
function onBackKeyDown()
{
	//do nothing	
};