export default `
:host {
  height: 100%;
  width: 100%;
  position: relative;
  display: block;
  contain: content;
}
.spinner {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  position: absolute;
}

.bounce1, .bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  opacity: .6;
  position: absolute;
  top: 0;
  left: 0;  
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.bounce2 {
  animation-delay: -1.0s;
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
}
`;