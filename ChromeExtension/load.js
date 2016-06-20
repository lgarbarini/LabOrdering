window.setTimeout(function() {$("#submit-btn").click(function(e) {
      this.disabled=true;
      sendForm();
})}, 500);

window.setTimeout(function() {$("#override").click(function(e) {
  $("#title")
    .replaceWith('<input type="text" name=title id="title" value="'+$("#title").text()+'">');
  $("#skus")
    .replaceWith('<input type="text" name=skus id="skus" value="'+$("#skus").val()+'">');
  $("#prices")
    .replaceWith('<input type="text" name=prices id="prices" value="'+$("#prices").val()+'">');
  $("#qty")
    .replaceWith('<input type="text" name=qty id="qty" value="'+$("#qty").val()+'">');
  $("#qty")
    .replaceWith('<input type="text" name=qty id="qty" value="'+$("#qty").val()+'">');
})}, 500);
