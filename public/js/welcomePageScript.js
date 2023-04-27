function showEncDecOptions() {
  var selection = document.getElementsByName("typeEncDec");
  var options = document.getElementById("encLevel");
  var isShare = document.getElementById('isShare');
  
  isShare.checked=false;
  
  for (var i = 0; i < selection.length; i++) {
    if (selection[i].checked && selection[i].value === "encrypt") {
      options.style.display = "block";
      return;
    }
  }

  options.style.display = "none";
}

function redirectTo(page) {
  var selection = document.getElementsByName("typeEncDec");
  for(var i=0; i< selection.length; i++) { selection[i].checked=false; }
  window.location=page;
}