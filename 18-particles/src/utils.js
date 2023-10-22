// Import the dat.gui library
// import * as dat from 'dat.gui';

// // Create a function to set up the debug menu
// function setupDebugMenu(value1, value2, value3, value4) {
//     // Create a new GUI object
//     const gui = new dat.GUI();

//     // Add the four values to the GUI
//     gui.add({ value1 }, 'value1', -100, 100);
//     gui.add({ value2 }, 'value2', -100, 100);
//     gui.add({ value3 }, 'value3', -100, 100);
//     gui.add({ value4 }, 'value4', -100, 100);
// }

// // Call the function with your four number values
// setupDebugMenu(0, 0, 0, 0);

export function fullScreenSwitch(document, canvas) {

    window.addEventListener('dblclick', () =>
    {
        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
        if(!fullscreenElement) {
            if(canvas.requestFullscreen)
            {
                canvas.requestFullscreen();
            }
            else if(canvas.webkitRequestFullscreen)
            {
                canvas.webkitRequestFullscreen();
            }
        }
        else {
            if(document.exitFullscreen)
                document.exitFullscreen();
            else if(document.webkitExitFullscreen)
                document.webkitExitFullscreen();
        }
    }
    )
}