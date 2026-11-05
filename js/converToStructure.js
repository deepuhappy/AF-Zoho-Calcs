var churchTax = {
    "Sweden": "Sweden_Church_Tax",
    "Switzerland":"Swiss_Gender_Tax"

}
var deduction = {
    "Sweden": {
        "Avesta": "Yes",
        "Gagnefs": "Yes",
        "Hedemora": "Yes",
        "Leksands": "Yes",
        "Ludvika": "Yes",
        "MalungRättviks": "Yes",
        "Smedjebackens": "Yes",
        "Säters": "Yes",
        "Vansbro": "Yes",
        "Älvdalens": "Yes",
        "Bollnäs": "Yes",
        "Hudiksvalls": "Yes",
        "Ljusdals": "Yes",
        "Nordanstigs": "Yes",
        "Ockelbo": "Yes",
        "Ovanåkers": "Yes",
        "Söderhamns": "Yes",
        "Bergs": "Yes",
        "Bräcke": "Yes",
        "Härjedalens": "Yes",
        "Krokoms": "Yes",
        "Ragunda": "Yes",
        "Strömsunds": "Yes",
        "Åre": "Yes",
        "Östersunds": "Yes",
        "Arjeplogs": "Yes",
        "Arvidsjaurs": "Yes",
        "Bodens": "Yes",
        "Gällivare": "Yes",
        "Haparanda": "Yes",
        "Jokkmokks": "Yes",
        "Kalix": "Yes",
        "Kiruna": "Yes",
        "Pajala": "Yes",
        "Piteå": "Yes",
        "Älvsbyns": "Yes",
        "Överkalix": "Yes",
        "Övertorneå": "Yes",
        "Arvika": "Yes",
        "Eda": "Yes",
        "Filipstads": "Yes",
        "Hagfors": "Yes",
        "Munkfors": "Yes",
        "Storfors": "Yes",
        "Sunne": "Yes",
        "Säffle": "Yes",
        "Torsby": "Yes",
        "Årjängs": "Yes",
        "Bjurholms": "Yes",
        "Dorotea": "Yes",
        "Lycksele": "Yes",
        "Malå": "Yes",
        "Nordmalings": "Yes",
        "Norsjö": "Yes",
        "Robertsfors": "Yes",
        "Skellefteå": "Yes",
        "Sorsele": "Yes",
        "Storumans": "Yes",
        "Vilhelmina": "Yes",
        "Vindelns": "Yes",
        "Vännäs": "Yes",
        "Åsele": "Yes",
        "Härnösands": "Yes",
        "Kramfors": "Yes",
        "Sollefteå": "Yes",
        "Timrå": "Yes",
        "Ånge": "Yes",
        "Örnsköldsviks": "Yes",
        "Bengtsfors": "Yes",
        "Dals-Eds": "Yes",
        "Färgelanda": "Yes",
        "Melleruds": "Yes",
        "Åmåls": "Yes"
    },
}
async function churchTaxFn(value) {
    
    if (value.includes(":")) {
        // console.log(value);
        var mySearchValeCriteria = value.split(":");
        var variable1 = mySearchValeCriteria[0];
        var variable2 = mySearchValeCriteria[1];
        var taxYear=document.getElementById("calculatorTaxYear").value;
        let ChurchTaxValue = sessionStorage.getItem('ChurchTax');
        console.log(ChurchTaxValue);
        // let TaxTableValue = sessionStorage.getItem('TaxTable');
        // console.log("ChurchTax",ChurchTaxValue);
        if (mySearchValeCriteria.length==2) {
        if (ChurchTaxValue === null) {
            var searchValue = `((${variable1}:equals:${(document.getElementById(variable1).value)})and(Tax_Year:equals:${taxYear})and(${variable2}:equals:${(document.getElementById(variable2).value)}))`;
            // if (mySearchValeCriteria[2] == "None") {
            //     searchValue = `((${variable1}:equals:${document.getElementById(variable1).value})and(${variable2}:equals:${mySearchValeCriteria[2]}))`;
            // }
            // console.log(searchValue);
            
            var entityName = churchTax[document.getElementById("countryData").value];
            const res = await ZOHO.CRM.API.searchRecord({ Entity: entityName, Type: "criteria", Query: searchValue });
            // console.log(res);
            if (res.status == 204) {
                sessionStorage.setItem('ChurchTax', 0);
                // console.log("Return 0");
                return 0; // Adjust based on the actual structure of the response        
            } else {
                // console.log((res.data[0].Tax_Rate)/100);
                sessionStorage.setItem('ChurchTax', (res.data[0].Tax_Rate) / 100);

                return (res.data[0].Tax_Rate) / 100; // Adjust based on the actual structure of the response      
            }
        } else {
            return ChurchTaxValue;
        }
    }
        if (mySearchValeCriteria.length==3) {
            if (mySearchValeCriteria[2]=="None" || mySearchValeCriteria[2].includes("None")) {
            var churchTaxValue1=sessionStorage.getItem('ChurchTax1');
            console.log(churchTaxValue1);
            if (churchTaxValue1 === null) {
                var searchValue = `((${variable1}:equals:${(document.getElementById(variable1).value)})and(Tax_Year:equals:${taxYear})and(${variable2}:equals:${(mySearchValeCriteria[2])}))`;
                // if (mySearchValeCriteria[2] == "None") {
                //     searchValue = `((${variable1}:equals:${document.getElementById(variable1).value})and(${variable2}:equals:${mySearchValeCriteria[2]}))`;
                // }
                var entityName = churchTax[document.getElementById("countryData").value];
                // console.log(searchValue);
                const res = await ZOHO.CRM.API.searchRecord({ Entity: entityName, Type: "criteria", Query: searchValue });
                if (res.status == 204) {
                    sessionStorage.setItem('ChurchTax1', 0);
                    // console.log("Return 0");
                    return 0; // Adjust based on the actual structure of the response        
                } else {
                    // console.log((res.data[0].Tax_Rate)/100);
                    sessionStorage.setItem('ChurchTax1', (res.data[0].Tax_Rate) / 100);
    
                    return (res.data[0].Tax_Rate) / 100; // Adjust based on the actual structure of the response      
                }
            } else {
                return churchTaxValue1;
            }
        }else{
            var searchValue = `((${variable1}:equals:${(document.getElementById(variable1).value)})and(Tax_Year:equals:${taxYear})and(${variable2}:equals:${(document.getElementById(variable2).value)}))`;
            var entityName = churchTax[document.getElementById("countryData").value];
            // console.log(searchValue);
            const res = await ZOHO.CRM.API.searchRecord({ Entity: entityName, Type: "criteria", Query: searchValue });
            if (res.status == 204) {
                console.log("Return 0");
                return 0; // Adjust based on the actual structure of the response        
            } else {
                console.log((res.data[0][mySearchValeCriteria[2]]));
                return (res.data[0][mySearchValeCriteria[2]]); // Adjust based on the actual structure of the response      
            }
        }
        }
    } else {
        // console.log(value);
        let taxReduction = sessionStorage.getItem('Tax_Reduction');
       
        console.log(taxReduction);
        
        if (taxReduction ==null) {

        var taxYear=document.getElementById("calculatorTaxYear").value;
        let inputValue = document.getElementById("Municipality").value;
        const res22 = await ZOHO.CRM.API.searchRecord({ Entity: "Sweden_Church_Tax", Type: "criteria", Query: `((Municipality:equals:${inputValue})and(Tax_Reduction:equals:Yes)and(Tax_Year:equals:${taxYear}))` });
        // console.log("Reduction is yes or no",res22);
        if (res22.status==204) {
            sessionStorage.setItem('Tax_Reduction',0);
            // return 0;
        }else{
            sessionStorage.setItem('Tax_Reduction',1675);
            // return 1675;
        }
        return taxReduction;
        }else{
            return taxReduction;
        }
        // var normalizedInput = normalizeString(inputValue);
        // for (var key in deduction.Sweden) {
        //     if (normalizeString(key) === normalizedInput) {
        //         console.log(1675);

        //         return 1675;
        //     }
        // }
        // console.log(0);
        

        // return 0;
    }
}
function normalizeString(str) {
    // console.log(str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());

    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
async function TaxTable(value1) {
    var taxYear=document.getElementById("calculatorTaxYear").value;
    var countryData=document.getElementById("countryData").value;

     var selectedTableElement = document.getElementById("Select_the_Tax_Table");
    var selectedTable = selectedTableElement ? selectedTableElement.value : "";
    // console.log("No 3Bala");
    let TaxTableValue = sessionStorage.getItem('TaxTable');
    // console.log("Tax Table",value1);
    if (TaxTableValue === null) {
        // console.log(value1);

        var parser = new formulaParser.Parser();
        var result = parser.parse(value1);
        // console.log(result);
        var value;
        if (result.result==null) {
             value=value1;
        } else{
       
        if (!isNaN(value)) {
             value = Math.round(result.result);
        }else{
            value=result.result;
        }
    }
        // console.log(value);
        
        var conn_name = "calcprodexternal";
        var req_data = {
            "parameters": {},
            "headers": {},
            "method": "GET",
            "url": "https://www.zohoapis.com/crm/v7/functions/basic_deduction/actions/execute?auth_type=apikey&zapikey=1003.33b27aef4b790e71583974173438750f.108255938346a1dc892a1cefd57a3154&arguments=%7BlimitValue%3A"+value+"%2CTax_Year%3A"+taxYear+"%2CountryName%3A"+countryData+"%2CselectedTaxTable%3A"+selectedTable+"%7D",
            "param_type": 1
        };

        // Use await here for the connection invocation if needed
        const connectionData = await ZOHO.CRM.CONNECTION.invoke(conn_name, req_data);
        // console.log("Standalode",connectionData);
        
        // var standaLoneResponse=connectionData.details.statusMessage.details.output
     
        // ✅ Safe JSON Check
        if (connectionData && 
            connectionData.details && 
            connectionData.details.statusMessage && 
            connectionData.details.statusMessage.details && 
            connectionData.details.statusMessage.details.output &&
            connectionData.details.statusMessage.details.output !== "undefined") {
            
            try {
                var detailsResult = JSON.parse(connectionData.details.statusMessage.details.output);
                console.log("Standalone Details", detailsResult);
                var FinalCount = Number(detailsResult.Basic_Deduction || 0);
                sessionStorage.setItem('TaxTable', FinalCount);
                return Number(FinalCount);
            } catch(e) {
                console.error("JSON Parse Exception avoided:", e);
                sessionStorage.setItem('TaxTable', 0);
                return 0;
            }
        } else {
            sessionStorage.setItem('TaxTable', 0);
            // console.log(0);
            return 0;
        }
    } else { return TaxTableValue; }
    // return 16800;

}

async function PanelTable(value) {
    // console.log("No 2",value);

    const res = await ZOHO.CRM.API.searchRecord({ Entity: "Calc_Configuration", Type: "criteria", Query: `(Country_Name:equals:${(value)})` });
    return res.data[0].id; // Adjust based on the actual structure of the response
}

function getInputValueById(id) {
    // console.log("No 1",id);

    const element = document.getElementById(id);
    if (element) {
        const value = element.value;
        // Convert to a number only if the value is numeric
        return isNaN(value) ? `"${value}"` : Number(value);
    }

    return 0; // Return 0 if the element is not found
}

async function evaluateAPIResponse(response) {
    // console.log(response);

    const promises = []; // Array to store promises for each match
    const regex = /\{([@#$]?)([^}]+)\}/g;

    // Replace the placeholder with asynchronous evaluation
    const finalResponse = response.replace(regex, (match, type, content) => {
        const promise = (async () => {
            let value;
            switch (type) {
                case '@':
                    value = await churchTaxFn(content);
                    break;
                // case '#':
                //     value = await TaxTable(content);
                //     break;
                case '$':
                    value = await PanelTable(content);
                    break;
                default:
                    value = getInputValueById(content);
            }
            // console.log(value);
            // console.log(isNaN(value) ? value : Number(value));

            return isNaN(value) ? value : Number(value);
        })();
        // console.log(promises);

        promises.push(promise);
        return `{${promises.length - 1}}`; // Temporarily replace with an index
    });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    return finalResponse.replace(/\{(\d+)\}/g, (match, index) => results[index]);

}

// async function replaceVariables(formula, apiData,taxData) {
//     // console.log(taxData);
    
//     // Perform the initial replacement of variables
//     apiData.forEach(item => {
//     // console.log(item.Variable);

//         const regex = new RegExp(`\\{\\$${item.Variable}\\}`, 'g');
//         formula = formula.replace(regex, `(${item.Formula})`);
      
        
//     });
//     taxData.forEach(item => {
//     // console.log(item.Variable);

//         const regex = new RegExp(`\\{\\&${item.Variable}\\}`, 'g');
//         formula = formula.replace(regex, `(${item.Tax_Rate})`);
//     })
//     // Recursively replace any remaining placeholders
//     if (/\{\$[^\}]+\}/.test(formula)) {
//         formula = await replaceVariables(formula, apiData,taxData);
//     }else if (/\{\&[^\}]+\}/.test(formula)) {
//         formula = await replaceVariables(formula, apiData,taxData);
//     }

//     const squareBracketsRegex = /\[([^\]]+)\]/g;
//     let match1;
//     // console.log(formula);
//     // var storedValue = sessionStorage.getItem("finalValue");
//     while ((match1 = squareBracketsRegex.exec(formula)) !== null) {
//         const expressionInsideBrackets = match1[1].trim();
//                 // if (storedValue !== null) {
//                 //     formula = formula.replaceAll(match1[0], storedValue);
//                 // }else{
//                 // console.log(expressionInsideBrackets);
                
//                 const grossSalary = await findGrossSalary(expressionInsideBrackets, apiData, taxData);
//                 // console.log(grossSalary);
//                 // sessionStorage.setItem("finalValue", grossSalary);
//                 // console.log(finalValue);
//                 formula = formula.replaceAll(match1[0], grossSalary);
//                 // console.log(finalValue);
//                 // }
//                 match1 = squareBracketsRegex.exec(formula); // Continue to find any other matches
//     }

//     // Regex to find {# ... #} blocks, accounting for complex/nested expressions
//     const taxTagRegex = /\{#([^#]+)#\}/g;
//     let match;
//     // console.log(formula);

//     while ((match = taxTagRegex.exec(formula)) !== null) {
//         const valueInsideCurlyBraces = match[1].trim();

//         // Evaluate the value inside {# ... #}
//         const evaluatedValue = await evaluateAPIResponse(valueInsideCurlyBraces);
//         // console.log(evaluatedValue);

//         // Pass the evaluated value to TaxTable and get the final result
//         const taxTableResult = await TaxTable(evaluatedValue);

//         // Replace the entire {# ... #} block with the result from TaxTable
//         formula = formula.replace(match[0], taxTableResult);
//     }

//     // Evaluate the final formula after all replacements
//     var finalValue = await evaluateAPIResponse(formula);
//     // console.log(finalValue);
// // Regex for square brackets []


//     return finalValue;
// }



// // Goal Seek Function to calculate employee total cost
// function calculateEmployeeTotalCost(G, formulas) {
//     // console.log(formulas);
//     // console.log(G);

//     // Replace G in the formulas with the actual value
//     const employeeTotalCost = formulas.replace(/GRSL/g, G);
//     // console.log(employeeTotalCost);
    
//     var targetValueEval2 = parser.parse(employeeTotalCost);
//     // console.log(targetValueEval2);
//     var targetValueEval3 = Number(targetValueEval2.result);

//     // console.log(targetValueEval3);
//     return targetValueEval3;
// }

// // Function to find gross salary using goal seek
// async function findGrossSalary(Formula, apiData, taxData) {
//     var TargetValueFormula = "";
    
//     apiData.forEach(item => {
//         if (item.Type == "Target") {
//             TargetValueFormula = item.Formula;
//             // console.log(TargetValueFormula);
//         }
//     });

//     // console.log(TargetValueFormula);

//     // Replace variables for target value formula
//     var targetValueEval1 = await replaceVariables(TargetValueFormula, apiData, taxData);
//     var targetValueEval2 = parser.parse(targetValueEval1);
//     // console.log(targetValueEval2);    
//     var targetValueEval3 = Number(targetValueEval2.result);
//     // console.log(targetValueEval3);

//     // console.log(Formula);

//     // Replace variables for gross formula
//     var grossFormulaEval1 = await replaceVariables(Formula, apiData, taxData);

//     let lowerBound = 0;
//     let upperBound = 2000000000000000000; // Assuming a reasonable upper bound
//     let tolerance = 0.01; // Tolerance for how close we want the result

//     while (upperBound - lowerBound > tolerance) {
//         let mid = (lowerBound + upperBound) / 2;
//         const currentCost = calculateEmployeeTotalCost(mid, grossFormulaEval1);

//         if (currentCost < targetValueEval3) {
//             lowerBound = mid;
//         } else {
//             upperBound = mid;
//         }
//     }

//     return (lowerBound + upperBound) / 2;
// }
// Goal Seek Function to calculate employee total cost

async function replaceVariables(formula, apiData, taxData) {
    // ✅ 1. Transform IF({Percentage}="Skip it", ...) in apiData BEFORE variable expansion
    const percVal = typeof getInputValueById1 === "function" ? String(getInputValueById1("Percentage")).trim() : "";

    apiData.forEach(item => {
        if (item.Formula && item.Formula.includes('IF({Percentage}="Skip it"')) {
            if (percVal === "Skip it") {
                item.Formula = item.Formula.replace(/IF\(\{Percentage\}="Skip it"\s*,\s*(\{#.*?#\})\s*,[\s\S]*\)$/i, "$1");
            } else if (percVal !== "" && percVal !== "null" && percVal !== "undefined") {
                item.Formula = item.Formula.replace(/IF\(\{Percentage\}="Skip it"\s*,\s*\{#.*?#\}\s*,\s*([\s\S]*)\)$/i, "$1");
            }
        }
    });

    if (formula && formula.includes('IF({Percentage}="Skip it"')) {
        if (percVal === "Skip it") {
            formula = formula.replace(/IF\(\{Percentage\}="Skip it"\s*,\s*(\{#.*?#\})\s*,[\s\S]*\)$/i, "$1");
        } else if (percVal !== "" && percVal !== "null" && percVal !== "undefined") {
            formula = formula.replace(/IF\(\{Percentage\}="Skip it"\s*,\s*\{#.*?#\}\s*,\s*([\s\S]*)\)$/i, "$1");
        }
    }

    // Perform the initial replacement of variables
    apiData.forEach(item => {
        const regex = new RegExp(`\\{\\$${item.Variable}\\}`, 'g');
        formula = formula.replace(regex, `(${item.Formula})`);
    });

    taxData.forEach(item => {
        const regex = new RegExp(`\\{\\&${item.Variable}\\}`, 'g');
        formula = formula.replace(regex, `(${item.Tax_Rate})`);
    });

    // Recursively replace any remaining placeholders
   // Replace remaining variables without recursion
const MAX_PASSES = 100;

for (let pass = 0; pass < MAX_PASSES; pass++) {

    const oldFormula = formula;

    apiData.forEach(item => {
        const regex = new RegExp(`\\{\\$${item.Variable}\\}`, 'g');
        formula = formula.replace(regex, `(${item.Formula})`);
    });

    taxData.forEach(item => {
        const regex = new RegExp(`\\{\\&${item.Variable}\\}`, 'g');
        formula = formula.replace(regex, `(${item.Tax_Rate})`);
    });

    // Nothing changed → stop
    if (formula === oldFormula) {
        break;
    }

    // No variables remaining → stop
    if (!/\{\$[^\}]+\}|\{\&[^\}]+\}/.test(formula)) {
        break;
    }

    // Prevent infinite variable chains
    if (pass === MAX_PASSES - 1) {
        console.error("Maximum variable replacement passes reached.");
        console.error("Remaining formula:", formula);
    }
}

    const squareBracketsRegex = /\[([^\]]+)\]/g;
    let match1;
    console.log(formula);
    while ((match1 = squareBracketsRegex.exec(formula)) !== null) {
        const expressionInsideBrackets = match1[1].trim();
        const grossSalary = await findGrossSalary(expressionInsideBrackets, apiData, taxData);
        formula = formula.replaceAll(match1[0], grossSalary);
        match1 = squareBracketsRegex.exec(formula);
    }

    // Regex to find {# ... #} blocks
    const taxTagRegex = /\{#([^#]+)#\}/g;
    let match;

    while ((match = taxTagRegex.exec(formula)) !== null) {
        const valueInsideCurlyBraces = match[1].trim();
        const evaluatedValue = await evaluateAPIResponse(valueInsideCurlyBraces);
        const taxTableResult = await TaxTable(evaluatedValue);
        formula = formula.replace(match[0], taxTableResult);
    }

    // Evaluate the final formula after all replacements
    var finalValue = await evaluateAPIResponse(formula);
    return finalValue;
}


function calculateEmployeeTotalCost(G, formulas) {
    // console.log(formulas);
    // console.log(G);

    // Replace G in the formulas with the actual value
    const employeeTotalCost = formulas.replace(/GRSL/g, G);
    // console.log(employeeTotalCost);
    
    var targetValueEval2 = parser.parse(employeeTotalCost);
    // console.log(targetValueEval2);
    var targetValueEval3 = Number(targetValueEval2.result);

    // console.log(targetValueEval3);
    return targetValueEval3;
}

// Function to find gross salary using goal seek
async function findGrossSalary(Formula, apiData, taxData) {
    var TargetValueFormula = "";
    
    apiData.forEach(item => {
        if (item.Type == "Target") {
            TargetValueFormula = item.Formula;
            // console.log(TargetValueFormula);
        }
    });

    // console.log(TargetValueFormula);

    // Replace variables for target value formula
    var targetValueEval1 = await replaceVariables(TargetValueFormula, apiData, taxData);
    var targetValueEval2 = parser.parse(targetValueEval1);
    // console.log(targetValueEval2);    
    var targetValueEval3 = Number(targetValueEval2.result);
    // console.log(targetValueEval3);

    // console.log(Formula);

    // Replace variables for gross formula
    var grossFormulaEval1 = await replaceVariables(Formula, apiData, taxData);

    let lowerBound = 0;
    let upperBound = 2000000000000000000; // Assuming a reasonable upper bound
    let tolerance = 0.01; // Tolerance for how close we want the result

    while (upperBound - lowerBound > tolerance) {
        let mid = (lowerBound + upperBound) / 2;
        const currentCost = calculateEmployeeTotalCost(mid, grossFormulaEval1);

        if (currentCost < targetValueEval3) {
            lowerBound = mid;
        } else {
            upperBound = mid;
        }
    }

    return (lowerBound + upperBound) / 2;
}