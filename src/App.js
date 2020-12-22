import { useEffect, useState } from 'react'
import logo from './logo.svg';
import './App.css';

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
    return score;
  }


  useEffect(() => {
    //Load model and then train the model with the data
    tf.ready().then(() => {
      loadModel(url)
      loadMetadata(url)
    });
  }, [])

  return (
    <div className="App">
      <input
        id="standard-read-only-input"
        type="text"
        label="Type your sentences here"
        onChange={(e) => setText(e.target.value)}
        value={testText}
        rows={4}
        variant="outlined"
      />
      <br />
      <br />
      {testText !== "" ?
        <button style={{ width: "20vh", height: "5vh" }} variant="outlined" onClick={() => getSentimentScore(testText)}>Calculate</button>
        : <></>}
      {testScore && (
        <h2>{testScore}</h2>
      )}
    </div>
  );
}

export default App;
