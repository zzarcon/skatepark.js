export default `
:host {
  position: relative;
  font-family: Verdana;
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-style: normal;
}
input{
  outline: none;
}
li{
  list-style: none;
}
header{
  border: 2px solid black;
  padding: 10px;
  position: sticky;
  top: 0;
  background-color: white;
}
.list{
  border: 1px solid;
}
.item-content{

}
.item-content li{
  border-bottom: 1px solid #ccc;
  padding: 5px;
}

/**
 * Sticky
 */

.sticky {
  position: -webkit-sticky;
  position: sticky;
}
.sticky.sticky-fixed.is-sticky {
  margin-top: 0;
  margin-bottom: 0;
  position: fixed;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  backface-visibility: hidden;
}
.sticky.sticky-fixed.is-sticky:not([style*="margin-top"]) {
  margin-top: 0 !important;
}
.sticky.sticky-fixed.is-sticky:not([style*="margin-bottom"]) {
  margin-bottom: 0 !important;
}
.sticky.sticky-fixed.is-absolute{
  position: absolute;
}
`;