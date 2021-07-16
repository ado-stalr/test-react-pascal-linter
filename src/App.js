import logo from './logo.svg';
import './App.css';
import React from 'react';


import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-pascal';
import 'prismjs/themes/prism.css';

import { checkFormating } from './pascalFormater/pascalChecker';

function SaveButton() {
  return (
    <div style={{'backgroundColor': 'lightgreen', 'width': '200px'}}
         onClick={() => {console.log(this)}}
    >
      Save
    </div>
  )
}


var code = `VAR
  W1, W2, W3, W4, Looking: CHAR;
BEGIN 
  
  WHILE Looking = 'Y'
    DO
    BEGIN
      
      BEGIN
      BEGIN
      if x then if y then if z then hi
      else hello else welcome
      
      
    END;
      
      
    END;
      
    END;
  
END. 
`;

class MyEditor extends React.Component {
  state = { code };
 
  render() {
    return (
      <Editor
        value={this.state.code}
        onValueChange={code => this.setState({ code })}
        highlight={code => {
          let h = highlight(code, languages.pascal, 'pascal');

          let pccCheck = checkFormating(code, {line: true, expected: true});

          document.getElementById('code').innerHTML = pccCheck.error? pccCheck.result + '<br />' + pccCheck.error : pccCheck.result;

          return h;
        }}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 20,
        }}
      />
    );
  }
}

function App() {
  return (
    <div className="App">
      {/*<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello World! This is my test react App.
        </p>
      </header>*/}
      <MyEditor />
      <SaveButton />
    </div>
  );
}

export default App;
