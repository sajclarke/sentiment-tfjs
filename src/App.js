import { useEffect, useState } from 'react'
import './App.css';
import './assets/output.css'
import Message from './components/message'

import * as tf from '@tensorflow/tfjs';


function App() {

  //Model and metadata URL
  const url = {
    model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
  };


  const [metadata, setMetadata] = useState();
  const [model, setModel] = useState();

  const [testText, setText] = useState("");
  const [testScore, setScore] = useState("");

  const [messages, setMessages] = useState([]);

  const OOV_INDEX = 2;
  const PAD_INDEX = 0;


  const padSequences = (sequences, maxLen, padding = 'pre', truncating = 'pre', value = PAD_INDEX) => {
    return sequences.map(seq => {
      if (seq.length > maxLen) {
        if (truncating === 'pre') {
          seq.splice(0, seq.length - maxLen);
        } else {
          seq.splice(maxLen, seq.length - maxLen);
        }
      }
      if (seq.length < maxLen) {
        const pad = [];
        for (let i = 0; i < maxLen - seq.length; ++i) {
          pad.push(value);
        }
        if (padding === 'pre') {
          seq = pad.concat(seq);
        } else {
          seq = seq.concat(pad);
        }
      }
      return seq;
    });
  }
  // const paddedSequence = padSequences([sequence], metadata.max_len);

  async function loadModel(url) {
    try {
      const model = await tf.loadLayersModel(url.model);
      setModel(model);
    }
    catch (err) {
      console.log(err);
    }
  }
  async function loadMetadata(url) {
    try {
      const metadataJson = await fetch(url.metadata);
      const metadata = await metadataJson.json();
      setMetadata(metadata);
    }
    catch (err) {
      console.log(err);
    }
  }

  const getDate = () => {
    let today = new Date();
    let date = today.getFullYear() + '/' + (today.getMonth()+1) + '/' + today.getDate();
    let time = today.getHours() + ":" + String(today.getMinutes()).padStart(2, '0') // + ":" + today.getSeconds();
    return date + " " + time
  }

  const getSentimentScore = (text) => {
    console.log(text)
    const inputText = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
    // setTrim(inputText)
    // console.log(inputText)
    const sequence = inputText.map(word => {
      let wordIndex = metadata.word_index[word] + metadata.index_from;
      if (wordIndex > metadata.vocabulary_size) {
        wordIndex = OOV_INDEX;
      }
      return wordIndex;
    });
    // setSeq(sequence)
    // console.log(sequence)
    // Perform truncation and padding.
    const paddedSequence = padSequences([sequence], metadata.max_len);
    console.log(metadata.max_len)
    // setPad(paddedSequence)

    const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);
    console.log(input)
    // setInput(input)
    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();
    setScore(score)

    setMessages([...messages, {
      txt: text,
      score: score,
      date: getDate(),
      user: true,
    }])

    return score;
  }


  useEffect(() => {
    //Load model and then train the model with the data
    tf.ready().then(() => {
      loadModel(url)
      loadMetadata(url)
    });
  }, [])

  const printScore = (score) => {
    const txtColor = score > 0.55 ? "text-black" : "text-red-400";
    score = String(score).slice(0, 6);

    return (
      <h2 className={txtColor}>{score}</h2>
    )
  }

  return (
    <div className="App">
      <div className="md:w-3/6 h-80 overflow-auto md:mx-auto mx-2 mt-2 p-2 bg-gray-200">
        { messages?.map((msg, index) => (
          <Message
            key={index}
            txt={msg.txt}
            score={msg.score}
            date={msg.date}
            userMsg={msg.user}
          />
        ))}
      </div>
      <div className="flex flex-row w-3/6 mx-auto">
        <input
          id="standard-read-only-input"
          type="text"
          label="Type your sentences here"
          placeholder="Enter here"
          onChange={(e) => setText(e.target.value)}
          value={testText}
          rows={4}
          variant="outlined"
          className="bg-gray-300 focus:bg-blue-300 md:w-5/6 text-white placeholder-white focus:placeholder-white px-2"
        />
        {testText !== "" ?
          <button
            style={{ width: "20vh", height: "5vh" }}
            variant="outlined"
            onClick={() => getSentimentScore(testText)}
            className="bg-blue-400 text-white hover:bg-blue-600 font-bold"
          >Send</button>
          : <></>}
        </div>
      {testScore && printScore(testScore)}
    </div>
  );
}

export default App;
