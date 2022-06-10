const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const displayName = document.querySelector(".displayName");

// Audio that will play on recieving messages
var audio = new Audio('Files/tone.mp3');

// Function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message')
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position != 'right'){
        audio.play();
    }
}

// Ask new user for his/her name and let server know
let names = prompt("Enter your Name to join");
if(names != ""){
socket.emit('new-user-joined', names);
}
else{
    prompt("Please Enter your Name to join");
    
}
 

// If a new user joins, receive his/her name from the server
displayName.innerText = names;
socket.on('user-joined', names =>{
append(`${names}: joined the chat`, 'center')
})

// If server sends a message, recieve it 
socket.on('recieve', data =>{
    append(`${data.names}: ${data.message}`, 'left')
 })

 // If a user leaves a chat, append the info to the container
 socket.on('left', names =>{
    append(`${names}: left the chat`, 'center')
 })

 // If the form gets submitted, send the message to server
 form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    if(message != ""){
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value = '';
    }
})