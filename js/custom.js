

function initializeWidget()
{
	/*
	 * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget 
	 */
	ZOHO.embeddedApp.on("PageLoad",function(data)
	{
				var paramBody = {
  select_query: "select Name, Tax_Year, Country_Name from Calc_Configuration where (Tax_Year is not null and Country_Name is not null) order by Created_Time desc limit 2000"
};


// Prepare the request data for your connection
var req_data = {
  parameters: paramBody,
  headers: {
    "Content-Type": "application/json"
  },
  method: "POST",
  url: "https://www.zohoapis.com/crm/v7/coql", // same Zoho CRM API endpoint
  param_type: 2
};

// Invoke using connection name created in CRM Connections
ZOHO.CRM.CONNECTION.invoke("calcprodexternal", req_data)
  .then(function(res) {
    console.log("Response:", res);
	if (res.status !="success" || res.details.statusMessage=="") {
				// document.querySelector(".Contact_Infrmation").style.display = "none"; 
				// document.getElementById("resultTable").style.display="none" ;
				// document.getElementById("dicCalculatorType").style.display="none"  
				// alert("The particular country not available in database")
			} else {
				var recordData = res.details.statusMessage.data;
		// ZOHO.CRM.API.getAllRecords({Entity:"Calc_Configuration",sort_order:"asc",per_page:200,page:1})
		// .then(function(res){
		// 	console.log(res);
			
		// 	if (res.status =="204") {
		// 		// document.querySelector(".Contact_Infrmation").style.display = "none"; 
		// 		// document.getElementById("resultTable").style.display="none" ;
		// 		// document.getElementById("dicCalculatorType").style.display="none"  
		// 		// alert("The particular country not available in database")
		// 	} else {
				
		// 	var recordData = res.data;
			// var listOfData = result2.data;
			var optionsAsString = "";
			var checkData=[];
			optionsAsString += "<option value=''>--Select--</option>";
			for (const key in recordData) {
				// var recordID = recordData[key].id;
				var recordName = recordData[key].Tax_Year;
				if (!checkData.includes(recordName)) {
				checkData.push(recordName);
					optionsAsString += "<option value='" + recordName + "'>" + recordName + "</option>";	
				}
			}
			// document.getElementById("dicCalculatorType").style.display="flex" 
			document.getElementById("calculatorTaxYear").innerHTML="";
			document.getElementById("calculatorTaxYear").innerHTML = optionsAsString;
			document.getElementById("calculatorTaxYear").value=new Date().getFullYear();
			ZOHO.CRM.API.searchRecord({ Entity: "Calc_Configuration", Type: "criteria", Query: "(Tax_Year:equals:" + (document.getElementById("calculatorTaxYear").value) + ")" })
			.then(function(res1){
				console.log(res1);
				if (res1.status =="204") {
					// document.querySelector(".Contact_Infrmation").style.display = "none"; 
					// document.getElementById("res1ultTable").style.display="none" ;
					// document.getElementById("dicCalculatorType").style.display="none"  
					// alert("The particular country not available in database")
				} else {
					
					var recordData1 = res1.data;
					var optionsAsString_Country = "<option value=''>--Select--</option>";
					var checkData_Country = [];
					
					for (const key in recordData1) {
						if (recordData1[key].Tax_Year == document.getElementById("calculatorTaxYear").value) {
							var countryName = recordData1[key].Country_Name;
							if (!checkData_Country.includes(countryName)) {
								checkData_Country.push(countryName);
							}
						}
					}
					
					// Sort country names in ascending order
					checkData_Country.sort((a, b) => a.localeCompare(b));
					
					// Generate options after sorting
					checkData_Country.forEach(country => {
						optionsAsString_Country += `<option value="${country}">${country}</option>`;
					});
					
					// Set the sorted options in the dropdown
					document.getElementById("countryData").innerHTML = "";
					document.getElementById("countryData").innerHTML = optionsAsString_Country;
					
			}
		})

			
			
			}
		});
		
		// ZOHO.CRM.META.getModules().then(function(data){
		// 	console.log(data);	
		// 	});
// 		var conn_name = "mailerattachment";
// var req_data ={
//   "parameters" : { },
//   "headers" : {  },
//   "method" : "GET",
//   "url" : "https://www.zohoapis.com/crm/v6/Sweden_Church_Tax/actions/count",
//   "param_type" : 1
// };
// ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
// .then(function(data){
//     console.log(data)
// })
			
		// ZOHO.CRM.API.searchRecord({Entity:"Calc_Configuration",Type:"criteria",Query:"(Name:equals:Germany)"})
		// .then(function(res){
		// 	// console.log(res)
		// 	var recordID=res.data[0].id;
		// 	ZOHO.CRM.API.getRecord({
		// 		Entity: "Calc_Configuration", approved: "both", RecordID:recordID
		// 	   })
		// 	   .then(function(recordRes){
		// 		//    console.log(recordRes)
		// 		var formulaSubData=recordRes.data[0].Solutions_List;
		// 		for (const key in formulaSubData) {
		// 			var productName=formulaSubData[key].Product_Name;
		// 			var fieldName=formulaSubData[key].Field_Name;
		// 			var productFormula=formulaSubData[key].Formula;
		// 			// console.log("Product Name",productName);
		// 			// console.log("Field Name",fieldName);
		// 			// console.log("product Formula",productFormula);





		// 			// function getValue(id) {
		// 			// 	const element = document.getElementById(id);
		// 			// 	if (element) {
		// 			// 		if (element.tagName === 'SELECT') {
		// 			// 			return element.value;
		// 			// 		} else {
		// 			// 			return parseFloat(element.value) || 0;
		// 			// 		}
		// 			// 	}
		// 			// 	return 0;
		// 			// }
			
		// 			// // Function to replace placeholders with actual values dynamically
		// 			// function replacePlaceholders(formula) {
		// 			// 	return formula.replace(/{(\w+)}/g, function(match, placeholder) {
		// 			// 		const value = getValue(placeholder);
		// 			// 		// Quote the value if it's a string
		// 			// 		return (typeof value === 'string') ? `'${value}'` : value;
		// 			// 	});
		// 			// }


		// 			// const replacedFormula = replacePlaceholders(productFormula);

		// 			// // Debug: Output the replaced formula
		// 			// console.log("Replaced Formula:", replacedFormula);
		
		// 			// // Evaluate the formula
		// 			// try {
		// 			// 	// Ensure that the formula is a valid JavaScript expression
		// 			// 	const result = new Function('Math', 'return ' + replacedFormula)(Math);
		// 			// 	// document.getElementById('result').textContent = `Result: ${result}`;
		// 			// } catch (e) {
		// 			// 	// document.getElementById('result').textContent = `Error evaluating formula: ${e.message}`;
		// 			// }
					
					
					
		// 		}
		// 	   })
		// })
		/*
	 	 * Verify if EntityInformation is Passed 
	 	 */
		// if(data && data.Entity)
		// {
		// 	/*
		//  	 * Fetch Information of Record passed in PageLoad
		//  	 * and insert the response into the dom
		//  	 */
		// 	ZOHO.CRM.API.getRecord({Entity:data.Entity,RecordID:data.EntityId})
		// 	.then(function(response)
		// 	{
				
    	// 			document.getElementById("recordInfo").innerHTML = JSON.stringify(response,null,2);
		// 	});	
		// }

		// /*
		//  * Fetch Current User Information from CRM
		//  * and insert the response into the dom
		//  */
		// ZOHO.CRM.CONFIG.getCurrentUser()
		// .then(function(response)
		// {
		// 	document.getElementById("userInfo").innerHTML = JSON.stringify(response,null,2);
		// });
	// 	var conn_name = "mailerattachment";
	// 	var req_data = {
	// 	"url": "https://download.zoho.com/v1/workdrive/download/qvt7ka065d247e6c8401c951f84ed457ec09a",
	// 	"method": "GET",
	// 	"parameters": {},
	// 	"headers": {},  
	// 	"param_type": 1
	// 	};
	
	// // Invoking Zoho CRM connection with the specified request data
	// ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
	//   .then(response => {
	// 	// Check if the response contains the file data directly
	// 	console.log(response);
		
	// 	if (response && response) {
	// 	  const blob = new Blob([response], { type: 'application/pdf' });
	
	// 	  // Create a URL for the Blob object
	// 	  const blobUrl = URL.createObjectURL(blob);
	
	// 	  // Open the PDF in a new tab using the Blob URL
	// 	  const newTab = window.open('', '_blank');
		 
	// 	  // Create an iframe element to embed the PDF in the new tab
	// 	  const iframe = document.createElement('iframe');
	// 	  iframe.src = blobUrl;
	// 	  iframe.style.width = '100vw';  // full width
	// 	  iframe.style.height = '100vh'; // full height
	// 	  iframe.style.border = 'none';  // No border
		 
	// 	  // Append the iframe to the new tab's document body
	// 	  newTab.document.body.appendChild(iframe);
	// 	} else {
	// 	  console.error('No file data returned from Zoho API');
	// 	}
	//   })
		
	})

	/*
	 * initialize the widget.
	 */
	ZOHO.embeddedApp.init();
}


// setTimeout(() => {
// 	const selectElement = document.getElementById('Congregration'); // Replace with your select element ID

// // Get all <option> elements within the <select> element
// const options = selectElement.getElementsByTagName('option');

// // Get the count of <option> elements
// const totalOptionsCount = options.length;

// console.log(`Total options count: ${totalOptionsCount}`);
// }, 30000);

// Create a new instance of FormulaParser
// var parser = new formulaParser.Parser();

// parser.setFunction('GET_DATEDIF', function(args) {
// 	const startDate = new Date(args[0]);
// 	const endDate = new Date(args[1]);
// 	const unit = args[2];
// 	if (isNaN(startDate) || isNaN(endDate)) {
//         throw new Error('Invalid date provided');
//     }
// 	let diffInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
// 	switch (unit) {
//         case 'd':
//             return diffInDays; // Days
//         case 'm':
//             const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
//             return months-1; // Complete months
//         case 'y':
//             return endDate.getFullYear() - startDate.getFullYear(); // Complete years
//         case 'md':
//             return diffInDays - (Math.floor(diffInDays / 30) * 30); // Ignore months and years
//         case 'ym':
//             return (endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear())); // Ignore years
//         case 'yd':
//             return diffInDays - ((endDate.getFullYear() - startDate.getFullYear()) * 365); // Ignore years
//         default:
//             throw new Error('Invalid unit specified for DATEDIF');
//     }
//     // return diffInDays;
//   });
//   parser.setFunction('GET_LETTER', function(params) {
//     var string = params[0];
//     var index = params[1] - 1;
  
//     return string.charAt(index);
//   });
//   parser.setFunction('GET_DAY', (args) => {
//     if (args.length !== 1) {
//         throw new Error('DAY requires exactly 1 argument');
//     }

//     const date = new Date(args[0]);
//     if (isNaN(date)) {
//         throw new Error('Invalid date provided');
//     }

//     return date.getDate(); // Return the day of the month
// });
// parser.setFunction('GET_ADD', (args) => {
//     if (args.length !== 2) {
//         throw new Error('GET_ADD requires exactly 2 arguments');
//     }

//     const date = new Date(args[0]);
//     const daysToAdd = args[1];

//     if (isNaN(date) || isNaN(daysToAdd)) {
//         throw new Error('Invalid arguments provided');
//     }

//     date.setDate(date.getDate() + daysToAdd); // Add days
//     return date.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
// });
// parser.setFunction('GET_SUB', (args) => {
//     if (args.length !== 2) {
//         throw new Error('GET_SUB requires exactly 2 arguments');
//     }

//     const date = new Date(args[0]);
//     const daysToSubtract = args[1];

//     if (isNaN(date) || isNaN(daysToSubtract)) {
//         throw new Error('Invalid arguments provided');
//     }

//     date.setDate(date.getDate() - daysToSubtract); // Subtract days
//     return date.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
// });
// parser.setFunction('GET_COMPARE', (args) => {
//     if (args.length !== 3) {
//         throw new Error('GET_COMPARE requires exactly 3 arguments');
//     }

//     const leftValue = args[0];
//     const rightValue = args[1];
//     const operator = args[2];

//     let result;

//     switch (operator) {
//         case '>':
//             result = leftValue > rightValue;
//             break;
//         case '<':
//             result = leftValue < rightValue;
//             break;
//         case '>=':
//             result = leftValue >= rightValue;
//             break;
//         case '<=':
//             result = leftValue <= rightValue;
//             break;
//         case '!=':
//             result = leftValue != rightValue;
//             break;
//         case '=':
//             result = leftValue == rightValue;
//             break;
//         default:
//             throw new Error('Invalid operator specified');
//     }
// if (result==true) {
// 	return 1;
// } else {
// 	return 0
// }
//     // return result; // Returns true or false
// });


//   var v1=parser.parse('GET_DATEDIF("12/01/2024","12/12/2024","d")'); // returns `10`
// //   var v2=parser.parse('GET_LETTER("Some string", 3)'); // returns `m`
//   console.log(v1);
// //   console.log(v2);
// console.log(parser.parse(`GET_DAY("2024-10-11")`));
// console.log(parser.parse(`GET_SUB("2024-10-11", 5)`));
// console.log(parser.parse(`GET_ADD("2024-10-11", 10)`));
// console.log(parser.parse(`GET_COMPARE("2024-12-12", "2023-11-11","=")`));


// var v2 = parser.parse('GET_DATEDIF(GET_SUB("2024-12-01", 5), "2024-12-12", "d")'); // Evaluates to 6
// console.log(v2); // Outputs: 6
// var K13="2024-04-04";
// var K14="2024-09-01";
// var v3 = parser.parse(`IF(GET_COMPARE("${K13}","2024-12-31",">"),0,IF(GET_COMPARE("${K14}","2024-12-31",">"),(GET_DATEDIF(GET_SUB("${K13}",GET_DAY("${K13}")+1),"2024-12-31","m")+1),(GET_DATEDIF(GET_SUB("${K13}",GET_DAY("${K13}")+1),"${K14}","m")+1)))`); 
// //   console.log(v1);
// console.log(parser.parse(`(GET_DATEDIF(GET_SUB("${K13}",GET_DAY("${K13}")+1),"${K14}","m")+1)`));
//   console.log(v3);
