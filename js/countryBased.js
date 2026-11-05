function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}
 
function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}
var parser = new formulaParser.Parser();
var outputOBJ1 = {};
var inputOBJ={}
var uniqueId=null;
var onchangeObject={
    TypeOne:{
        manageFees:async(formula,inputvalue)=>{
            // console.log(formula);
            let inputValue1 =await evaluateAPIResponse(formula);
            // console.log(inputValue1);
            
            var result = parser.parse(inputValue1);
            // console.log(result);
            
            document.getElementById(inputvalue).value=result.result;
        },
        dependency:async(moduleName,inputvalue)=>{
            let apiResponseFrom=await fetchAPIResponse(moduleName,inputvalue);
        },
        dependency1:async(cantonName,cantonStatus,inputvalue)=>{
            let apiResponseFrom=await fetchAPIResponseSwitz(cantonName,cantonStatus,inputvalue);
        },
        dependency2:async(valueFieds,value,inputvalue,operator)=>{
            console.log(valueFieds);
            
            if (valueFieds=="Solution_List") {
                console.log(value);
                if (value.split(",").includes(document.getElementById(valueFieds).value)) {
                document.getElementById(inputvalue).disabled=true;
                document.getElementById(inputvalue).value="United Kingdom";
                const inputElement = document.getElementById("Exchange_Rate_GBP");
                const secondNearestParentDiv = inputElement.closest('div').parentElement;
                secondNearestParentDiv.style.display="flex";
                
                }else{
                document.getElementById(inputvalue).disabled=false;

                }
            }else{
            // let apiResponseFrom=await fetchAPIResponse(moduleName,inputvalue);
            const selectInputs = document.querySelectorAll('.validationCheck1');

            // Flag to check if any select has the value 'United Kingdom'
            let found = false;
            // console.log(selectInputs);
            // Loop through each select input
            selectInputs.forEach((selectInput) => {
                // console.log(selectInput);
                
                // Check if the value matches 'United Kingdom'
                if (selectInput.value === 'United Kingdom') {
                    found = true;
                }
            });



            // console.log(valueFieds,value,inputvalue,operator,found);
            const inputElement = document.getElementById(inputvalue);
            const secondNearestParentDiv = inputElement.closest('div').parentElement;
            var valueOfLaout= document.getElementById(valueFieds).value;
            const isConditionMet = new Function("a", "b", `return a ${operator} b;`)(valueOfLaout, value);
            // console.log(isConditionMet);
            if(inputvalue=="Exchange_Rate_GBP"){
                if (found==false) {
                    secondNearestParentDiv.style.display = "none";
                } else {
                    secondNearestParentDiv.style.display = "flex";
                }
                
            }
            else if (isConditionMet) {
                secondNearestParentDiv.style.display = "none";
            } else if (valueOfLaout == "No Tax") {
                secondNearestParentDiv.style.display = "none";
                inputElement.value=0;
            }else if (valueOfLaout == "") {
                secondNearestParentDiv.style.display = "none";
            }
             else {
                secondNearestParentDiv.style.display = "flex";
            }
            // if (valueOfLaout==value || valueOfLaout=="No Tax") {
            //     secondNearestParentDiv.style.display="none";
            // }
            // else{
            //     secondNearestParentDiv.style.display="flex";
            // }
        }
        },
        dependency3:async(SelectValue,recordName,inputvalue,Type)=>{
            let apiResponseFrom=await exchangeRateFn(SelectValue,recordName,inputvalue,Type);
        }

    }
}
function resetCalculator(){
    var taxYear=document.getElementById("calculatorTaxYear").value;
    document.getElementById("countryData").value="";
    document.querySelector(".Contact_Infrmation").style.display = "none"; 
    document.getElementById("resultTable").style.display="none" ;
    document.getElementById("dicCalculatorType").style.display="none"  
    document.querySelector(".Question_Infrmation").style.display = "none"; 
    ZOHO.CRM.API.searchRecord({ Entity: "Calc_Configuration", Type: "criteria", Query: "(Tax_Year:equals:" + taxYear + ")" })
			.then(function(res1){
				console.log(res1);
				if (res1.status =="204") {
					// document.querySelector(".Contact_Infrmation").style.display = "none"; 
					// document.getElementById("resultTable").style.display="none" ;
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
async function exchangeRateFn(SelectValue,recordName,inputvalue,Type){
    if(Type=="Picklist"){
var SelectValue=document.getElementById(SelectValue).value;
    }
ZOHO.CRM.API.searchRecord({ Entity: "Daily_Currency_Rate", Type: "criteria", Query: "(Name:equals:" + (recordName.toUpperCase()) + ")" })
.then(function(res){
    // console.log(res);
    if (res.status =="204") {
        // alert("The particular Currency not available in database")
        showPopup('failure', 'The particular Currency not available in database')
    } else {
        var recordRate = res.data[0][SelectValue.toUpperCase()];
        document.getElementById(inputvalue).value=recordRate;
    }
})
}
function typOFcalculatorSelect(Selectdata){

    const payeMessage = document.getElementById("payeLimitMessage");
     payeMessage.style.display = "none";

     const denmarkmessage = document.getElementById("expatRegimeMessage");
     
      
      denmarkmessage.style.display = "none";

    
    var parseValue = Selectdata.value;
    // console.log(parseValue);
    
    var taxYear=document.getElementById("calculatorTaxYear").value;
    var country = document.getElementById("countryData").value;
    if(parseValue==""){
        document.querySelector(".Contact_Infrmation").style.display = "none"; 
        document.getElementById("resultTable").style.display="none" ;
        // document.getElementById("dicCalculatorType").style.display="none" ;
        document.querySelector(".Question_Infrmation").style.display = "none";  
    }else{
        ZOHO.CRM.API.searchRecord({ Entity: "Calculator_Questions", Type: "criteria", Query: "(Name:equals:" + (country) + ")" })
        .then(async function (res) {
            // console.log(res);
            if (res.status =="204") {
                ZOHO.CRM.API.searchRecord({ Entity: "Calc_Configuration", Type: "criteria", Query: "((Country_Name:equals:" + (country) + ")and(Tax_Year:equals:"+taxYear+")and(Type_of_Calculator:equals:"+parseValue+"))" })
                .then(function(res){
                    // console.log(res);
                    
                    if (res.status =="204") {
                        document.querySelector(".Contact_Infrmation").style.display = "none"; 
                        document.getElementById("resultTable").style.display="none" ;
                        document.getElementById("dicCalculatorType").style.display="none" ;
                        document.querySelector(".Question_Infrmation").style.display = "none";  
                        // alert("The particular country not available in database 2")
                        showPopup('failure', 'The particular country not available in database')
                    } else {
                        document.getElementById("resultTable").style.display="none" ;
                        document.querySelector(".Question_Infrmation").style.display = "none"; 
                        document.querySelector(".Contact_Infrmation").style.display = "none"; 
                        // console.log("Calculator Name is 2: "+res.data[0].Name);
                    var recordID = res.data[0].id;
                    document.getElementById("dynamicName").innerText=res.data[0].Country_Name+" - "+res.data[0].Type_of_Calculator;
                    document.getElementById("calculatorName").value=recordID;
                    document.getElementById("calculatorType").value=res.data[0].Type_of_Calculator;
                    calculatorSelect(recordID)
                    // var listOfData = result2.data;
                    
                    
                    
                    }
                });
            }else{
                var supportingClaculators=res.data[0].Type_of_Calculators;
                // console.log(supportingClaculators.includes(parseValue));
                if (supportingClaculators.includes(parseValue)) {
                    document.getElementById("resultTable").style.display="none" ;
                    document.querySelector(".Contact_Infrmation").style.display = "none"; 
                    // console.log("Calculator Name is 4: "+res.data[0].Name);
                var recordData = res.data[0].id;
                ZOHO.CRM.API.getRecord({
                    Entity: "Calculator_Questions", actionType: "approve", RecordID: recordData
                })
                    .then(async function (recordRes) {
                        
                        // console.log(layoutList);
                        if (parseValue=="PSC") {
                            var layoutList=[
                                {
                                "Options": "Local,Others",
                                "Field_Name": "PSC_Type",
                                "Display_Name": "PSC Currency Type",
                                "Field_Type": "Picklist"
                                }
                                ]
                        } else {
                            var layoutList_Old = recordRes.data[0].List_of_Question;
                            var layoutList =[];
                            layoutList_Old.forEach(element => {
                               
                                if (!element.Not_Need.includes(parseValue)) {
                                    console.log(element);
                                    layoutList.push(element);
                                }
                                
                            });
                        }
                        const contactInformationTag = document.getElementById('questionInformation');
                        contactInformationTag.innerHTML=""
                        for (const key in layoutList) {
                            var labelName = layoutList[key].Display_Name;
                            var inptID = layoutList[key].Field_Name;
                            var fieldType = layoutList[key].Field_Type;
                            var picklistValueFrom = layoutList[key].Options;
            
            
            
                            const formGroup = document.createElement('div');
                            formGroup.className = 'row mb-1 g-0';
            
                            // Label
                            const labelCol = document.createElement('div');
                            labelCol.className = 'col-sm-5';
                            const label = document.createElement('label');
                            label.className = 'custLabel';
                            label.innerText = labelName;
                            labelCol.appendChild(label);
            
                            // Input/Select
                            const inputCol = document.createElement('div');
                            inputCol.className = 'col-sm-5';
                            // console.log(fieldType);
                            
                            if (fieldType === 'Picklist') {
                                const select = document.createElement('select');
                                select.className = 'form-select form-select-sm custInput dynamicInputForQuestionStyle dynamicInputForQuestion';
                                select.id = inptID;
                                // Determine the initial option based on whether "None" is in the picklistValueFrom
                                let initialOption = document.createElement('option');
                                let isNonePresent = picklistValueFrom && picklistValueFrom.includes('None');
                                
                               
                                
                                select.appendChild(initialOption);
                            
                                // Generate options for select, skipping "None" if it was already added as the initial option
                                if (picklistValueFrom) {
                                    if (isNonePresent) {
                                        initialOption.value = 'None';
                                        initialOption.text = '-None-';
                                    } else {
                                        initialOption.value = '';
                                        initialOption.text = '-Select-';
                                    }
                                    picklistValueFrom.split(',').forEach(optionValue => {
                                        if (!(isNonePresent && optionValue === 'None')) { // Skip "None" if it's already the initial value
                                            const option = document.createElement('option');
                                            option.value = optionValue;
                                            option.text = optionValue;
                                            select.appendChild(option);
                                        }
                                    });
                                }
                            
                                inputCol.appendChild(select);
                            }
                             else{
                                const input = document.createElement('input');
                                input.type = 'text';
                                input.className = 'form-control custInput dynamicInputForQuestionStyle dynamicInputForQuestion';
                                input.id = inptID;
                                input.placeholder = `Enter ${labelName.toLowerCase()}`;
                                inputCol.appendChild(input);
                            }
            
                            formGroup.appendChild(labelCol);
                            formGroup.appendChild(inputCol);
                            contactInformationTag.appendChild(formGroup);
                        }
                    document.querySelector(".Question_Infrmation").style.display = "block";   
                    });
                    
                } else {
                    ZOHO.CRM.API.searchRecord({ Entity: "Calc_Configuration", Type: "criteria", Query: "((Country_Name:equals:" + (country) + ")and(Tax_Year:equals:"+taxYear+")and(Type_of_Calculator:equals:"+parseValue+"))" })
                .then(function(res){
                    // console.log(res);
                    
                    if (res.status =="204") {
                        document.querySelector(".Contact_Infrmation").style.display = "none"; 
                        document.getElementById("resultTable").style.display="none" ;
                        document.getElementById("dicCalculatorType").style.display="none" ;
                        document.querySelector(".Question_Infrmation").style.display = "none";  
                        // alert("The particular country not available in database 2")
                        showPopup('failure', 'The particular country not available in database')
                    } else {
                        document.getElementById("resultTable").style.display="none" ;
                        document.querySelector(".Question_Infrmation").style.display = "none"; 
                        document.querySelector(".Contact_Infrmation").style.display = "none"; 
                        // console.log("Calculator Name is 2: "+res.data[0].Name);
                    var recordID = res.data[0].id;
                    document.getElementById("dynamicName").innerText=res.data[0].Country_Name+" - "+res.data[0].Type_of_Calculator;
                    document.getElementById("calculatorName").value=recordID;
                    document.getElementById("calculatorType").value=res.data[0].Type_of_Calculator;
                    calculatorSelect(recordID)
                    // var listOfData = result2.data;
                    
                    
                    
                    }
                });
                }
            }
        
        
        })
    }

}
function matchTheDetails(checkData){

     const payeMessage = document.getElementById("payeLimitMessage");
     payeMessage.style.display = "none";
        const denmarkmessage = document.getElementById("expatRegimeMessage");
     denmarkmessage.style.display = "none";
   
    // if (checkData.checked ==true) {
        const inputs = document.querySelectorAll(".dynamicInputForQuestionStyle");
        let allFilled = true; // Flag to check if all inputs are filled
        
        // Loop through each input and check if it is empty
        inputs.forEach(input => {
            if (input.value === "") {
                // Add red border if the input is empty
                // checkData.checked=false;
                setTimeout(() => {
                    input.style.border = "1px solid #ced4da";
                }, 2000);
                input.style.border = "2px solid red";
                allFilled = false; // If any input is empty, set the flag to false
            } else {
                // Remove the red border if the input is not empty
                input.style.border = ""; // Reset the border style
            }
        });
        if (allFilled) {
    const inputsType = document.getElementsByClassName('dynamicInputForQuestion');
    var country=document.getElementById("countryData").value;
    var taxYear=document.getElementById("calculatorTaxYear").value;
    var typeOfCalculator=document.getElementById("typeOfCalculator").value;
    var searchParam="((Country_Name:equals:" + (country) + ")and(Tax_Year:equals:"+taxYear+")and(Type_of_Calculator:equals:"+typeOfCalculator+")";
    for (let index in inputsType) {
        if (inputsType.hasOwnProperty(index)) {  // Ensure it's a valid property
            let fieldId = inputsType[index].id;       // Get the ID of the field
            let fieldValue = inputsType[index].value; // Get the value of the field
            searchParam  += `and(${fieldId}:equals:${fieldValue})`
        }
    }
    searchParam +=")";
    // console.log(searchParam);
    ZOHO.CRM.API.searchRecord({ Entity: "Calc_Configuration", Type: "criteria", Query: searchParam })
    .then(function(res){
        // console.log(res);
        
        if (res.status =="204") {
            document.querySelector(".Contact_Infrmation").style.display = "none"; 
            document.getElementById("resultTable").style.display="none" ;
            // document.getElementById("dicCalculatorType").style.display="none"  
            // alert("The particular type of calculator not available in database")
            showPopup('failure', 'The particular type of calculator not available in database')
        } else {
            document.getElementById("resultTable").style.display="none" ;
            // document.querySelector(".Question_Infrmation").style.display = "none"; 
            // document.querySelector(".Contact_Infrmation").style.display = "none"; 
            // console.log("Calculator Name is : "+res.data[0].Name);
        var recordID = res.data[0].id;
        document.getElementById("dynamicName").innerText=res.data[0].Country_Name+" - "+res.data[0].Type_of_Calculator;
        document.getElementById("calculatorName").value=recordID;
        document.getElementById("calculatorType").value=res.data[0].Type_of_Calculator;
         calculatorSelect(recordID)
        // var listOfData = result2.data;
        
        
        
        }
    });
}
// }
// else{
        
//     document.querySelector(".Contact_Infrmation").style.display = "none";
//     const resultTable = document.getElementById('resultTable');
//     resultTable.style.display='none';
//     // const canvasDiv = document.createElement('myChart');
//     // canvasDiv.innerHTML='';

// }
    
}


async function countryBasedAction(Selectdata) {

     const denmarkmessage = document.getElementById("expatRegimeMessage");
if (denmarkmessage) denmarkmessage.style.display = "none";
    
    var input = document.getElementById("calculatorTaxYear");
    var taxYear=document.getElementById("calculatorTaxYear").value;
    if (taxYear=="") {
        setTimeout(() => {
            input.style.border = "1px solid #ced4da";
        }, 2000);
        input.style.border = "2px solid red"
        document.getElementById("countryData").value="";
    }else{
    var country = Selectdata.value;
    // workDrive(country)
    
        ZOHO.CRM.API.searchRecord({ Entity: "Calc_Configuration", Type: "criteria", Query: "((Country_Name:equals:" + (country) + ")and(Tax_Year:equals:"+taxYear+"))" })
            .then(async function (res) {
                // console.log(res);
                
                if (res.status =="204") {
                    document.querySelector(".Contact_Infrmation").style.display = "none"; 
                    document.getElementById("resultTable").style.display="none" ;
                    document.getElementById("dicCalculatorType").style.display="none"  
                    // alert("The particular country not available in database")
                    showPopup('failure', 'The particular country not available in database')
                } else {
                    
                var recordData = res.data;
                // var listOfData = result2.data;
                var optionsAsString = "";
                var checkData=[];
                optionsAsString += "<option value=''>--Select--</option>";
                for (const key in recordData) {
                    // var recordID = recordData[key].id;
                    var recordName = recordData[key].Type_of_Calculator;
                    if (!checkData.includes(recordName)) {
                    checkData.push(recordName);
                        optionsAsString += "<option value='" + recordName + "'>" + recordName + "</option>";	
                    }
                }
                document.querySelector(".Contact_Infrmation").style.display = "none"; 
                document.querySelector(".Question_Infrmation").style.display = "none"; 
                document.getElementById("resultTable").style.display="none" ;
                document.getElementById("dicCalculatorType").style.display="flex" 
                document.getElementById("typeOfCalculator").innerHTML="";
                document.getElementById("typeOfCalculator").innerHTML = optionsAsString;
                
                
                }
            });
        }
    
}
async function calculatorSelect(recordID){
    // var recordID = Selectdata.value;
    ZOHO.CRM.API.getRecord({
        Entity: "Calc_Configuration", actionType: "approve", RecordID: recordID
    })
        .then(async function (recordRes) {
            console.log(recordRes);

            var typeofcalculater =  recordRes.data[0].Type_of_Calculator;
            
            var layoutList = recordRes.data[0].List_of_Fields;
            console.log(layoutList);
            
            const contactInformationTag = document.getElementById('contactInformation');
            contactInformationTag.innerHTML=""
            for (const key in layoutList) {
                var labelName = layoutList[key].Display_Name;
                var inptID = layoutList[key].Field_Name;
                var fieldType = layoutList[key].Fields_Type;
                var picklistValueFrom = layoutList[key].Pick_List_Values;
                var inputFormula = layoutList[key].Formula;
                var staticFieldValue = layoutList[key].Value;
                var maxLimit = layoutList[key].Limit;
                // console.log(maxLimit);
                

                if (picklistValueFrom == null && inputFormula==null) {
                    var picklistLookup = layoutList[key].Lookup_Module;
                    if (picklistLookup != null) {
                        // Wait for the lookup data to be fetched
                        picklistValueFrom = await lookcupDataFromCRM(picklistLookup,inptID);
                        // console.log(picklistValueFrom);
                        
                    }
                }

                const formGroup = document.createElement('div');
                if(layoutList[key].Display=="Hide" ){
                    formGroup.style.display="none";

                }
                formGroup.className = 'row mb-1 g-0';

                // Label
                const labelCol = document.createElement('div');
                labelCol.className = 'col-sm-5';
                const label = document.createElement('label');
                label.className = 'custLabel';
                label.innerText = labelName;
                labelCol.appendChild(label);

                // Input/Select
                const inputCol = document.createElement('div');
                inputCol.className = 'col-sm-5';

if (
    fieldType == 'Single Line' &&
    staticFieldValue == 'warning' &&
    (typeofcalculater == 'EOR' || typeofcalculater == 'Employed')
) {

    const country = document.getElementById('countryData').value;

    if (country.trim() === 'Netherlands') {

        const previousFormGroup = contactInformationTag.lastElementChild;

        if (previousFormGroup) {

            const previousInputCol =
                previousFormGroup.querySelector('.col-sm-5:last-child');

            if (previousInputCol) {

                // ==============================
                // Warning Wrapper
                // ==============================

                const warningWrapper = document.createElement('span');

                warningWrapper.style.position = 'absolute';
                warningWrapper.style.right = '-30px';
                warningWrapper.style.top = '50%';
                warningWrapper.style.transform = 'translateY(-50%)';
                warningWrapper.style.display = 'inline-flex';
                warningWrapper.style.alignItems = 'center';
                warningWrapper.style.cursor = 'help';
                warningWrapper.style.zIndex = '1000';

                // ==============================
                // Warning Icon
                // ==============================

                const warningIcon = document.createElement('span');

                warningIcon.innerHTML = '⚠️';
                warningIcon.style.fontSize = '14px';

                // ==============================
                // Tooltip Message
                // ==============================

                const warningMessage = document.createElement('span');

                warningMessage.innerText =
                    'Please note that a contractor can work a maximum of 173.33 hours per month.';

                warningMessage.style.position = 'absolute';

                // Tooltip appears LEFT of icon
                warningMessage.style.right = '25px';
                warningMessage.style.left = 'auto';

                warningMessage.style.top = '50%';
                warningMessage.style.transform = 'translateY(-50%)';

                warningMessage.style.display = 'none';
                warningMessage.style.backgroundColor = '#fff3cd';
                warningMessage.style.color = '#856404';
                warningMessage.style.border = '1px solid #ffeeba';
                warningMessage.style.padding = '6px 10px';
                warningMessage.style.borderRadius = '4px';
                warningMessage.style.fontSize = '12px';
                warningMessage.style.width = '280px';
                warningMessage.style.boxSizing = 'border-box';
                warningMessage.style.whiteSpace = 'normal';
                warningMessage.style.boxShadow =
                    '0 2px 6px rgba(0,0,0,0.2)';
                warningMessage.style.zIndex = '9999';

                // ==============================
                // Add icon + message
                // ==============================

                warningWrapper.appendChild(warningIcon);
                warningWrapper.appendChild(warningMessage);

                // ==============================
                // Hover Show
                // ==============================

                warningWrapper.addEventListener('mouseenter', function () {
                    warningMessage.style.display = 'block';
                });

                // ==============================
                // Hover Hide
                // ==============================

                warningWrapper.addEventListener('mouseleave', function () {
                    warningMessage.style.display = 'none';
                });

                // ==============================
                // Find Previous Input
                // ==============================

                const previousInput =
                    previousInputCol.querySelector('input');

                if (previousInput) {

                    // Remove input from current position
                    previousInput.remove();

                    // ==============================
                    // Keep input SAME width
                    // ==============================

                    previousInput.style.width = '100%';
                    previousInput.style.display = 'block';
                    previousInput.style.boxSizing = 'border-box';

                    // Remove any flex shrinking
                    previousInput.style.flex = 'none';

                    // ==============================
                    // Make input column relative
                    // ==============================

                    previousInputCol.style.position = 'relative';

                    // ==============================
                    // Add input back
                    // ==============================

                    previousInputCol.appendChild(previousInput);

                    // ==============================
                    // Add warning icon beside input
                    // ==============================

                    previousInputCol.appendChild(warningWrapper);
                }
            }
        }
    }

    // IMPORTANT:
    // Do not create a new input/row for the warning field
    continue;
}
                // if (fieldType === 'Pick List') {
                //     const select = document.createElement('select');
                //     select.className = 'form-select form-select-sm custInput';
                //     select.id = inptID;
                //     const defaultOption = document.createElement('option');
                //     defaultOption.value = 'None';
                //     defaultOption.text = '-None-';
                //     select.appendChild(defaultOption);

                //     // Generate options for select
                //     if (picklistValueFrom) {
                //         picklistValueFrom.split(',').forEach(optionValue => {
                //             const option = document.createElement('option');
                //             option.value = optionValue;
                //             option.text = optionValue;
                //             select.appendChild(option);
                //         });
                //     }

                //     inputCol.appendChild(select);
                // }
                // console.log(inputFormula);
                
                if (fieldType === 'Pick List') {
                    const select = document.createElement('select');
                    select.className = 'form-select form-select-sm custInput dynamicInput validationCheck1';
                    select.id = inptID;

                 // 1. Tax Table Listener (Controls #Percentage)
if (inptID === "Select_the_Tax_Table") {
    select.addEventListener("change", function () {
        console.log("Tax Table selected:", this.value);
        handleTaxTableChange(this.value);
    });
}

// 2. Municipality Listener (Controls #Municipality_Percentage)
if (inptID === 'Municipality_Name') {

    select.addEventListener("change", async function () {

      

        const selectedMunicipality = this.value;
        console.log(selectedMunicipality);
        
        if (!selectedMunicipality) return;

        try {
            const res = await ZOHO.CRM.API.searchRecord({
                Entity: "Municipality_List",
                Type: "criteria",
                Query: "(Name:equals:" + selectedMunicipality + ")"
            });
            console.log(res);
            

            if (res.status !== "204" && res.data && res.data.length > 0) {
                const percentageValue = res.data[0].Percentage;
                const percentageInput = document.getElementById("Municipality_Percentage");
                if (percentageInput) {
                    percentageInput.value = percentageValue;
                    console.log("Updated Municipality_Percentage to:", percentageValue);
                }
            }
        } catch (error) {
            console.error("Error fetching Municipality_Percentage:", error);
        }
    });
}




                    // if (staticFieldValue!="" || staticFieldValue !=null) {

                    //     select.value=staticFieldValue;
                    // }
                    if (layoutList[key].Display=="Disable") {
                        select.disabled=true;
                    }else if(layoutList[key].Display=="Enable"){
                        select.disabled=false;
                    }
                    // else if(layoutList[key].Display=="None"){
                    //     select.style.display="none";

                    // }
                    if (inputFormula != null) {
                        for (let inputFormula_1 of inputFormula.split("||")) {
                            const squareBracketsRegex = /\[([^\]]+)\]/g;
                    
                            // Check and clean square brackets
                            if (squareBracketsRegex.test(inputFormula_1)) {
                                inputFormula_1 = inputFormula_1.replace("[", "").replace("]", "");
                               if (inputFormula_1.includes("&&&")) {                                
                                let arrayValue = inputFormula_1.split("&&&");
                                // console.log(arrayValue[0]);
                                // var selectValueFromHTML=document.getElementById(arrayValue[0].replace("{", "").replace("}", "")).value;
                                    select.addEventListener("change", function () {
                                        const onchangeHandler = onchangeObject["TypeOne"].dependency3;
                                        onchangeHandler(
                                            arrayValue[0].replace("{", "").replace("}", ""),
                                            arrayValue[1].replace("{", "").replace("}", ""),
                                            arrayValue[2].replace("{", "").replace("}", ""),
                                            "Picklist"
                                        );
                                    });
                               }else if (inputFormula_1.includes("&&")) {
                                    // console.log("||| Formula");
                                    let arrayValue = inputFormula_1.split("&&");
                                    select.addEventListener("change", function () {
                                        const onchangeHandler = onchangeObject["TypeOne"].dependency2;
                                        onchangeHandler(
                                            arrayValue[0].replace("{", "").replace("}", ""),
                                            arrayValue[1].replace("{", "").replace("}", ""),
                                            arrayValue[2].replace("{", "").replace("}", ""),
                                            arrayValue[3].replace("{", "").replace("}", "")
                                        );
                                    });

                                } else {
                                    // console.log("||| Formula");
                                let arrayValue = inputFormula_1.split("|");
                    
                                if (arrayValue.length == 2) {
                                    // Add onchange handler for two-element formulas
                                    select.addEventListener("change", function () {
                                        const onchangeHandler = onchangeObject["TypeOne"].dependency;
                                        onchangeHandler(
                                            arrayValue[0].replace("{", "").replace("}", ""),
                                            arrayValue[1].replace("{", "").replace("}", "")
                                        );
                                    });
                                } else {
                                    // Add onchange handler for three-element formulas
                                    select.addEventListener("change", function () {
                                        const onchangeHandler = onchangeObject["TypeOne"].dependency1;
                                        onchangeHandler(
                                            arrayValue[0].replace("{", "").replace("}", ""),
                                            arrayValue[1].replace("{", "").replace("}", ""),
                                            arrayValue[2].replace("{", "").replace("}", "")
                                        );
                                    });
                                }
                            }
                            } else {
                                let arrayValue = inputFormula_1.split("|");
                    
                                // Add onchange handler for general formulas
                                select.addEventListener("change", function () {
                                    const onchangeHandler = onchangeObject["TypeOne"].manageFees;
                                    onchangeHandler(
                                        arrayValue[0],
                                        arrayValue[1].replace("{", "").replace("}", "")
                                    );
                                });
                            }
                        }
                    }
                    
                    // Determine the initial option based on whether "None" is in the picklistValueFrom
                    let initialOption = document.createElement('option');
                    let isNonePresent = picklistValueFrom && picklistValueFrom.includes('None');
                    
                   
                    
                    select.appendChild(initialOption);
                
                    // Generate options for select, skipping "None" if it was already added as the initial option
                    if (picklistValueFrom) {
                        if (isNonePresent) {
                            initialOption.value = 'None';
                            initialOption.text = '-None-';
                        } else {
                            initialOption.value = '';
                            initialOption.text = '-Select-';
                        }
                        picklistValueFrom.split(',').forEach(optionValue => {
                            if (!(isNonePresent && optionValue === 'None')) { // Skip "None" if it's already the initial value
                                const option = document.createElement('option');
                                option.value = optionValue;
                                option.text = optionValue;
                                if (String(optionValue).trim() === String(staticFieldValue).trim()) {
                                    option.selected = true;
                                }
                                select.appendChild(option);
                            }
                        });
                    }
                
                    inputCol.appendChild(select);
                }
                
                 else if (fieldType == 'Decimal' ||fieldType == 'Number') {
                    
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.value=0;
                    input.className = 'form-control form-control-sm custInput dynamicInput';
                    input.id = inptID;
                    if (staticFieldValue!="" || staticFieldValue !=null) {

                        input.value=staticFieldValue;
                    }
                    // Set max value if maxLimit is provided
                    if (maxLimit !== "" && maxLimit !== null) {
                        input.max = Number(maxLimit);
                    }

                    // Add an event listener to restrict input to the max value
                    input.addEventListener('input', function () {
                        const maxValue = parseInt(input.max);
                        let currentValue = parseFloat(input.value);

                        // If the current value exceeds the max, set it to the max
                        if (currentValue > maxValue) {
                            input.value = maxValue;
                        }
                    });
                    if (layoutList[key].Display=="Disable") {
                        input.disabled=true;
                    }else if(layoutList[key].Display=="Enable"){
                        input.disabled=false;
                    }else{
                        input.disabled=false;
                    }

                    if (inputFormula!=null) {
                        for(let inputFormula_1 of inputFormula.split("||")){
                            if (inputFormula_1.includes("&&&")) {
                                let arrayValue = inputFormula_1.replace("(", "").replace(")", "").split("&&&");
                                    // input.addEventListener("load", function () {
                                        const onchangeHandler = onchangeObject["TypeOne"].dependency3;
                                        onchangeHandler(
                                            arrayValue[0].replace("{", "").replace("}", ""),
                                            arrayValue[1].replace("{", "").replace("}", ""),
                                            arrayValue[2].replace("{", "").replace("}", ""),
                                            "Number"
                                        );
                                    // });
                               }else{
                        let arrayValue=inputFormula_1.split("|");
                        // console.log(inputFormula_1);
                        input.addEventListener('change', function () {
                            const country = document.getElementById('countryData').value;
                            const onchangeHandler = onchangeObject["TypeOne"].manageFees;
                            onchangeHandler(arrayValue[0], arrayValue[1].replace("{", "").replace("}", ""));
                        });
                    }
                    }
                     }
                    input.placeholder = `Enter ${labelName.toLowerCase()}`;
                    inputCol.appendChild(input);
                }

                 else{
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'form-control custInput dynamicInput';
                    input.id = inptID;
                    if (staticFieldValue!="" || staticFieldValue !=null) {

                        input.value=staticFieldValue;
                    }
                    if (layoutList[key].Display=="Disable") {
                        input.disabled=true;
                    }else if(layoutList[key].Display=="Enable"){
                        input.disabled=false;
                    }else{
                        input.disabled=false;
                    }
                    input.placeholder = `Enter ${labelName.toLowerCase()}`;
                    inputCol.appendChild(input);
                }

                formGroup.appendChild(labelCol);
                formGroup.appendChild(inputCol);
                contactInformationTag.appendChild(formGroup);
            }
        document.querySelector(".Contact_Infrmation").style.display = "block";   
        
// let APIResponse = "{Daily_Contract_Rate}*{Days_Worked_per_Month}";
        // let evaluatedResponse = evaluateAPIResponse(APIResponse);
        // var parser = new formulaParser.Parser();
        // console.log(parser.parse(evaluatedResponse));
        // console.log("Final Evaluated Value:", evaluatedResponse);
        });

        
}

async function handleTaxTableChange(selectedTaxTable) {
    console.log("Selected Tax Table:", selectedTaxTable);

    const percentageField = document.getElementById("Percentage");

    if (!percentageField) {
        console.error("Percentage field element (#Percentage) not found in DOM");
        return;
    }

    // ALWAYS FORCE THE PERCENTAGE FIELD TO STAY VISIBLE (NEVER HIDE IT)
    const percentageRow = percentageField.closest('.row') || percentageField.parentElement.parentElement;
    if (percentageRow) {
        percentageRow.style.display = "flex";
    }

    const cleanValue = selectedTaxTable ? selectedTaxTable.trim() : "";
   

    // 1. Table 7150 / 8000 / 8050 / 8340 -> Show field, set value to "Skip it" & disable
    if (
        cleanValue === "Table 7150" ||
        cleanValue === "Table 8000" ||
        cleanValue === "Table 8050" ||
        cleanValue === "Table 8340" ||
        cleanValue.toLowerCase().includes("table")
    ) {
        percentageField.value = "Skip it";
        percentageField.disabled = true;
         percentageRow.style.display = "none";
        
        console.log("Set Percentage field to 'Skip it' (Visible) for:", cleanValue);
        return;
    }

    // 2. Custom percentage -> Clear field and enable manual entry
    if (
        cleanValue === "Tax percentage(Percentage known)" ||
        cleanValue === "Tax percentage (Percentage known)"
    ) {
        percentageField.value = "";
        percentageField.disabled = false;
        
        percentageField.focus();
         
        console.log("User must enter percentage");
        return;
    }

    // 3. PAYE options -> Fetch value from Admin_Input_Tax subform
    if (
        cleanValue === "First Job in Norway (PAYE including social security)" ||
        cleanValue === "First Job in Norway (PAYE excluding social security)"



    ) {
         // Immediately update UI
    percentageField.value = "Loading...";
    percentageField.disabled = true;
       
        try {
            const recordID = document.getElementById("calculatorName").value;
            console.log("Searching Admin_Input_Tax for Calculator Lookup ID:", recordID);

            // Step 1: Search Admin_Input_Tax by Calculator_Name to get Record ID
            const searchResponse = await ZOHO.CRM.API.searchRecord({
                Entity: "Admin_Input_Tax",
                Type: "criteria",
                Query: "(Calculator_Name:equals:" + recordID + ")"
            });

            if (searchResponse.status === "204" || !searchResponse.data || searchResponse.data.length === 0) {
                console.error("No Admin_Input_Tax record found for Calculator ID:", recordID);
                percentageField.value = "";
                percentageField.disabled = true;
                return;
            }

            const adminTaxRecordID = searchResponse.data[0].id;

            // Step 2: Fetch full record WITH subform (Admin_Inputs)
            const fullRecordResponse = await ZOHO.CRM.API.getRecord({
                Entity: "Admin_Input_Tax",
                RecordID: adminTaxRecordID
            });

            if (!fullRecordResponse || !fullRecordResponse.data || fullRecordResponse.data.length === 0) {
                console.error("Failed to fetch full record details for ID:", adminTaxRecordID);
                percentageField.value = "";
                percentageField.disabled = true;
                return;
            }

            const subformRows = fullRecordResponse.data[0].Admin_Inputs;

            if (!subformRows || subformRows.length === 0) {
                console.error("Subform Admin_Inputs is empty");
                percentageField.value = "";
                percentageField.disabled = true;
                return;
            }

            // Step 3: Match row using Name1 or Variable
            const matchedRow = subformRows.find(row => {
                const rowName1 = row.Name1 ? row.Name1.trim() : "";
                const rowVar = row.Variable ? row.Variable.trim() : "";

                return (
                    rowName1 === cleanValue ||
                    rowVar === cleanValue ||
                    (cleanValue.includes("including") && rowVar === "PAYE_including_social_security") ||
                    (cleanValue.includes("excluding") && rowVar === "PAYE_excluding_social_security")
                );
            });

            if (matchedRow) {
                console.log("Matched Subform Row:", matchedRow);
                
                // Read Tax_Rate (25 or 17.1)
                const rateValue = (matchedRow.Tax_Rate !== undefined && matchedRow.Tax_Rate !== null)
                    ? matchedRow.Tax_Rate
                    : (matchedRow.New_Value || matchedRow.Old_Value || "");

                percentageField.value = rateValue; // Populates 25 or 17.1
                percentageField.disabled = true;
                console.log("Successfully set Percentage field value to:", rateValue);
            } else {
                console.error("No subform row found matching:", cleanValue);
                percentageField.value = "";
                percentageField.disabled = true;
            }

        } catch (error) {
            console.error("Error fetching Admin_Input_Tax subform:", error);
            percentageField.value = "";
            percentageField.disabled = true;
        }
    }else{
        
    }
}


async function lookcupDataFromCRM(picklistLookup,inptID) {
    try {
        var conn_name = "calcprodexternal";
        var req_data = {
            "parameters": {},
            "headers": {},
            "method": "GET",
            "url": "https://www.zohoapis.com/crm/v6/Sweden_Church_Tax/actions/count",
            "param_type": 1
        };

        // Use await here for the connection invocation if needed
        const connectionData = await ZOHO.CRM.CONNECTION.invoke(conn_name, req_data);
        // console.log(connectionData);

        const totalRecords = connectionData.details.statusMessage.count;
        const pageSize = 200; // Number of records per page
        let allRecords = [];
        let numberOfPages = Math.ceil(totalRecords / pageSize);

        // For loop to handle pagination
        for (let currentPage = 1; currentPage <= numberOfPages; currentPage++) {
            // console.log(currentPage);
            const resAllData = await ZOHO.CRM.API.getAllRecords({
                Entity: picklistLookup,
                sort_order: "asc",
                per_page: pageSize,
                page: currentPage
            });
            const responseData = resAllData.data;
            
// console.log(responseData);

            if (responseData && responseData.length > 0) {
                allRecords = allRecords.concat(responseData);
            } else {
                break; // Exit loop if no more data is available
            }
        }

        // Remove duplicates and get unique names
        // console.log(allRecords);
        var checkKeyINRecord=allRecords.length > 0 && allRecords[0].hasOwnProperty(inptID);
        if (!checkKeyINRecord) {
         inptIDData="Name";   
        }else{
            inptIDData=inptID;
        }
        // const uniqueNames = [...new Set(allRecords.map(field => field[inptIDData]))];
        // console.log(uniqueNames.join(','));
        const uniqueNames = [...new Set(
            allRecords
                .map(field => field[inptIDData])
                // .filter(name => name !== 'None') // Remove 'None' values
        )];

        return uniqueNames.join(','); // Return concatenated unique names as a string
    } catch (error) {
        console.error('Error fetching lookup data:', error);
        return ''; // Handle error by returning an empty string
    }
}


function calculateProcess(checkData){
    // if (checkData.checked ==true) {

        const inputs = document.querySelectorAll(".dynamicInput");
        let allFilled = true; // Flag to check if all inputs are filled
        var inputTableBodyOutput=document.getElementById('inputDataTable');
        // Loop through each input and check if it is empty
        inputOBJ={};
        inputs.forEach(input => {
            if (input.value === "") {
                // Add red border if the input is empty
                // checkData.checked=false;
                setTimeout(() => {
                    input.style.border = "1px solid #ced4da";
                }, 2000);
                input.style.border = "2px solid red";
                allFilled = false; // If any input is empty, set the flag to false
            } else {
                // Remove the red border if the input is not empty
                input.style.border = ""; // Reset the border style
                const label = input.closest('.row').querySelector('label');
                const labelName = label ? label.innerText : ''; 
                var tableRow=document.createElement("tr");
                tableRow.style.textAlign="left";
                var tableHead=document.createElement("th");
                tableHead.scope="row";
                // tableRow.style.textAlign="left";
                tableHead.textContent=labelName;
                const parentRow = input.closest('.row'); // Find the closest parent with class "row"
    
                if (parentRow && window.getComputedStyle(parentRow).display === "none") {
                    // console.log("Parent row is hidden:", parentRow);
                } else {
                    inputOBJ[labelName]=input.value;
                    // console.log("Parent row is visible:", parentRow);
                }
                // inputOBJ[labelName]=input.value;
                tableRow.appendChild(tableHead);
                var tableData=document.createElement("td");
                tableData.textContent=input.value;
                // tableData.style.width="45%"
                // tableData.style.textAlign="center"
                tableRow.appendChild(tableData);
            }
            inputTableBodyOutput.appendChild(tableRow);
            console.log(inputTableBodyOutput);
            
        });
        if (allFilled) {
            
        
        sessionStorage.clear();
        showSpinner()
// alert("hi")
        var recordID=document.getElementById("calculatorName");
        // var countryName = recordID.options[recordID.selectedIndex].text;
        // console.log(countryName);
        
        // ZOHO.CRM.API.searchRecord({Entity:"Calc_Configuration",Type:"criteria",Query:"(Name:equals:"+country+")"})
		// .then(function(res){
			// console.log(res)
            // var recordID=res.data[0].id;
			ZOHO.CRM.API.getRecord({
				Entity: "Calc_Configuration", actionType: "approve", RecordID:recordID.value
			   })
			   .then(function(recordRes){
				//    console.log(recordRes)
                ZOHO.CRM.API.getRelatedRecords({Entity:"Calc_Configuration",RecordID:recordID.value,RelatedList:"Calculator_Name1",page:1,per_page:200})
                .then(function(res2){
                    // console.log(res2);
                    
                    var recordID2=res2.data[0].id;
			ZOHO.CRM.API.getRecord({
				Entity: "Admin_Input_Tax", actionType: "approve", RecordID:recordID2
			   }).then(function(recordRes2){
                // console.log(recordRes2);
                
				var formulaSubData=recordRes.data[0].Solutions_List;
                console.log(formulaSubData);
                
                var pieChartField=recordRes.data[0].Pie_Chart;
                // console.log(formulaSubData);
                var taxData=recordRes2.data[0].Admin_Inputs;
                console.log(recordRes2);
                
                generateTables(formulaSubData,taxData);
                // pieChartCalculate(formulaSubData,pieChartField,taxData)
               })
            })
                })
                
		// })
    }
        
    // }else{
        
    //     const tablesContainer = document.getElementById('tables-container');
    //     tablesContainer.innerHTML = '';
    //     const resultTable = document.getElementById('resultTable');
    //     resultTable.style.display='none';
    //     // const canvasDiv = document.createElement('myChart');
    //     // canvasDiv.innerHTML='';

    // }
}



async function generateTables(data,taxData) {
    console.log("New 11",data);
    
    // const parser = new formulaParser.Parser();
    const tablesContainer = document.getElementById('tables-container');
    tablesContainer.innerHTML = '';
    const tables = {};
    const outputOBJ = {};
        const rawValues = {}; // ADD HERE

    // Group data by Table_No
    for (const item of data) {
        const tableNo = item.Table_No;
        var isFormula=item.Type;
        let isGoalSeekTarget = item.Row;
        if ((isFormula=="Formula" || isFormula=="Target" || isFormula=="Template")&& (isGoalSeekTarget!="Goal_Seek_Target")) {
        // console.log("Issue variable",item.Variable);
        
        if (!tables[tableNo]) {
            tables[tableNo] = {
                heading: item.Table_Heading,
                rows: {},
                columns: new Set() // Track columns specific to this table
            };
        }
        if (!tables[tableNo].rows[item.Row]) {
            tables[tableNo].rows[item.Row] = {};
        }

        // Table for attachement#####################################
        if (!outputOBJ[tableNo]) {
            outputOBJ[tableNo] = {
                heading: item.Table_Heading,
                rows: {},
                columns: new Set() // Track columns specific to this table
            };
        }
        if (!outputOBJ[tableNo].rows[item.Row]) {
            outputOBJ[tableNo].rows[item.Row] = {};
        }
        // #############################################################

        // Evaluate the formula and store the result replaceVariables(variableFormula, apiResponse)
        const evaluatedFormula = await replaceVariables(item.Formula,data,taxData);
        console.log("New 12",evaluatedFormula);
        
        const productFormula = parser.parse(evaluatedFormula);
        console.log("New 13",productFormula);
        // console.log(isNaN(productFormula));
        // CAPTURE RAW VALUE HERE
rawValues[item.Variable] = Number(productFormula.result);
        var finalResult;
        // console.log(productFormula);       
        var finalResult=(Number(productFormula.result)).toFixed(2);
        // console.log(finalResult);
        // var valueFinal;
        if (isNaN(finalResult)) {
            // console.log(isNaN(finalResult));
            
            finalResult=`${productFormula.result}`;
        }else{
            finalResult=euroFormatter(finalResult)
        }
        let columnValue = item.Column;
        var columnValue1 = columnValue.replace(/{(.*?)}/g, (match, id) => {
            // Replace placeholder with the actual input value
            const inputValue = getInputValueById1(id);
            return inputValue !== undefined ? inputValue : match; // Keep the placeholder if not found
        });
        tables[tableNo].rows[item.Row][columnValue1] =finalResult;

        // Keep track of columns specific to this table
        tables[tableNo].columns.add(columnValue1);

         // Table for attachement#####################################
          outputOBJ[tableNo].rows[item.Row][columnValue1] =finalResult;

        // Keep track of columns specific to this table
        outputOBJ[tableNo].columns.add(columnValue1);
        //  ############################################################
        // if (!outputOBJ[item.Table_No]) {
        //     outputOBJ[item.Table_No] = {}; // Initialize Table_No object
        // }
        
        // if (!outputOBJ[item.Table_No][item.Table_Heading]) {
        //     outputOBJ[item.Table_No][item.Table_Heading] = {}; // Initialize Table_Heading object
        // }
        
        // if (!outputOBJ[item.Table_No][item.Table_Heading][item.Row]) {
        //     outputOBJ[item.Table_No][item.Table_Heading][item.Row] = {}; // Initialize Row object
        // }
        
        // outputOBJ[item.Table_No][item.Table_Heading][item.Row][columnValue1] = finalResult;
    }
    }





 showExpatRegimeMessage(rawValues, taxData);




  // =====================================================
    // 2. PAYE ELIGIBILITY CHECK
    // =====================================================

    const selectedTaxTable =
        document.getElementById("Select_the_Tax_Table")
            ?.value?.trim() || "";

    const payeMessage =
        document.getElementById("payeLimitMessage");

    const resultTable =
        document.getElementById("resultTable");


    const isPAYE =
        selectedTaxTable ===
            "First Job in Norway (PAYE including social security)" ||

        selectedTaxTable ===
            "First Job in Norway (PAYE excluding social security)";


    if (isPAYE) {

        const grossSalary =
            rawValues["Gross_Sal_NOK_T"] || 0;

        const holidayPay =
            rawValues["Holiday_Pay_NOK_T"] || 0;

        const grossPlusHoliday =
            grossSalary + holidayPay;


        const thresholdRow =
            taxData.find(
                t => t.Variable === "AD_PAYE_Threshold"
            );

        const threshold =
            thresholdRow
                ? Number(thresholdRow.Tax_Rate)
                : 725050;


        console.log("Gross Salary:", grossSalary);
        console.log("Holiday Pay:", holidayPay);
        console.log("Gross + Holiday:", grossPlusHoliday);
        console.log("PAYE Threshold:", threshold);


        if (grossPlusHoliday > threshold) {

            // NOT ELIGIBLE

            resultTable.style.display = "none";

            tablesContainer.innerHTML = "";

            payeMessage.style.display = "block";
            payeMessage.style.color = "red";

            payeMessage.innerHTML = `
                <p>
                    The PAYE threshold for this solution has been exceeded.
                    Please refer to the alternative rate table or select another compliant solution
                </p>
            `;

            hideSpinner();

            return;
        }

        // ELIGIBLE

        payeMessage.style.display = "none";

    } else {

        // OTHER TAX TABLE

        payeMessage.style.display = "none";
    }





    outputOBJ1 = {};
outputOBJ1 = { ...outputOBJ }
console.log(tables);
    // Generate tables for each Table_No
    for (const key in tables) {
        const tableData = tables[key];

        // Create table element
        const tableEntire = document.createElement('table');
        tableEntire.className = 'table table-hover rounded-5 table-sm mb-5 secondTable';
        tableEntire.style.borderSpacing = '0 25px';
        tableEntire.style.width = '100%';


        // Create table header
        const tableHeader = document.createElement('thead');
        tableHeader.className = 'table-header'; // Add class for styling
    //     tableHeader.style.position = 'sticky'; // Fixed header
    // tableHeader.style.top = '0'; // Stick to the top
        

        // tableHeader.className = "table-dark";
        const headerRow = document.createElement('tr');
        

        // First column header for the table heading
        const headingCell = document.createElement('th');
        headingCell.style.border = "none";
        headingCell.style.paddingBottom="15px"
        headingCell.textContent = tableData.heading;
        headingCell.style.fontSize="small"
        headingCell.style.textAlign = 'left';
        headerRow.appendChild(headingCell);

        // Add relevant columns as headers
        tableData.columns.forEach(column => {
            const th = document.createElement('th');
               // Change only "1 Months" to "1 Month"
    const columnName = column.replace(/\b1\s+Months\b/gi, "1 Month");
            th.textContent = columnName; // Column header (e.g., "12 Months(in SEK)", "Monthly(in SEK)")
            th.style.textAlign = 'right'; 
            th.style.border = "none";
            th.style.fontSize="small"
            th.style.paddingBottom="15px"
            headerRow.appendChild(th);
        });

        tableHeader.appendChild(headerRow);
        tableEntire.appendChild(tableHeader);

        // Create table body
        const tableBody = document.createElement('tbody');

        // Iterate over rows
        for (const rowKey in tableData.rows) {
            // console.log(rowKey);
            if (!rowKey.includes("MergeAndStoreSwiss")) {
            const rowData = tableData.rows[rowKey];
            // console.log(rowData);
            // console.log(rowKey);
            // const keyName = Object.keys(rowData)[0];
            // console.log(keyName);


                        if (document.getElementById("countryData").value === "Japan" &&
    rowKey.trim() === "Employer's Total Cost") {
    dataRow.style.display = "none";
}
           
            // Create a row for each unique row key (e.g., "Contract Value", "Annual Rate")
            const dataRow = document.createElement('tr');
            dataRow.style.marginBottom = '5px !important'; 
            // dataRow.style.borderLeft = `5px solid ${getRandomColor()}`; // Apply random left border color
            dataRow.style.borderLeft = "5px solid #80d3f1";
            dataRow.style.borderRadius = '25px';
            
            // First cell for the unique row key
            const rowTitleCell = document.createElement('th');
            rowTitleCell.scope = "row"; // Make it a row header
            rowTitleCell.textContent = rowKey;
            rowTitleCell.style.fontSize="x-small"
            rowTitleCell.style.paddingBottom = '5px'; // Adjust as needed
            rowTitleCell.style.textAlign = 'left';
            dataRow.appendChild(rowTitleCell);

            // Iterate over relevant columns and add values
            tableData.columns.forEach(column => {
                const td = document.createElement('td');
                td.textContent = rowData[column] || ''; // Fill with data or leave empty if not present
                td.style.fontSize="x-small";
                // td.style.borderLeft = "5px solid black";
                td.style.paddingBottom = '5px'; // Adjust as needed
                td.style.textAlign = 'right';
                dataRow.appendChild(td);
            });

            // Append the row to the table body
            
            tableBody.appendChild(dataRow);
            const spacerRow = document.createElement('tr');
            spacerRow.style.height = '5px'; // Adjust as needed
            tableBody.appendChild(spacerRow);
        }
        }

        // Append the body to the table
        tableEntire.appendChild(tableBody);

        // Append the entire table to the container
        tablesContainer.appendChild(tableEntire);
        document.getElementById("resultTable").style.display="block"
        hideSpinner()
        const userInfo = await ZOHO.CRM.CONFIG.getCurrentUser();
        console.log(userInfo);
        
        const fullName = userInfo.users[0].full_name;
        const emailID = userInfo.users[0].email;
        const zohouserID = userInfo.users[0].zuid;

        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = now.getTime(); // unique timestamp in ms

        uniqueId = `${fullName.toLowerCase().replace(/\s+/g, '')}_${dateStr}_${zohouserID}_${timeStr}`;
        createLogForCalculate(inputOBJ,outputOBJ1,"Calculate","")
        // workDrive()
         // Add scroll event listener to change header background color
         tablesContainer.addEventListener('scroll', function () {
        if (tablesContainer.scrollTop > 0) {
            tableHeader.classList.add('scrolling-header'); // Add class when scrolling
        } else {
            tableHeader.classList.remove('scrolling-header'); // Remove class when not scrolling
        }
    });
    }
}













function showExpatRegimeMessage(rawValues, taxData) {
    const msgBox = document.getElementById("expatRegimeMessage");
    if (!msgBox) return;

    // Show only for Denmark
    if (document.getElementById("countryData").value !== "Denmark") {
        msgBox.style.display = "none";
        return;
    }

    // 1. Taxed in last 10 years? (dropdown value is the text "TRUE" or "FALSE")
    const taxedBefore = document.getElementById("Taxed_in_Last_Year")?.value === "TRUE";

    // 2. Exchange rate
    const exchangeRate = Number(document.getElementById("Exchange_Rate")?.value) || 1;

    // 3. Threshold from Admin Inputs (75,100 DKK)
    const row = taxData.find(t => t.Variable === "AD_Inc_Tax_Denmark_Fixed");
    console.log(row);
    
    const thresholdDKK = row
        ? Number(row.Tax_Rate)
        : 0;

        console.log(thresholdDKK);
        

    // 4. Monthly Gross (EUR) minus monthly ATP (EUR)
    const grossMinusATP =
        (rawValues["Gross_Sal_1_EUR"] || 0) - (rawValues["EMp_Social_Sec_1_EUR"] || 0);
        console.log(grossMinusATP);
        

    // Same rule as Excel formula 2 and your Taxes_On_Pay_Den_12_DKK formula
    const eligible = !taxedBefore && grossMinusATP >= (thresholdDKK / exchangeRate);

    console.log(taxedBefore && grossMinusATP >= (thresholdDKK / exchangeRate));
    

    msgBox.style.display = "block";
    if (eligible) {
       
        msgBox.style.color = "#e71010";
        msgBox.innerText = "EXPAT TAX REGIME (27% FLAT RATE): INCLUDED IN THIS CALCULATION";
    } else {
        
        msgBox.style.color = "#e71010";
        msgBox.innerText = "You are not eligible — standard Danish tax rates applied.";
    }
}






function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let myChartInstance = null; // Declare a variable to hold the chart instance

async function pieChartCalculate(apiData, pieChartData,taxData) {
    // console.log(taxData);
    
    // Split the pie chart data into individual elements
    var listOfData = pieChartData.split(",");
    var labelName = [];
    var valueOfLabel = [];

    for (const element of listOfData) {
        let labelOne = element.split(":");

        // Push the label name
        labelName.push(labelOne[0]);
        // console.log(labelOne[1]);
        

        try {
            // Replace variables in the formula with actual values
            const evaluatedFormula = await replaceVariables(labelOne[1],apiData,taxData);

            // Parse and evaluate the formula
            const productFormula = parser.parse(evaluatedFormula);

            // Ensure the result is a number
            if (!isNaN(productFormula.result)) {
                valueOfLabel.push(Number(productFormula.result).toFixed(2));
            } else {
                // console.error(`Invalid result for formula: ${evaluatedFormula}`);
                valueOfLabel.push(0);
            }
        } catch (error) {
            console.error(`Error parsing formula for ${labelOne[0]}:`, error);
            valueOfLabel.push(0);
        }
    }

    // const ctx = document.getElementById('myChart');




    // Clear the previous chart instance if it exists
    // if (myChartInstance) {
    //     myChartInstance.destroy();
    // }

    // // Create a new chart instance
    // myChartInstance = new Chart(ctx, {
    //     type: 'pie',
    //     data: {
    //         labels: labelName,
    //         datasets: [{
    //             label: false,
    //             data: valueOfLabel,
    //             backgroundColor: [
    //                 'rgb(255, 99, 132)',
    //                 'rgb(54, 162, 235)',
    //                 'rgb(255, 205, 86)',
    //                 'rgb(75, 192, 192)'
    //             ],
    //             hoverOffset: 4
    //         }]
    //     },
    //     options: {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         aspectRatio: 1,
    //         plugins: {
    //             legend: {
    //                 position: 'bottom', // Moves the legend to the bottom
    //             }
    //         }
    //     }
    // });
}
var churchTax={
    "Sweden": "Sweden_Church_Tax",

}
async function fetchAPIResponseSwitz(cantonNameID,cantonStatusID,inputvalueID) {
    // console.log(cantonNameID);
    // console.log(cantonStatusID);
    // console.log(inputvalueID);
    var taxYear=document.getElementById("calculatorTaxYear").value;
    var cantonName=document.getElementById(cantonNameID).value;
    var cantonStatus=document.getElementById(cantonStatusID).value;
    var selectElement=document.getElementById(inputvalueID)
    // console.log(cantonName);
    // console.log(cantonStatus);
    // console.log(selectElement);
    selectElement.innerHTML = '';
    let options=[];
    if (cantonName !="" && cantonStatus !="") {
        showSpinner()
    var conn_name = "calcprodexternal";
    var req_data = {
        "parameters": {},
        "headers": {},
        "method": "GET",
        "url": "https://sandbox.zohoapis.com/crm/v2/functions/search_church_tax_swiz/actions/execute?auth_type=apikey&zapikey=1003.ea55d59f93b181efcf12b84091b90b32.e825f866cd896ce8b7471c47fd0b42c1&arguments=%7BcantonName%3A"+encodeURIComponent(cantonName)+"%2CtaxYear%3A"+taxYear+"%2CcantonStatus%3A"+encodeURIComponent(cantonStatus)+"%7D",
        "param_type": 1
    };

    // Use await here for the connection invocation if needed
    const connectionData = await ZOHO.CRM.CONNECTION.invoke(conn_name, req_data);
    console.log("Standalode",connectionData);
    
    // var standaLoneResponse=connectionData.details.statusMessage.details.output
    if (connectionData.details.statusMessage) {
        // console.log(connectionData.details.statusMessage);
        var detailsResult=(connectionData.details.statusMessage.details.output);
        console.log("Standalone Details Creator",detailsResult);
        if (detailsResult=="") {
            hideSpinner()
            document.getElementById(inputvalueID).innerHTML = `<option value="NA" selected>NA</option>`;
            document.getElementById("calcAvailable").disabled = true;
        } else {
            document.getElementById("calcAvailable").disabled = false;
            if (detailsResult.includes("YES")) {
                console.log("1");
                
                options.push("Yes")   
                }
                if (detailsResult.includes("NO")) {
                    console.log("2");
                    options.push("No")   
                    }
                    selectElement.innerHTML = `<option value="" selected>-None-</option>`;

                    // Optionally add "None" option
                    if (options.includes("None")) {
                        const option = document.createElement('option');
                        option.text = 'None';
                        option.value = 'None';
                        selectElement.appendChild(option);
                    }
                
                    options.forEach(optionValue => {
                        // Avoid duplicates
                        if (![...selectElement.options].some(option => option.value === optionValue)) {
                            if (optionValue !== "None") {
                                const option = document.createElement('option');
                                option.value = optionValue;
                                option.text = optionValue;
                                selectElement.appendChild(option);
                            }
                        }
                    });
            hideSpinner()
        }
    } else {
        // alert("Something went wrong contact your admin");
        showPopup('failure', 'Something went wrong contact your admin')
    }

    }
}
async function fetchAPIResponse(moduleName,inputvalue) {
    // console.log("Sweden Others");
    var taxYear=document.getElementById("calculatorTaxYear").value;
    var entityName=churchTax[document.getElementById("countryData").value];
    var searchValue=document.getElementById(moduleName).value
    var selectElement=document.getElementById(inputvalue)
    selectElement.innerHTML = '';
    let options=[]
    const res = await ZOHO.CRM.API.searchRecord({Entity:entityName,Type:"criteria",Query:"(("+moduleName+":equals:"+(searchValue)+")and(Tax_Year:equals:"+taxYear+"))"});
    for (const key in res.data) {
        let  optionList = res.data[key][inputvalue];
        // console.log(optionList);
        options.push(optionList)

    }
    // return res;
    if (options.includes("None")) {
        const option = document.createElement('option');
        option.text = 'None';
        option.value = 'None';
        selectElement.appendChild(option);
    }
    options.forEach(optionValue => {
        // Check if the option already exists
        if (![...selectElement.options].some(option => option.value === optionValue)) {
            const option = document.createElement('option');
            if (optionValue != "None") {
                option.value = optionValue;
                option.text = optionValue;
        
                // Append the <option> element to the <select> element
                selectElement.appendChild(option);
                
            }
        }
    });
}

// Example call
// pieChartCalculate(formulaSubData, pieChartField);
function euroFormatter(amount){
    const formattedAmount = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
      return  formattedAmount;

}


function workDrive(){
    console.log("cutomized output",outputOBJ1);
    console.log("cutomized Input",inputOBJ);
   
        
    
    showSpinner()
    var inputDataDiv = document.getElementById("entireInputData").innerHTML;
    // console.log(inputDataDiv);
    
    var countryData=document.getElementById("countryData").value;
//     ZOHO.CRM.API.searchRecord({Entity:"Calculator_Notes",Type:"criteria",Query:"((Name:equals:"+countryData+")and(Tax_Year:equals:"+document.getElementById("calculatorTaxYear").value+"))"})
// .then(function(searchCRM1){
//     console.log(searchCRM1);
    // searchCRM1.data[0].id
    // Calculator_Notes
    ZOHO.CRM.API.getRecord({
        Entity: "Calc_Configuration", actionType: "approve", RecordID: document.getElementById("calculatorName").value
    })
        .then( function (searchCRM) {
    console.log("New Placement Notes",searchCRM);
    var typeOFcalc=(document.getElementById("calculatorType").value).replace(" ","_");
    // console.log(typeOFcalc);
    // console.log(searchCRM.data[0][typeOFcalc]);
    
    // console.log(document.getElementById("tables-container").innerHTML);   
    
//     const newDiv = `<div style="padding: 10px; margin: 10px 0; background-color: rgb(228, 228, 228); width: 90%;">
//     <div style="padding: 15px; margin-top:10px; background: rgb(228, 228, 228);">${searchCRM.data[0][typeOFcalc]}<br><br></div>
// </div>`.replace(/\n/g, '');
if (document.getElementById("countryData").value!="Switzerland") {



      // ###########################################For Output###############################################
      var customTable="";
      for (const key in outputOBJ1) {
          let uniqValue=[];
          // console.log(outputOBJ1[key].heading);
          var tableHeading=outputOBJ1[key].heading;
          if (outputOBJ1[key].heading==null) {
               tableHeading="Summary Table";
          }
          // console.log(tableHeading);
           customTable+=`<table style="width: 100%; font-family: Calibri, sans-serif; border-collapse: collapse; border: transparent;"> <thead><tr style="background-color: #008cba; color: white;height:40px";><th style="padding: 5px; text-align: left; border: 1px solid #ddd;">${tableHeading}</th>`;
          for (const keyRow in outputOBJ1[key].rows) {
              // console.log(keyRow);
              let rowValue= outputOBJ1[key].rows[keyRow];
              // console.log(rowValue);
              for (const column in rowValue) {
                  if (!uniqValue.includes(column)) {
                      uniqValue.push(column);
                  }
              }
              
              
          }
         //  console.log(uniqValue);
          
          for (const element of uniqValue) {
              customTable+=`<th style="padding: 5px; text-align: right; border: 1px solid #ddd;">${element}</th>`
          }
          customTable+=`</tr></thead><tbody>`;
              var count=0;
              for (const keyRow2 in outputOBJ1[key].rows) {
                  count++;
                  if (count%2==0) {
                      var rowColor="background-color:rgb(228, 228, 228);";
                  }else{
                      var rowColor="background-color:rgb(255, 255, 255);";
                  }
                  // console.log(keyRow);
                  let rowValue= outputOBJ1[key].rows[keyRow2];
                  customTable+=`<tr style="height:25px;${rowColor}"> <td style="padding: 0px;text-align: left;  border: 1px solid #ddd; font-weight: bold;">${keyRow2}</td>`
                  for (const element of uniqValue) {
                     const value = rowValue?.[element];
                     if (value !== undefined) {
                         customTable+=`<td style="padding: 0px; text-align: right; border: 1px solid #ddd;">${rowValue[element]}</td>`;
                           
                       } else {
                         customTable+=`<td style="padding: 0px; text-align: right; border: 1px solid #ddd;">-</td>`;
                           
                       }
                     //  customTable+=`<td style="padding: 0px; text-align: center; border: 1px solid #ddd;">${rowValue[element]}</td>`;
                  }
                  
                  customTable+=`</tr>`
              }
              customTable+=`</tbody></table>`
          
          // break;
          
          
      }
      
          // #########################################End Output##################################################
      
          // ######################################### Input##################################################
          var customTableInput=`<table style="width: 100%; font-family: Calibri, sans-serif; border-collapse: collapse; border: transparent;"> <thead><tr style="background-color: #008cba; color: white;height:30px"><th style="padding: 5px; text-align: left; border: 1px solid #ddd;">Variables</th><th style="padding: 5px; text-align: right; border: 1px solid #ddd;">Values</th></tr></thead><tbody>`;
          for (const keyRow in inputOBJ) {
              let rowValue= inputOBJ[keyRow];
             //  console.log(rowValue+"#n");
              customTableInput+=`<tr  style="height:25px"><td style="text-align:left; border: 1px solid #ddd; font-weight: bold;">${keyRow}</td><td style="text-align:right; border: 1px solid #ddd; font-weight: bold;">${rowValue}</td></tr>`
              
              
          }
          customTableInput+=`</tbody></table>`
     //  console.log(customTableInput);
          // #########################################End Input##################################################





var newDiv =`<div style="background-color:#008cba; text-align:left;  height:20px;color:white; margin-top:25px;">&nbsp;<span style=""><strong>Notes</strong></span></div><div style="font-size:small">${searchCRM.data[0]["Calculator_Notes"]}</div>`
const mapDataMergeAndStore = new Map();
mapDataMergeAndStore.set("inputData", customTableInput.replace(/\n/g, ''));
mapDataMergeAndStore.set("htmlText", customTable);
mapDataMergeAndStore.set("headerImage", searchCRM.data[0].Header_URL);
mapDataMergeAndStore.set("Phone", searchCRM.data[0].Phone);
mapDataMergeAndStore.set("Email", searchCRM.data[0].Email);
mapDataMergeAndStore.set("webAddress", searchCRM.data[0].Web);
mapDataMergeAndStore.set("CountryNotes", newDiv);
mapDataMergeAndStore.set("CalcType", document.getElementById("countryData").value + " - " + document.getElementById("calculatorType").value);

// Convert the map to a plain object
// const mapObjectMandS = Object.fromEntries(mapDataMergeAndStore);

// Convert the object to a JSON string
// const mapStringMergeStore = JSON.stringify(mapObjectMandS);
const mapObjectMandSSS = Object.fromEntries(mapDataMergeAndStore);

console.log("Map String:", mapDataMergeAndStore);
// console.log(encodeURIComponent(mapStringMergeStore));
    var func_name = "mergeandstorewithmap";
var req_data ={
"arguments": JSON.stringify({
    "mapArgument" : mapObjectMandSSS
})
};
ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
.then(function(data){
    console.log(data)
    
    hideSpinner()
    var detailsResult = (data.details.output);
    createLogForCalculate(inputOBJ,outputOBJ1,"Proposal",detailsResult)
            console.log("Standalone Details Drive",detailsResult);
            window.open(detailsResult, '_blank');
})
}else if (document.getElementById("countryData").value=="Switzerland") {
    // hideSpinner()
    var keyAndValue=[];
    for (const key in outputOBJ1) {
        const tableData = outputOBJ1[key];
    
        for (const rowKey in tableData.rows) {
            if (rowKey.includes("MergeAndStoreSwiss")) {
                const summaryValue = tableData.rows[rowKey]["Summary Value"];
                // console.log(`Key: ${rowKey}`);
                // console.log(`Summary Value: ${summaryValue}`);
                if (summaryValue.includes("||")) {
                    const summaryValues = summaryValue.split("||");
                    summaryValues.forEach(element => {
                        keyAndValue.push(element)
                    });
                    
                }else{
                    keyAndValue.push(summaryValue);
                }
            }
        }
    }
    console.log(keyAndValue);
    
    // alert("Hi")
    var mapForBody={};
    keyAndValue.forEach(element => {
        if (element.includes("=>")) {
            var separateKeyAndValue=element.split("=>");
            var key=separateKeyAndValue[0];
            var value=separateKeyAndValue[1];
            // mapForBody[key]=value;
            if (key.includes("|")) {
               var separateMultiKeys=key.split("|");
               separateMultiKeys.forEach(separateKey => {
                mapForBody[separateKey]=formatIfNumber(value);
                });
            }else{
                mapForBody[key]=formatIfNumber(value);
            }

        }
    });
    console.log(mapForBody);
    var func_name = "mergeandstorewithmapForSwitz";
    var req_data ={
    "arguments": JSON.stringify({
        "mapArgument" : mapForBody,
        "mapArgument2" : {"Full_Name":document.getElementById("fullName").value}
    })
    };
    ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
    .then(function(data){
        console.log(data)
        hideSpinner()
        var detailsResult = (data.details.output);
        createLogForCalculate(inputOBJ,outputOBJ1,"Proposal",detailsResult)

                console.log("Standalone Details Drive",detailsResult);
                window.open(detailsResult, '_blank');
    })
}
    })
// })



















// ======================================================================

// const formBody = new URLSearchParams();
// formBody.append("merge_data", JSON.stringify({
//   data: [
//     {
//       htmlText: "htmlSTR<br>Bala",
//       headerImage: "https://accessfinancial.com/wp-content/uploads/2022/02/af-logo-landing.png",
//       Phone: "7871218448",
//       Email: "krishbal128@gmail.com",
//       webAddress: "www.afs.com"
//     }
//   ]
// }));
// formBody.append("output_settings", JSON.stringify({
//   doc_name: "Tax Calculation Deluge 22",
//   folder_id: "ie6zp9e694ab619a54afe8c31ed93510e416f",
//   output_format: "pdf"
// }));

// Setting up the request data with FormData as the body
// var req_data = {
//   "url": "https://www.zohoapis.com/writer/api/v2/documents/ie6zpf8518a4b831941a8b6368d27baf18e4e/merge/store",
//   "method": "POST",
//   "headers": {
//     // "Authorization": "Zoho-oauthtoken 1000.f9d8971c95c9a8f608099d998c073480.cb2d73b8d654d96260782307425be7f1"
//   },
//   "param_type": 2,  // Set to 2 to treat FormData as the payload
//   "parameters": formBody.toString()
// };

// // Invoking the Zoho connection
// ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
//   .then(function(response) {
//     console.log(response);
//   })
//   .catch(function(error) {
//     console.error(error);
//   });


// Construct the form data as a URL-encoded string


// Zoho CRM HTTP POST request object














// =====================================================
}

function getInputValueById1(id) {
    // console.log("No 1",id);

    const element = document.getElementById(id);
    if (element) {
        const value = element.value;
        // Convert to a number only if the value is numeric
        return isNaN(value) ? `${value}` : Number(value);
    }

    return 0; // Return 0 if the element is not found
}

function formatIfNumber(value) {
    // Convert to string and check if it's a valid number using regex
    const num = parseFloat(value);
    
    if (!isNaN(num) && /^[\d,.\-]+$/.test(value)) {
        return num;
    } else {
        return value; // Contains non-numeric characters, return as-is
    }
}

function createLogForCalculate(input,output,category,proposal){
    console.log("Comming.....");
    
    ZOHO.CRM.CONFIG.getCurrentUser().then(function(data){
        console.log(data);
       var calcName= document.getElementById("dynamicName").innerText;
       var recordID= document.getElementById("calculatorName").value;
       var taxYear=document.getElementById("calculatorTaxYear").value;
       console.log(calcName);
       console.log(recordID);
       console.log(taxYear);
        var fullName=data.users[0].full_name;
        var emailID=data.users[0].email;
        var zohouserID=data.users[0].zuid
        var recordData = {
            "Name": category,
            "Output_Response": output,
            "Input_Response":input,
            "Email":emailID,
            "User_Name":fullName,
            "Proposal_Response":proposal,
            "caculationID":uniqueId,
            "Calculator_Name":calcName,
            "Year":taxYear,
            "Calculator_ID":recordID
      }
    ZOHO.CRM.API.insertRecord({Entity:"Caculator_Log",APIData:recordData,Trigger:["workflow"]}).then(function(data){
        console.log("Log Response",data);
        });
    });
}