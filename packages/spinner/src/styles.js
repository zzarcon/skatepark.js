export default `
/*
Common
 */
:host {
  height: 100%;
  width: 100%;
  position: relative;
  display: block;
  contain: content;
}
.spinner{
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
.spinner.overlay{
  background-color: rgba(0,0,0,0.5);
}
/*
  Circle
 */
.spinner.circle {
  width: 40px;
  height: 40px;  
}

.spinner.circle .bounce1, .spinner.circle .bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--color);
  opacity: .6;
  position: absolute;
  top: 0;
  left: 0;  
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.spinner.circle .bounce2 {
  animation-delay: -1.0s;
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
}

/*
  Rect
 */

.spinner.rect {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 10px;
}

.spinner.rect > div {
  background-color: var(--color);
  height: 100%;
  width: 6px;
  display: inline-block;
  margin: 0 3px 0 0;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner.rect .rect2 {
  animation-delay: -1.1s;
}

.spinner.rect .rect3 {
  animation-delay: -1.0s;
}

.spinner.rect .rect4 {
  animation-delay: -0.9s;
}

.spinner.rect .rect5 {
  animation-delay: -0.8s;
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
  }
}

/*
Bounce
 */

.spinner.bounce {
  width: 70px;
  text-align: center;
}

.spinner.bounce > div {
  width: 18px;
  height: 18px;
  background-color: var(--color);
  border-radius: 100%;
  display: inline-block;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner.bounce .bounce1 {
  animation-delay: -0.32s;
}

.spinner.bounce .bounce2 {
  animation-delay: -0.16s;
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}
`;