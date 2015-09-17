//var tellertje = setInterval();
var pincode = getParameterByName("pincode");



function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
$(document).delegate('#selectUser2', 'pageshow', function () 
{	
	var clients;
	
	

	function getKlantNaam(klantID) {
		$.getJSON(serviceURL + 'clients.php?f=detail&klantID=' + klantID + '', function(data) {
			clients = data.items;
			$.each(clients, function(index, client) {
				$('#klant').append('<BR><BR>Welcome! <STRONG>' + client.cName + '</STRONG>');
			});
		});
	}
	$('#clientList2 li').remove();
	
	function getClientList() {
		$.getJSON(serviceURL + 'clients.php?f=overview', function(data) {
			$('#klantList li').remove();
			klanten = data.items;
			$.each(klanten, function(index, clients) {
				$('#clientList2').append('<li>' +
						'<a href="home.html?klantID=' + clients.cID + '" data-transition="slide">' +
						'' + clients.cName + '<span><img src="assets/images/icons/i_arrow-right.png" border="0" /></span></a></li>');
			});
			$('#clientList2').listview('refresh');
		});
	}
	getClientList();
});

$(document).delegate('#selectUser', 'pageshow', function () 
{	
	var clients;
	
  
	function getKlantNaam(klantID) {
		$.getJSON(serviceURL + 'clients.php?f=detail&klantID=' + klantID + '', function(data) {
			clients = data.items;
			$.each(clients, function(index, client) {
				$('#klant').append('<BR><BR>Welcome! <STRONG>' + client.cName + '</STRONG>');
			});
		});
	}
	function getClientList() {
		$.getJSON(serviceURL + 'clients.php?f=overview', function(data) {
			$('#clientList li').remove();
			klanten = data.items;
			$.each(klanten, function(index, clients) {
				$('#clientList').append('<li>' +
						'<a href="home.html?klantID=' + clients.cID + '" data-transition="slide">' +
						'' + clients.cName + '<span><img src="assets/images/icons/i_arrow-right.png" border="0" /></span></a></li>');
			});
			$('#clientList').listview('refresh');
		});
	}
	getClientList();
});
$(document).delegate('#home', 'pageshow', function () 
{	
	
	var klantID = getParameterByName("klantID");
	$("#btnScan").on("touchstart", function()
	{
		var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 
/*
            alert("We got a barcode\n" + 
            "Result: " + result.text + "\n" + 
            "Format: " + result.format + "\n" + 
            "Cancelled: " + result.cancelled);  

           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            //document.getElementById("info").innerHTML = result.text;
            console.log(result);
            */
            getOrderList(result);
        	
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
        
	});
	$("#btnPay").on("touchstart", function()
	{
		goToURL('pay.html?klantID=' + klantID);
	});
	$("#btnHome").on("touchstart", function()
	{
		goToURL('index.html?klantID=' + klantID);
	});
	$("#btnExit").on("touchstart", function()
	{
		goToURL('selectUser.html');
	});
	$("#btnOptions").on("touchstart", function()
	{
		goToURL('options.html?klantID=' + klantID);
	});

	
	
	
	var clients;
	function getOrderList(result) {
		
		if (result==""){
			barcode = "NULL";
		}
		else{
			barcode = result.text;
		}
		//barcode = '87125663549792';
		var pTotal = 0;
		//CHECK IF PRODUCT EXISTS
		
		if(barcode != 'NULL')
		{
			$.get(serviceURL + 'products.php?f=checkProduct&barcode=' + barcode, function(data)
			{
				if(data == "error")
				{
					$("#popupBasic").popup("open");
				}	
			});
		}
		
		
		$('#orderList li').remove();
		$.getJSON(serviceURL + 'products.php?f=getProduct&barcode=' + barcode + '&klantID=' + klantID + '', function(data) {
			
			order = data.items;
			var c = 0;
			$.each(order, function(index, product) {
				
				if(product.pID == 36)
				{
					$('#orderList').append('<li><a href="#">' +
							'<img src="./' + product.pImage + '" height="160" width="160"/>' +
							'<h4>' + product.pName + '</h4>' +
							'<p>&euro; ' + (product.pPrice * product.odAmount).toFixed(2) + '</p>' + 
							'<span class="ui-li-count">' + product.odAmount + '</span></a></li>');
				}
				else
				{
						$('#orderList').append('<li><a href="productdetail.html?pID=' + product.pID + '&klantID=' + klantID + '" >' +
							'<img src="./' + product.pImage + '" height="160" width="160"/>' +
							'<h4>' + product.pName + '</h4>' +
							'<p>' + product.odAmount + 'x &aacute; &euro; ' + product.pPrice + ' = <span>&euro; ' + (product.pPrice * product.odAmount).toFixed(2) + '</span></p>' + 
							'<span class="ui-li-count">' + product.odAmount + '</span></a></li>');
				}
				c += parseFloat(product.odAmount);
				pTotal += (product.pPrice * product.odAmount);
			});
			
			if(c == 0)
			{
				$('#welcome').show();	
				$(".headerTop li").html("&nbsp;");
			}
			else
			{
				$(".headerTop li").html("SCANNED ITEMS");
				$('#welcome').hide();	
				$('#pTotal').show();
				$('#orderList').listview('refresh');
				$('#pTotal').html('<div class="totalProducts">Total ('+ c +' products):</div><div class="totalAmount">&euro;&nbsp;' + pTotal.toFixed(2) + '</div>');
			}
		});
	}
	function getProductDetail(pID) {
		$.getJSON(serviceURL + 'products.php?f=getProductDetail&pID=' + pID + '', function(data) {
			order = data.items;
			$.each(order, function(index, product) {

				$('#productDetail').html("<img src='" + product.pImage + "' border='0' /> <br />" + product.pDescription);
			});
		});
	}

	
	function getKlantNaam(klantID) {
	$.getJSON(serviceURL + 'clients.php?f=detail&klantID=' + klantID + '', function(data) {
		clients = data.items;
		$.each(clients, function(index, client) {
			$('#klant').append('<BR><BR>Welcome! <STRONG>' + client.cName + '</STRONG>');
		});
	});
	}
	
	getKlantNaam(klantID);
	getOrderList("");
	
});



$(document).delegate('#productdetail', 'pageshow', function () {
	
	var klantID = getParameterByName("klantID");
	//bindMyButtons(klantID);	
	
	var minEnabled = true;
	var pID = getParameterByName("pID");
	getProductDetail(pID);
	getProductAmount(pID);
	
	
	$( "#plusProduct" ).on("touchstart", function() {
		editProductAmount(pID, "plus");
		getProductAmount(pID);
	});
	$( "#minProduct" ).on("touchstart", function() {
		if(minEnabled === true)
		{
			editProductAmount(pID, "min");
			getProductAmount(pID);
		}
	});
	$( "#delProduct" ).on("touchstart", function() {
		editProductAmount(pID, "del");
		goToURL('home.html?klantID='+klantID);
	});		
	
	$("#btnTerug").on("touchstart", function() {
		goToURL('home.html?klantID='+klantID);
	});
	
		
	function getProductDetail(pID) 
	{
		$.getJSON(serviceURL + 'products.php?f=getProductDetail&pID=' + pID + '', function(data) {
		order = data.items;
		$.each(order, function(index, product) {
			$('#productDetail').html("<p align='center'><strong>" + product.pName + "</strong></p><p align='center'><img height='100' src='" + product.pImage + "' border='0' /></p>");
		});
		});
	}
	function getProductAmount(pID) {
		$.get(serviceURL + 'products.php?f=getCurrentProductAmount&pID=' + pID + '&klantID=' + klantID + '', function(data) 
		{
			$('#productAmount').html(data);
			if(data > 1)
			{
				minEnabled = true;
				$("#minProduct").css('opacity','1');
			}
			else
			{
				$("#minProduct").css('opacity','0.4');
				minEnabled = false;
			}
		});
	}

	function editProductAmount(productID, type){
		$.get(serviceURL + 'products.php?f=edit&type=' + type + '&pID=' + pID + '&klantID=' + klantID + '', function(data)
		{
			getProductAmount(pID);	
		});
	}

	



});

/*$(document).delegate('#options', 'pageshow', function () {

	var klantID = getParameterByName("klantID");

	
	
	
	
	
	$.get(serviceURL + 'hardware.php?f=getPhoneHardwareSetting&type=cPayCash&cID=' + klantID, function(data) {
		if (data == 'y'){
			$('#payCash').val('y').selectmenu('refresh');
		}else{
			$('#payCash').val('n').selectmenu('refresh');
		}
	});
	//haal paycard status op
	$.get(serviceURL + 'hardware.php?f=getPhoneHardwareSetting&type=cPayCard&cID=' + klantID, function(data) {
		if (data == 'y'){
			$('#payCard').val("y").selectmenu('refresh');
		}else{
			$('#payCard').val("n").selectmenu('refresh');
		}
	});
	//haal paymobile status op
	$.get(serviceURL + 'hardware.php?f=getPhoneHardwareSetting&type=cPayMob&cID=' + klantID, function(data) {
		if (data == 'y'){
			$('#payMobile').val("y").selectmenu('refresh');
		}else{
			$('#payMobile').val("n").selectmenu('refresh');
		}
	});
	
	
	$('#payCash').on('change', function (e, active) {
	if ($(this).val() == "y") {
		$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayCash&value=y&cID=' + klantID);
	} else {
		$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayCash&value=n&cID=' + klantID);
	}
	});
	$('#payCard').on('change', function (e, active) {
		if ($(this).val() == "y") {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayCard&value=y&cID=' + klantID);
		} else {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayCard&value=n&cID=' + klantID);
		}
	});
	$('#payMobile').on('change', function (e, active) {
		if ($(this).val() == "y") {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayMob&value=y&cID=' + klantID);
		} else {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayMob&value=n&cID=' + klantID);
		}
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});*/

$(document).delegate('#pay', 'pageshow', function () {
	var klantID = getParameterByName("klantID");
	var pincode = getParameterByName("pincode");	
	$("#btnTerug").bind("touchstart", function()
	{
		
		$.get(serviceURL + 'checkout.php?f=changeStatus&pincode=' +  pincode + '&statusID=1', function()
		{
			clearInterval(tellertje);
			goToURL('home.html?klantID=' + klantID + '&pincode=' + pincode);
		});	
	});

	$.getJSON(serviceURL + 'checkout.php?f=getCheckout&klantID=' + klantID + '', function(data) {
		checkout = data.items;
		$.each(checkout, function(index, paydetail) {
			var error = paydetail.error;
			if (paydetail.hID){
			var Pimg = "<img src='assets/images/icons/i_" + paydetail.hID + ".png' border='0' height='92' width='92' />"
				$('#payCheckout').append(Pimg);
				$('#payPincode').append(paydetail.oDigitsCode);
				var pincode = $('#payPincode').html();
				
				tellertje = setInterval(function() { checkStatus(klantID, pincode) }, 750);	
				
				
			}else{
				
				$('#payCheckout').append(paydetail.error);
				$( "#enterpin" ).hide();
				$( "#goto" ).hide();
			}
		});
	});
	
	
	
	
	
});
$(document).delegate('#payMobile', 'pageshow', function () {
	var klantID = getParameterByName("klantID");
	var pincode = getParameterByName("pincode");
	
	$.get(serviceURL + 'checkout.php?f=getTotalAmount&pincode=' + pincode, function(data)
	{
		$("#paymentInfo").html(data);	
	});
	
	
	
	$("#btnJa").bind("touchstart", function()
	{
		
		var klantID = getParameterByName("klantID");
		var pincode = getParameterByName("pincode");
		$.get(serviceURL + 'checkout.php?f=changeStatus&pincode=' +  pincode + '&statusID=10');
		//, function()
		//{
		//	goToURL("pay_receipt.html");
		//});	
	});	
	$("#btnNee").bind("touchstart", function()
	{
		var klantID = getParameterByName("klantID");
		var pincode = getParameterByName("pincode");
		$.get(serviceURL + 'checkout.php?f=changeStatus&pincode=' +  pincode + '&statusID=2', function()
		{
			goToURL('pay_loggedIn.html?klantID=' + klantID + '&pincode=' + pincode);
		});	
	});	
});

$(document).delegate('#payLoggedIn', 'pageshow', function () {
	
	//var klantID = getParameterByName("klantID");
	//var pincode = getParameterByName("pincode");
	//tellertje = setInterval( function(){ checkStatus(klantID, pincode); }, 200);
	
	
});

$(document).delegate('#options', 'pageshow', function () {
	//haal selfservice status op
	var klantID = getParameterByName("klantID");
	
	$.get(serviceURL + 'hardware.php?f=getPhoneHardwareSetting&type=cOperator&cID=' + klantID, function(data) {
		if (data == 'y'){
			$(".cbselfService").prop('checked', true);
		}else{
			$(".cbselfService").prop('checked', false);
		}
	});
	//haal paycash status op	
	$( "#btnBack" ).on('touchstart', function() {
		goToURL('./home.html?klantID='+klantID);
	});
	
	$.get(serviceURL + 'hardware.php?f=getPhoneHardwareSetting&type=cOperator&cID=' + klantID, function(data) {
		if (data == 'y'){
			$(".cbSelfService").prop('checked', true);
		}else{
			$(".cbSelfService").prop('checked', false);
		}
	});
	
	$.get(serviceURL + 'hardware.php?f=getPhoneHardwareSetting&type=cPayCash&cID=' + klantID, function(data) {
		if (data == 'y'){
			$(".cbPayCash").prop('checked', true);
		}else{
			$(".cbPayCash").prop('checked', false);
		}
	});
	//haal paycard status op
	$.get(serviceURL + 'hardware.php?f=getPhoneHardwareSetting&type=cPayCard&cID=' + klantID, function(data) {
		if (data == 'y'){
			$(".cbPayCard").prop('checked', true);
		}else{
			$(".cbPayCard").prop('checked', false);
		}
	});
	//haal paymobile status op
	$.get(serviceURL + 'hardware.php?f=getPhoneHardwareSetting&type=cPayMob&cID=' + klantID, function(data) {
		if (data == 'y'){
			$(".cbPayMobile").prop('checked', true);
		}else{
			$(".cbPayMobile").prop('checked', false);
		}
	});

	$('#selfService input').change( function () {
		if ($('#selfService input:checked').val() == "on") {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cOperator&value=y&cID=' + klantID);
		} else {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cOperator&value=n&cID=' + klantID);
		}
	});	
	$('#payCash input').change( function () {
	if ($('#payCash input:checked').val() == "on") {
		$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayCash&value=y&cID=' + klantID);
	} else {
		$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayCash&value=n&cID=' + klantID);
	}
	});
	$('#payCard input').change( function () {
		if ($('#payCard input:checked').val() == "on") {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayCard&value=y&cID=' + klantID);
		} else {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayCard&value=n&cID=' + klantID);
		}
	});
	$('#payMobile input').change( function () {
		if ($('#payMobile input:checked').val() == "on") {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayMob&value=y&cID=' + klantID);
		} else {
			$.get(serviceURL + 'hardware.php?f=changePhoneHardwareSetting&type=cPayMob&value=n&cID=' + klantID);
		}
	});
});



$(document).delegate('#payReceipt', 'pageshow', function () {

	clearInterval(tellertje);
	var pincode = getParameterByName("pincode");
	$.get(serviceURL + 'checkout.php?f=getKlantID&pincode=' + pincode, function(data)
	{
		var klantID = data;
		$( "#btnNee" ).bind("touchstart", function() {
			//alert();
			goToURL('home.html?klantID='+ klantID);
		});
		$( "#btnJa" ).bind("touchstart", function() {
			//alert();
			goToURL('home.html?klantID='+ klantID);
		});
	});
	

	$.get(serviceURL + 'checkout.php?f=getOrderListWithQR&pincode=' +  pincode, function(data){
		$("#showReceipt").html(data, function()
		{
			$.get(serviceURL + 'checkout.php?f=clearCode&pincode=' + pincode);	
		});
		
	});
	
	
		
});