const inputTerminalElement = document.querySelector('[data-text-area-terminal]');
const logElement = document.querySelector('[data-log-container]')

function resizeTextArea() {
    inputTerminalElement.addEventListener('keypress', function (event) {
        if (event.target.value.length * 0.3 < 100) {
            inputTerminalElement.style.height = `${event.target.value.length * 0.3}px`
        }
    });
}

function createTerminalLog(message) {
    const spanElement = document.createElement('span')
    spanElement.innerHTML = message;
    logElement.appendChild(spanElement);
}

function submitCommand() {
    document.addEventListener('keypress', function (event) {
        const command = inputTerminalElement.value.replace('\n', '');
        if (event.key === 'Enter') {

            switch (command) {
                case 'cls':
                    cleanTerminalLog();
                    break;
                default:
                    createTerminalLog(
                        `USER-0858> ${inputTerminalElement.value} <br> 
                        is not recognized as an internal or external command, 
                        operable program or batch file. <br><br>`
                    );
                    break;
            }
            inputTerminalElement.value = '';
        }
    });
}

function cleanTerminalLog() {
    while (logElement.firstChild) {
        logElement.removeChild(logElement.firstChild);
    }
}

resizeTextArea();
submitCommand();