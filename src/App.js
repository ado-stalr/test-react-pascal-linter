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


var code = `unit theword; {addasf}
interface  type    windowtype = array [1..3] of char;  procedure readword(var fin: text; var newword: string; var wordisfound: boolean);implementation  const    upperalphabet = ['a'..'z', 'à'..'ß', '¨'];    specialsymbols = ['''', '-'];    allalphabet = ['a'..'z', 'a'..'z', 'à'..'ß', 'à'..'ÿ', '¨', '¸'];
    registerdifference = 32;    empty = ' ';
  var    window: windowtype;
  procedure cleanwindow(var window: windowtype);  var
    i: integer;  begin
    for i := 1 to length(window)    do
      window[i] := empty;  end;
  function tolowercase(str: string): string;
  var    i, charcode: integer;
  begin {tolowercase}    for i := 1 to length(str)    do      if (str[i] = '¨') or (str[i] = '¸')      then
        str[i] := 'å'      else        if (str[i] in upperalphabet)        then
          begin            charcode := ord(str[i]);            str[i] := chr(charcode + registerdifference)
          end;    tolowercase := str;
  end; {tolowercase}
  procedure addsymbol(var newword: string; var window: windowtype);  var
    isneedsymbol: boolean;  begin {addsymbol}
    {íóæíûé ñèìâîë - ýòî áóêâà èëè ñïåö. ñèìâîë, íàõîäÿøèéñÿ ìåæäó áóêâàìè}    isneedsymbol := not (window[2] in specialsymbols) or ((window[2] in specialsymbols) and (window[1] in allalphabet) and (window[3] in allalphabet));
    if isneedsymbol    then
      if newword = empty      then
        newword := window[2]      else
        newword := newword + window[2];  end; {addsymbol}
  procedure readword(var fin: text; var newword: string; var wordisfound: boolean);
  begin    wordisfound := false;    newword := empty;
    while (not eoln(fin)) and (not wordisfound)
    do      begin        window[1] := window[2];
        window[2] := window[3];        read(fin, window[3]);        if (window[2] in allalphabet) or (window[2] in specialsymbols)
       then          addsymbol(newword, window)
        else          if newword <> empty
          then            wordisfound := true
      end;    if eoln(fin)    then
      begin        window[1] := window[3];        window[2] := window[3];        addsymbol(newword, window);
        if newword <> empty        then  
          wordisfound := true;        cleanwindow(window)
      end;    newword := tolowercase(newword)
  end;begin  cleanwindow(window)end.
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
          outputCode = outputCode.split('\n').map(el => el.replace(/\-+$/, '')).filter(el => el !== '').join('\n');
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
