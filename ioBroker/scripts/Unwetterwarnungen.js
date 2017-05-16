//Do this only once at initial setup
createState('unwetterwarnungen.Warnungen', "");

schedule("*/10 * * * *", function() {

    var gesendeteWarnungen = getState("javascript.0.unwetterwarnungen.Warnungen").val.split(",");

    var request = require("request");
    var warnungen = request('http://www.dwd.de/DWD/warnungen/warnapp/json/warnings.json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var result = JSON.parse(body.replace("warnWetter.loadWarnings(", "").slice(0, -2));

                // Cleanup old weather warnings
                var tmp = gesendeteWarnungen;
                gesendeteWarnungen = [];

                for (var key in result.warnings) {

                	var warnung = result.warnings[key][0];

                    switch (warnung.regionName) {

                        // Replace --- with the regions you want to track
                        case "---":
                        case "---":
                        case "---":
                            {
                                if (tmp.indexOf(key) > -1) {
                                    console.log(key);
                                    gesendeteWarnungen.push(key);
                                }

                                if (gesendeteWarnungen.indexOf(key) > -1) {
                                    break;
                                } else {
                                    var startDate = new Date(warnung.start);
                                    var endDate = new Date(warnung.end);

                                    if (warnung.end === null || startDate === endDate) {
                                        sendTo("telegram.0", {
                                            text: "Unwetterwarnung: " + startDate.toLocaleDateString("de-DE") + " => " + warnung.regionName + "\n\n" + warnung.event + "\n\n" + warnung.description,
                                            chatId: "<YOUR-CHAT-ID-HERE>"
                                        });
                                    } else {
                                        sendTo("telegram.0", {
                                            text: "Unwetterwarnung: " + startDate.toLocaleDateString("de-DE") + " bis " + endDate.toLocaleDateString("de-DE") + " => " + warnung.regionName + "\n\n" + warnung.event + "\n\n" + warnung.description,
                                            chatId: "<YOUR-CHAT-ID-HERE>"
                                        });
                                    }
                                    gesendeteWarnungen.push(key);
                                }
                            }
                            break;
                    }
                }

                setState("javascript.0.unwetterwarnungen.Warnungen", gesendeteWarnungen.toString());

            } catch (e) {
                console.log(e);
            }
        }
    });
});