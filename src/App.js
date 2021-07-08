import logo from './logo.svg';
import './App.css';
import React from 'react';


import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-pascal';
import 'prismjs/themes/prism.css';

import {tokenize, formatting} from './pascalFormater/pascalFormater';

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
code = code.replace(/\{.*\}/g, '');

class MyEditor extends React.Component {
  state = { code };
 
  render() {
    return (
      <Editor
        value={this.state.code}
        onValueChange={code => this.setState({ code })}
        highlight={code => {
          let h = highlight(code, languages.pascal, 'pascal');
          let tokens = formatting(tokenize(code));
          console.log(tokens);
          let outputCode = tokens.reduce((str, token) => str + token.content, '');
          outputCode = outputCode.split('\n').map(el => el.replace(/\-+$/, '')).filter(el => el !== '' && el !== ';').join('\n');
          document.getElementById('code').innerHTML = outputCode;
          console.log(outputCode);

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
