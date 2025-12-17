const BIN_ID = "694268f4ae596e708f9fc245";
const API_KEY = "$2a$10$M55GAQGmXXRYA96RdrzW.uAiqpU.X2JqBMvXOyp0dDkE.4zO/0dfa";

async function getData() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { "X-Master-Key": API_KEY }
  });
  return (await res.json()).record;
}

async function saveData(data) {
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify(data)
  });
}
