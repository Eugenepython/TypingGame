import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const timeTarget = 20
  const [sentence, setSentence] = useState('');
  const [gameRunning, setGameRunning] = useState(false);
  const [text, setText] = useState('');
  const [time, setTime] = useState(timeTarget);
  const [difference, setDifference] = useState(0);
  const [disableText, setDisableText] = useState(false);
  const [disableStart, setDisableStart] = useState(false);
 

  const fetchRandomQuote = () => {
    if (gameRunning && time >=timeTarget) {
      fetch('https://labs.bible.org/api/?passage=random&type=json')
      
        .then((response) => response.json())
        .then((data) => {
          const words = data.content.split(' ');
          if (words.length > 20) {
            setSentence(data.content);
          } else {
            fetchRandomQuote();
          }
        });
    }
  };

  function endGame() {
    setGameRunning(false);
    setDifference(countDifferences(sentence, text));
    setDisableText(true)
    setDisableStart(false)
  }

  function startUp() {
    setGameRunning(true);
    setTime(timeTarget);
    setDisableText(false)
    setDisableStart(true)
    setText('')
  }

  function countDifferences(text1, text2){
    let count = 0;
    for (let i = 0; i < text1.length; i++) {
      if (text1[i] !== text2[i]) {
        count++;
      }
    }
    if (text1.length > text2.length) {
      count += text1.length - text2.length;
    }
    return count;
  }

  useEffect(() => {
    if (gameRunning && time > 0) {
      fetchRandomQuote();
      setTimeout(() => {
        setTime((x) => x - 1);
      }, 1000);
    } else if (time === 0) {
      endGame();
    }
  }, [gameRunning, time]);



  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="sentenceBox">{sentence}</div>

        <p>Type the paragraph above as fast as you can!</p>
        <button className = 'btn' disabled={disableStart} onClick={startUp}>Start a Game</button>

        <textarea
          disabled={disableText} 
          className="typingArea"
          placeholder="Type here"
          value={text}
          onChange={handleTextChange}
        />
        <p>Time Remaining: {time}</p>
        <p>Difference :  {difference} characters</p>
      </header>
    </div>
  );
}

export default App;
