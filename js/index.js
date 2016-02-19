"use strict";

var columnNameAndType

var selectedDb;

var serverName = "localhost";
//var serverName = "odm.capbpm.com";

var selectedVal;

var selectedTable;

var operationsText =   "<input type=\"radio\" name=\"operations\" value=\"mapXsdToTables\">Map Xsd to Database</input><br>" +
                       "<input type=\"radio\" name=\"operations\" value=\"mapTableToXsd\">Map Table to Xsd</input><br>";

var customerFormCreate="Customer Data<br>"+
    "<table id='customer'>" +
    "<tr><td>First Name</td><td><textarea id='customerCreateFirstName' row='1' col='50'/></td></tr>"+
    "<tr><td>Last Name</td><td><textarea id='customerCreateLastName' row='1' col='50'/></td></tr>"+
    "<tr><td>Account Balance</td><td><textarea id='customerCreateAccountBalance' row='1' col='50'/></td></tr>"+
    "<tr><td>Age</td><td><textarea id='customerCreateAge' row='1' col='50'/></td></tr>"+
    "<tr><td>Active</td><td><textarea id='customerCreateActive' row='1' col='50'/></td></tr>"+
    "<tr><td>Start Date</td><td><textarea id='customerCreateStartDate' row='1' col='50'/></td></tr>"+
    "</table>" +
    "<br>"+
    "Customer Map Entry Data<br>"+
    "<table id='customermapentry>" +
    "<tr><td>Key</td><td><textarea id='customerMapEntryCreateKey' row='1' col='50'/></td></tr>"+
    "<tr><td>Value</td><td><textarea id='customerMapEntryCreateValue' row='1' col='50'/></td></tr>"+
    "</table>" +
    "<button onclick='createRecord()'>Create Record</button>";

var customerReadInput="Read<br> <table><tr><td>Table</td><td><textarea id='tableName' row='1' col='10'/></td></tr><tr><td>Comparison Column Name</td><td><textarea id='compColName' row='1' col='10'/></td></tr><tr><td>Comparison Type</td><td><textarea id='compType' row='1' col='10'/></td></tr><tr><td>Comparison Value</td><td><textarea id='compValue' row='1' col='10'/></td></tr></table><button onclick='readRecord()'>Read Record</button>";

var customerUpdateInput="Update<br>"+
    "<table>" +
    "<tr><td>Table</td><td><textarea id='updateTableName' row='1' col='10'/></td></tr>" +
    "<tr><td>Update Column Name</td><td><textarea id='updateColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Update Column Value</td><td><textarea id='updateColValue' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Column Name</td><td><textarea id='updateCompColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Type</td><td><textarea id='updateCompType' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Value</td><td><textarea id='updateCompValue' row='1' col='10'/></td></tr>" +
    "</table>" +
    "<br>" +
    "<button onclick='updateRecord()'>Update Record</button>";

var customerDeleteInput="Delete<br>" +
    "<table>"+
    "<tr><td>Table</td><td><textarea id='deleteTableName' row='1' col='10'/></td></tr>"+
    "<tr><td>Comparison Column Name</td><td><textarea id='deleteCompColName' row='1' col='10'/></td></tr>"+
    "<tr><td>Comparison Type</td><td><textarea id='deleteCompType' row='1' col='10'/></td></tr>"+
    "<tr><td>Comparison Value</td><td><textarea id='deleteCompValue' row='1' col='10'/></td></tr>"+
    "</table>"+
    "<br>" +
    "<button onclick='deleteRecord()'>Delete Record</button>";

/*var generateTableInput="Generate Table<br>" +
    "<table>"+
    "<tr><td>XSD Name</td><td><textarea id='xsdName' row='1' col='50'/></td></tr>"+
    "<tr><td>Version Number</td><td><textarea id='versionNumber' row='1' col='100'>2064.374d42f7-af28-4f6d-a1c0-b34453c39b64T</textarea></td></tr>"+
    "</table>"+
    "<br>" +
    "<button onclick='listXsd()'>Generate Table</button>";*/

var pickTable = "<div id='pickTable'>" +
    "<input type='radio' name='picktable' value='customer'>Customer</input><br>" +
    "<input type='radio' name='picktable' value='customermapentry'>Customer Map Entry</input><br>" +
    "<input type='radio' name='picktable' value='account'>Account</input><br>" +
    "</div>";

/*

databaseDetailArr[0].tableName .columnName .columnType
                 [1]
                 [2]

*/
var databaseDetailArr = [];
var xsdDetailArr = {};
var xsdDetailArr2 = [];

//var xsdName;
//var versionNumber;


function setTable(){
   $('#pickTable input').on('change', function() {
   alert($('input[name="picktable"]:checked', '#pickTable').val()); 
   });
}

function deleteRecord(){
    var deleteTable=$('textarea#deleteTableName').val();
    var deleteCompColName=$('textarea#deleteCompColName').val();
    var deleteCompType=$('textarea#deleteCompType').val();
    var deleteCompValue=$('textarea#deleteCompValue').val();
    var deleteString= "{\"table\":\""+deleteTable+"\", " +
	"\"comps\":[ {\"column\":\""+deleteCompColName+"\" , \"comp\":\""+deleteCompType+"\", \"value\":\""+deleteCompValue+"\" }]}";
    console.log("deleteString="+deleteString);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://odm.capbpm.com:8080/crudService"+selectedDb+"/delete?input="+deleteString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}

function updateRecord(){
    var tableToUpdate=$('textarea#updateTableName').val();
    var updateColName = $('textarea#updateColName').val();
    var updateColValue = $('textarea#updateColValue').val();
    var updateCompColName = $('textarea#updateCompColName').val();
    var updateCompType = $('textarea#updateCompType').val();
    var updateCompValue = $('textarea#updateCompValue').val();

    var updateString = "{\"table\":\""+tableToUpdate+"\",\"colval\":[{\"column\":\""+updateColName+"\",\"value\":\""+updateColValue+"\"}],\"comps\":[ {\"column\":\""+updateCompColName+"\" , \"comp\":\""+updateCompType+"\",\"value\":\""+updateCompValue+"\" }]}";

    console.log("updateString="+updateString);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://odm.capbpm.com:8080/crudService"+selectedVal+"/update?input="+updateString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });    
    
}

function readRecord(){
    var tableToRead=$('textarea#tableName').val();
    var compColName=$('textarea#compColName').val();
    var compType=$('textarea#compType').val();
    var compValue=$('textarea#compValue').val();
    var readString= "{\"table\":\""+tableToRead+"\", " +
	"\"comps\":[ {\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":\""+compValue+"\" }]}";
    console.log("readString="+readString);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://odm.capbpm.com:8080/crudService"+selectedVal+"/read?input="+readString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
					
}

function createSecondaryTable(serviceType,key,value){

    var createSecondaryTableString;
    if (selectedVal == "Mysql"){
	createSecondaryTableString="{\"table\":\"customermapentry\", \"colval\":[ {\"column\":\"keycol\", \"value\":\""+key+"\" }, {\"column\":\"value\" ,\"value\":\""+value+"\" }]}";
    }
    else{
	createSecondaryTableString="{\"table\":\"customermapentry\", \"colval\":[ {\"column\":\"key\", \"value\":\""+key+"\" }, {\"column\":\"value\" ,\"value\":\""+value+"\" }]}";
    }
    
    console.log("http://localhost:8080/crudService"+serviceType+"/create?input="+createSecondaryTableString);
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://odm.capbpm.com:8080/crudService"+serviceType+"/create?input="+createSecondaryTableString,
            success: function(msg) {
                //need to build createCustomerMapEntryString and pass it to method that does that ajax call here
	    
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });    
}


function createRecord(){
    //Customer
    var customerCreateFirstName = $('textarea#customerCreateFirstName').val();
    var customerCreateLastName = $('textarea#customerCreateLastName').val();
    var customerCreateAccountBalance = $('textarea#customerCreateAccountBalance').val();
    var customerCreateAge = $('textarea#customerCreateAge').val();
    var customerCreateActive = $('textarea#customerCreateActive').val();
    var customerCreateStartDate = $('textarea#customerCreateStartDate').val();
   
    //Customer Map Entry Data
    var customerMapEntryCreateKey = $('textarea#customerMapEntryCreateKey').val();
    var customerMapEntryCreateValue = $('textarea#customerMapEntryCreateValue').val();
    
    console.log("customerCreateFirstName="+customerCreateFirstName);
    console.log("customerCreateLastName="+customerCreateLastName);
    console.log("customerCreateAccountBalance="+customerCreateAccountBalance);
    console.log("customerCreateAge="+customerCreateAge);
    console.log("customerCreateActive="+customerCreateActive);
    console.log("customerCreateStartDate="+customerCreateStartDate);
   
    //Customer Map Entry Data
    console.log("customerMapEntryCreateKey="+customerMapEntryCreateKey);     //need to use this value as alias in Customer rec
    console.log("customerMapEntryCreateValue="+customerMapEntryCreateValue);

    
    var createCustomerString="{\"table\":\"customer\", \"colval\":[ {\"column\":\"startdate\", \"value\":\""+customerCreateStartDate+"\" }, {\"column\":\"accountbalance\" ,\"value\":\""+customerCreateAccountBalance+"\" }, {\"column\":\"age\" ,\"value\":\""+customerCreateAge+"\" }, {\"column\":\"firstname\" , \"value\":\""+customerCreateFirstName+"\" }, {\"column\":\"lastname\", \"value\":\""+customerCreateLastName+"\" }, {\"column\":\"isactive\" ,\"value\":\""+customerCreateActive+"\" }, {\"column\":\"alias\" ,\"value\":\""+customerMapEntryCreateKey+"\" }]}";
    
    $("#input").hide();
    $("#output").hide();
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://odm.capbpm.com:8080/crudService"+selectedVal+"/create?input="+createCustomerString,
            success: function(msg) {
                //need to build createCustomerMapEntryString and pass it to method that does that ajax call here
	    
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
		createSecondaryTable(selectedVal,customerMapEntryCreateKey,customerMapEntryCreateValue);
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
    
    
}


function handleDrop(){

    var tableName = $('textarea#tableToDrop').val()
    console.log("selectedVal="+selectedVal+" dropping table " + tableName);
    $("#input").hide();
    $("#output").hide();
   /*$.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://localhost:8080/crudService"+selectedVal+"/deleteTable?input="+tableName,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
	    });*/
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://odm.capbpm.com:8080/crudService"+selectedVal+"/deleteTable?input="+tableName,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}

function generateTable(){

        var xsdName = $('textarea#xsdName').val();
        var versionNumber = $('textarea#versionNumber').val();
	var unencodedInput = "https://bpm.capbpm.com:9443/webapi/ViewSchema.jsp?type="+xsdName+"&version="+versionNumber

	var encodedUrl = encodeURIComponent(unencodedInput);

    console.log("encodedUrl="+encodedUrl);
    
    $("#input").hide();
    $("#output").hide();
    
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            //beforeSend: function (xhr) {
            //   xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            //},
            //url:    "http://odm.capbpm.com:8080/crudService"+selectedVal+"/generateTable3?input=https%3A%2F%2Fbpm.capbpm.com%3A9443%2Fwebapi%2FViewSchema.jsp%3Ftype%3DCustomer%26version%3D2064.374d42f7-af28-4f6d-a1c0-b34453c39b64T",
            url:    "http://odm.capbpm.com:8080/crudService"+selectedVal+"/generateTable3?input="+encodedUrl,	    
            //data: "{\"loginToken\":\""+"\",  \"password\":\""+"\", \"gpsLat\":\""+currentLat+"\", \"gpsLong\":\""+currentLong+"\", \"searchRadius\":\""+searchRadius+"\"}",
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
		//console.log("success msg="+msg);
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            	//alert("cassandra generateTable3 returned=["+msg+"]");
            }
          });
}

function handleCassandra(op){

    if (op == "generateTable"){
	console.log("calling gen table");
	$("#input").html(generateTableInput);
	$("#input").show();		
    }
    else if (op == "dropTable"){
	$("#input").html("<br>Enter table to drop: <textarea id='tableToDrop' rows='1' cols='100'/><br><button onclick='handleDrop()'>Drop Table</button>");
	$("#input").show();
    }
    else if (op == "createRecord"){

	//$("#input").html(createRecordPickTable);
	$("#input").html(customerFormCreate);
	$("#input").show();	
    }
    else if (op == "readRecord"){
	$("#input").html(pickTable);
	//$("#input").html(customerReadInput);
	//$("#input").show();	
    }
    else if (op == "updateRecord"){
	$("#input").html(pickTable);
	//$("#input").html(customerUpdateInput);
	//$("#input").show();	
    }
    else if (op == "deleteRecord"){
	$("#input").html(pickTable);
	//$("#input").html(customerDeleteInput);
	//$("#input").show();
    }
}

function listKeys(jsonObject){

    var keys = [];
    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
           keys.push(key);
        }
    }
    return keys;
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function dumpDatabaseDetailArr(){
    for (var idx=0; idx < databaseDetailArr.length; idx++){
	console.log("databaseDetailArr["+idx+"]="+JSON.stringify(databaseDetailArr[idx]));
    }
}

function dumpXsdDetailArr(){
    var xsdPropLetter = "A";
    for (var idx=0; idx < Object.size(xsdDetailArr); idx++){
	console.log("xsdDetailArr["+xsdPropLetter+"]="+JSON.stringify(xsdDetailArr[xsdPropLetter]));
	xsdPropLetter = nextChar(xsdPropLetter);
    }
}

function mapTableToXsd(){
    var leftMappingName, rightMappingName, leftIdx, rightIdx;

    var inputJsonObject = {} ;
    var jsonSubArray, jsonSubObj;
    var tableName = "";
    inputJsonObject.mapping = null;

    for (var idx=1; idx < databaseDetailArr.length; idx++){
        leftMappingName = "#leftMapping"+idx;
	rightMappingName = "#rightMapping"+idx;
	leftIdx = $(leftMappingName).val();
	rightIdx = $(rightMappingName).val();

	if (isNaN(leftIdx)){
	   /* jsonSubArray = [];
	    jsonSubArray.push(databaseDetailArr[rightIdx]);
	    jsonSubArray.push(xsdDetailArr2[leftIdx]);
	    if (inputJsonObject.mapping == null){
		console.log("inputJsonObject.mapping is NULL so assign value");
		inputJsonObject.mapping = [];
		inputJsonObject.mapping.push(jsonSubArray);
	    }
	    else{
		console.log("inputJsonObject.mapping is NOT null so APPEND value");
		inputJsonObject.mapping.push(jsonSubArray);
	    }
	    console.log("1 " + JSON.stringify(xsdDetailArr2[leftIdx]) + " will map to " + JSON.stringify(databaseDetailArr[rightIdx]));
	    */
	}
	else{
	    jsonSubArray = [];
	    jsonSubObj = {};
	    //jsonSubArray.push(databaseDetailArr[leftIdx]);
	    //jsonSubArray.push(xsdDetailArr2[rightIdx]);
	    if (tableName == ""){
		tableName = jsonSubObj.table=databaseDetailArr[leftIdx].tableName;
		inputJsonObject.tableName = tableName;
	    }
	    jsonSubObj.columnName=databaseDetailArr[leftIdx].columnName;
	    jsonSubObj.columnType=databaseDetailArr[leftIdx].columnType;
	    jsonSubObj.propName=xsdDetailArr2[rightIdx].mappingName;
	    jsonSubObj.propType=xsdDetailArr2[rightIdx].mappingType;
	    jsonSubArray.push(jsonSubObj);
	    if (inputJsonObject.mapping == null){
		console.log("inputJsonObject.mapping is NULL so assign value");
		inputJsonObject.mapping = [];
		inputJsonObject.mapping.push(jsonSubArray);
	    }
	    else{
		console.log("inputJsonObject.mapping is NOT null so APPEND value");
		inputJsonObject.mapping.push(jsonSubArray);
	    }
	    console.log("2 DATABASE table:"+databaseDetailArr[leftIdx].tableName + " columnName:" +
			databaseDetailArr[leftIdx].columnName + " columnType:" +
			databaseDetailArr[leftIdx].columnType + " will map to OBJECT propName:" + xsdDetailArr2[rightIdx].mappingName + " propType:" +
			xsdDetailArr2[rightIdx].mappingType);
	}    
    }
    console.log("mapTableToXsd inputJsonObject="+JSON.stringify(inputJsonObject, null, 2));
    
    	   $.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		crossDomain: true,
		url:    "http://"+serverName+":8080/crudService"+selectedDb+"/mapDbToXsd?input="+JSON.stringify(inputJsonObject),	    
		success: function(msg) {	    
		    $("#output").html("<br> SUCCESS  Service returned:  "+JSON.stringify(msg));
		    $("#output").show();
		},
		error: function(msg) {
		    $("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		    $("#output").show();
		}
            });
    

}
/*
databaseDetailArr[0]=undefined
databaseDetailArr[1]={"tableName":"account","columnName":"accountnumber","columnType":"UTF8Type"}
databaseDetailArr[2]={"tableName":"account","columnName":"balance","columnType":"DoubleType"}
databaseDetailArr[3]={"tableName":"account","columnName":"isactive","columnType":"BooleanType"}
databaseDetailArr[4]={"tableName":"account","columnName":"startdate","columnType":"TimestampType"}


xsdDetailArr[A]={"xsdName":"Account","columnName":"accountNumber","columnType":"xs:string","isKey":true}
xsdDetailArr[B]={"xsdName":"Account","columnName":"startDate","columnType":"xs:dateTime","isKey":false}
xsdDetailArr[C]={"xsdName":"Account","columnName":"balance","columnType":"xs:double","isKey":false}
xsdDetailArr[D]={"xsdName":"Account","columnName":"isActive","columnType":"xs:boolean","isKey":false}
*/
//Account.xsd version 2064.7195821d-5bac-4b5b-8b0b-9cadf827d960T
function establishMappings(){
    var leftMappingName, rightMappingName, leftIdx, rightIdx;

    var inputJsonObject = {} ;
    var jsonSubArray;

    inputJsonObject.mapping = null;
    
    for (var idx=1; idx < databaseDetailArr.length; idx++){
        leftMappingName = "#leftMapping"+idx;
	rightMappingName = "#rightMapping"+idx;
	leftIdx = $(leftMappingName).val();
	rightIdx = $(rightMappingName).val();

	if (isNaN(leftIdx)){
	    jsonSubArray = [];
	    jsonSubArray.push(xsdDetailArr[leftIdx]);
	    jsonSubArray.push(databaseDetailArr[rightIdx]);
	    if (inputJsonObject.mapping == null){
		console.log("inputJsonObject.mapping is NULL so assign value");
		inputJsonObject.mapping = [];
		inputJsonObject.mapping.push(jsonSubArray);
	    }
	    else{
		console.log("inputJsonObject.mapping is NOT null so APPEND value");
		inputJsonObject.mapping.push(jsonSubArray);
	    }
	    console.log(JSON.stringify(xsdDetailArr[leftIdx]) + " will map to " + JSON.stringify(databaseDetailArr[rightIdx]));
	    
	}
	else{
	    console.log(JSON.stringify(databaseDetailArr[leftIdx]) + " will map to " + JSON.stringify(xsdDetailArr[rightIdx]));
	}    
    }
    console.log("establishMappings mapXsdToDb inputJsonObject="+JSON.stringify(inputJsonObject, null, 2));
    
    	    $.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		crossDomain: true,
		url:    "http://"+serverName+":8080/crudService"+selectedDb+"/mapXsdToDb?input="+JSON.stringify(inputJsonObject),	    
		success: function(msg) {	    
		},
		error: function(msg) {
		    $("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		    $("#output").show();
		}
            });
    

}

function displayMappingEntryTable(whatIsFirst){

    var obj;
    var mappingContents="Mappings<br><br>";
    
    if (whatIsFirst == "database"){
	console.log("displayMappingEntryTable whatIsFirst=database xsdDetailArr="+JSON.stringify(xsdDetailArr2));
	console.log("displayMappingEntryTable whatIsFirst=database databaseDetailArr.length-1="+(databaseDetailArr.length-1)+" Object.size(xsdDetailArr2)="+Object.size(xsdDetailArr2));
	if ((databaseDetailArr.length-1) == Object.size(xsdDetailArr2)){
	    
	    mappingContents += "<form>";

	    var xsdArrIdx = "A";

	    dumpDatabaseDetailArr();
	    
	    for (var idx=1; idx < databaseDetailArr.length; idx++){
		obj = databaseDetailArr[idx];
		mappingContents += '<input type="text" id=leftMapping'+(idx)+' value='+idx+'> <input type="text" id=rightMapping'+(idx)+' value='+xsdArrIdx+'> <br>';
		xsdArrIdx = nextChar(xsdArrIdx);
	    }

	    mappingContents += '<input type="button" value="Submit" onclick="mapTableToXsd()">';
	    mappingContents += "</form>";
	    $("#mappings").html(mappingContents);
	}
	else{
	    alert("THIS IS NOT GOOD number database fields does not match number xsd fields");
            dumpDatabaseDetailArr();
            dumpXsdDetailArr();
	}
    }
    else if (whatIsFirst == "xsd"){
	if ((databaseDetailArr.length-1) == Object.size(xsdDetailArr)){
	    
	    mappingContents += "<form>";

	    var xsdArrIdx = "A";

	    dumpDatabaseDetailArr();
	    
	    for (var idx=1; idx < databaseDetailArr.length; idx++){
		obj = databaseDetailArr[idx];
		mappingContents += '<input type="text" id=leftMapping'+(idx)+' value='+xsdArrIdx+'> <input type="text" id=rightMapping'+(idx)+' value='+idx+'> <br>';
		xsdArrIdx = nextChar(xsdArrIdx);
	    }

	    mappingContents += '<input type="button" value="Submit" onclick="establishMappings()">';
	    mappingContents += "</form>";
	    $("#mappings").html(mappingContents);
	}
	else{
	    alert("number database fields does not match number xsd fields");
            dumpDatabaseDetailArr();
            dumpXsdDetailArr();
	}
    }

    

    
}

function listXsd(db, xsdPropLetter, nextOp, xsdName, versionNumber){
    
        var unencodedInput = "https://bpm.capbpm.com:9443/webapi/ViewSchema.jsp?type="+xsdName+"&version="+versionNumber
        var encodedUrl = encodeURIComponent(unencodedInput);
    
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+serverName+":8080/crudService"+db+"/listXsd?input="+encodedUrl,	    
            success: function(msg) {

		var columnNameAndType="BPM Object:  "+xsdName + "<br>";

		var xsdObjectNames = listKeys(msg);

                var currentOutputContents=$("#output").html();

		currentOutputContents += "<br>";
		
		for (var idx=0; idx < xsdObjectNames.length; idx++){

		    columnNameAndType += (idx+1) + ". " + xsdObjectNames[idx] + ":" + JSON.stringify(msg[xsdObjectNames[idx]]) + "<br>";

		    currentOutputContents += "XSD NAME: " + xsdObjectNames[idx] +"<br>";
		    var columns = msg[xsdObjectNames[idx]];
		    for (var j=0; j < columns.length; j++){
			currentOutputContents += '<label id="'+ xsdPropLetter + '">' + xsdPropLetter + ". " + columns[j].columnName + " " + columns[j].columnType + " " + columns[j].key + "</label><br>";
			xsdDetailArr[xsdPropLetter] = { xsdName:xsdName, columnName:columns[j].columnName, columnType:columns[j].columnType, isKey:columns[j].key};
			xsdPropLetter = nextChar(xsdPropLetter);
		    }

		    currentOutputContents += "<br>";
		}

		if (nextOp == "display"){
                    $("#output").html(currentOutputContents);
		    displayMappingEntryTable("database");
		}
		else if (nextOp == "mapXsdToTables"){
                    $("#output").html(currentOutputContents);
                    //processTable(db, selectedTable, false, 1, "display");
		    listGeneratedMappings(db, false, 1, "display", encodedUrl);
	        }
	    
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
        });
    
}
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function listGeneratedMappings(db, append, columnNumber, nextOp, encodedUrl){
		    
        var getTableMapEntry = false;		
	var currentOutputContents = $("#output").html();

    console.log("listGeneratedMappings encodedUrl="+encodedUrl);
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+serverName+":8080/crudService"+db+"/generateTableTemplate?input=" + encodedUrl,	    
            success: function(msg) {

		/* msg contains:

                   {"Account":["Column [columnName=accountNumber, columnType=xs:string, isKey=true]",
                               "Column [columnName=startDate, columnType=xs:dateTime, isKey=false]",
                               "Column [columnName=balance, columnType=xs:double, isKey=false]",
                               "Column [columnName=isActive, columnType=xs:boolean, isKey=false]"
                              ]
                   }

                */
		console.log("generateTableTemplate returned:");
		console.log(JSON.stringify(msg));

		var tableNames = listKeys(msg);
		console.log("tableNames(list of keys)="+tableNames);
		console.log("tableNames.length="+tableNames.length);
		var tableName;
                for (var idx=0; idx<tableNames.length; idx++){
		    tableName = tableNames[idx];
		    console.log("in loop tableName="+tableName);
		    if (append){
			currentOutputContents +="GENERATED DATABASE:  "+tableName + "<br>";
		    }
		    else{
			currentOutputContents +="GENERATED DATABASE:  "+tableName + "<br>";
		    }

                    var tableColumns = msg[tableName];
		    console.log("tableColumns=");
		    console.log(JSON.stringify(tableColumns));
                    console.log("tableColumns.length="+tableColumns.length);
		    var columnObj;
		    for (var idx2=0; idx2<tableColumns.length; idx2++){
			console.log("tableName="+tableName+" idx2="+idx2+"tableColumns[idx2]="+JSON.stringify(tableColumns[idx2]));
			columnObj = tableColumns[idx2];
			currentOutputContents += columnNumber + ". "  + '<textarea id="' + columnNumber+ '">' + columnObj.columnName + ":" + columnObj.columnType + "</textarea><br>";
			databaseDetailArr[columnNumber] = { tableName:tableName, columnName:columnObj.columnName, columnType:columnObj.columnType };
			columnNumber++;
		    }
		    currentOutputContents += '<br>';
		    

		}
		$("#output").html(currentOutputContents);
		if (nextOp == "listXsd"){
			listXsd(db, "A", "display");
		}
		else if (nextOp == "display"){
		        currentOutputContents += "<button id='acceptFields' onclick='acceptFields()'>Accept Fields</button><br><br>";
			$("#output").html(currentOutputContents);

		}		
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
        });
    
}

function acceptFields(){
    var fieldName;
    var columnNameAndType;
    var nameTypeArr;
    for (var columnNumber=1; columnNumber<databaseDetailArr.length; columnNumber++){
	fieldName="#"+columnNumber;
	columnNameAndType = $(fieldName).val();
	nameTypeArr = columnNameAndType.split(":");
	console.log(columnNameAndType);
	//$(fieldName).val(columnNameAndType);
	$(fieldName).attr('readonly', 'true');
        $(fieldName).css('background-color' , '#DEDEDE');
	databaseDetailArr[columnNumber].columnName=nameTypeArr[0];
	databaseDetailArr[columnNumber].columnType=nameTypeArr[1] ;
	console.log(JSON.stringify(databaseDetailArr[columnNumber]));
    }
    displayMappingEntryTable("xsd");    
}

function acceptXsdMapping(){
    var fieldName;
    var typeName;
    var idxColon;
    var objectFieldNameAndType;
    var nameTypeArr;
    console.log("acceptXsdMapping START");
    for (var mappingNumber=0; mappingNumber<xsdDetailArr2.length; mappingNumber++){
	console.log("acceptXsdMapping IN LOOP");
	fieldName="#mappingNumber"+mappingNumber;
	objectFieldNameAndType = $(fieldName).val();

	idxColon = objectFieldNameAndType.indexOf(":");
        fieldName = objectFieldNameAndType.substring(0,idxColon);
	typeName = objectFieldNameAndType.substring(idxColon+1);
	
	$(fieldName).attr('readonly', 'true');
        $(fieldName).css('background-color' , '#DEDEDE');
	xsdDetailArr2[mappingNumber].mappingName=fieldName;
	xsdDetailArr2[mappingNumber].mappingType=typeName;
	console.log(JSON.stringify(xsdDetailArr2[mappingNumber]));
    }
    //at this point we have changed the xsd names/types as necessary
    //we are now ready to associate them with the database
    
    displayMappingEntryTable("database");    
}

function displayPotentialXsd(db, tabName){

        var key;
        var currentOutputContents = $("#output").html();
    var idxNumToLetter = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z" ];
        var mappingNumber = 0;

	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+serverName+":8080/crudService"+db+"/generateXsdTemplate?input=" + tabName,	    
            success: function(msg) {

		currentOutputContents += "XSD Mapping<br>";

		console.log("displayPotentialXsd msg="+JSON.stringify(msg));	
		var keys = listKeys(msg);
		for (var idx=0; idx<keys.length; idx++){
		        key = keys[idx];
		        //currentOutputContents += (mappingNumber+1) + ". "  + '<textarea id="mappingNumber' + mappingNumber+ '">' + key + ":" + msg[key] + "</textarea><br>";
		        //xsdDetailArr2[mappingNumber] = { tableName:tabName, mappingName:key, mappingType:msg[key] };
                        currentOutputContents += idxNumToLetter[mappingNumber] + ". "  + '<textarea id="mappingNumber' + idxNumToLetter+ '">' + key + ":" + msg[key] + "</textarea><br>";
		        xsdDetailArr2[idxNumToLetter[mappingNumber]] = { tableName:tabName, mappingName:key, mappingType:msg[key] };		    
			mappingNumber++;		    
		}
		currentOutputContents += "<button id='acceptXsdMapping' onclick='acceptXsdMapping()'>Accept Object Mapping</button><br><br>";
	        $("#output").html(currentOutputContents);
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
        });  
}

//not used when mapping XSD to DB
function processTable(db, tableName, append, columnNumber, nextOp){

    console.log("processTable db="+db+" tableName="+tableName+" append="+append+" columnNumber="+columnNumber+" nextOp="+nextOp);
        var getTableMapEntry = false;		
	var currentOutputContents = $("#output").html();

	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+serverName+":8080/crudService"+db+"/listColumns?input=" + tableName,	    
            success: function(msg) {

		if (append){
		    currentOutputContents +="DATABASE:  "+tableName + "<br>";
		}
		else{
		    currentOutputContents +="DATABASE:  "+tableName + "<br>";
		}

		console.log("processTable msg="+JSON.stringify(msg));
		
		var keys = listKeys(msg);
		var tableMapEntryName = tableName+"mapentry";
	        tableMapEntryName = tableMapEntryName.toLowerCase();

		for (var idx=0; idx < keys.length; idx++){
		    currentOutputContents += '<label id="' + columnNumber+ '">' + columnNumber + ". " + JSON.stringify(msg[keys[idx]]) + "</label><br>";

		    //databaseDetailArr[columnNumber] = { tableName:tableName, columnName:keys[idx], columnType:msg[keys[idx]] };
		    databaseDetailArr[columnNumber] = { tableName:tableName, columnName:msg[keys[idx]].columnName, columnType:msg[keys[idx]].columnType };
		    columnNumber++;
		    if (endsWith(keys[idx],tableMapEntryName)){
			getTableMapEntry = true;
		    }
		}

		if (getTableMapEntry){
		    currentOutputContents += "<br>";
		    processTable(db, tableMapEntryName, true, columnNumber, nextOp);
		}
		else{
		    $("#output").html(currentOutputContents);
		    $("#output").show();
                }

		if (nextOp == "listXsd"){
		    listXsd(db, "A", "display");
		}
		else if (nextOp == "display"){
                    $("#output").html(currentOutputContents);
		    //displayMappingEntryTable("xsd");
		    console.log("processTable databaseDetailArr="+JSON.stringify(databaseDetailArr,null,2));
		    displayPotentialXsd(db, tableName);
		}
         
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
        });
    
}

function processListTables(db, userOp){

    console.log("processListTables START db="+db+" userOp="+userOp);
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+serverName+":8080/crudService"+db+"/listTables",	    
            success: function(msg) {

		    var myStringArray = msg.tableNames;
                    var arrayLength = myStringArray.length;
		    var tableRadioButtonList = "";
                    for (var i = 0; i < arrayLength; i++) {
                        console.log("table name="+myStringArray[i]);
                        tableRadioButtonList += "<input type='radio' name='tableRadioButtonList' value="+myStringArray[i]+">"+myStringArray[i]+"</input><br>"
                    }

		    $("#output").html(tableRadioButtonList);
		    $("#output").show();
		    
		    $('#output input').on('change', function() {
			//xsdName = $('textarea#xsdName').val();
                        //versionNumber = $('textarea#versionNumber').val();
			//console.log("HEY OVER HERE xsdName="+xsdName+" versionNumber="+versionNumber);
			selectedTable = $('input:radio[name=tableRadioButtonList]:checked').val();
			processTable(db, selectedTable, false, 1, "display");

			
		    });    	    

		
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            	//alert("cassandra generateTable3 returned=["+msg+"]");
            }
          });    
}

function processListXsdAndTable(db, userOp){
    
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+serverName+":8080/crudService"+db+"/" + userOp,	    
            success: function(msg) {
		if (userOp == "mapXsdToTables"){

		    var myStringArray = msg.tableNames;
                    var arrayLength = myStringArray.length;
		    var tableRadioButtonList = "";
                    for (var i = 0; i < arrayLength; i++) {
                        console.log("table name="+myStringArray[i]);
                        tableRadioButtonList += "<input type='radio' name='tableRadioButtonList' value="+myStringArray[i]+">"+myStringArray[i]+"</input><br>"
                    }

		    $("#output").html(captureXsdNameAndVersionInput + "<br>" + tableRadioButtonList);
		    $("#output").show();
		    
		    $('#output input').on('change', function() {
			xsdName = $('textarea#xsdName').val();
                        versionNumber = $('textarea#versionNumber').val();
			console.log("HEY OVER HERE xsdName="+xsdName+" versionNumber="+versionNumber);
			selectedTable = $('input:radio[name=tableRadioButtonList]:checked').val();
			//processTable(db, selectedTable, false, 1);
		        listXsd(db, "A","mapXsdToTables");
			
		    });    	    

		}
		
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            	//alert("cassandra generateTable3 returned=["+msg+"]");
            }
          });    
}

function processListXsdAndTable(db, userOp){
    
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+serverName+":8080/crudService"+db+"/" + userOp,	    
            success: function(msg) {
		if (userOp == "mapXsdToTables"){

		    var myStringArray = msg.tableNames;
                    var arrayLength = myStringArray.length;
		    var tableRadioButtonList = "";
                    for (var i = 0; i < arrayLength; i++) {
                        console.log("table name="+myStringArray[i]);
                        tableRadioButtonList += "<input type='radio' name='tableRadioButtonList' value="+myStringArray[i]+">"+myStringArray[i]+"</input><br>"
                    }

		    $("#output").html(captureXsdNameAndVersionInput + "<br>" + tableRadioButtonList);
		    $("#output").show();
		    
		    $('#output input').on('change', function() {
			xsdName = $('textarea#xsdName').val();
                        versionNumber = $('textarea#versionNumber').val();
			console.log("HEY OVER HERE xsdName="+xsdName+" versionNumber="+versionNumber);
			selectedTable = $('input:radio[name=tableRadioButtonList]:checked').val();
			//processTable(db, selectedTable, false, 1);
		        listXsd(db, "A","mapXsdToTables");
			
		    });    	    

		}
		
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            	//alert("cassandra generateTable3 returned=["+msg+"]");
            }
          });    
}

function generateMappingsForReview(){
    
    var xsdName = $('textarea#xsdName').val();
    var versionNumber = $('textarea#versionNumber').val();
    console.log("HEY OVER HERE xsdName="+xsdName+" versionNumber="+versionNumber);
    selectedTable = xsdName.toLowerCase();
    //processTable(db, selectedTable, false, 1);
    listXsd(selectedDb, "A","mapXsdToTables", xsdName, versionNumber);
    
}

function myFunction(){

    var captureXsdNameAndVersionInput="Enter XSD name and version<br>" +
        "<table>"+
        "<tr><td>XSD Name</td><td><textarea id='xsdName' row='1' col='50'/></td></tr>"+
        "<tr><td>Version Number</td><td><textarea id='versionNumber' row='1' col='100'>2064.7195821d-5bac-4b5b-8b0b-9cadf827d960T</textarea></td></tr>"+
        "</table>"+
        "<br>"+
	"<button onclick='generateMappingsForReview()'>Generate Mappings For Review</button>";
    

    $('#services input').on('change', function() {
	selectedDb = $('input:radio[name=database]:checked').val();
	console.log("selectedDb="+selectedDb);
	$("#operations").html("<br>you clicked "+selectedDb+"<br>"+operationsText);
	$('#operations input').on('change', function() {
	    var op = $('input:radio[name=operations]:checked').val();
	    console.log("op="+op);

	    if (op == "mapXsdToTables"){
		//processListTables(selectedDb, op);
		//processListXsdAndTable(selectedDb, op);
		//getGeneratedTable(selectedDb, op);

	        $("#output").html(captureXsdNameAndVersionInput + "<br>");
		$("#output").show();
		    
 
	    }
	    else if (op == "mapTableToXsd"){
		processListTables(selectedDb, op);
		//processListXsdAndTable(selectedDb, op);
		//getGeneratedTable(selectedDb, op);

	        //$("#output").html(captureXsdNameAndVersionInput + "<br>");
		//$("#output").show();
		    
 
	    }
	});	
     });   
}
