
const loginModal = document.getElementById("loginModal") as HTMLDivElement | null;
const openLoginBtn = document.getElementById("openLogin") as HTMLDivElement | null;
const closeLoginBg = document.getElementById("closeLogin") as HTMLDivElement | null;
const closeLoginX = document.getElementById("closeLoginX") as HTMLButtonElement | null;

const registerModal = document.getElementById("registerModal") as HTMLDivElement | null;
const closeRegisterBg = document.getElementById("closeRegister") as HTMLDivElement | null;
const closeRegisterX = document.getElementById("closeRegisterX") as HTMLButtonElement | null;

const openRegisterFromLogin = document.getElementById("openRegisterFromLogin") as HTMLButtonElement | null;
const openLoginFromRegister = document.getElementById("openLoginFromRegister") as HTMLButtonElement | null;

function setBodyBlur(on: boolean): void{
    document.body.classList.toggle("modal-open", on);
}

function openModal(modal: HTMLDivElement |null): void{
    if(!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("arria-hidden", "false");
    setBodyBlur(true);
}

function closeModal(modal: HTMLDivElement | null): void {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    // ako niti jedan modal nije otvoren maknem blur
    const anyOpen =
        (loginModal?.classList.contains("is-open") ?? false) ||
        (registerModal?.classList.contains("is-open") ?? false);

    if (!anyOpen) setBodyBlur(false);
  }

// LOGIN open/close
openLoginBtn?.addEventListener("click", () => openModal(loginModal));
closeLoginBg?.addEventListener("click", () => closeModal(loginModal));
closeLoginX?.addEventListener("click", () => closeModal(loginModal));

//REGISTER open/close
closeRegisterBg?.addEventListener("click", () => closeModal(registerModal));
closeRegisterX?.addEventListener("click", () => closeModal(registerModal));

//Prebacivanje iz jednog modala u drugi
openRegisterFromLogin?.addEventListener("click", () => {
    closeModal(loginModal);
    openModal(registerModal);
});

openLoginFromRegister?.addEventListener("click", () => {
    closeModal(registerModal);
    openModal(loginModal);
});

//zatvaranje na ESC tipku
document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    closeModal(loginModal);
    closeModal(registerModal);
});

//sprijeciti da submit reloada stranicu
const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;

loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
        const response = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Greška pri prijavi");
            return;
        }

        // SPREMI TOKEN
        localStorage.setItem("token", data.token);

        alert("Uspješna prijava!");
        closeModal(loginModal);

        // promijeni gumb u headeru
        const loginBtn = document.getElementById("openLogin");
        if (loginBtn) {
            loginBtn.textContent = data.user.name;
        }

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
});


const registerForm = document.getElementById("registerForm") as HTMLFormElement | null;

registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = (document.getElementById("regName") as HTMLInputElement).value;
    const email = (document.getElementById("regEmail") as HTMLInputElement).value;
    const password = (document.getElementById("regPassword") as HTMLInputElement).value;

    try {
        const response = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Greška pri registraciji");
            return;
        }

        // SPREMI TOKEN (auto login nakon registracije)
        localStorage.setItem("token", data.token);

        alert("Registracija uspješna!");
        closeModal(registerModal);

        // promijeni UI
        const loginBtn = document.getElementById("openLogin");
        if (loginBtn) {
            loginBtn.textContent = data.user.name;
        }

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
});


console.log("login.ts loaded");