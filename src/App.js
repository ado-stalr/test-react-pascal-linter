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


const code = `program insertsort(input, output);
const
  max = 16;
  listend = 0;
type
  recarray = array [1..max] of
                record
                  key: char;
                  next: 0..max
                end;
  range = 0..max; 
var
  arr: recarray;
  first: range;
  index: integer;
  found: boolean;
begin {insertsort}
  first := 0;
  index := 0;
  writeln('input data:');
  while (not eoln) and (index <= max)
  do 
    begin 
      index := index + 1;
      if index <= max
      then
        readitemsinlist(arr, first, index)
    end;
  if index <= max
  then
    printlist(arr, first)
  else
    writeln('the maximum length of the list is ', max, ' items.')
end. {insertsort}
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
          let tokens = formatting(tokenize(code));
          console.log(tokens);
          console.log(tokens.reduce((str, token) => str + token.content, ''));

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
