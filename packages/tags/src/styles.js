export default `
  *{
    box-sizing: border-box;
    font-family: Georgia;
  }
  .wrapper{
    border: 1px solid #ccc;
    width: 600px;
    padding: 5px;
    min-height: 50px;
    cursor: text;
  }
  .tags{
    cursor: default;
  }
  .tags .deletion::after{
    margin-left: 4px;
    padding: 0 4px;
    content: 'x';
    background-color: #ccc;
    cursor: pointer;
  }
  .tag{
    border: 1px solid #45B39E;
    padding: 3px;
    margin: 3px 7px 3px 2px;
    display: inline-block;
  }
  .input{
    width: 31px;
    height: 36px;
    outline: none;
    border-color: transparent;
    font-size: 16px;
  }
`;