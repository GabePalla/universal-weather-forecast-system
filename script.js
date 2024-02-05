 function testeTerminal() {
    const input = document.getElementsByClassName("textarea-terminal");
    const p = document.getElementById("text-area");

    p.innerHTML = p.innerHTML + "USER-0858> " + input.item(0).value + "<br> is not recognized as an internal or external command, operable program or batch file. <br><br>";
 }

 testeTerminal()

 document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        testeTerminal();
    }
  });