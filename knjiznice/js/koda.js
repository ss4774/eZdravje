
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

//Google API Key
var googleAPIKey = "AIzaSyA4uzD5gXkxAnl-FSGwfo-BOpzk4au6lvw";

//ready critical komponents
$(document).ready(function(){
	var ac = new google.maps.places.Autocomplete(document.getElementById('find_location'));
	google.maps.event.addListener(ac, 'place_changed', function(){
	  	var place = ac.getPlace();
	  	/*console.log(place.formatted_address);
	  	console.log(place.url);
	  	console.log(place.geometry.location);*/
	  	initMap(place.geometry.location.lat(), place.geometry.location.lng(), place.formatted_address);
	});
});

function initMap(lat, lng, address) {
    var mapDiv = document.getElementById('healthcare_map');
    var map = new google.maps.Map(mapDiv, {
      center: {lat: lat, lng: lng},
      location: {lat: lat, lng: lng},
      zoom: 16
    });
    
    var marker = new google.maps.Marker({
	    position: {lat: lat, lng: lng},
	    map: map,
	    title: address
	});
	marker.setMap(map);
}


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
  var ehrId = "";

  // TODO: Potrebno implementirati
  var sessionId = getSessionId();
  
  
  if(stPacienta == 1){
	//kreiraj nov vnos
	var ime = "Peter";
	var priimek = "Novak";
	var datumRojstva = "1970-06-08T02:20";
	
	$.ajaxSetup({
	    headers: {"Ehr-Session": sessionId}
	});
	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    success: function (data) {
	        var ehrId = data.ehrId;
	        var partyData = {
	            firstNames: ime,
	            lastNames: priimek,
	            dateOfBirth: datumRojstva,
	            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
	        };
	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
	                    $("#kreirajSporocilo").html("<span class='obvestilo label label-success fade-in'>Uspešno kreiran EHR '" + ehrId + "'.</span>");
	                    console.log("Uspešno kreiran EHR '" + ehrId + "'.");
	                    $("#preberiEHRid").val(ehrId);
	                    
	                    //////dodaj meritve
						var datumInUra = "2015-04-04T08:55";
						var telesnaVisina = "175";
						var telesnaTeza = "120";
						var telesnaTemperatura = "36.4";
						var sistolicniKrvniTlak = "143";
						var diastolicniKrvniTlak = "69";
						var nasicenostKrviSKisikom = "97.9";
						var merilec = "Dr. Marjan Pip";
						var pulz = "73";
					
						$.ajaxSetup({
						    headers: {"Ehr-Session": sessionId}
						});
						var podatki = {
							// Preview Structure: https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
						    "ctx/language": "en",
						    "ctx/territory": "SI",
						    "ctx/time": datumInUra,
						    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
						    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
						   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
						    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
						    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
						    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
						    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom,
						    "vital_signs/pulse:0/any_event:0/rate|magnitude": pulz
						    //vital_signs/pulse:0/any_event:0/rate|magnitude":83.0,
						};
						var parametriZahteve = {
						    "ehrId": ehrId,
						    templateId: 'Vital Signs',
						    format: 'FLAT',
						    committer: merilec
						};
						$.ajax({
						    url: baseUrl + "/composition?" + $.param(parametriZahteve),
						    type: 'POST',
						    contentType: 'application/json',
						    data: JSON.stringify(podatki),
						    success: function (res) {
						    	console.log(res.meta.href);
						        $("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-success fade-in'>" + res.meta.href + ".</span>");
						    },
						    error: function(err) {
						    	$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
								console.log(JSON.parse(err.responseText).userMessage);
						    }
						});
						$("#preberiEHRidEHR").val(ehrId);
						
	                    //////
	                    //////dodaj 2. meritve
						var datumInUra = "2015-05-05T09:35";
						var telesnaVisina = "186";
						var telesnaTeza = "125";
						var telesnaTemperatura = "35.2";
						var sistolicniKrvniTlak = "155";
						var diastolicniKrvniTlak = "67";
						var nasicenostKrviSKisikom = "96.9";
						var merilec = "Dr. Marjan Pip";
						var pulz = "71";
					
						$.ajaxSetup({
						    headers: {"Ehr-Session": sessionId}
						});
						var podatki = {
							// Preview Structure: https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
						    "ctx/language": "en",
						    "ctx/territory": "SI",
						    "ctx/time": datumInUra,
						    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
						    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
						   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
						    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
						    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
						    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
						    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom,
						    "vital_signs/pulse:0/any_event:0/rate|magnitude": pulz
						    //vital_signs/pulse:0/any_event:0/rate|magnitude":83.0,
						};
						var parametriZahteve = {
						    "ehrId": ehrId,
						    templateId: 'Vital Signs',
						    format: 'FLAT',
						    committer: merilec
						};
						$.ajax({
						    url: baseUrl + "/composition?" + $.param(parametriZahteve),
						    type: 'POST',
						    contentType: 'application/json',
						    data: JSON.stringify(podatki),
						    success: function (res) {
						    	console.log(res.meta.href);
						        $("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-success fade-in'>" + res.meta.href + ".</span>");
						    },
						    error: function(err) {
						    	$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
								console.log(JSON.parse(err.responseText).userMessage);
						    }
						});
						$("#preberiEHRidEHR").val(ehrId);
						
	                    //////
	                }
	            },
	            error: function(err) {
	            	$("#kreirajSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
	            	console.log(JSON.parse(err.responseText).userMessage);
	            }
	        });
	    }
	});
  }else if (stPacienta == 2) {
			
	var ime = "Nika";
	var priimek = "Cerar";
	var datumRojstva = "1989-03-05T18:20";
	
	
	$.ajaxSetup({
	    headers: {"Ehr-Session": sessionId}
	});
	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    success: function (data) {
	        var ehrId = data.ehrId;
	        var partyData = {
	            firstNames: ime,
	            lastNames: priimek,
	            dateOfBirth: datumRojstva,
	            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
	        };
	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
	                    $("#kreirajSporocilo").html("<span class='obvestilo label label-success fade-in'>Uspešno kreiran EHR '" + ehrId + "'.</span>");
	                    console.log("Uspešno kreiran EHR '" + ehrId + "'.");
	                    $("#preberiEHRid").val(ehrId);
	                    
	                    //////
						var datumInUra = "2016-12-07T12:30";
						var telesnaVisina = "180";
						var telesnaTeza = "55";
						var telesnaTemperatura = "36.5";
						var sistolicniKrvniTlak = "122";
						var diastolicniKrvniTlak = "75";
						var nasicenostKrviSKisikom = "98.9";
						var merilec = "Dr. Andreja Kranjc";
						var pulz = "68";
					
						$.ajaxSetup({
						    headers: {"Ehr-Session": sessionId}
						});
						var podatki = {
							// Preview Structure: https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
						    "ctx/language": "en",
						    "ctx/territory": "SI",
						    "ctx/time": datumInUra,
						    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
						    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
						   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
						    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
						    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
						    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
						    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom,
						    "vital_signs/pulse:0/any_event:0/rate|magnitude": pulz
						};
						var parametriZahteve = {
						    "ehrId": ehrId,
						    templateId: 'Vital Signs',
						    format: 'FLAT',
						    committer: merilec
						};
						$.ajax({
						    url: baseUrl + "/composition?" + $.param(parametriZahteve),
						    type: 'POST',
						    contentType: 'application/json',
						    data: JSON.stringify(podatki),
						    success: function (res) {
						    	console.log(res.meta.href);
						        $("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-success fade-in'>" + res.meta.href + ".</span>");
						    },
						    error: function(err) {
						    	$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
								console.log(JSON.parse(err.responseText).userMessage);
						    }
						});
						$("#preberiEHRidEHR").val(ehrId);
						
	                    //////
	                }
	            },
	            error: function(err) {
	            	$("#kreirajSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
	            	console.log(JSON.parse(err.responseText).userMessage);
	            }
	        });
	    }
	});
	}else if (stPacienta == 3) {
			
	var ime = "Klemen";
	var priimek = "Smole";
	var datumRojstva = "1968-7-2T12:20";
	
	
	$.ajaxSetup({
	    headers: {"Ehr-Session": sessionId}
	});
	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    success: function (data) {
	        var ehrId = data.ehrId;
	        var partyData = {
	            firstNames: ime,
	            lastNames: priimek,
	            dateOfBirth: datumRojstva,
	            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
	        };
	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
	                    $("#kreirajSporocilo").html("<span class='obvestilo label label-success fade-in'>Uspešno kreiran EHR '" + ehrId + "'.</span>");
	                    console.log("Uspešno kreiran EHR '" + ehrId + "'.");
	                    $("#preberiEHRid").val(ehrId);
	                    
	                    //////
						var datumInUra = "2016-05-05T08:15";
						var telesnaVisina = "193";
						var telesnaTeza = "83";
						var telesnaTemperatura = "38.4";
						var sistolicniKrvniTlak = "131";
						var diastolicniKrvniTlak = "86";
						var nasicenostKrviSKisikom = "97.2";
						var merilec = "Medicinska sestra Eva Bogataj";
						var pulz = "67";
					
						$.ajaxSetup({
						    headers: {"Ehr-Session": sessionId}
						});
						var podatki = {
							// Preview Structure: https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
						    "ctx/language": "en",
						    "ctx/territory": "SI",
						    "ctx/time": datumInUra,
						    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
						    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
						   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
						    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
						    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
						    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
						    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom,
						    "vital_signs/pulse:0/any_event:0/rate|magnitude": pulz
						};
						var parametriZahteve = {
						    "ehrId": ehrId,
						    templateId: 'Vital Signs',
						    format: 'FLAT',
						    committer: merilec
						};
						$.ajax({
						    url: baseUrl + "/composition?" + $.param(parametriZahteve),
						    type: 'POST',
						    contentType: 'application/json',
						    data: JSON.stringify(podatki),
						    success: function (res) {
						    	console.log(res.meta.href);
						        $("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-success fade-in'>" + res.meta.href + ".</span>");
						    },
						    error: function(err) {
						    	$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
								console.log(JSON.parse(err.responseText).userMessage);
						    }
						});
						$("#preberiEHRidEHR").val(ehrId);
						
	                    //////
	                }
	            },
	            error: function(err) {
	            	$("#kreirajSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
	            	console.log(JSON.parse(err.responseText).userMessage);
	            }
	        });
	    }
	});
	}

  return ehrId;
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
function generirajUporabnike(){
    generirajPodatke(1);
    generirajPodatke(2);
    generirajPodatke(3);
}
function izberiGeneriranegaUporabnika(){
    var uporabnik = parseInt($("#generirajEHR").val());
    
    var ehrID = generirajPodatke(uporabnik);
    $("#preberiEHRidEHR").val(ehrID);
}

function preberiEHROdUporabnika() {
	var sessionId = getSessionId();

	var ehrId = $("#preberiEHRidEHR").val();
	
	var temp;
	var temp2;
	var color = "blue";

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#patient-name").html("<span class='C1'>" + party.firstNames + " " + party.lastNames + ".</span>");
				$(".patient-age").html("<span class='C2'>" + ( ((new Date).getFullYear() - (new Date(party.dateOfBirth)).getFullYear()) ) + "</span>");
				//$("#patient-gender").html("<span class='obvestilo label label-success fade-in'>" + party.partyAdditionalInfo.telesnaVisina + "</span>");
				$("#patient-dob").html("<span class='C2'>" + party.dateOfBirth + "</span>");
			},
			error: function(err) {
				$("#preberiSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
		
		$.ajax({
		    url: baseUrl + "/view/" + ehrId + "/" + "body_temperature",
		    type: 'GET',
		    headers: {"Ehr-Session": sessionId},
		    success: function (res) {
		    	if (res.length > 0) {
			    	//var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Telesna temperatura</th></tr>";
			        /*for (var i in res) {
			           // results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].temperature + " " 	+ res[i].unit + "</td>";
			        }*/
			        //results += "</table>";
			        //$("#rezultatMeritveVitalnihZnakov").append(results);
			        //$("#patient-temp").html("<span class='C3'>" + res[0].temperature + " " + res[0].unit + "</span>");
			        $("#patient-temp").html("<button type=\"button\" class=\"C3\" onclick=\"master_deatilTemperature()\">" + res[0].temperature + " " + res[0].unit + "</button>");
			        
			        if(res[0].temperature < 37 && res[0].temperature > 34){
			        	color = "green";
			        }else if(res[0].temperature < 39 && res[0].temperature > 32){
			        	color = "yellow";
			        }else if(res[0].temperature < 41 && res[0].temperature > 30){
			        	color = "red";
			        }
			        $("#progress-temp").html("<div class=\"progress-bar\" style=\"width: " + ( 50*res[0].temperature/36.5 ) + "%; height: 20px; background-color: " + color + ";\"></div>");
		    	} else {
		    		//$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
		    		$("#patient-temp").html("<span class='obvestilo label label-success fade-in'>" + "Ni podatkov" + "</span>");
		    	}
		    },
		    error: function() {
		    	$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
		    }
		});
		
		$.ajax({
		    url: baseUrl + "/view/" + ehrId + "/" + "weight",
		    type: 'GET',
		    headers: {"Ehr-Session": sessionId},
		    success: function (res) {
		    	if (res.length > 0) {
			        temp = res[0].weight;
			        temp2 = res[0].unit;
			        $(".patient-weight").html("<button type=\"button\" class=\"C2\" onclick=\"master_deatilWeight()\">" + res[0].weight + " " + res[0].unit + "</button>");
			       // $(".patient-weight").html("<span class='obvestilo label label-success fade-in'>" + res[0].weight + " " + res[0].unit + "</span>");
		    	} else {
		    		$(".patient-weight").html("<span class='obvestilo label label-success fade-in'>" + "Ni podatkov" + "</span>");
		    	}
		    	
		    	//"callback" za zaporedje da se BMI pravilno izracuna
		    	$.ajax({
        		    url: baseUrl + "/view/" + ehrId + "/" + "height",
        		    type: 'GET',
        		    headers: {"Ehr-Session": sessionId},
        		    success: function (res) {
        		    	if (res.length > 0) {
        			        //$("#patient-height").html("<span class='obvestilo label label-success fade-in'>" + res[0].height + " " + res[0].unit + "</span>");
        			        $("#patient-height").html("<button type=\"button\" class=\"C2\" onclick=\"master_deatilHeight()\">" + res[0].height + " " + res[0].unit + "</button>");
        			        $(".height-placeholder-value").html("<span>" + res[0].height + " " + res[0].unit + "</span>");
        			        
        			        $("#patient-bmi").html("<span class='C3'>" + ( temp/(res[0].height/100)^2 ) + " " + temp2 + "/" + "m" + "2" + "</span>");
        		    	} else {
        		    		$("#patient-height").html("<span class='obvestilo label label-success fade-in'>" + "Ni podatkov" + "</span>");
        		    	}
        		    },
        		    error: function() {
        		    	$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
        				console.log(JSON.parse(err.responseText).userMessage);
        		    }
        		});
		    },
		    error: function() {
		    	$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
		    }
		});
		
		$.ajax({
		    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
		    type: 'GET',
		    headers: {"Ehr-Session": sessionId},
		    success: function (res) {
		    	if (res.length > 0) {
			        //$("#patient-bp").html("<span class='obvestilo label label-success fade-in'>" + res[0].systolic + "/" + res[0].diastolic + " " + res[0].unit + "</span>");
			        $("#patient-bp").html("<button type=\"button\" class=\"C3\" onclick=\"master_deatilBP()\">" + res[0].systolic + "/" + res[0].diastolic + " " + res[0].unit + "</button>");
			        
			        if(Math.abs( res[0].systolic - 120 ) < 20){
			        	color = "green";
			        }else if(Math.abs( res[0].systolic - 120 ) < 40){
			        	color = "yellow";
			        }else if(Math.abs( res[0].systolic - 120 ) < 60){
			        	color = "red";
			        }
			        $("#progress-bp-systolic").html("<div class=\"progress-bar\" style=\"width: " + ( 50*res[0].systolic/120 ) + "%; height: 20px; background-color: " + color + ";\"></div>");
			        
			        if(Math.abs( res[0].diastolic - 80 ) < 20){
			        	color = "green";
			        }else if(Math.abs( res[0].diastolic - 80 ) < 40){
			        	color = "yellow";
			        }else if(Math.abs( res[0].diastolic - 80 ) < 60){
			        	color = "red";
			        }
			        $("#progress-bp-diastolic").html("<div class=\"progress-bar\" style=\"width: " + ( 50*res[0].diastolic/80 ) + "%; height: 20px; background-color: " + color + ";\"></div>");
		    	} else {
		    		$("#patient-bp").html("<span class='obvestilo label label-success fade-in'>" + "Ni podatkov" + "</span>");
		    	}
		    },
		    error: function() {
		    	$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
		    }
		});
		
		$.ajax({
		    url: baseUrl + "/view/" + ehrId + "/" + "pulse",
		    type: 'GET',
		    headers: {"Ehr-Session": sessionId},
		    success: function (res) {
		    	if (res.length > 0) {
			        //$("#patient-pulse").html("<span class='obvestilo label label-success fade-in'>" + res[0].pulse + "</span>");
			        $("#patient-pulse").html("<button type=\"button\" class=\"C3\" onclick=\"master_deatilPulse()\">" + res[0].pulse + "</button>");
			        
			        if(Math.abs( res[0].pulse - 80 ) < 20){
			        	color = "green";
			        }else if(Math.abs( res[0].pulse - 80 ) < 40){
			        	color = "yellow";
			        }else if(Math.abs( res[0].pulse - 80 ) < 60){
			        	color = "red";
			        }
			        $("#progress-pulse").html("<div class=\"progress-bar\" style=\"width: " + ( 50*res[0].pulse/80 ) + "%; height: 20px; background-color: " + color + ";\"></div>");
		    	} else {
		    		$("#patient-pulse").html("<span class='obvestilo label label-success fade-in'>" + "Ni podatkov" + "</span>");
		    	}
		    },
		    error: function() {
		    	$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
		    }
		});
		
		$.ajax({
		    url: baseUrl + "/view/" + ehrId + "/" + "problem",
		    type: 'GET',
		    headers: {"Ehr-Session": sessionId},
		    success: function (res) {
		    	if (res.length > 0) {
		    		var results = "<table class='table table-striped table-hover'>";
			        for (var i in res) {
			            results += "<tr><td class='text-right'><li>" + res[i].problems + "</li></td></tr>";
			        }
			        results += "</table>";
			        $("#patient-problems").html(results);
		    	} else {
		    		$("#patient-problems").html("<span class='obvestilo label label-success fade-in'>" + "Ni podatkov" + "</span>");
		    	}
		    },
		    error: function() {
		    	$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
		    }
		});
		
		
	}	
}
//////////////////////////////////////// MASTER DETAIL FUNKCIJE
function master_deatilWeight() {
	var sessionId = getSessionId();

	var ehrId = $("#preberiEHRidEHR").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		/*$.ajax({
			url: baseUrl + "/view/" + ehrId + "/" + "weight",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (res) {
				var results = "<table class='table table-striped table-hover'><tr><th>Date</th><th class='text-right'>Weight</th></tr>";
		        for (var i in res) {
		            results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].weight + " " 	+ res[i].unit + "</td>";
		           
		        }
		        results += "</table>";
		        $("#detail").html(results);
			//	$("#detail").html("<span class='obvestilo label label-success fade-in'>" + res[i].weight + " " + res[i].unit + "</span>");
			},
			error: function(err) {
				$("#detail").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});*/
		
		var AQL = 
			"select " +
				"t/data[at0002]/events[at0003]/time/value as time, " +
				"t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as weight, " +
				"t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/units as unit " +
			"from EHR e[e/ehr_id/value='" + ehrId + "'] " +
			"contains OBSERVATION t[openEHR-EHR-OBSERVATION.body_weight.v1] " +
			"order by t/data[at0001]/events[at0002]/time/value desc " +
			"limit 5";
		$.ajax({
		    url: baseUrl + "/query?" + $.param({"aql": AQL}),
		    type: 'GET',
		    headers: {"Ehr-Session": sessionId},
		    success: function (res) {
		    	var results = "<table class='table table-striped table-hover'><tr><th>Date</th><th class='text-right'>Weight</th></tr>";
		    	if (res) {
		    		var rows = res.resultSet;
			        for (var i in rows) {
			            results += "<tr><td>" + rows[i].time + "</td><td class='text-right'>" + rows[i].weight + " " 	+ rows[i].unit + "</td>";
			        }
			        results += "</table>";
			        $("#detail").html(results);
		    	} else {
		    		$("#detail").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
		    	}

		    },
		    error: function() {
		    	$("#detail").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
		    }
		});
	}	
}
function master_deatilHeight() {
	var sessionId = getSessionId();

	var ehrId = $("#preberiEHRidEHR").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/view/" + ehrId + "/" + "height",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (res) {
				var results = "<table class='table table-striped table-hover'><tr><th>Date</th><th class='text-right'>Height</th></tr>";
		        for (var i in res) {
		            results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].height + " " 	+ res[i].unit + "</td>";
		           
		        }
		        results += "</table>";
		        $("#detail").html(results);
			//	$("#detail").html("<span class='obvestilo label label-success fade-in'>" + res[i].weight + " " + res[i].unit + "</span>");
			
				//draw 3d (pazi ker je tor eferenca in ne kopija)
				draw3Djs(res);
			},
			error: function(err) {
				$("#detail").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}	
}
function master_deatilBP() {
	var sessionId = getSessionId();

	var ehrId = $("#preberiEHRidEHR").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (res) {
				var results = "<table class='table table-striped table-hover'><tr><th>Date</th><th class='text-right'>Blood pressure</th></tr>";
		        for (var i in res) {
		            results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].systolic + "/" + res[i].diastolic + " " 	+ res[i].unit + "</td>";
		        }
		        results += "</table>";
		        $("#detail").html(results);
			//	$("#detail").html("<span class='obvestilo label label-success fade-in'>" + res[i].weight + " " + res[i].unit + "</span>");
			},
			error: function(err) {
				$("#detail").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}	
}
function master_deatilPulse() {
	var sessionId = getSessionId();

	var ehrId = $("#preberiEHRidEHR").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/view/" + ehrId + "/" + "pulse",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (res) {
				var results = "<table class='table table-striped table-hover'><tr><th>Date</th><th class='text-right'>Pulse</th></tr>";
		        for (var i in res) {
		            results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].pulse + " " 	+ res[i].unit + "</td>";
		        }
		        results += "</table>";
		        $("#detail").html(results);
			//	$("#detail").html("<span class='obvestilo label label-success fade-in'>" + res[i].weight + " " + res[i].unit + "</span>");
			},
			error: function(err) {
				$("#detail").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}	
}
function master_deatilTemperature() {
	var sessionId = getSessionId();

	var ehrId = $("#preberiEHRidEHR").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/view/" + ehrId + "/" + "body_temperature",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (res) {
				var results = "<table class='table table-striped table-hover'><tr><th>Date</th><th class='text-right'>Temperature</th></tr>";
		        for (var i in res) {
		            results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].temperature + " " 	+ res[i].unit + "</td>";
		        }
		        results += "</table>";
		        $("#detail").html(results);
			//	$("#detail").html("<span class='obvestilo label label-success fade-in'>" + res[i].weight + " " + res[i].unit + "</span>");
			},
			error: function(err) {
				$("#detail").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}	
}
//////////////////////////////////////////////

// 3D.js
function draw3Djs(datain){
	//document.getElementById("djs_holder").removeChild();
	
	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
	    width = 389.333 - margin.left - margin.right,
	    height = 153.367 - margin.top - margin.bottom;
	
	// Parse the date / time
	var parseDate = d3.time.format("%d-%b-%y").parse;
	
	// Set the ranges
	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);
	
	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5);
	
	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5);
	
	// Define the line
	var valueline = d3.svg.line()
	    .x(function(d) { return x(d.time); })
	    .y(function(d) { return y(d.height); });
	    
	// Adds the svg canvas
	var svg = d3.select("#djs_holder")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", 
	              "translate(" + margin.left + "," + margin.top + ")");
	
	// Get the data
	//console.log(datain[0]);
	for (var i in datain) {
        // datain[i].time = parseInt(datain[i].time);
    	/*datain[i].time = datain[i].time.substring(0, 10);
    	datain[i].time = datain[i].time.replace(new RegExp("-", 'g'), "");*/
    	datain[i].time = parseInt(i) + 1000;
    	//delete datain[i].unit;
    }
   
	//console.log(datain[0]);
	//console.log(datain);
	
	
	// Scale the range of the data
    x.domain(d3.extent(datain, function(d) { return d.time; }));
    y.domain([0, d3.max(datain, function(d) { return d.height; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(datain));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}