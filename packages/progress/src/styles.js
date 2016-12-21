export default `
/*
Common
 */
:host {
  height: 30px;
  width: 100%;
  position: relative;
  display: block;
  contain: content;
}
.wrapper, .progress{
  height: inherit;
  width: inherit;
}
.wrapper {
  background: #f80;
  overflow: hidden;
  position: relative;
}
.progress {
  background: #ddd;
  left: 0;
  position: absolute;
  top: 0;
  transition: transform 0.3s;
}

`;