/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8478260869565217, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://www.demoblaze.com/-15"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.demoblaze.com/"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.demoblaze.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-12"], "isController": false}, {"data": [0.5, 500, 1500, "https://hls.demoblaze.com/about_demo_hls_600k00000.ts"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://api.demoblaze.com/entries"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/config.json"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://hls.demoblaze.com/index.m3u8"], "isController": false}, {"data": [1.0, 500, 1500, "https://hls.demoblaze.com/about_demo_hls_600k.m3u8"], "isController": false}, {"data": [0.0, 500, 1500, "Home"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22, 0, 0.0, 392.4545454545454, 95, 1539, 311.0, 884.6999999999998, 1455.7499999999989, 1539.0, 5.975013579576317, 386.1124431355242, 4.983333191879414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.demoblaze.com/-15", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 26.272375606796118, 4.873331310679612], "isController": false}, {"data": ["https://www.demoblaze.com/-13", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 29.515975560897434, 1.702724358974359], "isController": false}, {"data": ["https://www.demoblaze.com/-14", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 135.498046875, 4.795619419642857], "isController": false}, {"data": ["https://www.demoblaze.com/-1", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 17.730106581125828, 1.662096440397351], "isController": false}, {"data": ["https://www.demoblaze.com/-11", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 657.4645483193277, 2.223936449579832], "isController": false}, {"data": ["https://www.demoblaze.com/", 1, 0, 0.0, 1539.0, 1539, 1539, 1539.0, 1539.0, 1539.0, 1539.0, 0.649772579597141, 286.21403407244964, 5.370776478232619], "isController": false}, {"data": ["https://www.demoblaze.com/-0", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 7.589670271822358, 0.7522372702909648], "isController": false}, {"data": ["https://www.demoblaze.com/-12", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 160.64009232954547, 1.2584339488636365], "isController": false}, {"data": ["https://hls.demoblaze.com/about_demo_hls_600k00000.ts", 1, 0, 0.0, 984.0, 984, 984, 984.0, 984.0, 984.0, 984.0, 1.016260162601626, 538.8540872713414, 0.36521849593495936], "isController": false}, {"data": ["https://www.demoblaze.com/-10", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 109.4145492601246, 1.6458576713395638], "isController": false}, {"data": ["https://www.demoblaze.com/-5", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 2.1342972285067874, 1.1488970588235294], "isController": false}, {"data": ["https://www.demoblaze.com/-4", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 4.28742439516129, 1.6381048387096775], "isController": false}, {"data": ["https://api.demoblaze.com/entries", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 5.300564236111111, 0.6293402777777778], "isController": false}, {"data": ["https://www.demoblaze.com/-3", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 44.99811222118959, 1.9821677509293678], "isController": false}, {"data": ["https://www.demoblaze.com/config.json", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 4.594983552631579, 4.409950657894737], "isController": false}, {"data": ["https://www.demoblaze.com/-2", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 78.56086687853107, 1.5227754237288136], "isController": false}, {"data": ["https://www.demoblaze.com/-9", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 194.74888392857144, 2.8683035714285716], "isController": false}, {"data": ["https://www.demoblaze.com/-8", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 102.58413461538461, 1.541466346153846], "isController": false}, {"data": ["https://www.demoblaze.com/-7", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 198.75201056985293, 3.698012408088235], "isController": false}, {"data": ["https://www.demoblaze.com/-6", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 8.991546301295896, 1.0735859881209502], "isController": false}, {"data": ["https://hls.demoblaze.com/index.m3u8", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 5.112829287190083, 1.4164191632231404], "isController": false}, {"data": ["https://hls.demoblaze.com/about_demo_hls_600k.m3u8", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 21.2568604390681, 1.2775817652329748], "isController": false}, {"data": ["Home", 1, 0, 0.0, 3679.0, 3679, 3679, 3679.0, 3679.0, 3679.0, 3679.0, 0.2718129926610492, 266.698183524735, 2.7406925285403645], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
