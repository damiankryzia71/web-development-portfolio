/**
 * Cards containing details on the current day's hourly forecast can be collapsed by clicking their buttons.
 */
$(".current-card-collapse").click(function() {
    const clickedID = $(this).attr("id").slice(0, 5);
    $("hr#" + clickedID + "-hr").toggleClass("current-card-hide-details");
    $(".current-card-body#" + clickedID + "-body").toggleClass("current-card-hide-details");
});

/**
 * Search bar's placeholder is adjusted as it is being used.
 */
const placeholder = $(".search-bar").attr("placeholder");
$(".search-bar").on("focus", function() {
    $(this).attr("placeholder", "");
});
$(".search-bar").on("blur", function() {
    $(this).attr("placeholder", placeholder);
});