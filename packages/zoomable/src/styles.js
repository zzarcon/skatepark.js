export default `
.zoom{
  position: relative;
  width: 500px;
  overflow: hidden;
  cursor: zoom-in;
  background-size: var(--zoom-level);
  border: 1px solid;
}
.zoom img{
  transition: opacity .5s;
  display: block;
  width: 100%;
  background-color: white;
}   
.zoom img:hover{
  opacity: 0;
}
`;