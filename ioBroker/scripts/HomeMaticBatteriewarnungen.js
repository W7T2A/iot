schedule("*/60 * * * *", function() {
    var actorsLowBat = $("channel[state.id=*0.LOWBAT]");
    
    actorsLowBat.each(function(actor) {
       if (getState(actor).val) {
           var obj = getObject(actor);
           var actorName = obj.common.name.split(":")[0];
           
            sendTo("telegram.0", {
                text: "Aktor => \"" + actorName + "\" meldet Batterie leer!",
                chatId: "<YOUR-CHAT-ID-HERE>"
            });
       }
    });
});