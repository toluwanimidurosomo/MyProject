var icon = document.getElementById("icon");
icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
}

var love = document.getElementById("love");
function Toggle1() {
    if (love.style.color == "red") {
        love.style.color = "grey"
    }
    else {
        love.style.color = "red"
    }
}