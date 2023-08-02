import { createRef, useRef, useState } from "react";
import randomWord from "random-word-by-length";
import "./scss/App.css";

declare function randomWord(len: number): string;

type PlaceType = {
  value: string;
  isCorrectInput: "CORRECT" | "PARTIALLY_CORRECT" | "INCORRECT";
};

const numerOfInputs = 5;

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

function checkIfInputIsCorrect(array: any[]) {
  for (const ele of array) {
    console.log(ele);
    if (!letters.includes(ele.current.value.toLowerCase())) return false;
  }
  return true;
}

function fixedRandomWordBruh(len: number, randomWord: (len: number) => string) {
  let word = randomWord(len);
  while (word.length !== len) {
    word = randomWord(len);
  }
  return word;
}

function checkLetter(
  userLetter: string,
  targetLetter: string,
  randWord: string[]
) {
  // return userLetter === targetLetter ? "TRUE" : "FALSE";
  if (userLetter === targetLetter) return "CORRECT";
  else if (randWord.includes(userLetter)) return "PARTIALLY_CORRECT";
  else return "INCORRECT";
}

function defineColorOfDiv(
  state: "CORRECT" | "PARTIALLY_CORRECT" | "INCORRECT",
  otherClasses: string[] = [""]
) {
  switch (state) {
    case "CORRECT":
      return `correct ${otherClasses.join(" ")}`;
    case "PARTIALLY_CORRECT":
      return `partCorrect ${otherClasses.join(" ")}`;
    case "INCORRECT":
      return `incorrect ${otherClasses.join(" ")}`;
  }
}

let randWord = fixedRandomWordBruh(5, randomWord).split("");

function App() {
  const [previousInputs, setPreviousInputs] = useState<PlaceType[][]>([]);

  const [isCorrectInput, setIsCorrectInput] = useState(true);

  const numberOfTries = useRef(0);

  const [inputRefsArray] = useState(() =>
    Array.from({ length: numerOfInputs }, () => createRef<HTMLFormElement>())
  );

  const [, setCurrentIndex] = useState(0);

  const [hasUserGuessedWord, setHasUserGuessedWord] = useState(false);

  let key = 0;
  let key2 = 25;

  function inputTextSumbitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checkIfInputIsCorrect(inputRefsArray)) {
      let numberOfCorrectGuesses = 0;
      const inputs: PlaceType[] = inputRefsArray.map((ref, index) => {
        const check = checkLetter(
          ref.current!.value,
          randWord[index],
          randWord
        );
        if (check === "CORRECT") numberOfCorrectGuesses++;
        return {
          value: ref.current!.value,
          isCorrectInput: check,
        };
      });

      setHasUserGuessedWord(numberOfCorrectGuesses === 5 ? true : false);

      setPreviousInputs((prevState) => {
        const state = [...prevState];
        state.push(inputs);
        return state;
      });

      for (const ele of inputRefsArray) {
        ele.current!.value === "";
      }

      setCurrentIndex(0);
      setIsCorrectInput(true);
      numberOfTries.current++;
    } else {
      setIsCorrectInput(false);
    }
  }

  function keyUpHandler() {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex < numerOfInputs - 1 ? prevIndex + 1 : 99;
      if (nextIndex !== 99) {
        const nextInput = inputRefsArray?.[nextIndex]?.current;
        nextInput!.focus();
        nextInput!.select();
      }
      return nextIndex;
    });
  }

  function resetHandler() {
    numberOfTries.current = 0;
    randWord = fixedRandomWordBruh(5, randomWord).split("");
    setPreviousInputs([]);
    setCurrentIndex(0);
    setHasUserGuessedWord(false);
  }

  return (
    <div className="mainDiv">
      <h2>Wordle game clone</h2>
      {!isCorrectInput ? (
        <h3 className="header">
          Allowed to use only english letters
          <br />
          and all inputs should be filled
        </h3>
      ) : null}
      {previousInputs.map((row) => {
        return (
          <div className="inputRow" key={key++}>
            {row.map((place) => {
              return (
                <div
                  className={defineColorOfDiv(place.isCorrectInput, ["place"])}
                  key={key2++}
                >
                  <p className="userInputParagraph">{place.value}</p>
                </div>
              );
            })}
          </div>
        );
      })}
      {!hasUserGuessedWord && numberOfTries.current !== 5 ? (
        <form
          className="inputForm"
          key={key++}
          onSubmit={inputTextSumbitHandler}
        >
          <div className="inputRow">
            {inputRefsArray.map((ref, index) => {
              return (
                <input
                  type="input"
                  className="place"
                  onKeyUp={keyUpHandler}
                  ref={ref}
                  key={index}
                  maxLength={1}
                />
              );
            })}
          </div>
          <button>Check answer</button>
        </form>
      ) : numberOfTries.current === 5 ? (
        <>
          <h3>
            Word was {randWord.join("")}. You`re out of tries... Try again!
          </h3>
          <button onClick={resetHandler}>Reset game</button>
        </>
      ) : (
        <>
          <h3>Congrats! You guessed word {randWord.join("")}</h3>
          <button onClick={resetHandler}>Reset game</button>
        </>
      )}
    </div>
  );
}

export default App;
