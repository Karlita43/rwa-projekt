
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
loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    // TODO: fetch login
});

const registerForm = document.getElementById("registerForm") as HTMLFormElement | null;
registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    // TODO: fetch register
});

console.log("login.ts loaded");