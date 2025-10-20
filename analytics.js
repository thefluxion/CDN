        (async () => {
    try {
      const url = window.location.href;
      const res = await fetch("https://v1.mathkits.org/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url
        })
      });
      const data = await res.json();
      console.log("URL submission result:", data);
    } catch (err) {
      console.error("Failed to send URL to server:", err);
    }
  })();
