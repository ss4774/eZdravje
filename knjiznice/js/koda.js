
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


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
  ehrId = "";

  // TODO: Potrebno implementirati
  sessionId = getSessionId();
  
  
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
						var datumInUra = "2014-04-04T08:55";
						var telesnaVisina = "185";
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
function izberiGeneriranegaUporabnika(){
    var uporabnik = $("#generirajEHR").val();
    
    var ehrID = generirajPodatke(uporabnik);
    $("#preberiEHRidEHR").val(ehrID);
}