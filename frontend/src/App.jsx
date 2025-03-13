import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [testDbMessage, setTestDbMessage] = useState(null); // State to hold test DB result

  // Function to handle submitting the count to the backend
  async function handleClick() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/counter",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setSuccess(true);
      setCount(0);
    } catch (error) {
      console.error("Error during submission:", error); // Log the error to the console
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Function to test DB connection
  async function handleTestDbConnection() {
    console.log("Testing DB connection...");
    console.log("API URL:", import.meta.env.VITE_API_URL); // Log the API URL for debugging

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/test-db");

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setTestDbMessage(`DB Connection Test Successful! Current time: ${data.current_time}`);
    } catch (error) {
      console.error("Error testing DB connection:", error); // Log the error to the console
      setTestDbMessage(`Error testing DB connection: ${error.message}`);
    }
  }

  return (
    <div className="App">
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <button onClick={handleClick} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Save to DB"}
      </button>
      <button onClick={handleTestDbConnection}>
        Test DB Connection
      </button>

      {success && <p>✅ Saved successfully!</p>}
      {error && <p>❌ Error: {error}</p>}
      {testDbMessage && <p>{testDbMessage}</p>} {/* Display DB connection result */}
    </div>
  );
}

export default App;
