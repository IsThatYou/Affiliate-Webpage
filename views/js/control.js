$(function() {
	var socket = io('http://192.168.0.22:3000/');
	socket.on("afsignup", function(data){
		var message = data.message;
		var warning = $("#warning1");
		if (warning){
			warning.remove();
		}
		$(".headline-dark").before('<div class="alert alert-danger" id = "warning1" >' + message + '</div>');
		$(".headline-dark").before('<div class="alert alert-danger" id = "warning1" >' + message + '</div>');
		socket.emit("disconnect-signup-af");
	});
	socket.on("afsignup_delete", function(){
		$("#warning1").remove();
		socket.emit("disconect-signup-af_delete");
	});
});

	function signup(form){

		console.log(form);
		if (form.name.value == "")
	  { alert("Please include your first name!"); form.name.focus(); return; }
	  
	  if (form.name2.value == "")
	  { alert("Please include your last name!"); form.name2.focus(); return; }
	  
	  if (form.password.value == "")
	  { alert("Please choose a password!"); form.password.focus(); return; }
	  
	  if (form.payto.value == "")
	  { alert("Please include checks payable to!"); form.payto.focus(); return; }
	  
	  if (form.taxid.value == "")
	  { alert("Please include Tax ID/SSN!"); form.taxid.focus(); return; }
 
	  if (form.email.value == "")
	  { alert("Please include your email address!"); form.email.focus(); return; }
	  
	  if (form.phone.value == "")
	  { alert("Please include phone number!"); form.phone.focus(); return; }
 
	  if (form.address.value == "")
	  { alert("Please include address!"); form.address.focus(); return; }
	  
	  if (form.city.value == "")
	  { alert("Please include city!"); form.city.focus(); return; }
	  
	  if (form.state.value == "" && form.state2.value == "")
	  { alert("Please include state!"); form.state.focus(); return; }
	  
	  if (form.country.value == "")
	  { alert("Please include country!"); form.country.focus(); return; }
	  
	  if (form.country.value == "CHINA")
	  { alert("We are not currently accepting Affiliates from China"); form.country.focus(); return; }
	  
	  if (form.country.value == "HONG KONG")
	  { alert("We are not currently accepting Affiliates from Hong Kong"); form.country.focus(); return; }
 
//	  if (form.country.value == "INDIA")
//	  { alert("We are not currently accepting Affiliates from India"); form.country.focus(); return; }
 
	  if (form.country.value == "RUSSIAN FEDERATION")
	  { alert("We are not currently accepting Affiliates from the Russian Federation"); form.country.focus(); return; }
	  
	  if (form.zip.value == "")
	  { alert("Please include zip code!"); form.zip.focus(); return; }
	  
//	  if (form.site_desc.value == "")
//	  { alert("Please include how you will promote our campaigns!"); form.site_desc.focus(); return; }
 
	  if ((form.chksite_desc1.checked == false) && (form.chksite_desc2.checked == false) && (form.chksite_desc3.checked == false) && (form.chksite_desc4.checked == false) && (form.monthlyspend.checked == false) && (form.site_desc.value == ""))
	  { alert("Please include how you will promote our campaigns!"); form.chksite_desc1.focus(); return; }
 
	  if (form.agree.checked == false)
	  { alert("Please check agreement!"); form.agree.focus(); return; }
 
	  form.submit();
	}
	//});
	//});