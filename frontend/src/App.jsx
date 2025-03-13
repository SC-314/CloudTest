import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      setError(error.message);
    } finally {
      setIsSubmitting(false);
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
      {success && <p>✅ Saved successfully!</p>}
      {error && <p>❌ Error: {error}</p>}
    </div>
  );
}

export default App;