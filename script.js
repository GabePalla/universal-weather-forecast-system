 function testeTerminal() {
    const input = document.getElementsByClassName("textarea-terminal");
    const p = document.getElementById("text-area");

    p.innerHTML = p.innerHTML + input.item(0).value + "<br>";
 }

 testeTerminal()

 document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        testeTerminal();
    }
  });