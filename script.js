// event listener on #burger-button to toggle class 'open' on #burger-menu
document.getElementById("burger-button").addEventListener("click", function () {
    document.getElementById("burger-menu").classList.toggle("open");
    document.getElementById("burger-button").classList.toggle("open");
});

// :event listener on input #guess add a treaming underscore after each keypress
document.getElementById("guess").addEventListener("input", function () {
    document.getElementById("input-display").innerHTML = this.value + "_";
});
