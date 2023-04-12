function showOptions() {
    var selection = document.getElementsByName("typeEncDec");
    var options = document.getElementById("encLevel");

    for (var i = 0; i < selection.length; i++) {
      if (selection[i].checked && selection[i].value === "encrypt") {
        options.style.display = "block";
        return;
      }
    }

    options.style.display = "none";
}

function getFileLocation() {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = function() {
      fileLocationSelectedByTheUser = fileInput.value;
    };
    fileInput.click();

    console.log(fileLocationSelectedByTheUser);
}