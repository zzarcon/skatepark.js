export default `
:host {
  width: inherit;
  position: relative;
  display: flex;
  font-family: Verdana;
  align-items: center;
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
.text{
  margin-right: 3px;
}
.toggle{
  padding: 5px;
  cursor: pointer;
  transition: transform .3s;
  transform: scale(0.9);
}
.toggle:hover{
  transform: scale(1.1);
}
li{
  list-style: none;
}
.emojis-wrapper{
  top: 0;
  left: 245px;
  border-radius: 3px;
  border: 2px solid #aaa;
  position: absolute;
  width: 305px;
  height: 350px;
  display: none;
  background-color: white;
  user-select: none;
}
.emojis-wrapper::before{
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 7px 8px 7px 0;
  border-color: transparent #aaa transparent transparent;
  position: absolute;
  top: 23px;
  left: -10px;
}
.emojis-wrapper.visible{
  display: block;
}
.emoji-search{
  margin: 10px 5px 10px 10px;
  flex: 1;
}
.emojis-content{
  margin: 10px 10px 0 10px;
  overflow: auto;
  height: calc(100% - 90px);
}
.emoji-data{
  display: none;
}
.emoji-data.visible{
  display: block;
}
.emoji-search-results{

}
.emoji-category-header{
  text-transform: capitalize;
  margin: 5px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 2px;
}
.emoji-category-content{

}
.emojis-content i{
  border: 1px solid transparent;
  padding: 3px 8px 3px 5px;
  border-radius: 5px;
  display: inline-block;
  cursor: pointer;
  transition: all .3s;
}
.emoji-category-content i:hover{
  border-color: #ddd;
  background-color: #eee;
}
.emojis{
  text-align: center;
}
.categories{
  border-top: 1px solid #aaa;
  justify-content: center;
  align-items: center;
  height: 41px;
  display: none;
}
.categories.visible{
  display: flex;
}
.categories .cat{
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  width: 25px;
  flex: 1;
  transition: background-color .2s;
  opacity: .8;
}
.categories .cat.active, .categories .cat:hover{
  background-color: #afd4f3;
}
sk-spinner{
  margin-right: 5px;
  display: none;
  width: 30px;
  height: 30px;  
}
sk-spinner.visible{
  display: block;
}
.header{
  display: flex;
  align-items: center;
}
`;