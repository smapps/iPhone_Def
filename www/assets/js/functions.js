var serviceURL = "http://192.168.40.2/api/";
#var serviceURL = "http://192.168.30.102/api/";
function goToURL(url)
{
	$.mobile.changePage(url);
}// JavaScript Document
var tellertje = setInterval();


function getPayStatus(klantID, pincode) 
{
	//alert(klantID + "PIN: " + pincode);
	
	
	
}

function checkStatus(klantID, pincode)
{
	var oStatus = "";
	$.get(serviceURL + 'checkout.php?f=checkStatus&pincode=' +  pincode + '&klantID=' + klantID + '', function(data){
		//alert(data);
		var oStatus = data;
	
	
		//oStatus = getPayStatus(klantID, pincode);
		//alert("PayStatus: " + orderstatus);
		if (oStatus == "0"){
			//Do nothing
		}else if (oStatus == "2"){
			//clearInterval(tellertje);
			//clearInterval(tellertje);
			goToURL('pay_loggedIn.html?klantID=' + klantID + '&pincode=' + pincode);
		}
		else if(oStatus  == "8")
		{
			//clearInterval(tellertje);
			
			goToURL('pay_mobile.html?klantID=' + klantID + '&pincode=' + pincode);
		}
		else if(oStatus  == "10")
		{
			//clearInterval(tellertje);
			clearInterval(tellertje);
			goToURL('pay_receipt.html?klantID=' + klantID + '&pincode=' + pincode);
			/*$( "#pay-step1" ).hide();
			$( "#pay-step2" ).hide();
			$("#footerMobile").hide();
			
			$.get(serviceURL + 'checkout.php?f=getOrderListWithQR&pincode=' +  $("#payPincode").html(), function(data){
				alert('lijstje + uitrijden');
				$("#footerPaymentComplete").show();
				$( "#pay-step3" ).show();
				$("#showReciept").html(data);
				clearInterval(tellertje);
			});*/
		}
		console.log("DE oStatus IS: " + oStatus + " en KLANTID = " + klantID + "EN PINC: " + pincode);
	});
}