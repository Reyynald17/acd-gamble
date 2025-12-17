async function hash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function register() {
  warn.innerText = "";
  const u = user.value.trim();
  const p = pass.value.trim();

  if (!u || !p) {
    warn.innerText = "User ID dan Password wajib diisi";
    return;
  }

  const data = await getData();
  if (data.users[u]) {
    warn.innerText = "User sudah ada";
    return;
  }

  data.users[u] = {
    password: await hash(p),
    balance: 1000
  };

  await saveData(data);
  alert("Register berhasil. Saldo awal 1000 ACD");
}

async function login() {
  warn.innerText = "";
  const u = user.value.trim();
  const p = pass.value.trim();

  if (!u || !p) {
    warn.innerText = "User ID dan Password wajib diisi";
    return;
  }

  const data = await getData();
  if (!data.users[u]) {
    warn.innerText = "User tidak ditemukan";
    return;
  }

  if (data.users[u].password !== await hash(p)) {
    warn.innerText = "Password salah";
    return;
  }

  localStorage.setItem("user", u);
  window.location = "game.html";
}
