// // Function to adjust saturation
// function adjustSaturation(value) {
//     document.body.style.filter =
//         "saturate(" +
//         value +
//         "%) contrast(" +
//         document.getElementById("contrastRange").value +
//         "%)";
//     localStorage.setItem("saturationValue", value);
// }

// // Function to reset saturation to default
// function resetSaturation() {
//     adjustSaturation(100);
// }

// // Function to adjust contrast
// function adjustContrast(value) {
//     document.body.style.filter =
//         "saturate(" +
//         document.getElementById("saturationRange").value +
//         "%) contrast(" +
//         value +
//         "%)";
//     localStorage.setItem("contrastValue", value);
// }

// // Function to reset contrast to default
// function resetContrast() {
//     document.getElementById("contrastRange").value = 100;
//     adjustContrast(100);
// }

// // Initialize slider values from localStorage
// if (localStorage.getItem("saturationValue")) {
//     document.getElementById("saturationRange").value =
//         localStorage.getItem("saturationValue");
//     adjustSaturation(localStorage.getItem("saturationValue"));
// }
// if (localStorage.getItem("contrastValue")) {
//     document.getElementById("contrastRange").value =
//         localStorage.getItem("contrastValue");
//     adjustContrast(localStorage.getItem("contrastValue"));
// }

// // Event listeners for slider changes
// document
//     .getElementById("saturationRange")
//     .addEventListener("input", function () {
//         adjustSaturation(this.value);
//     });

// document
//     .getElementById("contrastRange")
//     .addEventListener("input", function () {
//         adjustContrast(this.value);
//     });




const blankSwitch = document.getElementById("open_blank");

if (blankSwitch) {
    blankSwitch.addEventListener("change", function () {
        if (blankSwitch.checked) {
            openBlank();
        }
    });
}



function openBlank() {
    var win = window.open();
    var url = window.origin;
    var iframe = win.document.createElement("iframe");
    
    // Set title
    var title = document.title;
    win.document.title = title;

    // Set favicon
    var links = document.head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    if (links.length > 0) {
        var favicon = links[0].href;
        var link = win.document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = favicon;
        win.document.head.appendChild(link);
    }

    win.document.body.style.margin = "0";
    win.document.body.style.padding = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.src = "/index.html";
    win.document.body.appendChild(iframe);
}


var selector= document.getElementById('panic-key-input')
var ce=  document.getElementById('url-input');
selector.value = localStorage.getItem('key') || '';
ce.value = localStorage.getItem('website') || '';







// AB Cloak
function AB() {
    let inFrame
  
    try {
      inFrame = window !== top
    } catch (e) {
      inFrame = true
    }
  
    if (!inFrame && !navigator.userAgent.includes("Firefox")) {
      const popup = open("about:blank", "_blank")
      if (!popup || popup.closed) {
        alert("Please allow popups and redirects.")
      } else {
        const doc = popup.document
        const iframe = doc.createElement("iframe")
        const style = iframe.style
        const link = doc.createElement("link")
  
        const name = document.title; // Grab title from current page
        const icon = document.querySelector("link[rel*='icon']") ? document.querySelector("link[rel*='icon']").href : "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png"; // Grab favicon from current page, fallback if not found
  
        doc.title = name
        link.rel = "icon"
        link.href = icon
  
        iframe.src = location.href
        style.position = "fixed"
        style.top = style.bottom = style.left = style.right = 0
        style.border = style.outline = "none"
        style.width = style.height = "100%"
  
        doc.head.appendChild(link)
        doc.body.appendChild(iframe)
  
        const pLink = localStorage.getItem(encodeURI("pLink")) || "https://www.nasa.gov/"
        location.replace(pLink)
  
        const script = doc.createElement("script")
        script.textContent = `
          window.onbeforeunload = function (event) {
            const confirmationMessage = 'Leave Site?';
            (event || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
          };
        `
        doc.head.appendChild(script)
      }
    }
  }

document.getElementById('blankonbutton').addEventListener('click', turnonblank);
document.getElementById('blankoffbutton').addEventListener('click', turnoffblank);
function turnonblank(){
    localStorage.setItem('autoblank', true)
    AB();
    // window.location.reload();
    document.getElementById('blankonbutton').style.display = 'none';
    document.getElementById('blankoffbutton').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('autoblank') === 'true') {
        turnonblank();
    }
});

function turnoffblank(){
    localStorage.setItem('autoblank', false);
    window.location.reload();
}



function handleKeyPresskey(event) {
    var selector = document.getElementById("panic-key-input");
    var ce = document.getElementById("panic-key-input").value;
    if (ce.length > 0) {
        // alert('long')
        selector.value = selector.value.slice(0, -1); // Remove the last character
    }
    if (event.key === "Enter") {
        document.getElementById("save-button").click();
    }
}
    