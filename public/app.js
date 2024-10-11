const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

Swal.fire({
  title: 'Disclaimer',
  text: 'this piece of software is for educational purposes only. Do not use this software to download content that you do not have the rights to download. By clicking "I Agree" you agree to use this software responsibly and in accordance with the law.',
  icon: 'warning',
  showDenyButton: true,
  showCancelButton: false,
  confirmButtonText: 'I Agree',
  denyButtonText: 'I Disagree',
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire('Thank you for agreeing to the disclaimer.', '', 'success')
  } else if (result.isDenied) {
    Swal.fire({
      title: 'Close this now.',
      icon: 'info',
      confirmButtonText: 'OK'
    }).then(() => {
      window.close();
    });
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); 

  socket.on('log', (data) => {
    const informationConsole = document.getElementById('informationConsole');
    const logElement = document.createElement('p');
    logElement.textContent = data.message;
    informationConsole.appendChild(logElement);
  });
})


document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault(); 

  // Obtain the data from the form
  const url = document.getElementById('url').value;
  const session = document.getElementById('domestika_session').value;
  const credentials = document.getElementById('_credentials').value;

  // Create a formData object
  const formData = {
    url: url,
    domestika_session: session,
    _credentials: credentials
  };

  
  informationConsole.innerHTML = document.getElementById('informationConsole').innerHTML 
  informationConsole.innerHTML ='<div class = "flex items-center space-x-6 text-white p-2 rounded-md shadow-xl" > <img class="w-12 h-12 " src="assets/img/loading.gif"> <p>Downloading videos, please wait...</p> </div>';

    // send the data to the server
    fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => { throw new Error(error.message); });
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      Toast.fire({
        icon: "success",
        title: data.message
      });
      //alert(data.message);
    })
    .catch((error) => {
      console.error('Error:', error);
     //alert('Error: ' + error.message);
     Toast.fire({
      icon: "warning",
      title: "Error: " + error.message
    });
    });
});