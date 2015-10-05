/**
 * Created by Adam on 18/09/2015.
 */
var pattern01, pattern02;

var setBoundaryPatterns = function() {
    var img01 = document.getElementById("backdrop01");                                //get a handle on some image tags
    pattern01 = context.createPattern(img01, "no-repeat");                        //from the ejs file and assign
    var img02 = document.getElementById("backdrop02");                                //to context pattern objects
    pattern02 = context.createPattern(img02, "no-repeat");
};

