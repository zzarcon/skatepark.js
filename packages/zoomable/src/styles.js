export default `
figure.zoom{
  position: relative;
  width: 500px;
  overflow: hidden;
  cursor: zoom-in;
}
figure.zoom img{
  transition: opacity .5s;
  display: block;
  width: 100%;
}   
figure.zoom img:hover{
  opacity: 0;
}
`;