import React , {useState , useEffect , useCallback} from "react";

import JokeList from "./components/JokeList";
import "./App.css";
import AddJoke from "./components/AddJoke";

function App() {
  const [jokes , setJokes] = useState([]);
  const [isLoading , setIsLoading] = useState(false);
  const [error , setError] = useState(null);
  

  const fetchJokesHandler = useCallback(async ()=> {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://react-jokes-generator-default-rtdb.firebaseio.com/jokes.json");
      if(!response.ok){
        throw new Error('Something is wrong!!!');
      }
      const data = await response.json();

      const loadedJokes = []

      for(const key in data){
        loadedJokes.push({
          id: key,
          type : data[key].type,
          setup : data[key].setup,
          punchline : data[key].punchline
        })
      }
      setJokes(loadedJokes);
    } catch (e) {
      setError(e.message);
      
    }
    setIsLoading(false);
  }, [] );

  useEffect(() =>{
    fetchJokesHandler();
  }, [fetchJokesHandler]);

  async function addJokeHandler(joke){
    const response = await fetch("https://react-jokes-generator-default-rtdb.firebaseio.com/jokes.json", {
      method : 'POST', 
      body : JSON.stringify(joke),
      headers : {
        'Content-Type' : 'application/json'
      }
    });

    const data = await response.json();
    console.log(data);
  } 


  let content = <p>No jokes</p>

  if(jokes !== null && jokes !== undefined && jokes.length >0){
    content = <JokeList jokes={jokes}/>
  }

  if(error){
    content = <p>{error}</p>
  }

  if(isLoading){
    content = <p>Loading...</p>
  }


  return (
    <React.Fragment>
      <section>
        <AddJoke onAddJoke={addJokeHandler}/>
      </section>
      <section>
        <button onClick={fetchJokesHandler} >Fetch Jokes</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;