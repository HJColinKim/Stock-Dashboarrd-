'use strict';

//project
const apiKey = "API Key";
const apiUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
const overviewUrl = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=";
const timeSeriesUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="

function resetStockValues() {
    document.getElementById("stockPrice").innerText = "$0.00";
    document.getElementById("stockChange").innerText = "$0.00 (0.00%)";
    document.getElementById("stockChange").style.color = "white";
    document.getElementById("stockOpen").innerText = "$0.00";
    document.getElementById("stockHigh").innerText = "$0.00";
    document.getElementById("stockLow").innerText = "$0.00";
    document.getElementById("stockVolume").innerText = "0";
    document.getElementById("previousClose").innerText = "$0.00";
    document.getElementById("companyName").innerText = "Company Name not Available!";
    document.getElementById("companyDescription").innerText = "Description not Available!";
    document.getElementById("stock52WeekHigh").innerText = "$0.00";
    document.getElementById("stock52WeekLow").innerText = "$0.00";
    document.getElementById("marketCap").innerText = "$0.00";
    document.getElementById("pe-ratio").innerText = "0";
    document.getElementById("dividendYield").innerText = "0.00%";
    document.getElementById("sector").innerText = "N/A";
    document.getElementById("bookValue").innerText = "0.00";
    document.getElementById("stockEPS").innerText = "0.00";
    document.getElementById("ebitda").innerText = "$0.00B";
    document.getElementById("stockBeta").innerText = "0.00";
    document.getElementById("dma").innerText = "0.00";
}


async function fetchStockData(){
    const symbol = document.getElementById("stockSymbol").value.toUpperCase();
    if (!symbol){
        resetStockValues();
        const toast = document.getElementById('toast');
        toast.classList.add("show");

        setTimeout(()=> {
            toast.classList.remove("show");
        }, 3000)

        return;
    }

    try{
        const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        const stockResponse = await fetch(stockUrl);
        const stockData = await stockResponse.json();
        if (!stockData["Global Quote"]){
            resetStockValues();
            const toast1 = document.getElementById('toast1');
            toast1.classList.add("show");

            setTimeout(()=> {
                toast1.classList.remove("show");
            }, 3000)

            return;
        }

        const stock = stockData["Global Quote"];
        const change = parseFloat(stock["09. change"]).toFixed(2);

        document.getElementById("stockPrice").innerText = `$${parseFloat(stock["05. price"]).toFixed(2)}`
        document.getElementById("stockChange").innerText = `$${stock["09. change"]} (${stock["10. change percent"]})`;
        document.getElementById("stockChange").style.color = change >= 0 ? "green" : "red";
        document.getElementById("stockOpen").innerText = `$${parseFloat(stock["02. open"]).toFixed(2)}`
        document.getElementById("stockHigh").innerText = `$${parseFloat(stock["03. high"]).toFixed(2)}`
        document.getElementById("stockLow").innerText = `$${parseFloat(stock["04. low"]).toFixed(2)}`
        document.getElementById("stockVolume").innerText = `${stock["06. volume"]}`;
        document.getElementById("previousClose").innerText = `$${parseFloat(stock["08. previous close"]).toFixed(2)}`

        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
        const overviewResponse = await fetch(overviewUrl);
        const overviewData = await overviewResponse.json();

        if (overviewData){
            document.getElementById("companyName").innerText = overviewData["Name"] || "Company Name not Available!";
            document.getElementById("companyDescription").innerText = overviewData["Description"] || "Description not Available!";

            document.getElementById("stock52WeekHigh").innerText = `$${overviewData["52WeekHigh"]}`;
            document.getElementById("stock52WeekLow").innerText = `$${overviewData["52WeekLow"]}`;
            document.getElementById("marketCap").innerText = `$${(overviewData["MarketCapitalization"] / 1e9).toFixed(2)}`;
            document.getElementById("pe-ratio").innerText = overviewData["PERatio"];
            document.getElementById("dividendYield").innerText = `$${(overviewData["DividendYield"]*100).toFixed(2)}%`;
            document.getElementById("sector").innerText = `${overviewData["Sector"]}`;
            document.getElementById("bookValue").innerText = `${overviewData["BookValue"]}`;
            document.getElementById("stockEPS").innerText = `${overviewData["EPS"]}`;
            document.getElementById("ebitda").innerText = `${(overviewData["EBITDA"] / 1e9).toFixed(2)}B`;
            document.getElementById("stockBeta").innerText = `${overviewData["Beta"]}`;
            document.getElementById("dma").innerText = `${overviewData["200DayMovingAverage"]}`;

        }


    } catch (error) {
        resetStockValues();
        const toast2 = document.getElementById('toast2');
            toast2.classList.add("show");

            setTimeout(()=> {
                toast2.classList.remove("show");
            }, 3000)

            return;

    }
}
